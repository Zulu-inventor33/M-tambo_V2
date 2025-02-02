from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import UpdateAPIView
from rest_framework.exceptions import NotFound
from rest_framework.generics import DestroyAPIView
from .models import Elevator
from buildings.models import Building
from .serializers import ElevatorSerializer
from .models import ElevatorIssueLog
from jobs.models import AdHocMaintenanceSchedule
from jobs.models import MaintenanceSchedule
from .serializers import ElevatorIssueLogSerializer
from jobs.serializers import AdHocMaintenanceScheduleSerializer
from datetime import datetime
from django.utils import timezone

class AddElevatorView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this view

    def post(self, request, *args, **kwargs):
        serializer = ElevatorSerializer(data=request.data)
        if serializer.is_valid():
            # Save the new elevator object to the database
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # If validation fails, return a 400 Bad Request with the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ElevatorListView(APIView):
    permission_classes = [AllowAny]  # Adjust permission as necessary

    def get(self, request, *args, **kwargs):
        # Retrieve all elevator objects
        elevators = Elevator.objects.all()

        # Serialize the elevator data
        serializer = ElevatorSerializer(elevators, many=True)

        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ElevatorDetailByIdView(APIView):
    """
    Retrieve a specific elevator by its ID
    """
    permission_classes = [AllowAny]  # This allows any user to access this endpoint
    
    def get(self, request, elevator_id, *args, **kwargs):
        try:
            # Retrieve the elevator by its ID
            elevator = Elevator.objects.get(id=elevator_id)
            
            # Serialize the elevator data
            serializer = ElevatorSerializer(elevator)

            # Return the serialized data in the response
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Elevator.DoesNotExist:
            # If the elevator with the provided ID doesn't exist, return a 404 error
            return Response({"detail": "Elevator not found."}, status=status.HTTP_404_NOT_FOUND)

class ElevatorDetailByMachineNumberView(APIView):
    """
    Retrieve a specific elevator by its machine number
    """
    permission_classes = [AllowAny]  # This allows any user to access this endpoint
    
    def get(self, request, machine_number, *args, **kwargs):
        try:
            # Retrieve the elevator by its machine number
            elevator = Elevator.objects.get(machine_number=machine_number)
            
            # Serialize the elevator data
            serializer = ElevatorSerializer(elevator)

            # Return the serialized data in the response
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Elevator.DoesNotExist:
            # If the elevator with the provided machine number doesn't exist, return a 404 error
            return Response({"detail": "Elevator not found."}, status=status.HTTP_404_NOT_FOUND)
        

