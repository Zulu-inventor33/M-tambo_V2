from rest_framework import status
from rest_framework.response import Response
from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound
from rest_framework import status
from .utils import get_next_scheduled_date
from .utils import update_schedule_status_and_create_new_schedule
from .models import *
from .serializers import *
from .serializers import MaintenanceScheduleSerializer
from .serializers import FullMaintenanceScheduleSerializer
from elevators.models import Elevator
from technicians.models import Technician
from developers.models import Developer
from buildings.models import Building
from maintenance_companies.models import Maintenance
from datetime import datetime
from django.utils import timezone
from django.shortcuts import get_object_or_404



class CreateRoutineMaintenanceScheduleView(APIView):
    permission_classes = [AllowAny]  # Allow unrestricted access

    def post(self, request, elevator_id):
        """
        Create a maintenance schedule for a given elevator id.
        """
        # Fetch the elevator object, raise NotFound exception if it doesn't exist
        try:
            elevator = Elevator.objects.get(id=elevator_id)
        except Elevator.DoesNotExist:
            raise NotFound(f"Elevator with ID {elevator_id} does not exist.")
        
        # Extract maintenance company and technician from the elevator
        maintenance_company = elevator.maintenance_company
        technician = elevator.technician

        # Handle technician: Validate if provided, else auto-assign from elevator
        technician_data = request.data.get('technician', None)  # technician should not be passed in the request
        if technician_data:
            return Response(
                {"detail": "Technician should not be provided in the request. The system will use the elevator's technician."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle maintenance company: Validate if provided, else auto-assign from elevator
        maintenance_company_data = request.data.get('maintenance_company', None)  # maintenance company should not be passed
        if maintenance_company_data:
            return Response(
                {"detail": "Maintenance company should not be provided in the request. The system will use the elevator's maintenance company."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare the request data by ensuring elevator_id, technician_id, and maintenance_company_id are set
        request.data['technician'] = technician.id if technician else None
        request.data['elevator'] = elevator.id
        request.data['maintenance_company'] = maintenance_company.id if maintenance_company else None

        # Ensure that the necessary fields are present in the request
        next_schedule = request.data.get('next_schedule', None)
        scheduled_date = request.data.get('scheduled_date', None)
        description = request.data.get('description', None)

        # Validate that required fields (next_schedule, scheduled_date, and description) are present
        if not next_schedule or not scheduled_date or not description:
            return Response(
                {"detail": "Missing required fields: next_schedule, scheduled_date or description."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle scheduled_date
        try:
            # Ensure the scheduled_date is in the correct format
            if len(scheduled_date) == 10:  # Format is 'YYYY-MM-DD'
                scheduled_date = datetime.strptime(scheduled_date, "%Y-%m-%d")
            else:  # Format is 'YYYY-MM-DDTHH:MM:SSZ'
                scheduled_date = datetime.strptime(scheduled_date, "%Y-%m-%dT%H:%M:%SZ")

            # Convert to timezone-aware datetime
            if timezone.is_naive(scheduled_date):
                scheduled_date = timezone.make_aware(scheduled_date)

            # Get the current date in the timezone (ignoring time)
            now = timezone.now().date()

            # Compare only the date part, ignore the time
            if scheduled_date.date() < now:
                return Response(
                    {"detail": "The scheduled date cannot be in the past. Please choose a future date."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except ValueError:
            return Response(
                {"detail": "Invalid date format. Please provide a valid date in the format 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM:SSZ'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If everything is valid, add the scheduled_date to the request data
        request.data['scheduled_date'] = scheduled_date

        # Create the serializer and validate the data
        serializer = MaintenanceScheduleSerializer(data=request.data, context={'elevator_id': elevator_id})

        # Validate the serializer and create the schedule if valid
        if serializer.is_valid():
            schedule = serializer.save()

            # Ensure that the new schedule is linked with the correct technician and maintenance company
            if not schedule.technician:
                schedule.technician = technician
                schedule.save()

            if not schedule.maintenance_company:
                schedule.maintenance_company = maintenance_company
                schedule.save()

            return Response({
                "message": "Maintenance schedule created successfully",
                "maintenance_schedule_id": schedule.id
            }, status=status.HTTP_201_CREATED)

        # Return validation errors if serializer is not valid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CreateAdHocMaintenanceScheduleView(APIView):
    permission_classes = [AllowAny]  # Allow unrestricted access

    def post(self, request, elevator_id):
        """
        Create an ad-hoc maintenance schedule for a given elevator id.
        If no scheduled_date is provided, it defaults to the current date.
        """
        try:
            elevator = Elevator.objects.get(id=elevator_id)
        except Elevator.DoesNotExist:
            raise NotFound(f"Elevator with ID {elevator_id} does not exist.")

        # Extract maintenance company and technician from the elevator
        maintenance_company = elevator.maintenance_company
        technician = elevator.technician

        # Handle technician: Validate if provided, else auto-assign from elevator
        technician_data = request.data.get('technician', None)
        if technician_data:
            return Response(
                {"detail": "Technician should not be provided in the request. The system will use the elevator's technician."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle maintenance company: Validate if provided, else auto-assign from elevator
        maintenance_company_data = request.data.get('maintenance_company', None)
        if maintenance_company_data:
            return Response(
                {"detail": "Maintenance company should not be provided in the request. The system will use the elevator's maintenance company."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare the request data by ensuring elevator_id, technician_id, and maintenance_company_id are set
        request.data['technician'] = technician.id if technician else None
        request.data['elevator'] = elevator.id
        request.data['maintenance_company'] = maintenance_company.id if maintenance_company else None

        # Ensure that the necessary fields are present in the request
        scheduled_date = request.data.get('scheduled_date', None)
        description = request.data.get('description', None)

        # If scheduled_date is not provided, use the current date
        if not scheduled_date:
            scheduled_date = timezone.now()

        # Validate that the description field is present
        if not description:
            return Response(
                {"detail": "Missing required field: description."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle scheduled_date formatting
        try:
            # Ensure the scheduled_date is in the correct format
            if isinstance(scheduled_date, str):
                # If the scheduled date is provided as a string, ensure correct formatting
                if len(scheduled_date) == 10:  # Format is 'YYYY-MM-DD'
                    scheduled_date = datetime.strptime(scheduled_date, "%Y-%m-%d")
                else:  # Format is 'YYYY-MM-DDTHH:MM:SSZ'
                    scheduled_date = datetime.strptime(scheduled_date, "%Y-%m-%dT%H:%M:%SZ")

                # Convert to timezone-aware datetime
                if timezone.is_naive(scheduled_date):
                    scheduled_date = timezone.make_aware(scheduled_date)

            # Get the current date in the timezone (ignoring time)
            now = timezone.now().date()

            # Compare only the date part, ignore the time
            if scheduled_date.date() < now:
                return Response(
                    {"detail": "The scheduled date cannot be in the past. Please choose a future date."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except ValueError:
            return Response(
                {"detail": "Invalid date format. Please provide a valid date in the format 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM:SSZ'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If everything is valid, add the scheduled_date to the request data
        request.data['scheduled_date'] = scheduled_date

        # Create the serializer and validate the data
        serializer = AdHocMaintenanceScheduleSerializer(data=request.data)

        # Validate the serializer and create the schedule if valid
        if serializer.is_valid():
            schedule = serializer.save()

            # Ensure that the new schedule is linked with the correct technician and maintenance company
            if not schedule.technician:
                schedule.technician = technician
                schedule.save()

            if not schedule.maintenance_company:
                schedule.maintenance_company = maintenance_company
                schedule.save()

            return Response({
                "message": "Ad-Hoc maintenance schedule created successfully",
                "maintenance_schedule_id": schedule.id
            }, status=status.HTTP_201_CREATED)

        # Return validation errors if serializer is not valid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeMaintenanceScheduleToCompletedView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this view

    def put(self, request, schedule_id):
        try:
            # Fetch the MaintenanceSchedule object using the provided schedule_id
            maintenance_schedule = MaintenanceSchedule.objects.get(id=schedule_id)
        except MaintenanceSchedule.DoesNotExist:
            return Response({"detail": "Schedule not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the technician is assigned to the maintenance schedule
        if maintenance_schedule.technician is None:
            return Response({"detail": "This maintenance schedule cannot be completed as no technician has been assigned."}, status=status.HTTP_400_BAD_REQUEST)

        # Check the current status of the schedule
        if maintenance_schedule.status == 'completed':
            # If the schedule is already completed, return a message saying so
            return Response({"detail": "Sorry, this maintenance schedule has already been completed!"}, status=status.HTTP_400_BAD_REQUEST)

        elif maintenance_schedule.status == 'overdue':
            # If the status is 'overdue', change it to 'completed' quietly (without creating a new schedule)
            # Use the `update()` method to prevent triggering additional logic
            MaintenanceSchedule.objects.filter(id=schedule_id).update(status='completed')

            return Response({"detail": "The maintenance schedule was overdue and has now been marked as completed."}, status=status.HTTP_200_OK)

        elif maintenance_schedule.status == 'scheduled':
            # If the status is 'scheduled', change it to 'completed' and create a new schedule for next month
            maintenance_schedule.status = 'completed'
            maintenance_schedule.save()

            return Response({"detail": "The maintenance schedule has been completed, and a new schedule has been created"}, status=status.HTTP_200_OK)

        # Default case, shouldn't be needed, but handle any unexpected status
        return Response({"detail": "Unexpected status."}, status=status.HTTP_400_BAD_REQUEST)


class MaintenanceScheduleListView(APIView):
    """
    View to retrieve all maintenance schedules, including regular, ad-hoc, and building-level ad-hoc schedules.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def get(self, request):
        # Get all regular maintenance schedules
        regular_schedules = MaintenanceSchedule.objects.all()
        # Serialize regular maintenance schedules
        regular_serializer = CompleteMaintenanceScheduleSerializer(regular_schedules, many=True)

        # Get all ad-hoc maintenance schedules
        adhoc_schedules = AdHocMaintenanceSchedule.objects.all()
        # Serialize ad-hoc maintenance schedules
        adhoc_serializer = CompleteMaintenanceScheduleSerializer(adhoc_schedules, many=True)

        # Get all building-level ad-hoc maintenance schedules
        building_adhoc_schedules = BuildingLevelAdhocSchedule.objects.all()
        # Serialize building-level ad-hoc maintenance schedules
        building_adhoc_serializer = BuildingLevelAdhocScheduleSerializer(building_adhoc_schedules, many=True)

        # Combine the serialized data
        response_data = {
            "regular_schedules": regular_serializer.data,
            "adhoc_schedules": adhoc_serializer.data,
            "building_level_adhoc_schedules": building_adhoc_serializer.data,
        }

        # Return the combined data
        return Response(response_data, status=status.HTTP_200_OK)

class MaintenanceScheduleDeleteView(APIView):
    """
    View to delete a maintenance schedule, handling regular, ad-hoc, and building-level ad-hoc schedules.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def delete(self, request, schedule_id):
        # Try to find and delete a regular maintenance schedule
        try:
            maintenance_schedule = MaintenanceSchedule.objects.get(id=schedule_id)
            maintenance_schedule.delete()
            return Response({"detail": "Regular maintenance schedule deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except MaintenanceSchedule.DoesNotExist:
            pass  # Continue to check for ad-hoc schedules

        # Try to find and delete an ad-hoc maintenance schedule
        try:
            adhoc_schedule = AdHocMaintenanceSchedule.objects.get(id=schedule_id)
            adhoc_schedule.delete()
            return Response({"detail": "Ad-hoc maintenance schedule deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except AdHocMaintenanceSchedule.DoesNotExist:
            pass  # Continue to check for building-level ad-hoc schedules

        # Try to find and delete a building-level ad-hoc maintenance schedule
        try:
            building_adhoc_schedule = BuildingLevelAdhocSchedule.objects.get(id=schedule_id)
            building_adhoc_schedule.delete()
            return Response({"detail": "Building-level ad-hoc maintenance schedule deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except BuildingLevelAdhocSchedule.DoesNotExist:
            pass  # If none is found, proceed to the error response

        # If no schedule is found, return a 404 response
        return Response({"detail": "Schedule not found."}, status=status.HTTP_404_NOT_FOUND)

class TechnicianMaintenanceSchedulesView(APIView):
    """
    View to retrieve all maintenance schedules (regular, ad-hoc, and building-level ad-hoc) assigned to a technician.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def get(self, request, technician_id):
        try:
            # Fetch the Technician object using the provided technician_id
            technician = Technician.objects.get(id=technician_id)
        except Technician.DoesNotExist:
            return Response({"detail": "Technician not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all regular maintenance schedules for the technician
        regular_schedules = MaintenanceSchedule.objects.filter(technician=technician)
        # Get all ad-hoc maintenance schedules for the technician
        adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(technician=technician)
        # Get all building-level ad-hoc maintenance schedules assigned to the technician
        building_adhoc_schedules = BuildingLevelAdhocSchedule.objects.filter(technician=technician)
        
        # Check if no schedules are found
        if not (regular_schedules.exists() or adhoc_schedules.exists() or building_adhoc_schedules.exists()):
            return Response({"detail": "No maintenance schedules found for this technician."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the maintenance schedules
        regular_serializer = CompleteMaintenanceScheduleSerializer(regular_schedules, many=True)
        adhoc_serializer = CompleteMaintenanceScheduleSerializer(adhoc_schedules, many=True)
        building_adhoc_serializer = BuildingLevelAdhocScheduleSerializer(building_adhoc_schedules, many=True)
        
        # Combine serialized data
        response_data = {
            "regular_schedules": regular_serializer.data,
            "adhoc_schedules": adhoc_serializer.data,
            "building_adhoc_schedules": building_adhoc_serializer.data,
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    

class ElevatorMaintenanceSchedulesView(APIView):
    """
    View to retrieve all maintenance schedules (regular, ad-hoc, and building-level ad-hoc) associated with a specific elevator.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def get(self, request, elevator_id):
        try:
            # Fetch the Elevator object using the provided elevator_id
            elevator = Elevator.objects.get(id=elevator_id)
        except Elevator.DoesNotExist:
            return Response({"detail": "Elevator not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all regular maintenance schedules for the elevator
        regular_schedules = MaintenanceSchedule.objects.filter(elevator=elevator)
        # Get all ad-hoc maintenance schedules for the elevator
        adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(elevator=elevator)
        # Get all building-level ad-hoc maintenance schedules related to the elevator's building
        building_adhoc_schedules = BuildingLevelAdhocSchedule.objects.filter(building=elevator.building)
        
        # Check if no schedules are found
        if not (regular_schedules.exists() or adhoc_schedules.exists() or building_adhoc_schedules.exists()):
            return Response({"detail": "No maintenance schedules found for this elevator."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the maintenance schedules
        regular_serializer = CompleteMaintenanceScheduleSerializer(regular_schedules, many=True)
        adhoc_serializer = CompleteMaintenanceScheduleSerializer(adhoc_schedules, many=True)
        building_adhoc_serializer = BuildingLevelAdhocScheduleSerializer(building_adhoc_schedules, many=True)
        
        # Combine serialized data
        response_data = {
            "regular_schedules": regular_serializer.data,
            "adhoc_schedules": adhoc_serializer.data,
            "building_adhoc_schedules": building_adhoc_serializer.data,
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
class MaintenanceCompanyMaintenanceSchedulesView(APIView):
    """
    View to retrieve all maintenance schedules (regular, ad-hoc, and building-level ad-hoc) associated with a specific maintenance company.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def get(self, request, company_id):
        try:
            # Fetch the Maintenance object using the provided company_id
            maintenance_company = Maintenance.objects.get(id=company_id)
        except Maintenance.DoesNotExist:
            return Response({"detail": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all regular maintenance schedules for the company
        regular_schedules = MaintenanceSchedule.objects.filter(maintenance_company=maintenance_company)
        # Get all ad-hoc maintenance schedules for the company
        adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(maintenance_company=maintenance_company)
        # Get all building-level ad-hoc maintenance schedules for the company
        building_adhoc_schedules = BuildingLevelAdhocSchedule.objects.filter(maintenance_company=maintenance_company)
        
        # Check if no schedules are found
        if not (regular_schedules.exists() or adhoc_schedules.exists() or building_adhoc_schedules.exists()):
            return Response({"detail": "No maintenance schedules found for this maintenance company."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the maintenance schedules
        regular_serializer = CompleteMaintenanceScheduleSerializer(regular_schedules, many=True)
        adhoc_serializer = CompleteMaintenanceScheduleSerializer(adhoc_schedules, many=True)
        building_adhoc_serializer = BuildingLevelAdhocScheduleSerializer(building_adhoc_schedules, many=True)
        
        # Combine serialized data
        response_data = {
            "regular_schedules": regular_serializer.data,
            "adhoc_schedules": adhoc_serializer.data,
            "building_adhoc_schedules": building_adhoc_serializer.data,
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
class DeveloperMaintenanceSchedulesView(APIView):
    """
    View to retrieve all maintenance schedules (regular, ad-hoc, and building-level ad-hoc) associated with a developer.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def get(self, request, developer_id):
        try:
            # Fetch the Developer object using the provided developer_id
            developer = Developer.objects.get(id=developer_id)
        except Developer.DoesNotExist:
            return Response({"detail": "Developer not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get all buildings linked to this developer
        buildings = developer.buildings.all()
        if not buildings.exists():
            return Response({"detail": "No buildings found for this developer."}, status=status.HTTP_404_NOT_FOUND)

        # Get all elevators linked to these buildings
        elevators = Elevator.objects.filter(building__in=buildings)
        if not elevators.exists():
            return Response({"detail": "No elevators found for this developer."}, status=status.HTTP_404_NOT_FOUND)

        # Get all regular, ad-hoc, and building-level ad-hoc maintenance schedules for these elevators and buildings
        regular_schedules = MaintenanceSchedule.objects.filter(elevator__in=elevators)
        adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(elevator__in=elevators)
        building_adhoc_schedules = BuildingLevelAdhocSchedule.objects.filter(building__in=buildings)

        # Check if no maintenance schedules are found
        if not (regular_schedules.exists() or adhoc_schedules.exists() or building_adhoc_schedules.exists()):
            return Response({"detail": "No maintenance schedules found for this developer."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the schedules
        regular_serializer = CompleteMaintenanceScheduleSerializer(regular_schedules, many=True)
        adhoc_serializer = CompleteMaintenanceScheduleSerializer(adhoc_schedules, many=True)
        building_adhoc_serializer = BuildingLevelAdhocScheduleSerializer(building_adhoc_schedules, many=True)

        # Combine serialized data
        response_data = {
            "regular_schedules": regular_serializer.data,
            "adhoc_schedules": adhoc_serializer.data,
            "building_adhoc_schedules": building_adhoc_serializer.data,
        }

        return Response(response_data, status=status.HTTP_200_OK)
    

class BuildingMaintenanceSchedulesView(APIView):
    """
    View to retrieve all maintenance schedules (regular, ad-hoc, and building-level ad-hoc) for a specific building.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def get(self, request, building_id):
        try:
            # Fetch the Building object using the provided building_id
            building = Building.objects.get(id=building_id)
        except Building.DoesNotExist:
            return Response({"detail": "Building not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get all elevators linked to this building
        elevators = building.elevators.all()
        if not elevators.exists():
            return Response({"detail": "No elevators found for this building."}, status=status.HTTP_404_NOT_FOUND)

        # Get all regular and ad-hoc maintenance schedules for these elevators
        regular_schedules = MaintenanceSchedule.objects.filter(elevator__in=elevators)
        adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(elevator__in=elevators)

        # Get all building-level ad-hoc maintenance schedules for this building
        building_adhoc_schedules = BuildingLevelAdhocSchedule.objects.filter(building=building)

        # Check if no maintenance schedules are found
        if (
            not regular_schedules.exists()
            and not adhoc_schedules.exists()
            and not building_adhoc_schedules.exists()
        ):
            return Response({"detail": "No maintenance schedules found for this building."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the schedules
        regular_serializer = CompleteMaintenanceScheduleSerializer(regular_schedules, many=True)
        adhoc_serializer = CompleteMaintenanceScheduleSerializer(adhoc_schedules, many=True)
        building_adhoc_serializer = BuildingLevelAdhocScheduleSerializer(building_adhoc_schedules, many=True)

        # Combine serialized data into a structured response
        response_data = {
            "regular_schedules": regular_serializer.data,
            "adhoc_schedules": adhoc_serializer.data,
            "building_level_adhoc_schedules": building_adhoc_serializer.data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class ChangeTechnicianView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, schedule_type, schedule_id):
        """
        Change the technician assigned to a maintenance schedule (regular, ad-hoc, or building-level ad-hoc).
        Ensures proper validation of technician and schedule type-specific handling.
        """
        # Determine the schedule type and fetch the appropriate schedule
        if schedule_type == 'regular':
            schedule = MaintenanceSchedule.objects.filter(id=schedule_id).first()
        elif schedule_type == 'adhoc':
            schedule = AdHocMaintenanceSchedule.objects.filter(id=schedule_id).first()
        elif schedule_type == 'building':
            schedule = BuildingLevelAdhocSchedule.objects.filter(id=schedule_id).first()
        else:
            return Response(
                {"detail": "Invalid schedule type. Use 'regular', 'adhoc', or 'building'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not schedule:
            return Response({"detail": "Maintenance schedule not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the maintenance schedule status is 'completed'
        if schedule.status == 'completed':
            return Response(
                {"detail": "You cannot reassign a completed schedule."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retrieve technician_id from the request data
        technician_id = request.data.get('technician_id', None)
        if not technician_id:
            return Response({"detail": "Technician ID must be provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the Technician object using the provided technician_id
        try:
            technician = Technician.objects.get(id=technician_id)
        except Technician.DoesNotExist:
            return Response({"detail": f"Technician with ID {technician_id} does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the technician is linked to the same maintenance company as the schedule
        if technician.maintenance_company != schedule.maintenance_company:
            return Response(
                {"detail": "Technician is not linked to the same maintenance company as this maintenance schedule."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the technician on the schedule
        if schedule_type == 'regular':
            # Regular schedules: Use update to avoid triggering additional logic
            rows_updated = MaintenanceSchedule.objects.filter(id=schedule_id).update(technician=technician)
            if rows_updated == 0:
                return Response({"detail": "Failed to update the technician."}, status=status.HTTP_400_BAD_REQUEST)
        elif schedule_type == 'adhoc':
            # Ad-hoc schedules: Use save since additional logic might not be a concern
            schedule.technician = technician
            schedule.save()
        elif schedule_type == 'building':
            # Building-level ad-hoc schedules: Use save
            schedule.technician = technician
            schedule.save()

        # Return success response
        return Response(
            {"message": f"Technician has been changed to {technician.user.first_name} {technician.user.last_name}."},
            status=status.HTTP_200_OK
        )
    

class MaintenanceScheduleFilterView(APIView):
    """
    Filter maintenance schedules (regular, ad-hoc, and building-level ad-hoc) based on various criteria.
    Applies filters one-by-one and checks for matches across all schedule types.
    """
    permission_classes = [AllowAny]

    def put(self, request):
        # Allowed fields in the request
        allowed_fields = [
            'technician_id', 'status', 'developer_id', 'elevator_id', 
            'building_id', 'scheduled_date', 'next_schedule', 'maintenance_company_id', 'schedule_type'
        ]

        # Check for invalid keys in the request data
        invalid_fields = [key for key in request.data if key not in allowed_fields]
        if invalid_fields:
            return Response({"detail": f"Invalid fields: {', '.join(invalid_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract filters from the request data
        filters = {key: request.data.get(key) for key in allowed_fields}

        # Valid status and next_schedule options
        valid_statuses = ['scheduled', 'overdue', 'completed']
        valid_next_schedules = ['1_month', '3_months', '6_months', 'set_date']

        # Helper function to safely convert ID fields to integers
        def get_int_value(value):
            if isinstance(value, int):
                return value
            try:
                return int(value)
            except (ValueError, TypeError):
                return None

        # Determine schedule type
        schedule_type = filters.get("schedule_type")
        if schedule_type not in [None, "regular", "adhoc", "building"]:
            return Response({"detail": "Invalid schedule_type. Valid options are: 'regular', 'adhoc', 'building'."}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize querysets based on schedule_type
        if schedule_type == "regular":
            queryset = MaintenanceSchedule.objects.all()
        elif schedule_type == "adhoc":
            queryset = AdHocMaintenanceSchedule.objects.all()
        elif schedule_type == "building":
            queryset = BuildingLevelAdhocSchedule.objects.all()
        else:
            regular_queryset = MaintenanceSchedule.objects.all()
            adhoc_queryset = AdHocMaintenanceSchedule.objects.all()
            building_queryset = BuildingLevelAdhocSchedule.objects.all()
            queryset = list(regular_queryset) + list(adhoc_queryset) + list(building_queryset)

        # Apply filters to the queryset
        for key, value in filters.items():
            if not value or key == "schedule_type":
                continue

            if key == "technician_id":
                technician_id = get_int_value(value)
                if technician_id is None:
                    return Response({"detail": "Invalid technician ID format."}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    technician = Technician.objects.get(id=technician_id)
                    queryset = [item for item in queryset if item.technician == technician]
                except Technician.DoesNotExist:
                    return Response({"detail": f"Technician with ID {technician_id} not found."}, status=status.HTTP_404_NOT_FOUND)

            elif key == "status":
                if value not in valid_statuses:
                    return Response({"detail": f"Invalid status '{value}'. Valid options are: {', '.join(valid_statuses)}."}, status=status.HTTP_400_BAD_REQUEST)
                queryset = [item for item in queryset if item.status == value]

            elif key == "developer_id":
                developer_id = get_int_value(value)
                if developer_id is None:
                    return Response({"detail": "Invalid developer ID format."}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    developer = Developer.objects.get(id=developer_id)
                    buildings = Building.objects.filter(developer=developer)
                    elevators = Elevator.objects.filter(building__in=buildings)
                    queryset = [item for item in queryset if item.elevator in elevators]
                except Developer.DoesNotExist:
                    return Response({"detail": f"Developer with ID {developer_id} not found."}, status=status.HTTP_404_NOT_FOUND)

            elif key == "elevator_id":
                elevator_id = get_int_value(value)
                if elevator_id is None:
                    return Response({"detail": "Invalid elevator ID format."}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    elevator = Elevator.objects.get(id=elevator_id)
                    queryset = [item for item in queryset if item.elevator == elevator]
                except Elevator.DoesNotExist:
                    return Response({"detail": f"Elevator with ID {elevator_id} not found."}, status=status.HTTP_404_NOT_FOUND)

            elif key == "building_id":
                building_id = get_int_value(value)
                if building_id is None:
                    return Response({"detail": "Invalid building ID format."}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    building = Building.objects.get(id=building_id)
                    elevators = Elevator.objects.filter(building=building)
                    queryset = [item for item in queryset if item.elevator in elevators]
                except Building.DoesNotExist:
                    return Response({"detail": f"Building with ID {building_id} not found."}, status=status.HTTP_404_NOT_FOUND)

            elif key == "scheduled_date":
                try:
                    scheduled_date = datetime.strptime(value, '%Y-%m-%d').date()
                    queryset = [item for item in queryset if item.scheduled_date == scheduled_date]
                except ValueError:
                    return Response({"detail": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

            elif key == "next_schedule":
                if value not in valid_next_schedules:
                    return Response({"detail": f"Invalid next_schedule '{value}'. Valid options are: {', '.join(valid_next_schedules)}."}, status=status.HTTP_400_BAD_REQUEST)
                queryset = [item for item in queryset if item.next_schedule == value]

            elif key == "maintenance_company_id":
                maintenance_company_id = get_int_value(value)
                if maintenance_company_id is None:
                    return Response({"detail": "Invalid maintenance company ID format."}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    maintenance_company = Maintenance.objects.get(id=maintenance_company_id)
                    queryset = [item for item in queryset if item.maintenance_company == maintenance_company]
                except Maintenance.DoesNotExist:
                    return Response({"detail": f"Maintenance company with ID {maintenance_company_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if any results match the filters
        if not queryset:
            return Response({"detail": "No maintenance schedules found matching the criteria."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the queryset
        if schedule_type == "building":
            serializer = BuildingLevelAdhocScheduleSerializer(queryset, many=True)
        else:
            serializer = CompleteMaintenanceScheduleSerializer(queryset, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)



class MaintenanceScheduleNullTechnicianFilterView(APIView):
    permission_classes = [AllowAny]

    def put(self, request):
        """
        Fetch maintenance schedules where the technician field is null.
        The user can filter based on developer, building, maintenance company, or elevator.
        """
        # Allowed fields for filtering
        allowed_fields = ['developer_id', 'building_id', 'scheduled_date', 'maintenance_company_id', 'elevator_id']
        
        # Check for invalid keys in the request data
        invalid_fields = [key for key in request.data if key not in allowed_fields]
        if invalid_fields:
            return Response({"detail": f"Invalid fields: {', '.join(invalid_fields)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract filters from the request data
        developer_id = request.data.get('developer_id')
        building_id = request.data.get('building_id')
        scheduled_date = request.data.get('scheduled_date')
        maintenance_company_id = request.data.get('maintenance_company_id')
        elevator_id = request.data.get('elevator_id')

        # Start with the base queryset for maintenance schedules where the technician is null
        queryset = MaintenanceSchedule.objects.filter(technician__isnull=True)

        # 1. Filter by Developer
        if developer_id:
            try:
                developer = Developer.objects.get(id=developer_id)
                buildings = Building.objects.filter(developer=developer)
                elevators = Elevator.objects.filter(building__in=buildings)
                queryset = queryset.filter(elevator__in=elevators)
            except Developer.DoesNotExist:
                return Response({"detail": f"Developer with ID {developer_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Filter by Building
        if building_id:
            try:
                building = Building.objects.get(id=building_id)
                elevators = Elevator.objects.filter(building=building)
                queryset = queryset.filter(elevator__in=elevators)
            except Building.DoesNotExist:
                return Response({"detail": f"Building with ID {building_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 3. Filter by Scheduled Date
        if scheduled_date:
            try:
                scheduled_date = datetime.strptime(scheduled_date, '%Y-%m-%d').date()
                queryset = queryset.filter(scheduled_date=scheduled_date)
            except ValueError:
                return Response({"detail": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Filter by Maintenance Company
        if maintenance_company_id:
            try:
                maintenance_company = Maintenance.objects.get(id=maintenance_company_id)
                queryset = queryset.filter(maintenance_company=maintenance_company)
            except Maintenance.DoesNotExist:
                return Response({"detail": f"Maintenance company with ID {maintenance_company_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 5. Filter by Elevator
        if elevator_id:
            try:
                elevator = Elevator.objects.get(id=elevator_id)
                queryset = queryset.filter(elevator=elevator)
            except Elevator.DoesNotExist:
                return Response({"detail": f"Elevator with ID {elevator_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if any results match the filters
        if not queryset.exists():
            return Response({"detail": "No Non-assigned maintenance schedules found matching the criteria."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the filtered queryset
        serializer = FullMaintenanceScheduleSerializer(queryset, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class FileMaintenanceLogView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access this view

    def post(self, request, schedule_id):
        """
        File the details of the elevator condition and maintenance log for a given schedule.
        This will also trigger the completion of the maintenance schedule if successful.
        Handles both regular and ad-hoc maintenance schedules.
        """
        schedule_type = request.data.get('schedule_type')
        if not schedule_type:
            return Response({"detail": "Schedule type is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the maintenance schedule based on the schedule type
        try:
            if schedule_type == 'regular':
                maintenance_schedule = MaintenanceSchedule.objects.get(id=schedule_id)
            elif schedule_type == 'adhoc':
                maintenance_schedule = AdHocMaintenanceSchedule.objects.get(id=schedule_id)
            else:
                return Response({"detail": "Invalid schedule type."}, status=status.HTTP_400_BAD_REQUEST)
        except (MaintenanceSchedule.DoesNotExist, AdHocMaintenanceSchedule.DoesNotExist):
            return Response({"detail": "Maintenance schedule not found."}, status=status.HTTP_404_NOT_FOUND)

        # Validate the existence of technician and maintenance company
        if not maintenance_schedule.technician:
            return Response(
                {"detail": "This maintenance schedule cannot be completed as no technician has been assigned."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not maintenance_schedule.maintenance_company:
            return Response(
                {"detail": "This maintenance schedule cannot be completed as no maintenance company has been assigned."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Ensure the schedule is not already completed
        if maintenance_schedule.status == 'completed':
            return Response({"detail": "This maintenance schedule has already been completed!"}, status=status.HTTP_400_BAD_REQUEST)

        # Process the condition report
        condition_report_data = request.data.get('condition_report')
        if not condition_report_data:
            return Response({"detail": "Condition report data is required."}, status=status.HTTP_400_BAD_REQUEST)

        condition_report_data['technician'] = maintenance_schedule.technician.id

        # Handle ad-hoc schedule differently
        if schedule_type == 'regular':
            condition_report_data['maintenance_schedule'] = maintenance_schedule.id
            condition_report_serializer = ElevatorConditionReportSerializer(data=condition_report_data)
        else:  # Ad-hoc schedule
            condition_report_data['ad_hoc_schedule'] = maintenance_schedule.id
            condition_report_serializer = AdHocElevatorConditionReportSerializer(data=condition_report_data)

        # Validate and save the condition report
        if condition_report_serializer.is_valid():
            condition_report = condition_report_serializer.save()
        else:
            return Response(condition_report_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Process the maintenance log
        maintenance_log_data = request.data.get('maintenance_log')
        if not maintenance_log_data:
            return Response({"detail": "Maintenance log data is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Assign technician and condition report to the maintenance log
        maintenance_log_data['technician'] = maintenance_schedule.technician.id
        maintenance_log_data['condition_report'] = condition_report.id

        # Handle ad-hoc schedule differently
        if schedule_type == 'regular':
            maintenance_log_data['maintenance_schedule'] = maintenance_schedule.id
            maintenance_log_serializer = ScheduledMaintenanceLogSerializer(data=maintenance_log_data)
        else:  # Ad-hoc schedule
            maintenance_log_data['ad_hoc_schedule'] = maintenance_schedule.id
            maintenance_log_serializer = AdHocMaintenanceLogSerializer(data=maintenance_log_data)

        # Validate and save the maintenance log
        if maintenance_log_serializer.is_valid():
            maintenance_log = maintenance_log_serializer.save()
        else:
            return Response(maintenance_log_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Mark the schedule as completed
        maintenance_schedule.status = 'completed'
        maintenance_schedule.save()

        return Response(
            {"detail": f"{schedule_type.capitalize()} maintenance schedule successfully completed."},
            status=status.HTTP_200_OK,
        )


class ElevatorMaintenanceHistoryView(APIView):
    permission_classes = [AllowAny]
    """
    Retrieve all completed maintenance schedules (regular and ad-hoc) for a specific elevator,
    including condition reports and maintenance logs, sorted by most recent.
    """
    def get(self, request, elevator_id):
        # Get all completed maintenance schedules (regular and ad-hoc) for the elevator
        regular_schedules = MaintenanceSchedule.objects.filter(
            elevator_id=elevator_id,
            status='completed'
        ).order_by('-scheduled_date')

        adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(
            elevator_id=elevator_id,
            status='completed'
        ).order_by('-scheduled_date')

        # Combine and sort all schedules by the most recent scheduled_date
        all_schedules = sorted(
            list(regular_schedules) + list(adhoc_schedules),
            key=lambda x: x.scheduled_date,
            reverse=True
        )

        # Serialize the combined schedules
        serializer = CompleteMaintenanceScheduleSerializer(all_schedules, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    


class TechnicianJobStatusView(APIView):
    permission_classes = [AllowAny]
    """
    Retrieve regular, ad-hoc, and building-level ad-hoc maintenance schedules
    for a specific technician based on job status.
    """
    def get(self, request, technician_id, job_status):
        # Validate the technician ID
        try:
            technician = Technician.objects.get(id=technician_id)
        except Technician.DoesNotExist:
            return Response({"detail": f"Technician with ID {technician_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Filter MaintenanceSchedule, AdHocMaintenanceSchedule, and BuildingLevelAdhocSchedule for the technician
        regular_schedules = MaintenanceSchedule.objects.filter(technician=technician)
        adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(technician=technician)
        building_adhoc_schedules = BuildingLevelAdhocSchedule.objects.filter(technician=technician)

        # Filter schedules based on job status
        if job_status == "upcoming_jobs":
            regular_schedules = regular_schedules.filter(status="scheduled").order_by('scheduled_date')
            adhoc_schedules = adhoc_schedules.filter(status="scheduled").order_by('scheduled_date')
            building_adhoc_schedules = building_adhoc_schedules.filter(status="scheduled").order_by('scheduled_date')

        elif job_status == "overdue_jobs":
            regular_schedules = regular_schedules.filter(status="overdue").order_by('-scheduled_date')
            adhoc_schedules = adhoc_schedules.filter(status="overdue").order_by('-scheduled_date')
            building_adhoc_schedules = building_adhoc_schedules.filter(status="overdue").order_by('-scheduled_date')

        elif job_status == "completed_jobs":
            regular_schedules = regular_schedules.filter(status="completed")
            adhoc_schedules = adhoc_schedules.filter(status="completed")
            building_adhoc_schedules = building_adhoc_schedules.filter(status="completed")

        else:
            return Response({
                "detail": "Invalid job_status provided. Valid options are 'upcoming_jobs', 'overdue_jobs', and 'completed_jobs'."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Serialize the data using the appropriate serializers
        serialized_regular_schedules = CompleteMaintenanceScheduleSerializer(regular_schedules, many=True)
        serialized_adhoc_schedules = CompleteMaintenanceScheduleSerializer(adhoc_schedules, many=True)
        serialized_building_adhoc_schedules = BuildingLevelAdhocScheduleSerializer(building_adhoc_schedules, many=True)

        # Return the serialized data
        return Response({
            'regular_schedules': serialized_regular_schedules.data,
            'adhoc_schedules': serialized_adhoc_schedules.data,
            'building_adhoc_schedules': serialized_building_adhoc_schedules.data,
        }, status=status.HTTP_200_OK)
    


class MaintenanceCompanyJobStatusView(APIView):
    permission_classes = [AllowAny]
    """
    Retrieve regular, ad-hoc, and building-level ad-hoc maintenance schedules 
    for a specific maintenance company based on job status.
    """
    def get(self, request, company_id, job_status):
        # Validate the Maintenance Company ID
        try:
            maintenance_company = Maintenance.objects.get(id=company_id)
        except Maintenance.DoesNotExist:
            return Response({"detail": f"Maintenance company with ID {company_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Filter MaintenanceSchedule, AdHocMaintenanceSchedule, and BuildingLevelAdhocSchedule for the maintenance company
        regular_schedules = MaintenanceSchedule.objects.filter(maintenance_company=maintenance_company)
        adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(maintenance_company=maintenance_company)
        building_adhoc_schedules = BuildingLevelAdhocSchedule.objects.filter(maintenance_company=maintenance_company)

        # Filter schedules based on job status
        if job_status == "upcoming_jobs":
            regular_schedules = regular_schedules.filter(status="scheduled").order_by('scheduled_date')
            adhoc_schedules = adhoc_schedules.filter(status="scheduled").order_by('scheduled_date')
            building_adhoc_schedules = building_adhoc_schedules.filter(status="scheduled").order_by('scheduled_date')

        elif job_status == "overdue_jobs":
            regular_schedules = regular_schedules.filter(status="overdue").order_by('-scheduled_date')
            adhoc_schedules = adhoc_schedules.filter(status="overdue").order_by('-scheduled_date')
            building_adhoc_schedules = building_adhoc_schedules.filter(status="overdue").order_by('-scheduled_date')

        elif job_status == "completed_jobs":
            regular_schedules = regular_schedules.filter(status="completed")
            adhoc_schedules = adhoc_schedules.filter(status="completed")
            building_adhoc_schedules = building_adhoc_schedules.filter(status="completed")

        else:
            return Response({
                "detail": "Invalid job_status provided. Valid options are 'upcoming_jobs', 'overdue_jobs', and 'completed_jobs'."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Serialize the data using the appropriate serializers
        serialized_regular_schedules = CompleteMaintenanceScheduleSerializer(regular_schedules, many=True)
        serialized_adhoc_schedules = CompleteMaintenanceScheduleSerializer(adhoc_schedules, many=True)
        serialized_building_adhoc_schedules = BuildingLevelAdhocScheduleSerializer(building_adhoc_schedules, many=True)

        # Return the serialized data
        return Response({
            'regular_schedules': serialized_regular_schedules.data,
            'adhoc_schedules': serialized_adhoc_schedules.data,
            'building_adhoc_schedules': serialized_building_adhoc_schedules.data,
        }, status=status.HTTP_200_OK)
    

class CreateBuildingAdhocScheduleView(APIView):
    permission_classes = [AllowAny]
    """
    API endpoint to create a new building-specific ad hoc maintenance schedule.
    """

    def post(self, request, building_id):
        try:
            # Check if the building exists
            building = Building.objects.get(id=building_id)
        except Building.DoesNotExist:
            return Response(
                {"detail": f"Building with ID {building_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate that the description is provided
        description = request.data.get('description', '').strip()
        if not description:
            return Response(
                {"detail": "Description is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retrieve an elevator linked to the building
        elevator = Elevator.objects.filter(building=building).first()
        if not elevator:
            return Response(
                {"detail": f"No elevators found for Building with ID {building_id}."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Retrieve the associated technician and maintenance company
        technician = elevator.technician
        maintenance_company = elevator.maintenance_company

        if not technician:
            return Response(
                {"detail": f"No technician assigned to Elevator with ID {elevator.id}."},
                status=status.HTTP_404_NOT_FOUND
            )

        if not maintenance_company:
            return Response(
                {"detail": f"No maintenance company assigned to Elevator with ID {elevator.id}."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create the ad hoc schedule
        adhoc_schedule = BuildingLevelAdhocSchedule(
            building=building,
            technician=technician,
            maintenance_company=maintenance_company,
            description=description,
            scheduled_date=now(),  # Set to the current time
            status='scheduled'    # Default status
        )

        # Save the schedule and handle potential validation errors
        try:
            adhoc_schedule.full_clean()  # Perform model validation
            adhoc_schedule.save()
        except Exception as e:
            return Response(
                {"detail": f"Error creating ad hoc schedule: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Serialize and return the created schedule
        serializer = BuildingLevelAdhocScheduleSerializer(adhoc_schedule)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class CompleteBuildingScheduleView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        building_schedule_id = self.kwargs['building_schedule_id']
        
        # Retrieve the building schedule by ID (BuildingLevelAdhocSchedule)
        building_schedule = get_object_or_404(BuildingLevelAdhocSchedule, id=building_schedule_id)

        # Check if the Building Adhoc Schedule is already completed
        if building_schedule.status == 'completed':
            return Response({
                "message": "This building schedule has already been completed."
            }, status=400)

        # Retrieve the building associated with the schedule
        building = building_schedule.building
        
        # Get the list of elevator data from the request body
        elevators_data = request.data.get("elevators", [])

        # List to collect failed elevators
        failed_elevators = []

        # First, check if all elevators belong to the building
        for elevator_data in elevators_data:
            elevator_id = elevator_data.get("elevator_id")
            
            # Ensure the elevator exists and belongs to the building
            elevator = Elevator.objects.filter(id=elevator_id, building=building).first()

            if not elevator:
                # Add failed elevator to the list and terminate early with a response
                failed_elevators.append(f"Elevator ID {elevator_id} does not exist or does not belong to this building.")
                return Response({
                    "message": "Some elevators do not belong to this building or do not exist.",
                    "failed_elevators": failed_elevators
                }, status=400)

        # If all elevators are valid, proceed with the creation of maintenance schedules, condition reports, and maintenance logs
        successful_elevators = []

        for elevator_data in elevators_data:
            elevator_id = elevator_data.get("elevator_id")
            try:
                # Retrieve the elevator that belongs to the building
                elevator = get_object_or_404(Elevator, id=elevator_id, building=building)

                # Create the Ad-Hoc Maintenance Schedule for this elevator
                ad_hoc_schedule = AdHocMaintenanceSchedule.objects.create(
                    elevator=elevator,
                    technician=building_schedule.technician,
                    maintenance_company=building_schedule.maintenance_company,
                    scheduled_date=building_schedule.scheduled_date,
                    description=f"A system-generated maintenance schedule based on the building-level ad-hoc schedule of {building_schedule.scheduled_date.strftime('%Y-%m-%d')}, intended to { {building_schedule.description} }.",  # Creative and concise description
                    status='completed'  # Set the status to completed
                )
                # Create the Condition Report using the provided data
                condition_report_data = elevator_data.get("condition_report", {})
                condition_report = AdHocElevatorConditionReport.objects.create(
                    ad_hoc_schedule=ad_hoc_schedule,
                    technician=building_schedule.technician,
                    date_inspected=timezone.now(),
                    components_checked=condition_report_data.get("components_checked", ""),
                    condition=condition_report_data.get("condition", ""),
                )

                # Create the Maintenance Log using the provided data
                maintenance_log_data = elevator_data.get("maintenance_log", {})
                maintenance_log = AdHocMaintenanceLog.objects.create(
                    ad_hoc_schedule=ad_hoc_schedule,
                    technician=building_schedule.technician,
                    condition_report=condition_report,
                    date_completed=timezone.now(),
                    summary_title=maintenance_log_data.get("summary_title", ""),
                    description=maintenance_log_data.get("description", ""),
                    overseen_by=maintenance_log_data.get("overseen_by", ""),
                )

                # Add to the list of successful elevators
                successful_elevators.append(elevator.user_name)

            except Exception as e:
                failed_elevators.append(f"Error processing elevator ID {elevator_id}: {str(e)}")
                continue

        # Only update the building schedule status to 'completed' if all processes were successful
        if not failed_elevators:
            building_schedule.status = 'completed'
            building_schedule.save()

        # Prepare a success/failure response message
        if successful_elevators:
            message = f"{len(successful_elevators)} elevators ({', '.join(successful_elevators)}) were successfully checked during this building schedule and their condition reports and maintenance logs were generated and recorded."
        else:
            message = "No elevators were successfully checked during this building schedule."

        # If there were any failures, return a message with details
        if failed_elevators:
            message = "Some elevators failed during the process: " + "; ".join(failed_elevators)

        return Response({
            "message": message,
            "failed_elevators": failed_elevators
        }, status=200)