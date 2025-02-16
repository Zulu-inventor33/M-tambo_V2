# payments/serializers.py
from rest_framework import serializers
from brokers.models import *
from .models import *
from account.models import Maintenance
from .models import ExpectedPayment
from elevators.models import Elevator


class PaymentSettingsSerializer(serializers.Serializer):
    """
    Serializer for configuring payment settings.
    Allows partial updates (one or more fields).
    """
    min_charge_per_elevator = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        help_text="Default minimum charge per elevator per month."
    )
    default_commission = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        required=False,
        help_text="Default commission percentage for brokers (e.g., 12.5%)."
    )
    default_commission_duration = serializers.IntegerField(
        required=False,
        help_text="Default duration (in months) for which brokers earn commissions (e.g., 24 months)."
    )
    default_calculation_date = serializers.IntegerField(
        required=False,
        help_text="Default day of the month for calculating expected payments (e.g., 25th)."
    )
    default_due_date = serializers.IntegerField(
        required=False,
        help_text="Default day of the month for payment due dates (e.g., 5th)."
    )


class BrokerCommissionSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving and updating broker commission settings.
    """
    class Meta:
        model = BrokerUser
        fields = [
            'first_name', 'last_name', 'referral_code',
            'commission_percentage', 'commission_duration_months', 'registration_date'
        ]
        read_only_fields = ['first_name', 'last_name', 'referral_code', 'registration_date']  # These fields cannot be updated


class PaymentPlanSerializer(serializers.ModelSerializer):
    maintenance_company_name = serializers.CharField(source='maintenance_company.company_name')
    maintenance_company_id = serializers.IntegerField(source='maintenance_company.id')
    
    # Combine first_name and last_name of the broker
    broker_name = serializers.SerializerMethodField()
    broker_id = serializers.SerializerMethodField()  # Correcting broker_id field
    broker_referral_code = serializers.SerializerMethodField()  # Add referral code field
    
    start_date = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S')
    amount_per_asset = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = PaymentPlan
        fields = [
            'id',
            'maintenance_company_name',
            'maintenance_company_id',
            'broker_name',
            'broker_id',
            'broker_commission',
            'broker_referral_code',
            'start_date',
            'amount_per_asset',
        ]
    
    def get_broker_name(self, obj):
        # Access BrokerReferral through maintenance_company
        broker_referral = obj.maintenance_company.referral.first()  # .first() gets the first referral
        if broker_referral:
            broker = broker_referral.broker  # Get the broker from BrokerReferral
            return f"{broker.first_name} {broker.last_name}"  # Combine first and last name
        return "No broker"  # Return a default value if no broker is associated

    def get_broker_id(self, obj):
        # Access BrokerReferral through maintenance_company
        broker_referral = obj.maintenance_company.referral.first()  # .first() gets the first referral
        if broker_referral:
            return broker_referral.broker.id  # Return the broker's ID
        return None  # Return None if no broker is associated

    def get_broker_referral_code(self, obj):
        # Access BrokerReferral through maintenance_company
        broker_referral = obj.maintenance_company.referral.first()  # .first() gets the first referral
        if broker_referral:
            return broker_referral.broker.referral_code  # Return the broker's referral code
        return None  # Return None if no broker is associated
    

class ElevatorSerializer(serializers.ModelSerializer):
    building_name = serializers.CharField(source='building.name', read_only=True)

    class Meta:
        model = Elevator
        fields = ['id', 'user_name', 'building_name', 'machine_number']

class ExpectedPaymentSerializer(serializers.ModelSerializer):
    maintenance_company_name = serializers.CharField(source='maintenance_company.company_name', read_only=True)
    assets = ElevatorSerializer(many=True, read_only=True)
    asset_count = serializers.SerializerMethodField()

    class Meta:
        model = ExpectedPayment
        fields = ['id', 'maintenance_company_name', 'total_amount', 'calculation_date', 'due_date', 'status', 'payment_date', 'assets', 'asset_count']
        read_only_fields = ['id', 'calculation_date', 'due_date', 'payment_date']

    def get_asset_count(self, obj):
        """
        Return the count of assets (elevators) associated with the ExpectedPayment.
        """
        return obj.assets.count()
    

class PaymentSerializer(serializers.ModelSerializer):
    maintenance_company_name = serializers.CharField(source='maintenance_company.company_name', read_only=True)
    asset_count = serializers.SerializerMethodField()
    invoice_code = serializers.CharField(source='expected_payment.payment_reference_code', read_only=True, allow_null=True)
    class Meta:
        model = Payment
        fields = [
            'id', 'maintenance_company_name', 'maintenance_company_id', 'amount', 'payment_date', 'transaction_id', 
            'payment_method', 'is_successful', 'asset_count', 'expected_payment_id', 'invoice_code'
        ]
        read_only_fields = ['id', 'payment_date']
    def get_asset_count(self, obj):
        """
        Return the count of assets (elevators) associated with the Payment through the expected_payment.
        """
        if obj.expected_payment:
            return obj.expected_payment.assets.count()
        return 0
    

class RevenueSplitSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueSplit
        fields = '__all__'


class BrokerBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrokerBalance
        fields = '__all__'


class WithdrawalRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithdrawalRequest
        fields = '__all__'