class ElevatorsInBuildingView(APIView):
    """
    Get all elevators in a specific building identified by building_id.
    """
    permission_classes = [AllowAny]  # You can adjust the permission as needed

    def get(self, request, building_id, *args, **kwargs):
        try:
            # Attempt to retrieve the building by its ID
            building = Building.objects.get(id=building_id)

            # Get all elevators related to this building
            elevators = building.elevators.all()

            # Check if there are no elevators for the given building
            if not elevators.exists():
                return Response(
                    {"detail": "No elevators found for this building."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize the elevator data
            serializer = ElevatorSerializer(elevators, many=True)

            # Return the serialized data in the response
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Building.DoesNotExist:
            # If the building with the provided ID doesn't exist, return a 404 error
            return Response(
                {"detail": "Building not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        

class UpdateElevatorView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, id):
        try:
            return Elevator.objects.get(id=id)
        except Elevator.DoesNotExist:
            return None

    def put(self, request, id, *args, **kwargs):
        elevator = self.get_object(id)
        if not elevator:
            return Response({"error": "Elevator not found."}, status=status.HTTP_404_NOT_FOUND)

        # Full update: Expect all fields to be provided, no partial updates
        serializer = ElevatorSerializer(elevator, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id, *args, **kwargs):
        elevator = self.get_object(id)
        if not elevator:
            return Response({"error": "Elevator not found."}, status=status.HTTP_404_NOT_FOUND)

        # Partial update: Only fields provided in the request will be updated
        serializer = ElevatorSerializer(elevator, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteElevatorView(DestroyAPIView):
    permission_classes = [AllowAny]

    queryset = Elevator.objects.all()
    serializer_class = ElevatorSerializer

    def get_object(self):
        elevator_id = self.kwargs['id']
        try:
            # Retrieve the elevator by ID
            elevator = Elevator.objects.get(id=elevator_id)
            return elevator
        except Elevator.DoesNotExist:
            # Raise a 404 error if the elevator doesn't exist
            raise NotFound(detail="Elevator not found.")


class LogElevatorIssueView(APIView):
    """
    Record an issue for a specific elevator.
    If a predefined message is passed (e.g., "Urgency": "Technician needed Urgently"),
    create both an elevator issue and an ad-hoc maintenance schedule.
    """
    permission_classes = [AllowAny]  # Allow any user to log issues
    
    def put(self, request, elevator_id, *args, **kwargs):
        try:
            # Attempt to retrieve the elevator by its ID
            elevator = Elevator.objects.get(id=elevator_id)
        except Elevator.DoesNotExist:
            return Response({"detail": "Elevator not found."}, status=status.HTTP_404_NOT_FOUND)

        # Extract the issue description from the request data
        issue_description = request.data.get('issue_description')
        if not issue_description:
            return Response({"detail": "Issue description is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the issue log (ElevatorIssueLog)
        issue_log = ElevatorIssueLog.objects.create(
            elevator=elevator,
            developer=elevator.developer,
            building=elevator.building,
            issue_description=issue_description
        )

        # Check if an urgency message is provided
        urgency_message = request.data.get('Urgency', None)

        # If an urgency message is provided, create an ad-hoc maintenance schedule
        if urgency_message:
            # Prepare the description for the ad-hoc maintenance schedule
            maintenance_description = f"A system-generated maintenance schedule based on a Logged Elevator Issue of {timezone.now().date()}, the description of the issue is: { {issue_description} }"

            # Create an AdHocMaintenanceSchedule
            maintenance_schedule_data = {
                'elevator': elevator.id,
                'maintenance_company': elevator.maintenance_company.id if elevator.maintenance_company else None,
                'technician': elevator.technician.id if elevator.technician else None,
                'scheduled_date': timezone.now(),
                'description': maintenance_description
            }

            # Validate and create the ad-hoc maintenance schedule
            schedule_serializer = AdHocMaintenanceScheduleSerializer(data=maintenance_schedule_data)
            if schedule_serializer.is_valid():
                schedule = schedule_serializer.save()

                # Link the created schedule to the technician and maintenance company
                if not schedule.technician:
                    schedule.technician = elevator.technician
                    schedule.save()

                if not schedule.maintenance_company:
                    schedule.maintenance_company = elevator.maintenance_company
                    schedule.save()

                # Return success response with issue and maintenance schedule details
                return Response({
                    "message": "Issue logged and ad-hoc maintenance schedule created successfully.",
                    "issue_id": issue_log.id,
                    "maintenance_schedule_id": schedule.id
                }, status=status.HTTP_201_CREATED)

            return Response(schedule_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # If no urgency message is provided, just return the created issue
        return Response({
            "message": "Issue logged successfully.",
            "issue_id": issue_log.id
        }, status=status.HTTP_201_CREATED)
    


class LoggedElevatorIssuesView(APIView):
    """
    List all the logged issues for a specific elevator.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def get(self, request, elevator_id, *args, **kwargs):
        """
        Get a list of all issues logged for a specific elevator.
        """
        try:
            # Attempt to retrieve the elevator by its ID
            elevator = Elevator.objects.get(id=elevator_id)
        except Elevator.DoesNotExist:
            return Response({"detail": "Elevator not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get all logged issues for this elevator
        issues = ElevatorIssueLog.objects.filter(elevator=elevator)

        # If no issues are found, return a message
        if not issues.exists():
            return Response({"detail": "No issues logged for this elevator."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the issues data
        serializer = ElevatorIssueLogSerializer(issues, many=True)

        # Return the list of logged issues
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ElevatorWithRunningSchedulesView(APIView):
    permission_classes = [AllowAny]  # Adjust permission as necessary

    def get(self, request, *args, **kwargs):
        """
        List all elevators that have a running scheduled maintenance for today or in the future.
        """
        # We need to filter elevators that have a maintenance schedule with a scheduled date today or in the future
        elevators_with_schedules = Elevator.objects.filter(
            maintenance_schedules__scheduled_date__gte=timezone.now().date(),  # Include today or future dates
            maintenance_schedules__status="scheduled"  # Only include scheduled maintenance
        ).distinct()  # Remove duplicate entries for the same elevator

        # Serialize the elevator data
        serializer = ElevatorSerializer(elevators_with_schedules, many=True)

        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ElevatorWithoutRunningSchedulesView(APIView):
    permission_classes = [AllowAny]  # Adjust permission as necessary

    def get(self, request, *args, **kwargs):
        # Get today's date
        today = timezone.now().date()

        # Find all elevators that do not have maintenance schedules scheduled for today or in the future
        elevators_without_schedules = Elevator.objects.filter(
            ~Q(maintenance_schedules__scheduled_date__gte=today)
        ).distinct()

        # If no elevators are found, return 404 not found
        if not elevators_without_schedules:
            raise NotFound(detail="No elevators without running schedules found.")

        # Serialize the elevator data using ElevatorSerializer
        serializer = ElevatorSerializer(elevators_without_schedules, many=True)

        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)