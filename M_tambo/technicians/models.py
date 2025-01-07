from django.db import models
import uuid
from account.models import Technician

class TechnicianProfile(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    technician = models.OneToOneField(
        Technician, 
        on_delete=models.CASCADE, 
        related_name='technician_profile'
    )
    created_at = models.DateTimeField(auto_now_add=True)  # Default removed
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.technician.user.first_name} {self.technician.user.last_name}"

    class Meta:
        ordering = ['-created_at']

