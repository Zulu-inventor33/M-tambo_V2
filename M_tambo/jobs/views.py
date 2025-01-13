from rest_framework import status
from rest_framework.response import Response
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


class ChangeMaintenanceScheduleToCompletedView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this view

    def put(self, request, schedule_id):
        try:
            # Fetch the MaintenanceSchedule object using the provided schedule_id
            maintenance_schedule = MaintenanceSchedule.objects.get(id=schedule_id)
        except MaintenanceSchedule.DoesNotExist:
            return Response({"detail": "Schedule not found."}, status=status.HTTP_404_NOT_FOUND)

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

            # Create a new maintenance schedule for the next month
            update_schedule_status_and_create_new_schedule(maintenance_schedule)

            return Response({"detail": "The maintenance schedule has been completed, and a new schedule has been created"}, status=status.HTTP_200_OK)

        # Default case, shouldn't be needed, but handle any unexpected status
        return Response({"detail": "Unexpected status."}, status=status.HTTP_400_BAD_REQUEST)

class MaintenanceScheduleListView(APIView):
    permission_classes = [AllowAny]  # Set to AllowAny if you want public access, otherwise use other permissions like IsAuthenticated

    def get(self, request):
        # Get all maintenance schedules
        schedules = MaintenanceSchedule.objects.all()
        
        # Serialize the data
        serializer = MaintenanceScheduleSerializer(schedules, many=True)
        
        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class MaintenanceScheduleDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, schedule_id):
        try:
            # Fetch the MaintenanceSchedule object using the provided schedule_id
            maintenance_schedule = MaintenanceSchedule.objects.get(id=schedule_id)
        except MaintenanceSchedule.DoesNotExist:
            return Response({"detail": "Schedule not found."}, status=status.HTTP_404_NOT_FOUND)

        # If found, delete the schedule
        maintenance_schedule.delete()

        # Return a success response
        return Response({"detail": "Schedule deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    

class TechnicianMaintenanceSchedulesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, technician_id):
        try:
            # Fetch the Technician object using the provided technician_id
            technician = Technician.objects.get(id=technician_id)
        except Technician.DoesNotExist:
            return Response({"detail": "Technician not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all maintenance schedules for the technician
        maintenance_schedules = MaintenanceSchedule.objects.filter(technician=technician)
        
        # Check if there are no schedules assigned to the technician
        if not maintenance_schedules.exists():
            return Response({"detail": "No maintenance schedules found for this technician."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the maintenance schedules and return the response
        serializer = MaintenanceScheduleSerializer(maintenance_schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ElevatorMaintenanceSchedulesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, elevator_id):
        try:
            # Fetch the Elevator object using the provided elevator_id
            elevator = Elevator.objects.get(id=elevator_id)
        except Elevator.DoesNotExist:
            return Response({"detail": "Elevator not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all maintenance schedules for the elevator
        maintenance_schedules = MaintenanceSchedule.objects.filter(elevator=elevator)
        
        # Check if no schedules are found
        if not maintenance_schedules.exists():
            return Response({"detail": "No maintenance schedules found for this elevator."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the maintenance schedules and return the response
        serializer = MaintenanceScheduleSerializer(maintenance_schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class MaintenanceCompanyMaintenanceSchedulesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, company_id):
        try:
            # Fetch the Maintenance object using the provided company_id
            maintenance_company = Maintenance.objects.get(id=company_id)
        except Maintenance.DoesNotExist:
            return Response({"detail": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all maintenance schedules related to the maintenance company
        maintenance_schedules = MaintenanceSchedule.objects.filter(maintenance_company=maintenance_company)
        
        # Check if no schedules are found
        if not maintenance_schedules.exists():
            return Response({"detail": "No maintenance schedules found for this maintenance company."}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the maintenance schedules and return the response
        serializer = MaintenanceScheduleSerializer(maintenance_schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class DeveloperMaintenanceSchedulesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, developer_id):
        try:
            # Fetch the Developer object using the provided developer_id
            developer = Developer.objects.get(id=developer_id)
        except Developer.DoesNotExist:
            return Response({"detail": "Developer not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get all buildings linked to this developer
        buildings = developer.buildings.all()  # Using the reverse relation from Building to Developer
        if not buildings.exists():
            return Response({"detail": "No buildings found for this developer."}, status=status.HTTP_404_NOT_FOUND)

        # Get all elevators linked to these buildings
        elevators = Elevator.objects.filter(building__in=buildings)

        # Check if no elevators are found
        if not elevators.exists():
            return Response({"detail": "No elevators found for this developer."}, status=status.HTTP_404_NOT_FOUND)

        # Get all maintenance schedules for these elevators
        maintenance_schedules = MaintenanceSchedule.objects.filter(elevator__in=elevators)

        # Check if no maintenance schedules are found
        if not maintenance_schedules.exists():
            return Response({"detail": "No maintenance schedules found for this developer."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the maintenance schedules and return the response
        serializer = FullMaintenanceScheduleSerializer(maintenance_schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class BuildingMaintenanceSchedulesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, building_id):
        try:
            # Fetch the Building object using the provided building_id
            building = Building.objects.get(id=building_id)
        except Building.DoesNotExist:
            return Response({"detail": "Building not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get all elevators linked to this building
        elevators = building.elevators.all()

        # Check if no elevators are found for this building
        if not elevators.exists():
            return Response({"detail": "No elevators found for this building."}, status=status.HTTP_404_NOT_FOUND)

        # Get all maintenance schedules for these elevators
        maintenance_schedules = MaintenanceSchedule.objects.filter(elevator__in=elevators)

        # Check if no maintenance schedules are found
        if not maintenance_schedules.exists():
            return Response({"detail": "No maintenance schedules found for this building."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the maintenance schedules and return the response
        serializer = FullMaintenanceScheduleSerializer(maintenance_schedules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChangeTechnicianView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, schedule_id):
        """
        Change the technician assigned to a specific maintenance schedule.
        Verifies if the technician belongs to the same maintenance company.
        Additionally, it checks if the status of the maintenance schedule is 'completed',
        in which case reassignment is not allowed.
        """
        try:
            # Fetch the MaintenanceSchedule object using the schedule_id
            schedule = MaintenanceSchedule.objects.get(id=schedule_id)
        except MaintenanceSchedule.DoesNotExist:
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

        # Update the technician for the schedule
        schedule.technician = technician
        schedule.save()

        # Return success response
        return Response(
            {"message": f"Technician has been changed to {technician.user.first_name} {technician.user.last_name}."},
            status=status.HTTP_200_OK
        )
    

class MaintenanceScheduleFilterView(APIView):
    permission_classes = [AllowAny]

    def put(self, request):
        """
        Filter maintenance schedules based on various criteria.
        Applies filters one-by-one and checks for matches.
        Returns a specific message for each filter if no results are found.
        """

        # Extract filters from the request data
        technician_id = request.data.get('technician_id')
        status_filter = request.data.get('status')
        developer_id = request.data.get('developer_id')
        elevator_id = request.data.get('elevator_id')
        building_id = request.data.get('building_id')
        scheduled_date = request.data.get('scheduled_date')
        next_schedule = request.data.get('next_schedule')

        # Start with the base queryset for maintenance schedules
        queryset = MaintenanceSchedule.objects.all()

        # Step-by-step checks for each filter

        # 1. Filter by Technician
        if technician_id:
            try:
                technician = Technician.objects.get(id=technician_id)
                queryset = queryset.filter(technician=technician)
                if not queryset.exists():
                    return Response({"detail": f"No schedules found for technician with ID {technician_id}."}, status=status.HTTP_404_NOT_FOUND)
            except Technician.DoesNotExist:
                return Response({"detail": f"Technician with ID {technician_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Filter by Status
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            if not queryset.exists():
                return Response({"detail": f"No {status_filter} schedules found."}, status=status.HTTP_404_NOT_FOUND)

        # 3. Filter by Developer
        if developer_id:
            try:
                developer = Developer.objects.get(id=developer_id)
                buildings = Building.objects.filter(developer=developer)
                elevators = Elevator.objects.filter(building__in=buildings)
                queryset = queryset.filter(elevator__in=elevators)
                if not queryset.exists():
                    return Response({"detail": f"No schedules found for developer with ID {developer_id}."}, status=status.HTTP_404_NOT_FOUND)
            except Developer.DoesNotExist:
                return Response({"detail": f"Developer with ID {developer_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 4. Filter by Elevator
        if elevator_id:
            try:
                elevator = Elevator.objects.get(id=elevator_id)
                queryset = queryset.filter(elevator=elevator)
                if not queryset.exists():
                    return Response({"detail": f"No schedules found for elevator with ID {elevator_id}."}, status=status.HTTP_404_NOT_FOUND)
            except Elevator.DoesNotExist:
                return Response({"detail": f"Elevator with ID {elevator_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 5. Filter by Building
        if building_id:
            try:
                building = Building.objects.get(id=building_id)
                elevators = Elevator.objects.filter(building=building)
                queryset = queryset.filter(elevator__in=elevators)
                if not queryset.exists():
                    return Response({"detail": f"No schedules found for building with ID {building_id}."}, status=status.HTTP_404_NOT_FOUND)
            except Building.DoesNotExist:
                return Response({"detail": f"Building with ID {building_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 6. Filter by Scheduled Date
        if scheduled_date:
            try:
                scheduled_date = datetime.strptime(scheduled_date, '%Y-%m-%d').date()
                queryset = queryset.filter(scheduled_date=scheduled_date)
                if not queryset.exists():
                    return Response({"detail": f"No schedules found for the date {scheduled_date}."}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({"detail": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # 7. Filter by Next Schedule
        if next_schedule:
            queryset = queryset.filter(next_schedule=next_schedule)
            if not queryset.exists():
                return Response({"detail": f"No schedules found with next schedule of {next_schedule}."}, status=status.HTTP_404_NOT_FOUND)

        # Check if any results match the filters
        if not queryset.exists():
            return Response({"detail": "No maintenance schedules found matching the criteria."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the filtered queryset
        serializer = FullMaintenanceScheduleSerializer(queryset, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class MaintenanceScheduleNullTechnicianFilterView(APIView):
    permission_classes = [AllowAny]

    def put(self, request):
        """
        Fetch maintenance schedules where the technician field is null.
        The user can filter based on developer, building, maintenance company, or elevator.
        """
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
                # Find the developer, then get buildings related to the developer
                developer = Developer.objects.get(id=developer_id)
                buildings = Building.objects.filter(developer=developer)
                # Get elevators related to those buildings
                elevators = Elevator.objects.filter(building__in=buildings)
                # Apply the filter for maintenance schedules related to those elevators
                queryset = queryset.filter(elevator__in=elevators)
            except Developer.DoesNotExist:
                return Response({"detail": f"Developer with ID {developer_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Filter by Building
        if building_id:
            try:
                # Get the building, then get elevators related to this building
                building = Building.objects.get(id=building_id)
                elevators = Elevator.objects.filter(building=building)
                queryset = queryset.filter(elevator__in=elevators)
            except Building.DoesNotExist:
                return Response({"detail": f"Building with ID {building_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 3. Filter by Scheduled Date
        if scheduled_date:
            try:
                # Convert the date string to a date object and filter the maintenance schedules
                scheduled_date = datetime.strptime(scheduled_date, '%Y-%m-%d').date()
                queryset = queryset.filter(scheduled_date=scheduled_date)
            except ValueError:
                return Response({"detail": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Filter by Maintenance Company
        if maintenance_company_id:
            try:
                # Find the maintenance company and apply filter
                maintenance_company = Maintenance.objects.get(id=maintenance_company_id)
                queryset = queryset.filter(maintenance_company=maintenance_company)
            except Maintenance.DoesNotExist:
                return Response({"detail": f"Maintenance company with ID {maintenance_company_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 5. Filter by Elevator
        if elevator_id:
            try:
                # Get the specific elevator and filter based on that
                elevator = Elevator.objects.get(id=elevator_id)
                queryset = queryset.filter(elevator=elevator)
            except Elevator.DoesNotExist:
                return Response({"detail": f"Elevator with ID {elevator_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if any results match the filters
        if not queryset.exists():
            return Response({"detail": "No maintenance schedules found matching the criteria."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the filtered queryset
        serializer = FullMaintenanceScheduleSerializer(queryset, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)