# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny  # For testing purposes
# from rest_framework.permissions import IsAuthenticated  # For production
from .serializers import BrokerRegistrationSerializer
from .models import *
from account.serializers import MaintenanceSerializer, MaintenanceListSerializer
from django.shortcuts import get_object_or_404

class BrokerRegistrationView(APIView):
    """
    API endpoint for broker registration.
    - For testing: AllowAny permission.
    - For production: Only admin users can register brokers (commented out).
    """
    permission_classes = [AllowAny]  # For testing purposes
    # permission_classes = [IsAuthenticated]  # For production

    def post(self, request, *args, **kwargs):
        # For production: Check if the requesting user is an admin (is_staff)
        # if not request.user.is_staff:
        #     return Response(
        #         {"error": "Only admin users can register brokers."},
        #         status=status.HTTP_403_FORBIDDEN
        #     )

        serializer = BrokerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Save the broker user
            return Response(
                {"message": "Broker registered successfully.", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BrokerListView(APIView):
    """
    API endpoint to list all registered brokers with no authentication required.
    """
    permission_classes = [AllowAny]  # Allow unrestricted access to this view

    def get(self, request, *args, **kwargs):
        brokers = BrokerUser.objects.all()  # Get all brokers
        serializer = BrokerRegistrationSerializer(brokers, many=True)  # Serialize the data
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class MaintenanceCompaniesListView(APIView):
    """
    List all maintenance companies registered under a specific broker.
    If the broker doesn't exist or if there are no registered maintenance companies,
    appropriate messages will be returned.
    """
    permission_classes = [AllowAny]


    def get(self, request, broker_id):
        # Step 1: Get the broker by broker_id, or return a 404 if the broker doesn't exist
        broker = get_object_or_404(BrokerUser, id=broker_id)

        # Step 2: Retrieve all maintenance companies registered under this broker
        # This assumes the BrokerReferral model links brokers and maintenance companies
        broker_referrals = BrokerReferral.objects.filter(broker=broker)

        # Step 3: Check if the broker has any maintenance companies registered
        if not broker_referrals:
            return Response(
                {"message": f"No maintenance companies are registered under broker with ID {broker_id}."},
                status=status.HTTP_200_OK  # Return 200 OK because it's not a client error, just no data
            )

        # Step 4: Serialize the maintenance companies
        maintenance_companies = [referral.maintenance_company for referral in broker_referrals]
        serialized_maintenance_companies = MaintenanceSerializer(maintenance_companies, many=True)

        return Response(
            {
                "broker_code": broker.referral_code, #Include refferal code of the broker.
                "broker_email": broker.email,  # Include broker's email or other identifying info
                "maintenance_companies": serialized_maintenance_companies.data
            },
            status=status.HTTP_200_OK
        )