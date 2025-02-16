# payments/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .serializers import *
from .models import *
import math
from django.db import transaction
from decimal import Decimal
from datetime import datetime
from django.utils.dateparse import parse_datetime
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from brokers.models import BrokerUser
from .services import *
from .serializers import *
from django_daraja.mpesa.core import MpesaClient
import logging

logger = logging.getLogger(__name__)

class ConfigurePaymentSettingsView(APIView):
    """
    API endpoint for retrieving and configuring default payment settings.
    - GET: Retrieve all payment settings.
    - POST: Update one or more payment settings.
    For testing purposes, allow any user to access this endpoint.
    For production, restrict access to admin users (is_staff).
    """
    # For testing purposes, allow any user to access this endpoint
    permission_classes = [AllowAny]  # AllowAny for testing
    # For production, uncomment the following line to restrict access to admin users
    # permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        """
        Handle GET requests to retrieve all payment settings.
        """
        # Get or create the PaymentSettings instance
        settings, created = PaymentSettings.objects.get_or_create(id=1)

        # Serialize the settings
        serializer = PaymentSettingsSerializer(settings)

        # Add a flag to indicate whether each field is configured
        response_data = serializer.data
        response_data["is_configured"] = {
            "min_charge_per_elevator": settings.min_charge_per_elevator != None,  # Default value
            "default_commission": settings.default_commission != None,  # Default value
            "default_commission_duration": settings.default_commission_duration != None,  # Default value
            "default_calculation_date": settings.default_calculation_date != None,  # Default value
            "default_due_date": settings.default_due_date != None,  # Default value
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Handle POST requests to update payment settings.
        Allows partial updates (one or more fields).
        """
        serializer = PaymentSettingsSerializer(data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            # Get or create the PaymentSettings instance
            settings, created = PaymentSettings.objects.get_or_create(id=1)

            # Update only the fields provided in the request
            for field, value in serializer.validated_data.items():
                setattr(settings, field, value)
            settings.save()

            return Response(
                {"message": "Payment settings updated successfully.", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BrokerCommissionSettingsView(APIView):
    """
    API endpoint for retrieving and updating commission settings of a specific broker.
    Only accessible by admin users (is_staff).
    """
    # For testing purposes, allow any user to access this endpoint
    permission_classes = [AllowAny]  # AllowAny for testing
    # For production, uncomment the following line to restrict access to admin users
    # permission_classes = [IsAdminUser]

    def get(self, request, broker_id, *args, **kwargs):
        """
        Handle GET requests to retrieve commission settings of a specific broker.
        """
        # Retrieve the broker or return a 404 response if not found
        broker = get_object_or_404(BrokerUser, id=broker_id)

        # Serialize the broker's commission settings
        serializer = BrokerCommissionSettingsSerializer(broker)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, broker_id, *args, **kwargs):
        """
        Handle PUT requests to update commission settings of a specific broker.
        """
        # Retrieve the broker or return a 404 response if not found
        broker = get_object_or_404(BrokerUser, id=broker_id)

        # Serialize and validate the request data
        serializer = BrokerCommissionSettingsSerializer(broker, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()  # Save the updated commission settings
            return Response(
                {"message": "Broker commission settings updated successfully.", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class PaymentPlansListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Fetch all PaymentPlans (You could also add filters or pagination if needed)
        payment_plans = PaymentPlan.objects.all()
        
        # Serialize the data using PaymentPlanSerializer
        serializer = PaymentPlanSerializer(payment_plans, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class ExpectedPaymentListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Fetch all ExpectedPayments (You could also add filters or pagination if needed)
        expected_payments = ExpectedPayment.objects.all()
        
        # Serialize the data using ExpectedPaymentSerializer
        serializer = ExpectedPaymentSerializer(expected_payments, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class ExpectedPaymentDetailView(APIView):
    permission_classes = [AllowAny]
    """
    Retrieve a specific expected payment by its ID.
    Handles cases for non-existent IDs, empty payments, etc.
    """
    def get(self, request, expected_payments_id):
        try:
            # Try to fetch the expected payment by ID
            expected_payment = ExpectedPayment.objects.get(id=expected_payments_id)

            # Serialize the data using the ExpectedPaymentSerializer
            serializer = ExpectedPaymentSerializer(expected_payment)

            # Return the serialized data
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ExpectedPayment.DoesNotExist:
            # If the ExpectedPayment does not exist, return a 404 Not Found error
            return Response(
                {"detail": "Expected Payment not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Generic error handling for any unexpected issues
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        

class ExpectedPaymentsByCompanyView(APIView):
    """
    This view handles the retrieval of all expected payments for a specific maintenance company.
    It handles the following scenarios:
    - Fetches expected payments of a maintenance company by its ID.
    - Returns a message when no expected payments are found for the company.
    - Returns a 404 error when the provided maintenance company ID does not exist.
    """
    
    permission_classes = [AllowAny]  # Allows any user to access this view without authentication

    def get(self, request, maintenance_company_id):
        """
        Handles GET requests to retrieve expected payments for a specific maintenance company.
        
        Parameters:
        - maintenance_company_id: The ID of the maintenance company for which we want to retrieve expected payments.
        
        Returns:
        - 200 OK with the list of expected payments (if found).
        - 200 OK with a message if no expected payments are found.
        - 404 Not Found if the maintenance company does not exist.
        """

        # Try to fetch the maintenance company by the provided ID
        try:
            maintenance_company = Maintenance.objects.get(id=maintenance_company_id)
        except Maintenance.DoesNotExist:
            # If no company is found with the given ID, return a 404 error
            return Response({"detail": "Maintenance company not found."}, status=status.HTTP_404_NOT_FOUND)

        # Fetch all expected payments related to the found maintenance company
        expected_payments = ExpectedPayment.objects.filter(maintenance_company=maintenance_company)
        
        if not expected_payments.exists():
            # If no expected payments are found for this company, return a message indicating that
            return Response({"detail": "No expected payments found for this company."}, status=status.HTTP_200_OK)

        # If expected payments are found, serialize and return the data
        serializer = ExpectedPaymentSerializer(expected_payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class LatestExpectedPaymentView(APIView):
    """
    View to get the latest expected payment for a specific maintenance company.
    """

    permission_classes = [AllowAny]

    def get(self, request, maintenance_company_id):
        try:
            # Fetch the maintenance company by ID
            maintenance_company = Maintenance.objects.get(id=maintenance_company_id)

            # Get the latest expected payment for the maintenance company, ordered by calculation date
            latest_payment = ExpectedPayment.objects.filter(
                maintenance_company=maintenance_company
            ).order_by('-calculation_date').first()

            if not latest_payment:
                return Response(
                    {"detail": "No expected payment found for this company."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize the latest expected payment
            serializer = ExpectedPaymentSerializer(latest_payment)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            return Response(
                {"detail": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        

class ExpectedPaymentsByStatusView(APIView):
    """
    View to get the expected payments for a specific maintenance company based on the payment status (e.g., pending, paid, overdue).
    """

    permission_classes = [AllowAny]

    def get(self, request, maintenance_company_id, status_choice):
        # Validate status_choice
        valid_status_choices = ['pending', 'paid', 'overdue']
        if status_choice not in valid_status_choices:
            return Response(
                {"detail": f"Invalid status choice. Valid choices are {', '.join(valid_status_choices)}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Fetch the maintenance company by ID
            maintenance_company = Maintenance.objects.get(id=maintenance_company_id)

            # Filter expected payments by status and maintenance company
            expected_payments = ExpectedPayment.objects.filter(
                maintenance_company=maintenance_company,
                status=status_choice
            )

            if not expected_payments.exists():
                return Response(
                    {"detail": f"No expected payments found for this company with status {status_choice}."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize the expected payments
            serializer = ExpectedPaymentSerializer(expected_payments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Maintenance.DoesNotExist:
            return Response(
                {"detail": "Maintenance company not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class FilterExpectedPaymentsView(APIView):
    """
    View to filter and list all expected payments based on the provided criteria.
    Supports filtering by maintenance company, status, calculation date, due date, and more.
    """

    permission_classes = [AllowAny]

    def put(self, request):
        # Extract filtering parameters from the request data
        filters = request.data
        maintenance_company_id = filters.get('maintenance_company_id', None)
        status_choice = filters.get('status', None)
        calculation_date = filters.get('calculation_date', None)
        due_date = filters.get('due_date', None)
        
        # Initialize the queryset
        expected_payments = ExpectedPayment.objects.all()

        # Apply filters based on provided inputs

        # Filter by maintenance company ID
        if maintenance_company_id:
            try:
                maintenance_company = Maintenance.objects.get(id=maintenance_company_id)
                expected_payments = expected_payments.filter(maintenance_company=maintenance_company)
            except Maintenance.DoesNotExist:
                return Response(
                    {"detail": "Maintenance company not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Filter by status choice (pending, paid, overdue)
        if status_choice:
            valid_status_choices = ['pending', 'paid', 'overdue']
            if status_choice not in valid_status_choices:
                return Response(
                    {"detail": f"Invalid status choice. Valid choices are {', '.join(valid_status_choices)}."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            expected_payments = expected_payments.filter(status=status_choice)

        # Filter by calculation date (greater than or equal)
        if calculation_date:
            calculation_date_parsed = parse_datetime(calculation_date)
            if not calculation_date_parsed:
                return Response(
                    {"detail": "Invalid calculation_date format. Please use 'YYYY-MM-DDTHH:MM:SS'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            expected_payments = expected_payments.filter(calculation_date__gte=calculation_date_parsed)

        # Filter by due date (less than or equal)
        if due_date:
            due_date_parsed = parse_datetime(due_date)
            if not due_date_parsed:
                return Response(
                    {"detail": "Invalid due_date format. Please use 'YYYY-MM-DDTHH:MM:SS'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            expected_payments = expected_payments.filter(due_date__lte=due_date_parsed)

        # If no filters were applied, return all payments
        if not expected_payments.exists():
            return Response(
                {"detail": "No expected payments match the provided criteria."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize the filtered expected payments
        serializer = ExpectedPaymentSerializer(expected_payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class DashboardAccessView(APIView):
    """
    View to get the latest expected payment data and determine dashboard access.
    If the latest expected payment is paid, access is allowed. If it's pending after the due date, access is denied.
    """
    permission_classes = [AllowAny]  # Allow anyone to access this view

    def get(self, request, *args, **kwargs):
        company_id = kwargs['maintenance_company_id']
        today = timezone.localtime(timezone.now())  # Ensure today is timezone-aware

        # Step 1: Fetch the expected payments for the previous period (e.g., January 25th if today is February 9th)
        current_month_calculation_date = today.replace(day=25, hour=0, minute=0, second=0, microsecond=0)

        # Find the latest expected payment before today (last month's expected payment)
        previous_payment = ExpectedPayment.objects.filter(
            maintenance_company_id=company_id,
            calculation_date__lt=current_month_calculation_date
        ).order_by('-calculation_date').first()

        # Step 2: If no expected payment exists for the previous period, return allowed access
        if not previous_payment:
            return Response({
                "id": None,
                "maintenance_company_name": None,
                "total_amount": "0.00",
                "calculation_date": None,
                "due_date": None,
                "status": "No Payment Yet",
                "payment_reference_code": None,
                "dashboard_access_status": "allowed"  # Allow access if no expected payment
            }, status=status.HTTP_200_OK)

        # Step 3: Evaluate the status of the previous expected payment (whether it is overdue, paid, etc.)
        if previous_payment.status == 'paid':
            dashboard_access_status = 'allowed'
        elif previous_payment.status == 'pending':
            if previous_payment.due_date < today:
                dashboard_access_status = 'denied'
            elif previous_payment.calculation_date.month < today.month and today.day > 1:
                dashboard_access_status = 'warning'
        else:
            dashboard_access_status = 'denied'

        # Step 4: Check if there is an expected payment for the current period (i.e., the next expected payment)
        current_payment = ExpectedPayment.objects.filter(
            maintenance_company_id=company_id,
            calculation_date__gte=current_month_calculation_date
        ).order_by('calculation_date').first()

        if current_payment:
            # Evaluate the new expected payment status for the new month
            if current_payment.status == 'paid':
                dashboard_access_status = 'allowed'
            elif current_payment.status == 'pending':
                if current_payment.due_date < today:
                    dashboard_access_status = 'denied'
                elif current_payment.calculation_date.month < today.month and today.day > 1:
                    dashboard_access_status = 'warning'

        # Step 5: Return the response with the appropriate dashboard access status
        data = {
            "id": previous_payment.id if previous_payment else None,
            "maintenance_company_name": previous_payment.maintenance_company.company_name if previous_payment else None,
            "total_amount": str(previous_payment.total_amount) if previous_payment else "0.00",
            "calculation_date": previous_payment.calculation_date.isoformat() if previous_payment else None,
            "due_date": previous_payment.due_date.isoformat() if previous_payment else None,
            "status": previous_payment.get_status_display() if previous_payment else "No Payment Yet",
            "payment_reference_code": previous_payment.payment_reference_code if previous_payment else None,
            "dashboard_access_status": dashboard_access_status  # Final access status
        }

        return Response(data, status=status.HTTP_200_OK)
    

class ConfigureExpectedPaymentView(APIView):
    """
    Admin view to GET and PUT (update) the details of a specific ExpectedPayment.
    Only accessible by users with 'is_staff' permission (commented out for now).
    """
    permission_classes = [AllowAny]  # All users can access for now, modify as needed for production

    def get_object(self, expected_payment_id):
        """
        Get the ExpectedPayment object or raise a 404 error if it doesn't exist.
        """
        return get_object_or_404(ExpectedPayment, id=expected_payment_id)

    def get(self, request, expected_payment_id):
        """
        GET: Retrieve the details of a specific expected payment.
        """
        # Uncomment this block when moving to production
        # if not request.user.is_staff:
        #     raise PermissionDenied("You do not have permission to access this resource.")

        expected_payment = self.get_object(expected_payment_id)
        serializer = ExpectedPaymentSerializer(expected_payment)
        return Response(serializer.data)

    def put(self, request, expected_payment_id):
        """
        PUT: Update the details of a specific expected payment.
        This will allow updating the status, total_amount, due_date, and calculation_date.
        """
        # Uncomment this block when moving to production
        # if not request.user.is_staff:
        #     raise PermissionDenied("You do not have permission to access this resource.")

        expected_payment = self.get_object(expected_payment_id)
        serializer = ExpectedPaymentSerializer(expected_payment, data=request.data, partial=True)

        if serializer.is_valid():
            # Validate calculation_date (if provided)
            new_calculation_date = request.data.get('calculation_date')
            if new_calculation_date:
                try:
                    new_date = datetime.fromisoformat(new_calculation_date.replace('Z', '+00:00'))  # Convert to datetime object
                    # Check if the new calculation date is in the future
                    if new_date > timezone.now():
                        return Response({"error": "calculation_date cannot be set in the future."}, status=status.HTTP_400_BAD_REQUEST)
                    expected_payment.calculation_date = new_date
                except ValueError:
                    return Response({"error": "Invalid calculation_date format."}, status=status.HTTP_400_BAD_REQUEST)

            # Validate due_date (if provided)
            new_due_date = request.data.get('due_date')
            if new_due_date:
                try:
                    new_due_date_obj = datetime.fromisoformat(new_due_date.replace('Z', '+00:00'))  # Convert to datetime object
                    # Check if the new due date is in the future
                    if new_due_date_obj > timezone.now():
                        return Response({"error": "due_date cannot be set in the future."}, status=status.HTTP_400_BAD_REQUEST)
                    expected_payment.due_date = new_due_date_obj
                except ValueError:
                    return Response({"error": "Invalid due_date format."}, status=status.HTTP_400_BAD_REQUEST)

            # Save the updated ExpectedPayment object
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


class MakePaymentViaMpesaView(APIView):
    """
    View to initiate M-PESA payment for a specific Expected Payment using direct API calls.
    """
    permission_classes = [AllowAny]
    def post(self, request, expected_payment_id):
        logger.debug(f"[MakePaymentViaMpesaView] POST request data: {request.data}, Expected Payment ID: {expected_payment_id}")
        expected_payment = get_object_or_404(ExpectedPayment, id=expected_payment_id)
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({"detail": "Phone number is required."}, status=status.HTTP_400_BAD_REQUEST)
        # Format phone number to international format
        phone_number = format_phone_number(phone_number)
        if not phone_number:
            return Response({"detail": "Invalid phone number format."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            amount = Decimal(str(expected_payment.total_amount))
            amount_rounded = math.ceil(amount)
            logger.debug(f"[MakePaymentViaMpesaView] Rounded amount: {amount_rounded}")
            
            mpesa_stk_push = MpesaSTKPush(expected_payment_id, request)
            result = mpesa_stk_push.initiate_payment(
                amount=amount_rounded,
                phone_number=phone_number,
                account_reference=expected_payment.payment_reference_code,
                transaction_description=f"Payment for {expected_payment.maintenance_company.company_name}"
            )
            
            if result['status'] == 'success':
                return Response({'message': result['message']}, status=status.HTTP_200_OK)
            else:
                logger.error(f"[MakePaymentViaMpesaView] M-PESA payment failed: {result}")
                return Response({'error': result['message']}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"[MakePaymentViaMpesaView] Error initiating payment via M-PESA: {str(e)}")
            return Response({"detail": f"Error initiating M-PESA payment: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MpesaPaymentCallbackView(APIView):
    """
    Callback view to handle M-PESA payment status update using direct API response parsing.
    """
    permission_classes = [AllowAny]

    def post(self, request, expected_payment_id):
        logger.debug(f"[MpesaPaymentCallbackView] Callback Data: {request.data}, Expected Payment ID: {expected_payment_id}")
        callback_data = request.data
        body = callback_data.get('Body', {})
        stk_callback = body.get('stkCallback', {})
        
        # Extract relevant data
        result_code = stk_callback.get('ResultCode')
        result_desc = stk_callback.get('ResultDesc')
        callback_metadata = stk_callback.get('CallbackMetadata', {})
        items = callback_metadata.get('Item', [])
        
        amount_paid = next((item['Value'] for item in items if item['Name'] == 'Amount'), None)
        transaction_id = next((item['Value'] for item in items if item['Name'] == 'MpesaReceiptNumber'), None)
        logger.debug(f"[MpesaPaymentCallbackView] Extracted Amount: {amount_paid}, Transaction ID: {transaction_id}")
        
        # Check if the payment was successful
        if result_code == 0:
            with transaction.atomic():
                expected_payment = get_object_or_404(ExpectedPayment, id=expected_payment_id)
                payment = Payment.objects.create(
                    maintenance_company=expected_payment.maintenance_company,
                    expected_payment=expected_payment,
                    amount=amount_paid,
                    payment_date=timezone.now(),
                    transaction_id=transaction_id,
                    payment_method='mpesa',
                    is_successful=True
                )
                logger.debug(f"[MpesaPaymentCallbackView] Payment Created: {payment}")
                
                # Mark the ExpectedPayment as paid
                if Decimal(amount_paid) >= Decimal(expected_payment.total_amount):
                    expected_payment.status = 'paid'
                    expected_payment.payment_date = payment.payment_date
                    expected_payment.save()
                    logger.info(f"[MpesaPaymentCallbackView] Expected Payment {expected_payment.id} status updated to 'paid'.")

                # Check if the company is linked to a broker through BrokerReferral
                referral = BrokerReferral.objects.filter(maintenance_company=expected_payment.maintenance_company).first()
                if referral:
                    logger.debug(f"[MpesaPaymentCallbackView] BrokerReferral Found: {referral}")
                    
                    # Get the broker and commission details
                    broker = referral.broker
                    broker_commission_percentage = referral.commission_percentage
                    
                    # If no specific commission in referral, get default from PaymentSettings
                    if not broker_commission_percentage:
                        default_payment_settings = PaymentSettings.objects.first()
                        broker_commission_percentage = default_payment_settings.broker_commission if default_payment_settings else Decimal('0.00')
                    
                    logger.debug(f"[MpesaPaymentCallbackView] Using Commission Percentage: {broker_commission_percentage}")
                    
                    # Calculate the revenue split
                    total_revenue = Decimal(amount_paid)
                    broker_commission = (broker_commission_percentage / Decimal('100.00')) * total_revenue
                    company_earnings = total_revenue - broker_commission
                    
                    # Create RevenueSplit entry
                    revenue_split, created = RevenueSplit.objects.get_or_create(
                        payment=payment,
                        defaults={
                            'total_revenue': total_revenue,
                            'broker_commission': broker_commission,
                            'company_earnings': company_earnings,
                            'split_date': timezone.now()
                        }
                    )
                    logger.info(f"[MpesaPaymentCallbackView] Revenue Split {'Created' if created else 'Already Exists'}: {revenue_split}")
                    
                    # Update BrokerBalance
                    broker_balance, created = BrokerBalance.objects.get_or_create(
                        broker=broker,
                        defaults={
                            'total_earnings': broker_commission,
                            'expected_monthly_earnings': Decimal('0.00'),
                            'withdrawable_amount': broker_commission,
                            'last_updated': timezone.now()
                        }
                    )
                    
                    # If the balance already exists, update it
                    if not created:
                        broker_balance.total_earnings += broker_commission
                        broker_balance.withdrawable_amount += broker_commission
                        broker_balance.last_updated = timezone.now()
                        broker_balance.save()

                    logger.info(f"[MpesaPaymentCallbackView] Broker Balance Updated for {broker.email} - Total Earnings: Kshs. {broker_balance.total_earnings}")
                else:
                    logger.info(f"[MpesaPaymentCallbackView] No broker linked for Maintenance Company: {expected_payment.maintenance_company}")

            return Response({"detail": "Payment processed successfully."}, status=status.HTTP_200_OK)
        
        else:
            logger.warning(f"[MpesaPaymentCallbackView] Payment failed: {result_desc}")
            return Response({"detail": f"Payment failed: {result_desc}"}, status=status.HTTP_400_BAD_REQUEST)
        

class PaymentView(APIView):
    """
    View to list all payments.
    """
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            # Fetch all payments
            payments = Payment.objects.all()
            if not payments.exists():
                return Response(
                    {"detail": "No payments found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            # Serialize the payments
            serializer = PaymentSerializer(payments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": "An error occurred while fetching payments."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class RevenueSplitListView(APIView):
    """
    View to list all revenue splits.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed
    
    def get(self, request):
        try:
            # Fetch all revenue splits
            revenue_splits = RevenueSplit.objects.all()
            
            if not revenue_splits.exists():
                return Response(
                    {"detail": "No revenue splits found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Serialize the revenue splits
            serializer = RevenueSplitSerializer(revenue_splits, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"detail": "An error occurred while fetching revenue splits."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class BrokerBalanceView(APIView):
    """
    View to list all broker balances.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed
    
    def get(self, request):
        try:
            # Fetch all broker balances
            broker_balances = BrokerBalance.objects.all()
            
            if not broker_balances.exists():
                return Response(
                    {"detail": "No broker balances found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Serialize the broker balances
            serializer = BrokerBalanceSerializer(broker_balances, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"detail": "An error occurred while fetching broker balances."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class WithdrawalRequestListView(APIView):
    """
    View to list all withdrawal requests.
    """
    permission_classes = [AllowAny]  # Adjust permissions as needed
    
    def get(self, request):
        try:
            # Fetch all withdrawal requests
            withdrawal_requests = WithdrawalRequest.objects.all()
            
            if not withdrawal_requests.exists():
                return Response(
                    {"detail": "No withdrawal requests found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Serialize the withdrawal requests
            serializer = WithdrawalRequestSerializer(withdrawal_requests, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"detail": "An error occurred while fetching withdrawal requests."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class BrokerWithdrawViaMpesaView(APIView):
    """
    Allows brokers to initiate withdrawal requests via M-PESA
    """
    permission_classes = [AllowAny]  # For testing purposes
    # permission_classes = [IsAuthenticated]  # Uncomment for production

    def post(self, request, broker_id):
        broker = get_object_or_404(BrokerUser, id=broker_id)

        # Uncomment for production to restrict access
        # if request.user != broker:
        #     return Response({"detail": "You are not authorized to make this request."}, status=status.HTTP_403_FORBIDDEN)

        try:
            amount = float(Decimal(request.data.get('amount')))
        except (TypeError, ValueError, Decimal.InvalidOperation):
            return Response({"detail": "Invalid amount provided."}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response({"detail": "Amount must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        broker_balance = get_object_or_404(BrokerBalance, broker=broker)

        # Check if broker has sufficient balance
        if broker_balance.withdrawable_amount < amount:
            return Response({"detail": "Insufficient withdrawable balance."}, status=status.HTTP_400_BAD_REQUEST)

        # Initiate withdrawal via M-PESA B2C using the new services.py
        mpesa = MpesaB2C()
        mpesa_response = mpesa.initiate_b2c_payment(broker.phone_number, amount, broker.id)

        # Only check if the request was sent successfully, not the final status
        if mpesa_response.get('status') == 'success':
            return Response({"detail": "Withdrawal request submitted successfully. Awaiting confirmation."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Withdrawal request failed. Try again later."}, status=status.HTTP_400_BAD_REQUEST)
        

class MpesaB2CCallbackView(APIView):
    """
    Handles M-PESA B2C transaction callback from Safaricom.
    """
    permission_classes = [AllowAny]

    def post(self, request, broker_id):
        broker = get_object_or_404(BrokerUser, id=broker_id)
        data = request.data  # Safaricom's callback payload

        # Extract relevant details from the callback
        transaction_id = data.get("TransactionID")  # M-PESA Receipt Number
        result_code = data.get("ResultCode")
        result_desc = data.get("ResultDesc")
        amount = Decimal(data.get("Amount", 0))
        phone_number = data.get("PhoneNumber")

        # Get or create the withdrawal request
        withdrawal_request, created = WithdrawalRequest.objects.get_or_create(
            broker=broker,
            amount=amount,
            status='pending',  # Initially set to pending
            defaults={'phone_number': phone_number}  # Save the phone number here
        )

        # Process success or failure
        if result_code == "0":  # Success
            withdrawal_request.mpesa_receipt_number = transaction_id
            withdrawal_request.status = "approved"
            withdrawal_request.phone_number = phone_number  # Update phone number
            withdrawal_request.request_date = timezone.now()
            withdrawal_request.save()

            # Deduct balance from broker
            broker_balance = get_object_or_404(BrokerBalance, broker=broker)
            broker_balance.withdrawable_amount -= amount
            broker_balance.last_updated = timezone.now()
            broker_balance.save()

            return Response({"detail": "Withdrawal confirmed successfully."}, status=status.HTTP_200_OK)
        else:  # Failure
            withdrawal_request.status = "rejected"
            withdrawal_request.phone_number = phone_number  # Update phone number even on failure
            withdrawal_request.request_date = timezone.now()
            withdrawal_request.save()

            return Response({"detail": f"Withdrawal failed: {result_desc}"}, status=status.HTTP_400_BAD_REQUEST)