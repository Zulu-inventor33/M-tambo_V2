from django.db import models
from technicians.models import TechnicianProfile
from maintenance_companies.models import MaintenanceCompanyProfile
from elevators.models import Elevator
from django.utils import timezone

# Represents a scheduled maintenance task for an elevator
class MaintenanceSchedule(models.Model):
    SCHEDULE_CHOICES = [
        ('1_month', '1 Month'),
        ('3_months', '3 Months'),
        ('6_months', '6 Months'),
        ('set_date', 'Set Date'),
    ]
    
    elevator = models.ForeignKey(Elevator, on_delete=models.CASCADE, related_name="maintenance_schedules")
    technician = models.ForeignKey(TechnicianProfile, on_delete=models.SET_NULL, null=True, related_name="maintenance_schedules")
    company = models.ForeignKey(MaintenanceCompanyProfile, on_delete=models.CASCADE, related_name="maintenance_schedules")
    scheduled_date = models.DateTimeField()
    next_schedule = models.CharField(max_length=10, choices=SCHEDULE_CHOICES, default='set_date')
    description = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=[('pending', 'Pending'), ('overdue', 'Overdue'), ('completed', 'Completed')],
        default='pending'
    )

    def __str__(self):
        return f"Scheduled Maintenance for {self.elevator} on {self.scheduled_date}"

    def save(self, *args, **kwargs):
        # Import Alert model locally to avoid circular import
        from alerts.models import Alert
        # If the maintenance is overdue, update the status
        if self.scheduled_date < timezone.now():
            self.status = 'overdue'
        super().save(*args, **kwargs)

# Represents a log of a maintenance activity done on an elevator
class MaintenanceLog(models.Model):
    elevator = models.ForeignKey(Elevator, on_delete=models.CASCADE, related_name="maintenance_logs")
    technician = models.ForeignKey(TechnicianProfile, on_delete=models.SET_NULL, null=True, related_name="maintenance_logs")
    company = models.ForeignKey(MaintenanceCompanyProfile, on_delete=models.CASCADE, related_name="maintenance_logs")
    maintenance_date = models.DateTimeField(default=timezone.now)
    work_done = models.TextField(help_text="Details of the maintenance performed.")
    parts_used = models.TextField(help_text="Parts replaced or repaired.")
    maintenance_type = models.CharField(max_length=50, choices=[('repair', 'Repair'), ('inspection', 'Inspection'), ('upgrade', 'Upgrade')])

    def __str__(self):
        return f"Maintenance Log for {self.elevator} on {self.maintenance_date}"

# Represents an ad-hoc maintenance task created by the maintenance company
class AdHocMaintenanceTask(models.Model):
    description = models.TextField()
    created_by = models.ForeignKey(MaintenanceCompanyProfile, on_delete=models.CASCADE, related_name="adhoc_tasks")
    assigned_to = models.ForeignKey(TechnicianProfile, on_delete=models.SET_NULL, null=True, related_name="adhoc_tasks")
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
