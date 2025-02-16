from celery import shared_task, chain
from payments.models import ExpectedPayment, PaymentPlan, BrokerBalance, PaymentSettings
from account.models import Maintenance
from brokers.models import *
from django.utils import timezone
from decimal import Decimal
from django.db.models import Sum

@shared_task
def populate_expected_payments():
    """
    Populates ExpectedPayment for all maintenance companies.
    Uses default payment settings if no payment plan is found.
    Sets status to 'paid' if total amount is 0.
    """
    print("Populating expected payments...")

    # Get default payment settings
    default_payment_settings = PaymentSettings.objects.first()

    maintenance_companies = Maintenance.objects.all()

    for maintenance_company in maintenance_companies:
        # Get payment plan or default settings
        payment_plan = PaymentPlan.objects.filter(maintenance_company=maintenance_company).first()

        if payment_plan:
            amount_per_asset = payment_plan.amount_per_asset
        else:
            amount_per_asset = default_payment_settings.amount_per_asset if default_payment_settings else Decimal('0.00')

        # Calculate total amount
        total_amount = amount_per_asset * maintenance_company.elevators.count()

        # Determine status
        status = 'paid' if total_amount == 0 else 'pending'

        # Create ExpectedPayment instance
        expected_payment = ExpectedPayment.objects.create(
            maintenance_company=maintenance_company,
            total_amount=total_amount,
            calculation_date=timezone.now().replace(day=25, hour=0, minute=0, second=0, microsecond=0),
            due_date=timezone.now().replace(day=5, hour=23, minute=59, second=59) + timezone.timedelta(days=30),
            status=status
        )

        # Assign assets to ExpectedPayment
        expected_payment.assets.set(maintenance_company.elevators.all())

        print(f"Processed Expected Payment for {maintenance_company.company_name} - Kshs. {total_amount}")

    print("Expected payments populated successfully.")



@shared_task
def calculate_broker_earnings():
    """
    Calculates the expected monthly earnings for each broker.
    Uses the referral-specific commission percentage and duration if available;
    otherwise, falls back on default payment settings.
    """
    print("Calculating broker earnings...")

    # Get default payment settings
    default_payment_settings = PaymentSettings.objects.first()
    default_commission_percentage = default_payment_settings.broker_commission if default_payment_settings else Decimal('0.00')
    default_commission_duration = default_payment_settings.default_commission_duration if default_payment_settings else 0

    brokers = BrokerUser.objects.all()

    for broker in brokers:
        total_commission = Decimal('0.00')

        # Get all referrals for this broker
        referrals = BrokerReferral.objects.filter(broker=broker)

        for referral in referrals:
            company = referral.maintenance_company
            referral_date = referral.referral_date

            # Calculate months since referral
            months_elapsed = (timezone.now().year - referral_date.year) * 12 + (timezone.now().month - referral_date.month)

            # Check commission eligibility based on referral-specific duration
            if months_elapsed > referral.commission_duration_months:
                print(f"Commission period lapsed for {company.company_name}. No earnings for this referral.")
                continue

            # Get expected payments for this company for the current month
            expected_payments = ExpectedPayment.objects.filter(
                maintenance_company=company,
                calculation_date__month=timezone.now().month,
                calculation_date__year=timezone.now().year
            )

            # Sum up total amounts for this month
            total_amount = expected_payments.aggregate(Sum('total_amount'))['total_amount__sum'] or Decimal('0.00')

            if total_amount > 0:
                # Get broker commission for this company
                payment_plan = PaymentPlan.objects.filter(maintenance_company=company).first()

                if payment_plan and payment_plan.broker_commission:
                    broker_commission_percentage = payment_plan.broker_commission
                else:
                    # Use referral-specific commission percentage if no payment plan
                    broker_commission_percentage = referral.commission_percentage or default_commission_percentage

                # Calculate broker's commission
                broker_commission = (broker_commission_percentage / Decimal('100.00')) * total_amount
                total_commission += broker_commission

        # Get or create BrokerBalance for this broker
        broker_balance, created = BrokerBalance.objects.get_or_create(
            broker=broker,
            defaults={
                'total_earnings': Decimal('0.00'),
                'expected_monthly_earnings': total_commission,
                'withdrawable_amount': Decimal('0.00'),
                'last_updated': timezone.now()
            }
        )

        # If the balance already exists, update the expected monthly earnings
        if not created:
            broker_balance.expected_monthly_earnings = total_commission
            broker_balance.last_updated = timezone.now()
            broker_balance.save()

        print(f"Updated Broker Balance for {broker.email} - Expected Monthly Earnings: Kshs. {broker_balance.expected_monthly_earnings}")

    print("Broker earnings calculated successfully.")


@shared_task
def check_and_update_overdue_payments():
    """
    Checks for ExpectedPayments with status 'pending' and due date that has passed.
    Updates their status to 'overdue' if not marked as 'paid'.
    This task should run on the 6th of each month, at the start of the day.
    """
    print("Checking for overdue expected payments...")

    # Get the current date and check if it is after the 5th of the month.
    current_date = timezone.now()

    if current_date.day == 6:
        # Query for expected payments with status 'pending' and due_date in the past
        overdue_payments = ExpectedPayment.objects.filter(
            status='pending',
            due_date__lt=current_date,
        )

        if overdue_payments.exists():
            for payment in overdue_payments:
                # Check if the payment status is still 'pending' and change it to 'overdue'
                if payment.status == 'pending':
                    payment.status = 'overdue'
                    payment.save()

                    print(f"Updated payment status to 'overdue' for {payment.maintenance_company.company_name} - Kshs. {payment.total_amount}")

        else:
            print("No overdue payments found.")

    else:
        print("Today is not the 6th. Skipping overdue payments check.")

    print("Overdue payments check completed.")


