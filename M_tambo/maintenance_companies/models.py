from django.db import models

from account.models import Maintenance

class MaintenanceCompanyProfile(models.Model):
    maintenance = models.OneToOneField(Maintenance, on_delete=models.CASCADE, related_name='company_profile')
    # Add more fields specific to maintenance company profile

    def __str__(self):
        return self.maintenance.company_name


# Create your models here.
