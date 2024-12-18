from django.shortcuts import render
from django.shortcuts import render,get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Maintenance
from account.models import User
from .serializers import MaintenanceSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from technicians.models import Technician
from technicians.serializers import TechnicianListSerializer, TechnicianDetailSerializer
from rest_framework.exceptions import status, NotFound

# View to list all maintenance companies
@swagger_auto_schema(
    tags=["Maintenance Companies"],
    operation_description="Retrieve a list of all maintenance companies.",
    responses={200: MaintenanceSerializer(many=True)}
)
class MaintenanceCompanyListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

@swagger_auto_schema(
    tags=["Maintenance Companies"],
    operation_description="Retrieve maintenance companies by specialization.",
    manual_parameters=[
        openapi.Parameter(
            'specialization', openapi.IN_PATH, description="Specialization to filter by", type=openapi.TYPE_STRING
        )
    ],
    responses={200: MaintenanceSerializer(many=True)}
)
class MaintenanceCompanyBySpecializationView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = MaintenanceSerializer

    def get_queryset(self):
        specialization = self.kwargs['specialization']
        return Maintenance.objects.filter(specialization=specialization)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = MaintenanceSerializer(queryset, many=True).data
        filtered_data = [{"id": item["id"], "company_name": item["company_name"]} for item in serialized_data]
        return Response(filtered_data)

@swagger_auto_schema(
    tags=["Maintenance Companies"],
    operation_description="Retrieve details of a specific maintenance company by ID.",
    manual_parameters=[
        openapi.Parameter(
            'company_id', openapi.IN_PATH, description="ID of the maintenance company", type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: MaintenanceSerializer}
)
class MaintenanceCompanyDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer

    def get_object(self):
        return Maintenance.objects.get(id=self.kwargs['company_id'])

@swagger_auto_schema(
    tags=["Maintenance Companies"],
    operation_description="Retrieve a list of all technicians linked to a specific maintenance company.",
    manual_parameters=[
        openapi.Parameter(
            'company_id', openapi.IN_PATH, description="ID of the maintenance company", type=openapi.TYPE_INTEGER
        )
    ],
    responses={200: TechnicianListSerializer(many=True)}
)

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

@swagger_auto_schema(
    tags=["Technicians"],
    operation_description="Remove a technician from a maintenance company.",
    manual_parameters=[
        openapi.Parameter('company_id', openapi.IN_PATH, description="ID of the maintenance company", type=openapi.TYPE_INTEGER),
        openapi.Parameter('technician_id', openapi.IN_PATH, description="ID of the technician", type=openapi.TYPE_INTEGER)
    ],
    responses={204: "Technician removed successfully."}
)
class RemoveTechnicianFromCompanyView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def delete(self, request, company_id, technician_id):
        try:
            company = Maintenance.objects.get(id=company_id)
            technician = Technician.objects.get(id=technician_id, maintenance_company=company)
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

@swagger_auto_schema(
    tags=["Technicians"],
    operation_description="Add a technician to a maintenance company.",
    manual_parameters=[
        openapi.Parameter('company_id', openapi.IN_PATH, description="ID of the maintenance company", type=openapi.TYPE_INTEGER),
        openapi.Parameter('technician_id', openapi.IN_PATH, description="ID of the technician", type=openapi.TYPE_INTEGER)
    ],
    responses={200: "Technician added successfully."}
)
class AddTechnicianToCompanyView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, company_id, technician_id):
        try:
            company = Maintenance.objects.get(id=company_id)
            technician = Technician.objects.get(id=technician_id)

            if technician.maintenance_company is not None:
                return Response(
                    {"error": "Technician is already linked to another maintenance company."},
                    status=status.HTTP_400_BAD_REQUEST
                )

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

@swagger_auto_schema(
    tags=["Technicians"],
    operation_description="Retrieve detailed information about a specific technician for a company.",
    manual_parameters=[
        openapi.Parameter('company_id', openapi.IN_PATH, description="ID of the maintenance company", type=openapi.TYPE_INTEGER),
        openapi.Parameter('technician_id', openapi.IN_PATH, description="ID of the technician", type=openapi.TYPE_INTEGER)
    ],
    responses={200: TechnicianDetailSerializer}
)
class TechnicianDetailForCompanyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, company_id, technician_id):
        try:
            company = Maintenance.objects.get(id=company_id)
            technician = Technician.objects.get(id=technician_id, maintenance_company=company)

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

@swagger_auto_schema(
    tags=["Maintenance Companies"],
    operation_description="Update details of a specific maintenance company by ID.",
    manual_parameters=[
        openapi.Parameter('company_id', openapi.IN_PATH, description="ID of the maintenance company", type=openapi.TYPE_INTEGER)
    ],
    request_body=MaintenanceSerializer,
    responses={200: MaintenanceSerializer}
)
class UpdateMaintenanceCompanyView(UpdateAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        company_id = self.kwargs['company_id']
        try:
            return Maintenance.objects.get(id=company_id)
        except Maintenance.DoesNotExist:
            raise NotFound(detail="Maintenance company not found.")

    def patch(self, request, *args, **kwargs):
        partial = True
        return self.update(request, partial=partial, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

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
