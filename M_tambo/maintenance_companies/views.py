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
from developers.serializers import DeveloperDetailSerializer
from .serializers import MaintenanceSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from technicians.models import Technician
from developers.models import Developer
from jobs.models import MaintenanceSchedule
from technicians.serializers import TechnicianListSerializer,TechnicianDetailSerializer
from rest_framework.exceptions import status,NotFound
from django.db import transaction
import logging

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
    permission_classes = [AllowAny]  # Modify as necessary for permissions

    def get(self, request, company_id, building_id):
        try:
            # Step 1: Retrieve the maintenance company using the company_id
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Get all elevators under the given company
            elevators = Elevator.objects.filter(maintenance_company=company)

            # Step 3: Retrieve the building using the building_id
            building = Building.objects.get(id=building_id)

            # Step 4: Ensure the building has elevators linked to the company
            if not elevators.filter(building=building).exists():
                raise NotFound(detail="Building is not linked to the specified maintenance company.", code=404)

            # Step 5: Serialize and return the building data
            serialized_data = BuildingSerializer(building)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Building.DoesNotExist:
            return Response(
                {"error": "Building not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except NotFound as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
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
    permission_classes = [AllowAny]  # Adjust based on your permission needs

    def get(self, request, company_id, building_id):
        try:
            # Step 1: Retrieve the maintenance company
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve the building and ensure it's associated with the correct maintenance company
            building = Building.objects.get(id=building_id)

            # Check if the building is linked to any elevators under the given maintenance company
            elevators = Elevator.objects.filter(building=building, maintenance_company=company)

            # Step 3: Handle case when no elevators are found for the building under the specified maintenance company
            if not elevators.exists():
                raise NotFound(detail="No elevators found for this building under the specified maintenance company.", code=404)

            # Step 4: Serialize the elevator data
            serialized_data = ElevatorSerializer(elevators, many=True)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle the case where the maintenance company does not exist
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Building.DoesNotExist:
            # Handle the case where the building does not exist
            return Response(
                {"error": "Building not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except NotFound as e:
            # Handle case where no elevators are found for the building under the maintenance company
            return Response(
                {"error": str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
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
        

class ElevatorDetailByMachineNumberView(APIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def get(self, request, company_id, machine_number):
        try:
            # Step 1: Retrieve the maintenance company
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve the elevator by machine_number and ensure it belongs to the given maintenance company
            elevator = Elevator.objects.get(machine_number=machine_number, maintenance_company=company)

            # Step 3: Serialize the elevator data and return the response
            serialized_data = ElevatorSerializer(elevator)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle the case where the maintenance company does not exist
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Elevator.DoesNotExist:
            # Handle the case where the elevator does not exist or is not linked to the maintenance company
            return Response(
                {"error": "Elevator with the specified machine number not found under this maintenance company."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Handle any unexpected errors
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class DevelopersUnderCompanyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, company_id):
        """
        Retrieve a list of all developers under a specific maintenance company.
        
        This view returns a list of developers associated with the buildings managed
        by elevators linked to the provided maintenance company.
        """
        try:
            # Step 1: Retrieve the maintenance company by its ID
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve all elevators linked to this maintenance company
            elevators = Elevator.objects.filter(maintenance_company=company)

            # Step 3: Retrieve all buildings linked to these elevators
            buildings = set([elevator.building for elevator in elevators])

            # Step 4: Retrieve all developers related to these buildings via the building field
            developers = Developer.objects.filter(buildings__in=buildings).distinct()

            # Step 5: Handle the case when no developers are found
            if not developers.exists():
                return Response(
                    {"message": "No developers found under this maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Step 6: Serialize the developer data
            serialized_data = DeveloperDetailSerializer(developers, many=True)

            # Step 7: Return the serialized data as a response
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle the case where the maintenance company doesn't exist
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Elevator.DoesNotExist:
            # Handle the case where no elevators are found for the maintenance company
            return Response(
                {"error": "No elevators found for the specified maintenance company."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Developer.DoesNotExist:
            # Handle the case where no developers are found linked to the buildings managed by elevators
            return Response(
                {"message": "No developers found under this maintenance company."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Catch any unexpected errors and respond with a generic message
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class DeveloperDetailUnderCompanyView(APIView):
    permission_classes = [AllowAny]  # Adjust this based on your permission needs

    def get(self, request, company_id, developer_id):
        try:
            # Step 1: Retrieve the maintenance company by its ID
            company = Maintenance.objects.get(id=company_id)
            
            # Step 2: Retrieve the elevators linked to the given maintenance company
            elevators = Elevator.objects.filter(maintenance_company=company)
            
            # Step 3: Get the buildings associated with these elevators
            buildings = set([elevator.building for elevator in elevators])
            
            # Step 4: Check if the developer is linked to any of these buildings
            developer = Developer.objects.get(id=developer_id)
            developer_buildings = set([building for building in buildings if building.developer == developer])
            
            if not developer_buildings:
                # If no buildings are found for the specified developer, return an error
                return Response(
                    {"error": "Developer not found or not linked to any buildings under the specified maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Step 5: Serialize the developer data
            serialized_data = DeveloperDetailSerializer(developer)

            # Step 6: Return the serialized developer data
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # If the maintenance company doesn't exist
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Developer.DoesNotExist:
            # If the developer doesn't exist
            return Response(
                {"error": "Developer not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Handle any unexpected errors
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class BuildingsUnderDeveloperView(APIView):
    permission_classes = [AllowAny]  # Adjust this based on your permission needs

    def get(self, request, company_id, developer_id):
        try:
            # Step 1: Retrieve the maintenance company by its ID
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve the developer by its ID
            developer = Developer.objects.get(id=developer_id)

            # Step 3: Retrieve all elevators linked to this developer and the maintenance company
            elevators = Elevator.objects.filter(building__developer=developer, maintenance_company=company)

            # Step 4: If no elevators are found, return an appropriate message
            if not elevators.exists():
                return Response(
                    {"message": "No buildings with elevators found for this developer under the specified maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Step 5: Retrieve the buildings linked to these elevators
            buildings = set(elevator.building for elevator in elevators)

            # Step 6: If no buildings are found for this developer, return an appropriate message
            if not buildings:
                return Response(
                    {"message": "No buildings found for this developer under the specified maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Step 7: Serialize the building data and return the response
            serialized_data = BuildingSerializer(buildings, many=True)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle the case where the maintenance company doesn't exist
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Developer.DoesNotExist:
            # Handle the case where the developer doesn't exist
            return Response(
                {"error": "Developer not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Handle any unexpected errors
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class ElevatorsUnderTechnicianView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, company_id, technician_id):
        try:
            # Step 1: Retrieve the maintenance company by its ID
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve the technician by technician_id
            technician = Technician.objects.get(id=technician_id)

            # Step 3: Get all elevators associated with the technician and maintenance company
            elevators = Elevator.objects.filter(
                maintenance_company=company,
                technician=technician
            )

            # If no elevators are found, return a message indicating that
            if not elevators.exists():
                return Response(
                    {"message": "No elevators found under this technician for the specified maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Step 4: Serialize the elevators data
            serialized_data = ElevatorSerializer(elevators, many=True)

            # Return the serialized data as a response
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle case where maintenance company is not found
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Technician.DoesNotExist:
            # Handle case where technician is not found
            return Response(
                {"error": "Technician not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Catch any unexpected errors
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BuildingsUnderTechnicianView(APIView):
    permission_classes = [AllowAny]  # Adjust based on your permission needs

    def get(self, request, company_id, technician_id):
        try:
            # Step 1: Retrieve the maintenance company by its ID
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve the technician by technician_id
            technician = Technician.objects.get(id=technician_id)

            # Step 3: Get all elevators under this maintenance company and technician
            elevators = Elevator.objects.filter(
                maintenance_company=company,
                technician=technician
            )

            # If no elevators are found, return an error message
            if not elevators.exists():
                return Response(
                    {"message": "No elevators found under this technician for the specified maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Step 4: Get the buildings associated with the elevators
            buildings = Building.objects.filter(id__in=[elevator.building.id for elevator in elevators])

            # Step 5: Serialize the buildings data
            serialized_data = BuildingSerializer(buildings, many=True)

            # Return the serialized data as a response
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle case where maintenance company is not found
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Technician.DoesNotExist:
            # Handle case where technician is not found
            return Response(
                {"error": "Technician not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Catch any unexpected errors
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class UpdateTechnicianOnBuildingsView(APIView):
    permission_classes = [AllowAny]  # Adjust based on your needs (authentication, etc.)

    def put(self, request, company_id, building_id):
        try:
            # Step 1: Retrieve the maintenance company by its ID
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve the building by building_id and check if it has elevators associated with the maintenance company
            building = Building.objects.get(id=building_id)
            elevators = Elevator.objects.filter(building=building, maintenance_company=company)

            if not elevators.exists():
                return Response(
                    {"error": "No elevators found under this building for the specified maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Step 3: Retrieve the technician from the request data
            technician_id = request.data.get("technician_id", None)
            if not technician_id:
                return Response({"error": "Technician ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Ensure the technician belongs to the specified maintenance company
                technician = Technician.objects.get(id=technician_id, maintenance_company=company)
            except Technician.DoesNotExist:
                return Response(
                    {"error": "Technician not found or does not belong to this maintenance company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Step 4: Update the technician for all elevators under this building and maintenance company
            elevators.update(technician=technician)

            # Step 5: Serialize the updated elevator data
            updated_elevators = Elevator.objects.filter(building=building, maintenance_company=company)
            elevator_data = [{
                "id": elevator.id,
                "user_name": elevator.user_name,
                "technician": {
                    "id": technician.id,
                    "name": f"{technician.user.first_name} {technician.user.last_name}"  # Concatenate first and last names
                },
                "capacity": elevator.capacity,
                "building": {
                    "id": building.id,
                    "name": building.name
                }
            } for elevator in updated_elevators]

            # Step 6: Return the updated elevator data as a response
            return Response(elevator_data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle case where maintenance company is not found
            return Response({"error": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)
        except Building.DoesNotExist:
            # Handle case where building is not found
            return Response(
                {"error": "Building not found or not linked to the specified maintenance company."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Handle unexpected errors
            return Response({"error": "An unexpected error occurred. Please try again later."},
                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class UpdateTechnicianOnElevatorView(APIView):
    permission_classes = [AllowAny]  # Adjust based on your needs (authentication, etc.)

    def put(self, request, company_id, elevator_id):
        try:
            # Step 1: Retrieve the maintenance company by its ID
            company = Maintenance.objects.get(id=company_id)

            # Step 2: Retrieve the elevator by elevator_id, ensuring it belongs to the specified maintenance company
            elevator = Elevator.objects.get(id=elevator_id, maintenance_company=company)

            # Step 3: Retrieve the technician from the request data
            technician_id = request.data.get("technician_id", None)
            if not technician_id:
                return Response({"error": "Technician ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the technician exists and belongs to the specified maintenance company
            try:
                technician = Technician.objects.get(id=technician_id, maintenance_company=company)
            except Technician.DoesNotExist:
                return Response({"error": "Technician not found or does not belong to this maintenance company."}, 
                                 status=status.HTTP_404_NOT_FOUND)

            # Step 4: Update the technician for the specified elevator
            elevator.technician = technician
            elevator.save()

            # Step 5: Serialize the updated elevator data to confirm the changes
            updated_elevator = {
                "id": elevator.id,
                "user_name": elevator.user_name,
                "technician": {
                    "id": technician.id,
                    "name": f"{technician.user.first_name} {technician.user.last_name}"
                },
                "capacity": elevator.capacity,
                "building": {
                    "id": elevator.building.id,
                    "name": elevator.building.name
                }
            }

            # Step 6: Return the updated data as a response
            return Response(updated_elevator, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            # Handle case where maintenance company is not found
            return Response({"error": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)
        except Elevator.DoesNotExist:
            # Handle case where elevator is not found or not linked to the specified maintenance company
            return Response({"error": "Elevator not found or not linked to the specified maintenance company."},
                             status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Handle any unexpected errors
            return Response({"error": "An unexpected error occurred. Please try again later."},
                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class AddBuildingView(APIView):
    permission_classes = [AllowAny]  # Adjust based on your needs (authentication, etc.)

    def put(self, request, company_id):  # company_id is still in URL for routing
        try:
            # Step 1: Retrieve the Maintenance company based on the company_id provided in the URL
            try:
                company = Maintenance.objects.get(id=company_id)
            except Maintenance.DoesNotExist:
                return Response({"error": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)

            # Step 2: Retrieve the developer based on the developer_id provided in the request
            developer_id = request.data.get("developer_id", None)
            if not developer_id:
                return Response({"error": "Developer ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                developer = Developer.objects.get(id=developer_id)
            except Developer.DoesNotExist:
                return Response({"error": "Developer not found."}, status=status.HTTP_404_NOT_FOUND)

            # Step 3: Parse the building details from the request data
            building_name = request.data.get("name", None)
            building_address = request.data.get("address", None)
            building_contact = request.data.get("contact", None)

            # Validate if required fields are provided
            if not building_name or not building_address or not building_contact:
                return Response(
                    {"error": "Building name, address, and contact are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Step 4: Retrieve and validate the technician if provided
            technician_id = request.data.get("technician_id", None)
            technician = None
            if technician_id:
                try:
                    technician = Technician.objects.get(id=technician_id, maintenance_company=company)
                except Technician.DoesNotExist:
                    return Response(
                        {"error": "Technician not found or not linked to the specified maintenance company."},
                        status=status.HTTP_404_NOT_FOUND
                    )

            # Step 5: Create the building
            new_building = Building.objects.create(
                name=building_name,
                address=building_address,
                contact=building_contact,
                developer=developer,
                developer_name=developer.developer_name  # Use developer's name
            )

            # Step 6: Create the elevator and associate it with the new building
            elevator_data = request.data.get("elevator", None)
            if elevator_data:
                user_name = elevator_data.get("user_name")
                capacity = elevator_data.get("capacity")
                machine_number = elevator_data.get("machine_number")
                manufacturer = elevator_data.get("manufacturer")
                installation_date = elevator_data.get("installation_date")

                # Validate elevator fields
                if not all([user_name, capacity, machine_number, manufacturer, installation_date]):
                    return Response(
                        {"error": "All elevator fields (user_name, capacity, machine_number, manufacturer, installation_date) are required."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Create the elevator and assign the developer to it
                new_elevator = Elevator.objects.create(
                    user_name=user_name,
                    capacity=capacity,
                    machine_number=machine_number,
                    manufacturer=manufacturer,
                    installation_date=installation_date,
                    building=new_building,  # Associate the elevator with the building
                    maintenance_company=company,  # Link the elevator to the Maintenance company
                    technician=technician,  # Link the elevator to the technician if provided
                    developer=developer  # Link the elevator to the Developer
                )

            # Step 7: Prepare the data to return in the response
            building_data = {
                "id": new_building.id,
                "name": new_building.name,
                "address": new_building.address,
                "contact": new_building.contact,
                "developer": {
                    "id": new_building.developer.id,
                    "developer_name": new_building.developer.developer_name
                },
                "developer_name": new_building.developer_name,
                "elevators": [
                    {
                        "id": new_elevator.id,
                        "user_name": new_elevator.user_name,
                        "machine_number": new_elevator.machine_number,
                        "capacity": new_elevator.capacity,
                        "manufacturer": new_elevator.manufacturer,
                        "installation_date": new_elevator.installation_date,
                        "maintenance_company": new_elevator.maintenance_company.id,
                        "technician": {
                            "id": new_elevator.technician.id if new_elevator.technician else None,
                            "name": f"{new_elevator.technician.user.first_name} {new_elevator.technician.user.last_name}" if new_elevator.technician else None
                        },
                        "developer": {
                            "id": new_elevator.developer.id,
                            "developer_name": new_elevator.developer.developer_name
                        }
                    }
                ] if 'new_elevator' in locals() else []
            }

            # Step 8: Return the response with the new building and elevator data
            return Response(building_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Catch any unexpected errors and return a 500 internal server error
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class AddElevatorToBuildingView(APIView):
    permission_classes = [AllowAny]  # Adjust based on your needs (authentication, etc.)

    def put(self, request, company_id, building_id):
        try:
            # Step 1: Retrieve the maintenance company by its ID
            try:
                maintenance_company = Maintenance.objects.get(id=company_id)
            except Maintenance.DoesNotExist:
                return Response({"error": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)

            # Step 2: Retrieve the building by its ID, ensuring it belongs to a developer
            try:
                building = Building.objects.get(id=building_id)
            except Building.DoesNotExist:
                return Response({"error": "Building not found."}, status=status.HTTP_404_NOT_FOUND)

            # Step 3: Retrieve the elevator details from the request data
            elevator_user_name = request.data.get("user_name", None)
            elevator_capacity = request.data.get("capacity", None)
            elevator_machine_number = request.data.get("machine_number", None)
            elevator_manufacturer = request.data.get("manufacturer", None)
            elevator_installation_date = request.data.get("installation_date", None)

            if not all([elevator_user_name, elevator_capacity, elevator_machine_number, elevator_manufacturer, elevator_installation_date]):
                return Response(
                    {"error": "All elevator fields (user_name, capacity, machine_number, manufacturer, installation_date) are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Step 4: Retrieve technician_id if provided and check if the technician belongs to the maintenance company
            technician_id = request.data.get("technician_id", None)
            technician = None
            if technician_id:
                try:
                    technician = Technician.objects.get(id=technician_id, maintenance_company=maintenance_company)
                except Technician.DoesNotExist:
                    return Response({"error": "Technician not found or does not belong to the specified maintenance company."}, status=status.HTTP_404_NOT_FOUND)

            # Step 5: Create the elevator
            new_elevator = Elevator.objects.create(
                user_name=elevator_user_name,
                capacity=elevator_capacity,
                machine_number=elevator_machine_number,
                manufacturer=elevator_manufacturer,
                installation_date=elevator_installation_date,
                building=building,
                maintenance_company=maintenance_company,
                technician=technician if technician else None,  # Link technician if available
                developer=building.developer  # Automatically link the developer of the building to the elevator
            )

            # Step 6: Serialize the newly created elevator data to return it
            elevator_data = {
                "id": new_elevator.id,
                "user_name": new_elevator.user_name,
                "machine_number": new_elevator.machine_number,
                "capacity": new_elevator.capacity,
                "manufacturer": new_elevator.manufacturer,
                "installation_date": new_elevator.installation_date,
                "maintenance_company": {
                    "id": new_elevator.maintenance_company.id,
                    "company_name": new_elevator.maintenance_company.company_name
                },
                "technician": {
                    "id": new_elevator.technician.id if new_elevator.technician else None,
                    "name": f"{new_elevator.technician.user.first_name} {new_elevator.technician.user.last_name}" if new_elevator.technician else None
                },
                "developer": {
                    "id": new_elevator.developer.id,
                    "developer_name": new_elevator.developer.developer_name
                },
                "building": {
                    "id": new_elevator.building.id,
                    "name": new_elevator.building.name
                }
            }

            # Step 7: Return the elevator data as a response
            return Response(elevator_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Catch any unexpected errors and return a 500 internal server error
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class RemoveMaintenanceFromBuildingElevatorsView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, company_id, building_id):
        # Retrieve the maintenance company
        maintenance_company = self.get_object(Maintenance, company_id)
        if not maintenance_company:
            return Response({"error": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Retrieve the building
        building = self.get_object(Building, building_id)
        if not building:
            return Response({"error": "Building not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get elevators linked to the building
        elevators = Elevator.objects.filter(building=building)

        # Get elevators that are linked to the maintenance company
        affected_elevators = elevators.filter(maintenance_company=maintenance_company)

        # Check if any elevators are linked to the maintenance company in this building
        if not affected_elevators.exists():
            return Response(
                {"message": "No elevators linked to the provided maintenance company in this building."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Ensure we're not removing elevators linked to other maintenance companies
        # Get elevators in this building that may be linked to other companies
        other_elevators = elevators.exclude(maintenance_company=maintenance_company)
        
        if affected_elevators.count() == elevators.count():
            # If all elevators are linked to this maintenance company, proceed with the update
            # Step 1: Update MaintenanceSchedule for affected elevators
            affected_schedules = MaintenanceSchedule.objects.filter(
                elevator__in=affected_elevators,
                status__in=['scheduled', 'overdue']
            )

            # Remove the maintenance company and technician from the schedules first
            affected_schedules_updated = affected_schedules.update(maintenance_company=None, technician=None)

            # Step 2: Update the elevators after the schedules
            affected_elevators_updated = affected_elevators.update(maintenance_company=None, technician=None)

            # Prepare the success response
            return Response(
                {
                    "message": f"Successfully removed the maintenance company and technician from {affected_elevators_updated} elevator(s) "
                               f"and {affected_schedules_updated} maintenance schedule(s)."
                },
                status=status.HTTP_200_OK
            )
        else:
            # If there are elevators linked to other maintenance companies, only remove the specified maintenance company
            # Step 1: Update MaintenanceSchedule for affected elevators
            affected_schedules = MaintenanceSchedule.objects.filter(
                elevator__in=affected_elevators,
                status__in=['scheduled', 'overdue']
            )

            # Remove the maintenance company and technician from the schedules first
            affected_schedules_updated = affected_schedules.update(maintenance_company=None, technician=None)

            # Step 2: Update the elevators after the schedules
            affected_elevators_updated = affected_elevators.update(maintenance_company=None, technician=None)

            # Prepare the success response for partial removal
            return Response(
                {
                    "message": f"Successfully removed the maintenance company and technician from {affected_elevators_updated} elevator(s) "
                               f"and {affected_schedules_updated} maintenance schedule(s)."
                },
                status=status.HTTP_200_OK
            )

    def get_object(self, model, object_id):
        """
        Helper method to get an object by its ID and handle DoesNotExist exceptions.
        Returns the object if found, otherwise None.
        """
        try:
            return model.objects.get(id=object_id)
        except model.DoesNotExist:
            return None
        

class RemoveMaintenanceFromDeveloperElevatorsView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, company_id, developer_id):
        # Retrieve the maintenance company
        maintenance_company = self.get_object(Maintenance, company_id)
        if not maintenance_company:
            return Response({"error": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Retrieve the developer
        developer = self.get_object(Developer, developer_id)
        if not developer:
            return Response({"error": "Developer not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all buildings linked to the developer
        buildings = Building.objects.filter(developer=developer)
        
        if not buildings.exists():
            return Response({"message": "No buildings found for this developer."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all elevators linked to these buildings
        elevators = Elevator.objects.filter(building__in=buildings)

        if not elevators.exists():
            return Response(
                {"message": "No elevators found for this developer."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get elevators that are linked to the maintenance company
        affected_elevators = elevators.filter(maintenance_company=maintenance_company)

        if not affected_elevators.exists():
            return Response(
                {"message": "No elevators linked to the provided maintenance company for this developer."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # STEP 1: Update MaintenanceSchedule for affected elevators
        affected_schedules = MaintenanceSchedule.objects.filter(
            elevator__in=affected_elevators,
            status__in=['scheduled', 'overdue']
        )

        # Count affected schedules before updating
        affected_schedules_count = affected_schedules.count()

        # Remove the maintenance company and technician from the schedules first
        affected_schedules.update(maintenance_company=None, technician=None)

        # STEP 2: Update the elevators after the schedules
        affected_elevators_count = affected_elevators.count()
        affected_elevators.update(maintenance_company=None, technician=None)

        # Prepare the success response
        return Response(
            {
                "message": f"Successfully removed the maintenance company and technician from {affected_elevators_count} elevator(s) "
                           f"and {affected_schedules_count} maintenance schedule(s)."
            },
            status=status.HTTP_200_OK
        )

    def get_object(self, model, object_id):
        """
        Helper method to get an object by its ID and handle DoesNotExist exceptions.
        Returns the object if found, otherwise None.
        """
        try:
            return model.objects.get(id=object_id)
        except model.DoesNotExist:
            return None
        

class TechnicianListForBuildingView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, company_id, building_id):
        # Retrieve the maintenance company
        maintenance_company = self.get_object(Maintenance, company_id)
        if not maintenance_company:
            return Response({"error": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Retrieve the building
        building = self.get_object(Building, building_id)
        if not building:
            return Response({"error": "Building not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all elevators in the building
        elevators = Elevator.objects.filter(building=building)

        # If no elevators are found, return a message indicating that
        if not elevators.exists():
            return Response({"message": "No elevators linked to this building."}, status=status.HTTP_404_NOT_FOUND)
        
        # Get elevators linked to this maintenance company
        elevators_linked_to_company = elevators.filter(maintenance_company=maintenance_company)

        if not elevators_linked_to_company.exists():
            return Response({"message": "No elevators linked to this maintenance company in this building."},
                            status=status.HTTP_404_NOT_FOUND)
        
        # Get technicians assigned to these elevators via ForeignKey directly from Elevator
        technicians = Technician.objects.filter(elevators__in=elevators_linked_to_company).distinct()

        if not technicians.exists():
            return Response({"message": "No technicians assigned to elevators in this building."}, status=status.HTTP_404_NOT_FOUND)
        
        # Prepare the technician data with elevators they are managing
        technician_data = []
        for technician in technicians:
            # Get the elevators associated with this technician
            elevators_for_technician = elevators_linked_to_company.filter(technician=technician)
            
            # Serialize the elevators for this technician
            elevator_data = ElevatorSerializer(elevators_for_technician, many=True).data
            
            # Serialize the technician data and include the elevators they manage
            technician_info = TechnicianListSerializer(technician).data
            technician_info['elevators'] = elevator_data
            technician_data.append(technician_info)

        # Prepare the response
        return Response({"technicians": technician_data}, status=status.HTTP_200_OK)

    def get_object(self, model, object_id):
        """
        Helper method to get an object by its ID and handle DoesNotExist exceptions.
        """
        try:
            return model.objects.get(id=object_id)
        except model.DoesNotExist:
            return None