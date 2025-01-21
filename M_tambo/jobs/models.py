from django.db import models
from account.models import Technician, Maintenance
from elevators.models import Elevator
from buildings.models import Building
from django.utils import timezone
from django.utils.timezone import now
from .utils import update_schedule_status_and_create_new_schedule  # Import the utility function
from dateutil.relativedelta import relativedelta

class MaintenanceSchedule(models.Model):
    SCHEDULE_CHOICES = [
        ('1_month', '1 Month'),
        ('3_months', '3 Months'),
        ('6_months', '6 Months'),
        ('set_date', 'Set Date'),
    ]
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('overdue', 'Overdue'),
        ('completed', 'Completed')
    ]
    
    elevator = models.ForeignKey(Elevator, on_delete=models.CASCADE, related_name="maintenance_schedules")
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, related_name="maintenance_schedules")
    maintenance_company = models.ForeignKey(Maintenance, on_delete=models.SET_NULL, null=True, related_name="maintenance_schedules")
    scheduled_date = models.DateTimeField()
    next_schedule = models.CharField(max_length=10, choices=SCHEDULE_CHOICES, default='set_date')
    description = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES,
        default='scheduled'
    )

    def __str__(self):
        scheduled_date_str = self.scheduled_date.strftime('%Y-%m-%d %H:%M:%S')
        
        if self.next_schedule != 'set_date':
            months_to_add = 1 if self.next_schedule == '1_month' else 3 if self.next_schedule == '3_months' else 6
            next_due_date = self.get_next_scheduled_date(self.scheduled_date, months_to_add)
            next_due_date_str = next_due_date.strftime('%Y-%m-%d %H:%M:%S')
        else:
            next_due_date_str = 'Not Set'

        technician_name = f"{self.technician.user.first_name} {self.technician.user.last_name}" if self.technician else 'No Technician Assigned'
        maintenance_company_name = self.maintenance_company.company_name if self.maintenance_company else 'No Company Assigned'
        
        return f"Scheduled: {scheduled_date_str} | Maintenance Company: {maintenance_company_name} | Technician: {technician_name} | Next Due: {next_due_date_str} | Status: {self.status}"

    def save(self, *args, **kwargs):
        """
        Override save to handle automatic status update, and schedule generation logic.
        """
        if not self.pk:  # If the object is new (don't trigger status update for new schedules)
            super().save(*args, **kwargs)
            return

        # Avoid recursion by checking if the status has already been updated
        if self.status != 'overdue':  # Ensure we only update if it's not already 'overdue'
            update_schedule_status_and_create_new_schedule(self)

        # Save the instance after the logic has been applied
        super().save(*args, **kwargs)

    def get_next_scheduled_date(self, current_date, months_to_add):
        """
        Helper method to calculate the next scheduled date based on the current date
        and months to add.
        """
        return current_date + relativedelta(months=+months_to_add)

class ElevatorConditionReport(models.Model):
    maintenance_schedule = models.ForeignKey(
        MaintenanceSchedule, 
        on_delete=models.CASCADE, 
        related_name="condition_reports"
    )
    technician = models.ForeignKey(
        Technician, 
        on_delete=models.CASCADE, 
        related_name="condition_reports"
    )
    date_inspected = models.DateTimeField(default=now)

    # Assessment fields
    alarm_bell = models.CharField(max_length=255, blank=True, null=True)
    noise_during_motion = models.CharField(max_length=255, blank=True, null=True)
    cabin_lights = models.CharField(max_length=255, blank=True, null=True)
    position_indicators = models.CharField(max_length=255, blank=True, null=True)
    hall_lantern_indicators = models.CharField(max_length=255, blank=True, null=True)
    cabin_flooring = models.CharField(max_length=255, blank=True, null=True)
    additional_comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Condition Report for Schedule ID: {self.maintenance_schedule.id} | Inspected: {self.date_inspected}"

    class Meta:
        verbose_name = "Elevator Condition Report"
        verbose_name_plural = "Elevator Condition Reports"

class ScheduledMaintenanceLog(models.Model):
    maintenance_schedule = models.ForeignKey(
        MaintenanceSchedule, 
        on_delete=models.CASCADE, 
        related_name="maintenance_logs"
    )
    technician = models.ForeignKey(
        Technician, 
        on_delete=models.CASCADE, 
        related_name="maintenance_logs"
    )
    condition_report = models.OneToOneField(
        ElevatorConditionReport, 
        on_delete=models.CASCADE, 
        related_name="maintenance_log"
    )
    date_completed = models.DateTimeField(default=now)

    # Checklist fields
    check_machine_gear = models.BooleanField(default=False)
    check_machine_brake = models.BooleanField(default=False)
    check_controller_connections = models.BooleanField(default=False)
    blow_dust_from_controller = models.BooleanField(default=False)
    clean_machine_room = models.BooleanField(default=False)
    clean_guide_rails = models.BooleanField(default=False)
    observe_operation = models.BooleanField(default=False)

    # Description and observations
    description = models.TextField(blank=True, null=True)

    # Oversight and approval
    overseen_by = models.CharField(max_length=255, blank=True, null=True)
    approved_by = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Log for Schedule ID: {self.maintenance_schedule.id} | Completed: {self.date_completed}"

    class Meta:
        verbose_name = "Scheduled Maintenance Log"
        verbose_name_plural = "Scheduled Maintenance Logs"


