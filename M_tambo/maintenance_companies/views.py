from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from .models import Maintenance
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


# View to get details of a specific maintenance company by ID
class MaintenanceCompanyDetailView(generics.RetrieveAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

    def get_object(self):
        # Retrieve the specific maintenance company by ID
        return Maintenance.objects.get(id=self.kwargs['company_id'])
    
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