from django.db import models
from technicians.models import TechnicianProfile
from maintenance_companies.models import MaintenanceCompanyProfile
from jobs.models import MaintenanceSchedule, AdHocMaintenanceTask
from django.apps import apps

class Alert(models.Model):
    ALERT_CHOICES = [
        ('upcoming', 'Upcoming Maintenance'),
        ('scheduled', 'Maintenance Scheduled'),
        ('adhoc_task', 'Ad-Hoc Task Assigned'),
    ]
    
    alert_type = models.CharField(max_length=20, choices=ALERT_CHOICES)
    technician = models.ForeignKey(TechnicianProfile, on_delete=models.CASCADE, related_name="alerts_received")
    company = models.ForeignKey(MaintenanceCompanyProfile, on_delete=models.CASCADE, related_name="alerts_received", null=True, blank=True)
    maintenance_schedule = models.ForeignKey(MaintenanceSchedule, on_delete=models.CASCADE, related_name="maintenance_schedule_alerts", null=True, blank=True)
    adhoc_task = models.ForeignKey(AdHocMaintenanceTask, on_delete=models.CASCADE, related_name="adhoc_task_alerts", null=True, blank=True)
    alert_message = models.TextField()
    alert_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Alert for {self.technician} - {self.alert_message}"

    def save(self, *args, **kwargs):
        # Avoid circular import using apps.get_model()
        MaintenanceSchedule = apps.get_model('jobs', 'MaintenanceSchedule')
        AdHocMaintenanceTask = apps.get_model('jobs', 'AdHocMaintenanceTask')
        super().save(*args, **kwargs)







