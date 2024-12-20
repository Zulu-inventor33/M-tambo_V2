from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny  # Allow any user to access these endpoints
from .models import User, Developer, Maintenance, Technician
from .serializers import UserSerializer, DeveloperSerializer, MaintenanceSerializer, TechnicianSerializer, LoginSerializer, MaintenanceListSerializer
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db import transaction
from rest_framework import serializers

import logging
logger = logging.getLogger(__name__)

# View for User SignUp
class SignUpView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=UserSerializer)
    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        
        try:
            with transaction.atomic():
                if user_serializer.is_valid():
                    user = user_serializer.save()
                    return Response(user_serializer.data, status=status.HTTP_201_CREATED)
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            # Log the error
            logger.error(f"Unexpected error in user signup: {str(e)}")
            # Return error response
            return Response(
                {"error": "An unexpected error occurred during signup."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(request_body=MaintenanceSerializer) 
    def create_maintenance_profile(self, request, user):
        # Handle the maintenance user profile creation
        company_name = request.data.get("company_name")
        company_address = request.data.get("company_address")
        company_registration_number = request.data.get("company_registration_number")
        specialization_name = request.data.get("specialization")

        # Ensure all necessary fields are provided
        if not all([company_name, company_address, company_registration_number, specialization_name]):
            return Response(
                {"error": "All fields are required for the Maintenance profile."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create or update the Maintenance profile
        maintenance_profile, created = Maintenance.objects.get_or_create(user=user)
        maintenance_profile.company_name = company_name
        maintenance_profile.company_address = company_address
        maintenance_profile.company_registration_number = company_registration_number
        maintenance_profile.specialization = specialization_name
        maintenance_profile.save()

        # Return response with user and maintenance profile data
        return Response(
            {"user": UserSerializer(user).data, "maintenance_profile": MaintenanceSerializer(maintenance_profile).data},
            status=status.HTTP_201_CREATED
        )
    

    @swagger_auto_schema(request_body=TechnicianSerializer)
    def create_technician_profile(self, request, user):
        # Ensure both specialization and maintenance_company_id are provided
        specialization = request.data.get("specialization")
        maintenance_company_id = request.data.get("maintenance_company_id")

        if not all([specialization, maintenance_company_id]):
            return Response(
                {"error": "Both specialization and maintenance_company_id are required for the Technician profile."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the Maintenance company exists
        try:
            maintenance_company = Maintenance.objects.get(id=maintenance_company_id)
        except Maintenance.DoesNotExist:
            return Response(
                {"error": f"Maintenance company with ID {maintenance_company_id} does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Technician profile and link it to the Maintenance company
        technician_serializer = TechnicianSerializer(data={
            'user': user.id,  # Ensure the user is passed correctly
            'specialization': specialization,
            'maintenance_company_id': maintenance_company.id  # Link to the Maintenance company
        })

        if technician_serializer.is_valid():
            technician = technician_serializer.save()  # Save the technician instance
            # Return response with user and technician profile data
            return Response(
                {"user": UserSerializer(user).data, "technician_profile": TechnicianSerializer(technician).data},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                technician_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
    


    @swagger_auto_schema(request_body=DeveloperSerializer)
    def create_developer_profile(self, request, user):
        # Handle the developer user profile creation
        developer_name = request.data.get("developer_name")
        address = request.data.get("address")

        # Ensure both developer_name and address are provided
        if not all([developer_name, address]):
            return Response(
                {"error": "Both developer_name and address are required for the Developer profile."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Developer profile
        developer_profile = Developer.objects.create(
            user=user,
            developer_name=developer_name,
            address=address
        )

        # Return response with user and developer profile data
        return Response(
            {"user": UserSerializer(user).data, "developer_profile": DeveloperSerializer(developer_profile).data},
            status=status.HTTP_201_CREATED
        )

    
# account/views.py

class LoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={200: 'Login successful', 400: 'Bad request', 401: 'Unauthorized'}
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email_or_phone = serializer.validated_data['email_or_phone']
            password = serializer.validated_data['password']
            
            print("Attempting authentication...")
            user = authenticate(request, username=email_or_phone, password=password)
            print(f"Authentication result: {user}")

            if user is None:  # Changed this condition to check for None explicitly
                return Response(
                    {"error": "Invalid credentials"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# View to List Available Specializations (for Frontend Dropdown)
class SpecializationListView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this endpoint

    @swagger_auto_schema(
        operation_summary="List Available Specializations",
        operation_description="Fetches a list of specializations that can be displayed in dropdowns or UI forms.",
        responses={
            200: openapi.Response(
                description="List of specializations",
                examples={
                    "application/json": {
                        "option1": "Elevators",
                        "option2": "HVAC",
                        "option3": "Power Backup Generators"
                    }
                }
            )
        }
    )
    def get(self, request):
        # Define the specializations as a dictionary with formatted options
        specializations = {
            "option1": "Elevators",
            "option2": "HVAC",
            "option3": "Power Backup Generators"
        }

        # Return the specializations in the response with a 200 OK status
        return Response(specializations, status=status.HTTP_200_OK)


# View for Maintenance Company List

class MaintenanceListView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this endpoint

    

    @swagger_auto_schema(
        operation_summary="List Maintenance Companies by Specialization",
        operation_description="Fetches maintenance companies filtered by the given specialization. "
                              "The specialization is provided as a query parameter.",
        manual_parameters=[
            openapi.Parameter(
                'specialization',
                openapi.IN_QUERY,
                description="Specialization to filter companies (e.g., 'Elevators', 'HVAC')",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="List of maintenance companies",
                examples={
                    "application/json": [
                        {
                            "id": 1,
                            "name": "Elite HVAC Solutions",
                            "address": "123 Main St, Cityville",
                            "specialization": "HVAC"
                        },
                        {
                            "id": 2,
                            "name": "Elevator Experts",
                            "address": "456 Highrise Ave, Cityville",
                            "specialization": "Elevators"
                        }
                    ]
                }
            ),
            400: openapi.Response(
                description="Specialization is required",
                examples={"application/json": {"error": "Specialization is required"}}
            ),
            404: openapi.Response(
                description="No companies found for the given specialization",
                examples={"application/json": {"error": "No companies found dealing with HVAC"}}
            ),
        }
    )
    def get(self, request):
        specialization = request.query_params.get('specialization')
        
        valid_specializations = ["Elevators", "HVAC", "Power Backup Generators"]
        if not specialization:
            return Response({'error': 'Specialization is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            maintenances = Maintenance.objects.filter(specialization=specialization)
            
            if not maintenances.exists():
                return Response({'error': 'No maintenance companies found for this specialization'}, 
                                status=status.HTTP_404_NOT_FOUND)
            
            # Serialize the data (you'll need to create a serializer)
            serializer = MaintenanceSerializer(maintenances, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   

