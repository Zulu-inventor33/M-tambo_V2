from django.db import models
from account.models import Technician, Maintenance
from elevators.models import Elevator
from django.utils import timezone
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
        # Call the utility function to handle status update and potentially create a new schedule
        update_schedule_status_and_create_new_schedule(self)
        
        # Save the instance after logic has been applied
        super().save(*args, **kwargs)

    def get_next_scheduled_date(self, current_date, months_to_add):
        """
        Helper method to calculate the next scheduled date based on the current date
        and months to add.
        """
        return current_date + relativedelta(months=+months_to_add)


# Represents a log of a maintenance activity done on an elevator
class MaintenanceLog(models.Model):
    elevator = models.ForeignKey(Elevator, on_delete=models.CASCADE, related_name="maintenance_logs")
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, related_name="maintenance_logs")
    maintenance_company = models.ForeignKey(Maintenance, on_delete=models.CASCADE, related_name="maintenance_logs")
    maintenance_date = models.DateTimeField(default=timezone.now)
    work_done = models.TextField(help_text="Details of the maintenance performed.")
    parts_used = models.TextField(help_text="Parts replaced or repaired.")
    maintenance_type = models.CharField(max_length=50, choices=[('repair', 'Repair'), ('inspection', 'Inspection'), ('upgrade', 'Upgrade')])

    def __str__(self):
        return f"Maintenance Log for {self.elevator} on {self.maintenance_date}"


# Represents an ad-hoc maintenance task created by the maintenance company
class AdHocMaintenanceTask(models.Model):
    description = models.TextField()
    created_by = models.ForeignKey(Maintenance, on_delete=models.CASCADE, related_name="adhoc_tasks")
    assigned_to = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, related_name="adhoc_tasks")
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_date = models.DateTimeField()
    completed = models.BooleanField(default=False)
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Ad-Hoc Task for {self.assigned_to} - {self.description}"


# Represents a maintenance check item in a checklist during maintenance
class MaintenanceCheck(models.Model):
    maintenance_schedule = models.ForeignKey(MaintenanceSchedule, on_delete=models.CASCADE, related_name='checks')
    task_description = models.CharField(max_length=255)
    passed = models.BooleanField(default=False)
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Task: {self.task_description} for {self.maintenance_schedule.elevator}"


