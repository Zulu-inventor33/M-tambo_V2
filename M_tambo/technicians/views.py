from django.shortcuts import render,get_object_or_404
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import Technician
from account.models import User
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import TechnicianListSerializer, TechnicianDetailSerializer, TechnicianSpecializationSerializer

# View to list all technicians
class TechnicianListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TechnicianListSerializer

    def get_queryset(self):
        return Technician.objects.all()

# View to list all technicians by specialization
class TechnicianListBySpecializationView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TechnicianSpecializationSerializer

    def get_queryset(self):
        specialization = self.kwargs['specialization']
        return Technician.objects.filter(specialization=specialization)

# View to get a specific technician's details (name, available jobs, etc.)
class TechnicianDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Technician.objects.all()
    serializer_class = TechnicianDetailSerializer
    lookup_field = 'id'

class UnlinkedTechniciansView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Technician.objects.filter(maintenance_company__isnull=True)  # Filter technicians with NULL maintenance company
    serializer_class = TechnicianListSerializer

    def get(self, request, *args, **kwargs):
        # Perform the query for unlinked technicians
        technicians = self.get_queryset()
        
        if not technicians:
            return Response({"message": "No technicians are unlinked to a maintenance company."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the data and return the response
        serializer = self.get_serializer(technicians, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UnlinkedTechniciansBySpecializationView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TechnicianListSerializer

    def get_queryset(self):
        # Retrieve the specialization from the URL parameters
        specialization = self.kwargs.get('specialization')

        # Filter technicians who have NULL maintenance_company and match the provided specialization
        if specialization:
            return Technician.objects.filter(maintenance_company__isnull=True, specialization=specialization)
        return Technician.objects.filter(maintenance_company__isnull=True)  # Default to unlinked technicians

    def get(self, request, *args, **kwargs):
        # Get the filtered queryset based on specialization
        technicians = self.get_queryset()

        if not technicians:
            return Response({"message": "No unlinked technicians found for this specialization."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the data and return the response
        serializer = self.get_serializer(technicians, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UnlinkTechnicianFromCompanyView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, id, *args, **kwargs):
        try:
            # Retrieve the technician by technician_id (from URL parameter)
            technician = Technician.objects.get(id=id)

            # Check if the technician is already unlinked (maintenance_company is None)
            if technician.maintenance_company is None:
                return Response(
                    {"message": "Sorry you are currently not associated with any maintenance company."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Unlink the technician from the maintenance company
            technician.maintenance_company = None
            technician.save()

            return Response(
                {"message": "You have successfully been unlinked from the maintenance company and you are currently not associated with any company."},
                status=status.HTTP_200_OK
            )

        except Technician.DoesNotExist:
            return Response(
                {"error": "Technician not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class TechnicianDetailByEmailView(APIView):
    permission_classes = [AllowAny]  # Modify this as per your permissions
    serializer_class = TechnicianDetailSerializer
    
    def get(self, request, technician_email, *args, **kwargs):
        try:
            # Retrieve the User by email using the custom user model
            user = User.objects.get(email=technician_email)
            
            # Assuming 'technician_profile' is the related name in your User model
            if user.technician_profile is None:
                raise NotFound(detail="User has no technician profile associated.")
            
            # Serialize the technician profile
            serializer = self.serializer_class(user.technician_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            raise NotFound(detail="User with this email not found.")
        except Technician.DoesNotExist:
            raise NotFound(detail="Technician profile not found for this user.")