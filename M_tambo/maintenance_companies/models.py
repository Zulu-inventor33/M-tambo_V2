import uuid
from django.db import models
from django.conf import settings
from account.models import Maintenance

class MaintenanceCompanyProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # UUID as primary key
    maintenance = models.OneToOneField(Maintenance, on_delete=models.CASCADE, related_name='company_profile')
    # Add more fields specific to maintenance company profile

    def __str__(self):
        return self.maintenance.company_name

