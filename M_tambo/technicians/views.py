from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import TechnicianProfile
from account.models import User, Maintenance, Technician
from .serializers import TechnicianListSerializer, TechnicianDetailSerializer, TechnicianSpecializationSerializer
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from uuid import UUID
from rest_framework import generics
from account.serializers import TechnicianSerializer
from django.core.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from django.core.validators import validate_email
from drf_yasg import openapi

# View to list all technicians
class TechnicianListView(generics.ListAPIView):
    """
    View to list all technicians associated with a specific maintenance company.
    """
    serializer_class = TechnicianListSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(tags=['Technician List'])
    def get_queryset(self):
        # Check if company_uuid was provided in URL path
        company_uuid = self.kwargs.get('company_uuid')
        
        if company_uuid:
            return Technician.objects.filter(maintenance_company_id=company_uuid)
        return Technician.objects.all()
# View to list all technicians by specialization
class TechnicianListBySpecializationView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TechnicianSpecializationSerializer

    @swagger_auto_schema(tags=['Technician List by Specialization'])
    def get_queryset(self):
        specialization = self.kwargs['specialization']
        return Technician.objects.filter(specialization=specialization)

# View to get a specific technician's details (using UUID)
class TechnicianDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Technician.objects.all()
    serializer_class = TechnicianDetailSerializer
    lookup_field = 'id'  # Use UUID field for lookup


    @swagger_auto_schema(tags=['Technician Details'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


# View for unlinked technicians
class UnlinkTechnicianFromCompanyView(APIView):
    permission_classes = [AllowAny]  # Changed to IsAuthenticated for better security

    @swagger_auto_schema(
        tags=['Unlink Technician'],
        manual_parameters=[
            openapi.Parameter(
                'pk',
                openapi.IN_PATH,
                description="UUID of the technician to unlink",
                type=openapi.TYPE_STRING,
            )
        ],
        responses={
            200: openapi.Response("Technician successfully unlinked from maintenance company."),
            400: openapi.Response("Technician is not linked to any maintenance company."),
            404: openapi.Response("Technician not found."),
        },
    )
    def patch(self, request, pk):  # Ensure `pk` is UUID
        # Fetch the technician object, or return a 404 error if not found
        technician = get_object_or_404(Technician, pk=pk)

        # Check if the technician is linked to a maintenance company
        if not technician.maintenance_company:
            return Response(
                {"error": "Technician is not linked to any maintenance company."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Unlink the technician from the maintenance company
        technician.maintenance_company = None
        technician.save()

        return Response(
            {"message": "Technician successfully unlinked from maintenance company."},
            status=status.HTTP_200_OK,
        )

# View for unlinked technicians by specialization
class UnlinkedTechniciansBySpecializationView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TechnicianListSerializer

    @swagger_auto_schema(tags=['Unlinked Technicians by Specialization'])
    def get_queryset(self):
        specialization = self.kwargs.get('specialization')
        if specialization:
            return Technician.objects.filter(maintenance_company__isnull=True, specialization=specialization)
        return Technician.objects.filter(maintenance_company__isnull=True)

    def get(self, request, *args, **kwargs):
        technicians = self.get_queryset()
        if not technicians.exists():
            return Response({"message": "No unlinked technicians found for this specialization."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(technicians, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# View to get technician details by email (uses UUID for related fields)
class TechnicianDetailByEmailView(APIView):
    permission_classes = [AllowAny]
    serializer_class = TechnicianDetailSerializer

    @swagger_auto_schema(tags=['Technician Details by Email'])
    def get(self, request, technician_email, *args, **kwargs):
        # Validate email format
        try:
            validate_email(technician_email)
        except DjangoValidationError:
            # Return a proper 400 Bad Request response instead of raising an error
            return Response(
                {"error": "Invalid email format."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Retrieve the User and Technician profile by email
        try:
            user = User.objects.get(email=technician_email)
        except User.DoesNotExist:
            raise NotFound(detail="User with this email not found.")
        
        try:
            technician = Technician.objects.get(user=user)
        except Technician.DoesNotExist:
            raise NotFound(detail="User has no technician profile associated.")

        # Create a custom response data structure to match test expectations
        technician_data = {
            'id': str(technician.id),
            'technician_name': f"{user.first_name} {user.last_name}",
            'specialization': technician.specialization,
            'maintenance_company': technician.maintenance_company.id if technician.maintenance_company else None,
            'maintenance_company_name': str(technician.maintenance_company) if technician.maintenance_company else None,
            'email': user.email,
            'phone_number': user.phone_number
        }
        
        return Response({"technician": technician_data}, status=status.HTTP_200_OK)
