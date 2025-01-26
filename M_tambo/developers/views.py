from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework import status
from .models import Developer
from .serializers import DeveloperListSerializer, DeveloperDetailSerializer
from jobs.models import *
from jobs.serializers import CompleteMaintenanceScheduleSerializer
from rest_framework.views import APIView
from django.db.models import Prefetch
import logging

# Set up logging
logger = logging.getLogger(__name__)


# View to list all developers
class DeveloperListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DeveloperListSerializer

    def get_queryset(self):
        return Developer.objects.all()

# View to get developer details by ID
class DeveloperDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = DeveloperDetailSerializer
    lookup_field = 'id'  # Assumes 'id' is the field you use to identify the developer

    def get_queryset(self):
        return Developer.objects.all()

    def get_object(self):
        try:
            return Developer.objects.get(id=self.kwargs['developer_id'])
        except Developer.DoesNotExist:
            raise NotFound(detail="Developer not found", code=404)

# View to get developer details by email
class DeveloperDetailByEmailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]  # Modify this as per your permissions
    serializer_class = DeveloperDetailSerializer
    lookup_field = 'user__email'  # Use the email field of the related User model

    def get_queryset(self):
        return Developer.objects.all()

    def get_object(self):
        try:
            # Retrieve the developer by email via the related User model
            return Developer.objects.get(user__email=self.kwargs['developer_email'])
        except Developer.DoesNotExist:
            raise NotFound(detail="Developer with this email not found.", code=404)



class DeveloperMaintenanceLogApprovalView(APIView):
    permission_classes = [AllowAny]  # Replace with appropriate permissions

    def get(self, request, developer_id):
        """
        Fetch unapproved maintenance logs for both regular and adhoc schedules for a specific developer.
        """
        try:
            # Validate developer existence
            developer = Developer.objects.get(id=developer_id)

            # Fetch unapproved maintenance logs for both regular and adhoc schedules
            regular_logs_queryset = ScheduledMaintenanceLog.objects.filter(approved_by__isnull=True)
            adhoc_logs_queryset = AdHocMaintenanceLog.objects.filter(approved_by__isnull=True)

            # Fetch schedules with unapproved logs
            regular_schedules = MaintenanceSchedule.objects.filter(
                elevator__building__developer=developer, status="completed"
            ).prefetch_related(
                Prefetch('maintenance_logs', queryset=regular_logs_queryset, to_attr='unapproved_maintenance_logs'),
                'unapproved_maintenance_logs__condition_report',
            )

            adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(
                elevator__building__developer=developer, status="completed"
            ).prefetch_related(
                Prefetch('maintenance_logs', queryset=adhoc_logs_queryset, to_attr='unapproved_maintenance_logs'),
                'unapproved_maintenance_logs__condition_report',
            )

            # Filter out schedules without unapproved logs
            filtered_regular_schedules = [
                schedule for schedule in regular_schedules if schedule.unapproved_maintenance_logs
            ]
            filtered_adhoc_schedules = [
                schedule for schedule in adhoc_schedules if schedule.unapproved_maintenance_logs
            ]

            # Combine and serialize schedules
            regular_data = CompleteMaintenanceScheduleSerializer(filtered_regular_schedules, many=True).data
            adhoc_data = CompleteMaintenanceScheduleSerializer(filtered_adhoc_schedules, many=True).data

            if not regular_data and not adhoc_data:
                return Response(
                    {"detail": "No pending unapproved maintenance logs for this developer."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {
                    "unapproved_regular_schedules": regular_data,
                    "unapproved_adhoc_schedules": adhoc_data,
                },
                status=status.HTTP_200_OK,
            )

        except Developer.DoesNotExist:
            return Response({"detail": "Developer not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({"detail": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, developer_id):
        """
        Approve maintenance logs for a given developer.
        The request body should include IDs for both regular and ad-hoc maintenance logs.
        Handles individual or multiple maintenance log IDs for either type.
        """
        try:
            # Ensure the developer exists
            developer = Developer.objects.get(id=developer_id)

            # Extract maintenance log IDs from the request
            regular_log_ids = request.data.get("regular_maintenance_log_ids", [])
            adhoc_log_ids = request.data.get("adhoc_maintenance_log_ids", [])

            # Convert single integers to lists for uniform processing
            if isinstance(regular_log_ids, int):
                regular_log_ids = [regular_log_ids]
            if isinstance(adhoc_log_ids, int):
                adhoc_log_ids = [adhoc_log_ids]

            # Initialize response data
            successful_approvals = []
            not_found = []
            already_approved = []

            # Function to process logs of a given type
            def process_logs(log_ids, log_model, log_type):
                nonlocal successful_approvals, not_found, already_approved

                if not log_ids:
                    return

                logs = log_model.objects.filter(id__in=log_ids)

                for log_id in log_ids:
                    log = logs.filter(id=log_id).first()

                    if not log:
                        not_found.append({"id": log_id, "type": log_type})
                        continue

                    if log.approved_by:
                        already_approved.append({"id": log_id, "type": log_type})
                        continue

                    if log.maintenance_schedule.elevator.building.developer != developer:
                        return Response({"detail": f"Log {log_id} ({log_type}) does not belong to the specified developer."}, 
                                        status=status.HTTP_403_FORBIDDEN)

                    log.approved_by = developer.developer_name
                    log.save()
                    successful_approvals.append({"id": log_id, "type": log_type})

            # Process regular and ad-hoc logs
            process_logs(regular_log_ids, ScheduledMaintenanceLog, "regular")
            process_logs(adhoc_log_ids, AdHocMaintenanceLog, "adhoc")

            # Prepare the response data
            response_data = {
                "successful_approvals": successful_approvals,
                "not_found": not_found,
                "already_approved": already_approved
            }

            if not successful_approvals and not_found:
                return Response({"detail": "No valid maintenance logs found.", "data": response_data}, 
                                status=status.HTTP_404_NOT_FOUND)

            return Response(response_data, status=status.HTTP_200_OK)

        except Developer.DoesNotExist:
            return Response({"detail": "Developer not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"detail": "An unexpected error occurred.", "error": str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
