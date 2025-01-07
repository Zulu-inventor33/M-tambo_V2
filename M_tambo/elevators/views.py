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
<<<<<<< HEAD
=======

>>>>>>> 599bc3919ee2d2b1d710c4b3cba10c43d769a0fb
