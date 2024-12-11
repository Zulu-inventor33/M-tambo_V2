from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny  # Allow any user to access these endpoints
from .models import User, Developer, Maintenance, Technician
from .serializers import UserSerializer, DeveloperSerializer, MaintenanceSerializer, TechnicianSerializer, LoginSerializer, MaintenanceListSerializer
from rest_framework.exceptions import ValidationError

from django.contrib.auth import get_user_model

# View for User SignUp
class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(f"Received data: {request.data}")

        # Check if email or phone number already exists to handle the errors more gracefully
        if User.objects.filter(email=request.data.get('email')).exists():
            return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(phone_number=request.data.get('phone_number')).exists():
            return Response({"error": "A user with this phone number already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Validate and create the user
        user_serializer = UserSerializer(data=request.data)
        print(f"serealized data: {user_serializer}")

        if user_serializer.is_valid():
            user = user_serializer.save()
            account_type = user.account_type

            print(f"Account_type: {account_type}")

            # Step 2: Handle 'maintenance' account type (Create or Update Maintenance profile)
            if account_type == 'maintenance':
                # Ensure the necessary fields are available in the request data
                company_name = request.data.get("company_name")
                company_address = request.data.get("company_address")
                company_registration_number = request.data.get("company_registration_number")
                specialization_name = request.data.get("specialization")

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

                return Response(user_serializer.data, status=status.HTTP_201_CREATED)

            # Step 3: Handle 'developer' account type (Create Developer profile)
            elif account_type == 'developer':
                # Ensure the necessary fields for Developer profile are available
                developer_name = request.data.get("developer_name")
                address = request.data.get("address")

                if not all([developer_name, address]):
                    return Response(
                        {"error": "Both developer_name and address are required for the Developer profile."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Create the Developer profile
                developer_profile = Developer.objects.create(
                    user=user,
                    developer_name=developer_name,
                    address=address
                )

                return Response(user_serializer.data, status=status.HTTP_201_CREATED)

            # Step 4: Handle 'technician' account type (Create Technician profile)
            elif account_type == 'technician':
                # Validate fields for Technician profile
                specialization = request.data.get("specialization")
                maintenance_company_id = request.data.get("maintenance_company_id")

                # Ensure that both specialization and maintenance_company_id are provided
                if not all([specialization, maintenance_company_id]):
                    return Response(
                        {"error": "Both specialization and maintenance_company_id are required for the Technician profile."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Step 4.1: Check if the Maintenance company exists
                try:
                    maintenance_company = Maintenance.objects.get(id=maintenance_company_id)
                except Maintenance.DoesNotExist:
                    return Response(
                        {"error": "Maintenance company not found."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Step 4.2: Create the Technician profile and link it to the maintenance company
                try:
                    technician = Technician.objects.create(
                        user=user,
                        specialization=specialization,
                        maintenance_company=maintenance_company  # Correctly link to the maintenance company
                    )
                except Exception as e:
                    return Response(
                        {"error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                return Response(user_serializer.data, status=status.HTTP_201_CREATED)

        # If user_serializer is not valid, return errors
        print(f"Serializer errors: {user_serializer.errors}")
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    # Allow any user to access this endpoint
    permission_classes = [AllowAny]

    def post(self, request):
        # Deserialize the incoming request data
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email_or_phone = serializer.validated_data['email_or_phone']
            password = serializer.validated_data['password']
            
            # Adjust authentication to handle email or phone number login
            user = authenticate(request, username=email_or_phone, password=password)
            print(f"yooooooo: {user}")

            #this is for debugging purposes
            #we have added on top of returning access token, we are return user so that
            #we can use the user to maintain a session on the frontend using react context
            if user:
                print(f"Full User Object: {user}")
                print(f"User ID: {user.id}")
                print(f"User Email: {user.email}")
                print(f"First_Name: {user.first_name}")
                print(f"account_type: {user.account_type}")
            else:
                print("Authentication failed!")
            
            if user is not None:
                # Generate JWT tokens for the authenticated user
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                # Serialize the user data to return relevant information
                user_data = {
                    'id': user.id,
                    'first_name': user.first_name,
                    'email': user.email,
                    'account_type': user.account_type
                }

                # Return the user data and tokens in the response
                return Response({
                    'user': user_data,
                    'access': str(access_token),
                    'refresh': str(refresh)
                })

            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # If serializer is invalid, return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to List Available Specializations (for Frontend Dropdown)
class SpecializationListView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this endpoint

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

    def get(self, request):
        # Get the 'specialization' parameter from the query params
        specialization_name = request.query_params.get('specialization', None)

        if not specialization_name:
            return Response({"error": "Specialization is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Filter maintenance companies based on the specialization provided
        maintenance_companies = Maintenance.objects.filter(specialization__iexact=specialization_name)

        # Check if there are any maintenance companies for the given specialization
        if not maintenance_companies.exists():
            return Response({"error": f"No companies found dealing with {specialization_name}"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the filtered maintenance companies
        serializer = MaintenanceListSerializer(maintenance_companies, many=True)

        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_200_OK)
