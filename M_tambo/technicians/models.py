from django.db import models
from account.models import Technician

class TechnicianProfile(models.Model):
    technician = models.OneToOneField(Technician, on_delete=models.CASCADE, related_name='technician_profile')
    # Add more fields specific to technician profile

    def __str__(self):
        return f"{self.technician.user.first_name} {self.technician.user.last_name}"

