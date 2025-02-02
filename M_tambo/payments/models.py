from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from maintenance_companies.models import MaintenanceCompanyProfile
from django.core.validators import MinValueValidator, MaxValueValidator
from brokers.models import BrokerUser
from elevators.models import Elevator  # Assuming Elevator model exists

class PaymentPlan(models.Model):
    """
    Defines the payment plan for maintenance companies.
    """
    maintenance_company = models.ForeignKey(MaintenanceCompanyProfile, on_delete=models.CASCADE, related_name="payment_plans")
    amount_per_asset = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=700.00,
        validators=[MinValueValidator(0)],
        help_text="Amount charged per elevator per month (default is Kshs. 700)."
    )
    start_date = models.DateTimeField(default=timezone.now, help_text="Start date of the payment plan.")
    end_date = models.DateTimeField(null=True, blank=True, help_text="End date of the payment plan (if applicable).")

    def __str__(self):
        return f"Payment Plan for {self.maintenance_company.company_name} - Kshs. {self.amount_per_asset} per elevator/month"


class ExpectedPayment(models.Model):
    """
    Tracks expected payments by maintenance companies.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),  # Payment is expected but not yet paid
        ('paid', 'Paid'),        # Payment has been made
        ('overdue', 'Overdue'),  # Payment was not made by the due date
    ]

    maintenance_company = models.ForeignKey(MaintenanceCompanyProfile, on_delete=models.CASCADE, related_name="expected_payments")
    assets = models.ManyToManyField(Elevator, related_name="expected_payments", help_text="List of assets (elevators) being charged.")
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Total amount due for the month."
    )
    calculation_date = models.DateTimeField(default=timezone.now, help_text="Date when the expected payment was calculated (25th of the month).")
    due_date = models.DateTimeField(help_text="Date by which the payment is due (5th of the next month).")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', help_text="Payment status (pending, paid, overdue).")
    payment_date = models.DateTimeField(null=True, blank=True, help_text="Date when the payment was made (if paid).")

    def __str__(self):
        return f"Expected Payment for {self.maintenance_company.company_name} - Kshs. {self.total_amount} (Status: {self.get_status_display()})"

    def save(self, *args, **kwargs):
        """
        Override save method to set the due date and calculate the total amount.
        """
        if not self.pk:  # Only set calculation_date and due_date for new instances
            # Set calculation_date to the 25th of the current month
            self.calculation_date = timezone.now().replace(day=25, hour=0, minute=0, second=0, microsecond=0)

            # Set due_date to the 5th of the next month
            next_month = self.calculation_date.replace(day=28) + timezone.timedelta(days=4)  # Move to next month
            self.due_date = next_month.replace(day=5, hour=23, minute=59, second=59)

            # Calculate total_amount based on the number of assets and the amount_per_asset
            payment_plan = self.maintenance_company.payment_plans.first()  # Get the latest payment plan
            if payment_plan:
                self.total_amount = payment_plan.amount_per_asset * self.assets.count()
            else:
                self.total_amount = 700.00 * self.assets.count()  # Default amount per asset

        super().save(*args, **kwargs)

    def update_status(self):
        """
        Update the payment status based on the due date and payment_date.
        """
        if self.payment_date:
            self.status = 'paid'
        elif timezone.now() > self.due_date:
            self.status = 'overdue'
        else:
            self.status = 'pending'
        self.save()

    class Meta:
        verbose_name = "Expected Payment"
        verbose_name_plural = "Expected Payments"
        ordering = ['-calculation_date']


class Payment(models.Model):
    """
    Tracks payments made by maintenance companies.
    """
    maintenance_company = models.ForeignKey(MaintenanceCompanyProfile, on_delete=models.CASCADE, related_name="payments")
    expected_payment = models.ForeignKey(ExpectedPayment, on_delete=models.CASCADE, related_name="payments", null=True, blank=True)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Total amount paid."
    )
    payment_date = models.DateTimeField(default=timezone.now, help_text="Date and time when the payment was made.")
    transaction_id = models.CharField(max_length=100, unique=True, help_text="Transaction ID from the payment gateway (e.g., M-PESA).")
    payment_method = models.CharField(
        max_length=50,
        choices=[('mpesa', 'M-PESA'), ('bank', 'Bank Transfer'), ('other', 'Other')],
        default='mpesa',
        help_text="Method used for the payment."
    )
    is_successful = models.BooleanField(default=True, help_text="Whether the payment was successful.")

    def __str__(self):
        return f"Payment of Kshs. {self.amount} by {self.maintenance_company.company_name} on {self.payment_date.strftime('%Y-%m-%d')}"

    class Meta:
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        ordering = ['-payment_date']


class RevenueSplit(models.Model):
    """
    Tracks how payments are split between the company, the broker, and the platform.
    """
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name="revenue_splits")
    total_revenue = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Total revenue from the payment."
    )
    broker_commission = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Amount paid to the broker as commission."
    )
    company_earnings = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Amount retained by the platform as earnings."
    )
    split_date = models.DateTimeField(default=timezone.now, help_text="Date and time when the revenue was split.")

    def __str__(self):
        return f"Revenue Split for Payment ID: {self.payment.id} | Total: Kshs. {self.total_revenue}"

    class Meta:
        verbose_name = "Revenue Split"
        verbose_name_plural = "Revenue Splits"
        ordering = ['-split_date']


class BrokerBalance(models.Model):
    """
    Tracks the financial balances for brokers.
    """
    broker = models.ForeignKey(BrokerUser, on_delete=models.CASCADE, related_name="balances")
    total_earnings = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        help_text="Total earnings over time."
    )
    expected_monthly_earnings = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        help_text="Expected earnings for the current month."
    )
    withdrawable_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        help_text="Amount available for withdrawal."
    )
    last_updated = models.DateTimeField(default=timezone.now, help_text="Date and time when the balance was last updated.")

    def __str__(self):
        return f"Balance for Broker: {self.broker.email} | Withdrawable: Kshs. {self.withdrawable_amount}"

    class Meta:
        verbose_name = "Broker Balance"
        verbose_name_plural = "Broker Balances"
        ordering = ['-last_updated']


class WithdrawalRequest(models.Model):
    """
    Tracks withdrawal requests made by brokers.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    broker = models.ForeignKey(BrokerUser, on_delete=models.CASCADE, related_name="withdrawal_requests")
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Amount requested for withdrawal."
    )
    request_date = models.DateTimeField(default=timezone.now, help_text="Date and time when the request was made.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', help_text="Status of the withdrawal request.")

    def __str__(self):
        return f"Withdrawal Request by {self.broker.email} for Kshs. {self.amount}"

    class Meta:
        verbose_name = "Withdrawal Request"
        verbose_name_plural = "Withdrawal Requests"
        ordering = ['-request_date']


class PaymentSettings(models.Model):
    """
    Model to store system-wide payment settings.
    """
    min_charge_per_elevator = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Default minimum charge per elevator per month."
    )
    default_commission = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Default commission percentage for brokers (e.g., 12.5%)."
    )
    default_commission_duration = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Default duration (in months) for which brokers earn commissions (e.g., 24 months)."
    )
    default_calculation_date = models.PositiveIntegerField(
        default=20,
        validators=[MinValueValidator(1), MaxValueValidator(31)],
        help_text="Default day of the month for calculating expected payments (e.g., 25th)."
    )
    default_due_date = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(31)],
        help_text="Default day of the month for payment due dates (e.g., 5th)."
    )

    def __str__(self):
        return (
            f"Payment Settings | "
            f"Min Charge: Kshs. {self.min_charge_per_elevator}, "
            f"Commission: {self.default_commission}%, "
            f"Commission Duration: {self.default_commission_duration} months, "
            f"Calculation Date: {self.default_calculation_date}, "
            f"Due Date: {self.default_due_date}"
        )

    class Meta:
        verbose_name = "Payment Settings"
        verbose_name_plural = "Payment Settings"