from django.core.exceptions import PermissionDenied
import uuid
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.tokens import RefreshToken
import logging

# Local imports
from .models import MaintenanceCompanyProfile
from account.models import User, Maintenance, Technician
from .serializers import MaintenanceSerializer, MaintenanceCompanyProfileSerializer
from technicians.models import TechnicianProfile
from technicians.serializers import TechnicianListSerializer, TechnicianDetailSerializer
from account.serializers import TechnicianSerializer

# Configure logging
logger = logging.getLogger(__name__)

class MaintenanceCompanyListView(generics.ListAPIView):
    """
    API endpoint that allows viewing a list of all maintenance companies.
    GET /maintenance/companies/
    """
    permission_classes = [AllowAny]
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

class MaintenanceCompanyDetailView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve detailed information about a specific maintenance company.
    GET /maintenance/companies/{uuid_id}/
    """
    permission_classes = [AllowAny]
    serializer_class = MaintenanceCompanyProfileSerializer
    
    def get_object(self):
        """
        Retrieve company profile by UUID, creating one if it doesn't exist.
        First tries direct profile lookup, then falls back to maintenance company lookup.
        """
        uuid_id = self.kwargs['uuid_id']
        try:
            # Primary lookup: Try to find existing profile
            return MaintenanceCompanyProfile.objects.get(id=uuid_id)
        except MaintenanceCompanyProfile.DoesNotExist:
            try:
                # Secondary lookup: Find maintenance company and get/create profile
                maintenance = Maintenance.objects.get(id=uuid_id)
                profile, created = MaintenanceCompanyProfile.objects.get_or_create(maintenance=maintenance)
                return profile
            except Maintenance.DoesNotExist:
                raise NotFound("Company not found")

class MaintenanceCompanyTechniciansView(generics.ListAPIView):
    """
    API endpoint to list all technicians associated with a specific maintenance company.
    GET /maintenance/companies/{uuid_id}/technicians/
    """
    permission_classes = [AllowAny]
    serializer_class = TechnicianListSerializer
    
    def get_queryset(self):
        """
        Retrieve all technicians linked to the specified maintenance company.
        Creates company profile if it doesn't exist.
        """
        uuid_id = self.kwargs.get('uuid_id')
        
        try:
            # Try finding company profile first
            try:
                company_profile = MaintenanceCompanyProfile.objects.get(id=uuid_id)
                maintenance = company_profile.maintenance
            except MaintenanceCompanyProfile.DoesNotExist:
                # Fall back to maintenance company lookup
                maintenance = Maintenance.objects.get(id=uuid_id)
                company_profile, created = MaintenanceCompanyProfile.objects.get_or_create(
                    maintenance=maintenance
                )
            
            return Technician.objects.filter(maintenance_company=maintenance)
            
        except (MaintenanceCompanyProfile.DoesNotExist, Maintenance.DoesNotExist):
            raise NotFound("Maintenance company not found")

class RemoveTechnicianFromCompanyView(APIView):
    """
    API endpoint to remove a technician from a maintenance company.
    DELETE /maintenance/companies/{uuid_id}/technicians/{technician_id}/
    """
    def delete(self, request, uuid_id, technician_id):
        """
        Remove the association between a technician and their maintenance company.
        Verifies both entities exist and are properly linked before removal.
        """
        try:
            # Fetch technician with related data
            try:
                technician = Technician.objects.select_related(
                    'user',
                    'maintenance_company'
                ).get(id=technician_id)
                logger.info(f"Found technician: {technician}")
            except Technician.DoesNotExist:
                return Response(
                    {"detail": "Technician not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Fetch company profile
            try:
                maintenance = Maintenance.objects.get(id=uuid_id)
                company_profile = MaintenanceCompanyProfile.objects.get(maintenance=maintenance)
                logger.info(f"Found company: {maintenance}")
            except (Maintenance.DoesNotExist, MaintenanceCompanyProfile.DoesNotExist):
                return Response(
                    {"detail": "Company profile not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Verify association
            if technician.maintenance_company != maintenance:
                return Response(
                    {"detail": "Technician not associated with this company."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Remove association and save
            technician.maintenance_company = None
            technician.save()
            
            return Response(
                {"detail": "Technician removed from company successfully."},
                status=status.HTTP_204_NO_CONTENT
            )
            
        except Exception as e:
            logger.error(f"Error removing technician: {str(e)}", exc_info=True)
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CompanyAddTechnicianView(generics.GenericAPIView):
    """
    API endpoint to add and approve a technician for a maintenance company.
    POST /maintenance/companies/technicians/{technician_id}/add/
    """
    permission_classes = [AllowAny]
    serializer_class = TechnicianSerializer
    
    def post(self, request, technician_id):
        """
        Add and approve a technician for the maintenance company.
        Verifies technician isn't already approved before processing.
        """
        try:
            # Get technician and associated company
            technician = get_object_or_404(Technician, id=technician_id)
            company = Maintenance.objects.get(id=technician.maintenance_company_id)
            
            # Check if already approved
            if technician.is_approved:
                return Response(
                    {"error": "This technician is already approved."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Approve technician
            technician.is_approved = True
            technician.save()
            
            return Response({
                "message": f"Technician {technician.user.first_name} {technician.user.last_name} has been approved.",
                "data": {
                    "technician_id": str(technician.id),
                    "name": f"{technician.user.first_name} {technician.user.last_name}",
                    "email": technician.user.email,
                    "specialization": technician.specialization,
                    "company_name": company.company_name
                }
            }, status=status.HTTP_200_OK)
            
        except Maintenance.DoesNotExist:
            return Response(
                {"error": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )

class ListPendingTechniciansView(generics.ListAPIView):
    """
    API endpoint to list all pending (unapproved) technicians for a maintenance company.
    GET /maintenance/companies/{company_id}/pending-technicians/
    """
    permission_classes = [AllowAny]
    serializer_class = TechnicianListSerializer

    def get_queryset(self):
        """
        Retrieve all unapproved technicians for the specified company.
        """
        company_id = self.kwargs.get('company_id')
        company = get_object_or_404(Maintenance, id=company_id)
        return Technician.objects.filter(
            maintenance_company=company_id,
            is_approved=False
        )

    def get(self, request, *args, **kwargs):
        """
        Return list of pending technicians with their basic information.
        """
        queryset = self.get_queryset()
        pending_technicians = [{
            "id": str(tech.id),
            "name": f"{tech.user.first_name} {tech.user.last_name}",
            "email": tech.user.email,
            "specialization": tech.specialization,
        } for tech in queryset]

        return Response({
            "pending_technicians": pending_technicians,
            "count": len(pending_technicians)
        }, status=status.HTTP_200_OK)

class UpdateMaintenanceCompanyView(UpdateAPIView):
    """
    API endpoint to update maintenance company details.
    PUT/PATCH /maintenance/companies/{uuid_id}/
    """
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    lookup_url_kwarg = 'uuid_id'

    def get_object(self):
        """
        Retrieve the maintenance company to be updated.
        """
        try:
            return Maintenance.objects.get(id=self.kwargs['uuid_id'])
        except (Maintenance.DoesNotExist, ValueError):
            raise NotFound(detail="Maintenance company not found.")

class MaintenanceCompanyBySpecializationView(generics.ListAPIView):
    """
    API endpoint to list maintenance companies filtered by specialization.
    GET /maintenance/companies/specialization/{specialization}/
    """
    permission_classes = [AllowAny]
    serializer_class = MaintenanceSerializer

    def get_queryset(self):
        """
        Filter maintenance companies by the specified specialization.
        """
        specialization = self.kwargs['specialization']
        return Maintenance.objects.filter(specialization=specialization)

    def list(self, request, *args, **kwargs):
        """
        Return filtered list of companies with only ID and name fields.
        """
        queryset = self.get_queryset()
        serialized_data = MaintenanceSerializer(queryset, many=True).data
        filtered_data = [
            {
                "id": item["id"],
                "company_name": item["company_name"]
            } 
            for item in serialized_data
        ]
        return Response(filtered_data)
