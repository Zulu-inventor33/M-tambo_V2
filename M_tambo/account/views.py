from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny  # Allow any user to access these endpoints
from .models import User, Developer, Maintenance, Technician
from .serializers import UserSerializer, DeveloperSerializer, MaintenanceSerializer, TechnicianSerializer, LoginSerializer, MaintenanceListSerializer

# View for User SignUp
class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Step 1: Validate and create the user
        user_serializer = UserSerializer(data=request.data)
        print(f"serealized data: {user_serializer}")

        if user_serializer.is_valid():
            user = user_serializer.save()  # Save user and get the user instance
            account_type = user.account_type

            # Step 2: Handle profile creation based on account type
            if account_type == 'maintenance':
                return self.create_maintenance_profile(request, user)
            elif account_type == 'technician':
                return self.create_technician_profile(request, user)
            elif account_type == 'developer':
                return self.create_developer_profile(request, user)

            # If account type is invalid
            return Response(
                {"error": "Invalid account type provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If user_serializer is not valid, return errors
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
