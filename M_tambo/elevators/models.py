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
<<<<<<< HEAD
    maintenance_company_profile = models.ForeignKey(Maintenance, on_delete=models.SET_NULL, null=True, blank=True, related_name="elevators")

    # Developer Profile (One-to-One Relationship)
    developer_profile = models.ForeignKey(Developer, on_delete=models.SET_NULL, null=True, blank=True, related_name="elevators")

    # Technician Profile (One-to-One Relationship)
    technician_profile = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name="elevators")
=======
    maintenance_company = models.ForeignKey(Maintenance, on_delete=models.SET_NULL, null=True, blank=True, related_name="elevators")

    # Developer Profile (One-to-One Relationship)
    developer = models.ForeignKey(Developer, on_delete=models.SET_NULL, null=True, blank=True, related_name="elevators")

    # Technician Profile (One-to-One Relationship)
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name="elevators")
>>>>>>> 599bc3919ee2d2b1d710c4b3cba10c43d769a0fb

    def __str__(self):
        return f"{self.machine_number} - {self.user_name} - {self.building.name}"



