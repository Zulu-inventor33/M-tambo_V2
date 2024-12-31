from django.shortcuts import render,get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from .models import Maintenance
from buildings.models import Building
from elevators.models import Elevator
from account.models import User
from buildings.serializers import BuildingSerializer
from elevators.serializers import ElevatorSerializer
from .serializers import MaintenanceSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from technicians.models import Technician
from technicians.serializers import TechnicianListSerializer,TechnicianDetailSerializer
from rest_framework.exceptions import status,NotFound

# View to list all maintenance companies
class MaintenanceCompanyListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

class MaintenanceCompanyBySpecializationView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = MaintenanceSerializer
    
    def get_queryset(self):
        specialization = self.kwargs['specialization']
        # Return full model instances, not just values
        return Maintenance.objects.filter(specialization=specialization)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        # Serialize the result
        serialized_data = MaintenanceSerializer(queryset, many=True).data
        # Manually select only the required fields (id and company_name)
        filtered_data = [{"id": item["id"], "company_name": item["company_name"]} for item in serialized_data]
        return Response(filtered_data)


class MaintenanceCompanyDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, company_id):
        try:
            # Attempt to retrieve the maintenance company by ID
            company = Maintenance.objects.get(id=company_id)
            
            # Serialize and return the company data
            serialized_data = MaintenanceSerializer(company)
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        
        except Maintenance.DoesNotExist:
            # Print a log if company not found
            print(f"Company with ID {company_id} not found.")
            raise NotFound(detail="Maintenance company not found.")

    
# View to list all technicians for a specific maintenance company
class MaintenanceCompanyTechniciansView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TechnicianListSerializer

    def get_queryset(self):
        company_id = self.kwargs['company_id']
        return Technician.objects.filter(maintenance_company__id=company_id)

class RemoveTechnicianFromCompanyView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    def delete(self, request, company_id, technician_id):
        try:
            # Retrieve the maintenance company
            company = Maintenance.objects.get(id=company_id)
            
            # Retrieve the technician linked to the company
            technician = Technician.objects.get(id=technician_id, maintenance_company=company)
            
            # Disassociate technician from the maintenance company
            technician.maintenance_company = None
            technician.save()

            return Response(
                {"message": "Technician removed from the maintenance company."},
                status=status.HTTP_204_NO_CONTENT
            )

        except Maintenance.DoesNotExist:
            raise NotFound(detail="Maintenance company not found.")
        except Technician.DoesNotExist:
            raise NotFound(detail="Technician not found or not linked to this company.")
        