class AdHocMaintenanceSchedule(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('overdue', 'Overdue'),
        ('completed', 'Completed')
    ]

    elevator = models.ForeignKey(Elevator, on_delete=models.CASCADE, related_name="ad_hoc_schedules")
    technician = models.ForeignKey(
        Technician,
        on_delete=models.CASCADE,
        related_name="ad_hoc_schedules"
    )
    maintenance_company = models.ForeignKey(
        Maintenance,
        on_delete=models.CASCADE,
        related_name="ad_hoc_schedules"
    )
    scheduled_date = models.DateTimeField(default=now)
    description = models.TextField(help_text="Briefly describe the purpose of this ad-hoc schedule.")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled'
    )

    def __str__(self):
        return f"Ad-Hoc Schedule | Elevator: {self.elevator.name} | Date: {self.scheduled_date} | Status: {self.status}"

    class Meta:
        verbose_name = "Ad-Hoc Maintenance Schedule"
        verbose_name_plural = "Ad-Hoc Maintenance Schedules"


class AdHocElevatorConditionReport(models.Model):
    ad_hoc_schedule = models.ForeignKey(
        AdHocMaintenanceSchedule,
        on_delete=models.CASCADE,
        related_name="condition_reports"
    )
    technician = models.ForeignKey(
        Technician,
        on_delete=models.CASCADE,
        related_name="ad_hoc_condition_reports"
    )
    date_inspected = models.DateTimeField(default=now)

    # Updated fields for dynamic reporting
    components_checked = models.CharField(
        max_length=255,
        help_text="List of components or parts of the elevator inspected during this visit."
    )
    condition = models.TextField(help_text="Condition of the components checked.")

    def __str__(self):
        return f"Ad-Hoc Condition Report | Schedule ID: {self.ad_hoc_schedule.id} | Inspected: {self.date_inspected}"

    class Meta:
        verbose_name = "Ad-Hoc Elevator Condition Report"
        verbose_name_plural = "Ad-Hoc Elevator Condition Reports"


class AdHocMaintenanceLog(models.Model):
    ad_hoc_schedule = models.ForeignKey(
        AdHocMaintenanceSchedule,
        on_delete=models.CASCADE,
        related_name="maintenance_logs"
    )
    technician = models.ForeignKey(
        Technician,
        on_delete=models.CASCADE,
        related_name="ad_hoc_maintenance_logs"
    )
    condition_report = models.OneToOneField(
        AdHocElevatorConditionReport,
        on_delete=models.CASCADE,
        related_name="ad_hoc_maintenance_log"
    )
    date_completed = models.DateTimeField(default=now)

    # Updated field for task summary
    summary_title = models.CharField(
        max_length=255,
        help_text="Brief summary of the work done during this maintenance."
    )
    description = models.TextField(blank=True, null=True)

    # Oversight and approval
    overseen_by = models.CharField(max_length=255, blank=True, null=True)
    approved_by = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Ad-Hoc Maintenance Log | Schedule ID: {self.ad_hoc_schedule.id} | Completed: {self.date_completed}"

    class Meta:
        verbose_name = "Ad-Hoc Maintenance Log"
        verbose_name_plural = "Ad-Hoc Maintenance Logs"


class BuildingLevelAdhocSchedule(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('overdue', 'Overdue'),
        ('completed', 'Completed')
    ]

    building = models.ForeignKey(
        Building,
        on_delete=models.CASCADE,
        related_name="building_level_adhoc_schedules",
        help_text="The building linked to this ad-hoc schedule."
    )
    technician = models.ForeignKey(
        Technician,
        on_delete=models.CASCADE,
        related_name="building_level_adhoc_schedules",
        help_text="The technician assigned to this ad-hoc schedule."
    )
    maintenance_company = models.ForeignKey(
        Maintenance,
        on_delete=models.CASCADE,
        related_name="building_level_adhoc_schedules",
        help_text="The maintenance company handling this ad-hoc schedule."
    )
    scheduled_date = models.DateTimeField(
        default=now,
        help_text="The date and time when this ad-hoc schedule is planned to occur."
    )
    description = models.TextField(
        help_text="Briefly describe the purpose of this ad-hoc schedule."
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled',
        help_text="The current status of this ad-hoc schedule."
    )

    class Meta:
        ordering = ['-scheduled_date']
        verbose_name = "Building Level Adhoc Schedule"
        verbose_name_plural = "Building Level Adhoc Schedules"

    def __str__(self):
        return f"Adhoc Schedule for Building {self.building.name} (Status: {self.get_status_display()})"



# Represents a maintenance check item in a checklist during maintenance
class MaintenanceCheck(models.Model):
    maintenance_schedule = models.ForeignKey(MaintenanceSchedule, on_delete=models.CASCADE, related_name='checks')
    task_description = models.CharField(max_length=255)
    passed = models.BooleanField(default=False)
    comments = models.TextField(blank=True, null=True)



# Represents an ad-hoc maintenance task created by the maintenance company
class AdHocMaintenanceTask(models.Model):
    description = models.TextField()
    created_by = models.ForeignKey(Maintenance, on_delete=models.CASCADE, related_name="adhoc_tasks")
    assigned_to = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, related_name="adhoc_tasks")
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_date = models.DateTimeField()
    completed = models.BooleanField(default=False)
    comments = models.TextField(blank=True, null=True)