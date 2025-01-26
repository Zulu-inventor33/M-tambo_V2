from django.db import models
from maintenance_companies.models import MaintenanceCompanyProfile
from developers.models import DeveloperProfile
from technicians.models import TechnicianProfile
from buildings.models import Building
from account.models import Maintenance,Developer,Technician

class Elevator(models.Model):
    user_name = models.CharField(
        max_length=100, 
        unique=False, 
        help_text="Identifier for the elevator (e.g., LIFT1, LIFT2)."
    )
    controller_type = models.CharField(
        max_length=100, 
        blank=True,
        help_text="Specify the type of controller (e.g., Digital, Analog, etc.)."
    )
    machine_type = models.CharField(
        max_length=100, 
        choices=[('gearless', 'Gearless'), ('geared', 'Geared')], 
        default='gearless',
        help_text="Type of the elevator machine (e.g., Gearless, Geared)."
    )

    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name="elevators")
    machine_number = models.CharField(max_length=100,unique=True)
    capacity = models.PositiveIntegerField(help_text="Maximum weight capacity in kilograms.")
    manufacturer = models.CharField(max_length=255)
    installation_date = models.DateField()

    # Maintenance Company Profile (One-to-One Relationship)
    maintenance_company = models.ForeignKey(Maintenance, on_delete=models.SET_NULL, null=True, blank=True, related_name="elevators")

    # Developer Profile (One-to-One Relationship)
    developer = models.ForeignKey(Developer, on_delete=models.SET_NULL, null=True, blank=True, related_name="elevators")

    # Technician Profile (One-to-One Relationship)
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name="elevators")

    def __str__(self):
        return f"{self.machine_number} - {self.user_name} - {self.building.name}"


class ElevatorIssueLog(models.Model):
    elevator = models.ForeignKey(Elevator, on_delete=models.CASCADE, related_name="issue_logs")
    developer = models.ForeignKey(Developer, on_delete=models.SET_NULL, null=True, blank=True, related_name="reported_issues")
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name="elevator_issue_logs")
    reported_date = models.DateTimeField(auto_now_add=True, help_text="The date and time when the issue was reported.")
    issue_description = models.TextField(help_text="A detailed description of the elevator issue reported by the developer.")

    def __str__(self):
        return f"Issue reported for Elevator: {self.elevator.user_name} in Building: {self.building.name} on {self.reported_date.strftime('%Y-%m-%d %H:%M:%S')}"

    class Meta:
        verbose_name = "Elevator Issue Log"
        verbose_name_plural = "Elevator Issue Logs"
        ordering = ['-reported_date']