class AddTechnicianToCompanyView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    def post(self, request, company_id, technician_id):
        try:
            # Retrieve the maintenance company by ID
            company = Maintenance.objects.get(id=company_id)

            # Retrieve the technician by ID and ensure they have no linked maintenance company
            technician = Technician.objects.get(id=technician_id)

            # Check if the technician is already linked to another maintenance company
            if technician.maintenance_company is not None:
                return Response(
                    {"error": "Technician is already linked to another maintenance company."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # If technician is available (not linked), assign them to the maintenance company
            technician.maintenance_company = company
            technician.save()

            return Response(
                {"message": f"Technician {technician.user.first_name} {technician.user.last_name} added to {company.company_name}."},
                status=status.HTTP_200_OK
            )

        except Maintenance.DoesNotExist:
            raise NotFound(detail="Maintenance company not found.")
        except Technician.DoesNotExist:
            raise NotFound(detail="Technician not found.")
        
class AddTechnicianToCompanyView(APIView):
    permission_classes = [AllowAny]  # Ensure the user is authenticated (can be modified as needed)

    def post(self, request, company_id, technician_id):
        try:
            # Retrieve the maintenance company by company_id
            company = Maintenance.objects.get(id=company_id)

            # Retrieve the technician by technician_id
            technician = Technician.objects.get(id=technician_id)

            # Check if the technician is already linked to the given maintenance company
            if technician.maintenance_company == company:
                return Response(
                    {"message": "The technician is already linked to this company."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if the technician is already linked to another maintenance company
            if technician.maintenance_company is not None:
                return Response(
                    {"error": "Technician is already linked to another maintenance company."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if the technician's specialization matches the maintenance company's specialization
            if technician.specialization != company.specialization:
                return Response(
                    {"error": f"Technician's specialization ({technician.specialization}) does not match the company's specialization ({company.specialization})."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Link the technician to the maintenance company
            technician.maintenance_company = company
            technician.save()

            return Response(
                {"message": f"Technician {technician.user.first_name} {technician.user.last_name} added to {company.company_name}."},
                status=status.HTTP_200_OK
            )

        except Maintenance.DoesNotExist:
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Technician.DoesNotExist:
            return Response(
                {"error": "Technician not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        

class TechnicianDetailForCompanyView(APIView):
    permission_classes = [AllowAny]  # Remember to change this so that only authenticated users can access this view
    
    def get(self, request, company_id, technician_id):
        try:
            # Retrieve the company by company_id
            company = Maintenance.objects.get(id=company_id)
            
            # Retrieve the technician by technician_id and check if they are linked to the given company
            technician = Technician.objects.get(id=technician_id, maintenance_company=company)

            # If the technician is linked to this company, serialize and return their details
            technician_data = TechnicianDetailSerializer(technician)
            
            return Response(technician_data.data, status=status.HTTP_200_OK)
        
        except Maintenance.DoesNotExist:
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        except Technician.DoesNotExist:
            return Response(
                {"error": "Technician not found or not linked to this company."},
                status=status.HTTP_404_NOT_FOUND
            )
        

class UpdateMaintenanceCompanyView(UpdateAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        """
        Retrieve the maintenance company by company_id from the URL.
        If the company does not exist, it raises a 404 error.
        """
        company_id = self.kwargs['company_id']
        try:
            company = Maintenance.objects.get(id=company_id)
            return company
        except Maintenance.DoesNotExist:
            return Response({"error": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, *args, **kwargs):
        """
        Handle partial update (updating a single or multiple fields).
        Ensures partial=True is passed to the serializer.
        """
        partial = True  # Allow partial updates
        return self.update(request, partial=partial, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Handle full update (updating all fields).
        """
        return self.update(request, *args, **kwargs)
    
class MaintenanceCompanyByEmailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]  # Modify this as per your permissions
    serializer_class = MaintenanceSerializer
    
    def get_object(self):
        # Retrieve the User by email
        email = self.kwargs['email']
        try:
            user = User.objects.get(email=email)
            # Check if the user has an associated maintenance profile
            if not user.maintenance_profile:
                raise NotFound(detail="User has no maintenance company associated.")
            return user.maintenance_profile  # This will return the associated Maintenance object
        except User.DoesNotExist:
            raise NotFound(detail="User with this email not found.")
        

class BuildingListView(generics.ListAPIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed
    serializer_class = BuildingSerializer

    def get_queryset(self):
        # Get the maintenance company ID from the URL
        company_id = self.kwargs['company_id']

        try:
            # Attempt to retrieve the maintenance company by ID
            company = Maintenance.objects.get(id=company_id)
        except Maintenance.DoesNotExist:
            # If the maintenance company does not exist, return 404
            raise NotFound(detail="Maintenance company not found.", code=404)

        # Get all the elevators related to this maintenance company
        elevators = Elevator.objects.filter(maintenance_company=company)

        # Get the buildings linked to these elevators
        buildings = set([elevator.building for elevator in elevators])

        return buildings

    def list(self, request, *args, **kwargs):
        # Override list method to handle different response scenarios
        try:
            queryset = self.get_queryset()

            if not queryset:
                # If no buildings are found, return an empty list with a message
                return Response(
                    {"message": "No buildings found for this maintenance company."},
                    status=status.HTTP_200_OK
                )

            # Serialize the building data
            serialized_data = BuildingSerializer(queryset, many=True).data

            return Response(serialized_data, status=status.HTTP_200_OK)

        except NotFound as e:
            # Handle case where maintenance company is not found
            return Response(
                {"error": str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Catch any unexpected errors and provide a 500 response
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class BuildingDetailView(APIView):
    permission_classes = [AllowAny]  # Adjust this as per your permissions

    def get(self, request, company_id, building_id):
        try:
            # Retrieve the maintenance company using the company_id
            company = Maintenance.objects.get(id=company_id)
            
            # Retrieve the building using the building_id and check if it's linked to the developer of the company
            building = Building.objects.get(id=building_id, developer=company.developer)
            
            # Serialize the building data and return it
            serialized_data = BuildingSerializer(building)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Building.DoesNotExist:
            return Response(
                {"error": "Building not found or not linked to the specified maintenance company."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class ElevatorsUnderCompanyView(APIView):
    permission_classes = [AllowAny]  # Adjust as necessary for authentication

    def get(self, request, company_id):
        try:
            # Attempt to retrieve the maintenance company using company_id
            company = Maintenance.objects.get(id=company_id)

            # Retrieve all elevators linked to this company
            elevators = Elevator.objects.filter(maintenance_company=company)

            # Check if any elevators are found
            if not elevators.exists():
                return Response(
                    {"message": "No elevators found under this maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize the elevators data
            serialized_data = ElevatorSerializer(elevators, many=True)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class ElevatorsInBuildingView(APIView):
    permission_classes = [AllowAny]  # Adjust this based on your permission needs

    def get(self, request, company_id, building_id):
        try:
            # Step 1: Retrieve the maintenance company
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve the building and ensure it's linked to the maintenance company
            building = Building.objects.get(id=building_id, developer__maintenance_profile=company)

            # Step 3: Retrieve all elevators in the building
            elevators = Elevator.objects.filter(building=building)

            # Step 4: Handle the case when no elevators are found for the building
            if not elevators.exists():
                return Response(
                    {"message": "No elevators found for this building under the specified maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Step 5: Serialize and return the elevator data
            serialized_data = ElevatorSerializer(elevators, many=True)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle the case where the maintenance company does not exist
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Building.DoesNotExist:
            # Handle the case where the building does not exist or doesn't belong to the company
            return Response(
                {"error": "Building not found under the specified maintenance company."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Handle any unexpected errors
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class ElevatorDetailView(APIView):
    permission_classes = [AllowAny]  # Modify as necessary for permissions

    def get(self, request, company_id, elevator_id):
        try:
            # Step 1: Retrieve the maintenance company
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve the elevator and check if it's associated with the given company
            elevator = Elevator.objects.get(id=elevator_id, maintenance_company=company)

            # Step 3: Serialize the elevator data and return it
            serialized_data = ElevatorSerializer(elevator)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle the case where the maintenance company does not exist
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Elevator.DoesNotExist:
            # Handle the case where the elevator does not exist or is not linked to the specified company
            return Response(
                {"error": "Elevator not found or not linked to the specified maintenance company."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Handle any unexpected errors
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )