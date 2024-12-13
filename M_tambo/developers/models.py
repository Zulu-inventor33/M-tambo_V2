from django.db import models
from account.models import Developer

class DeveloperProfile(models.Model):
    developer = models.OneToOneField(Developer, on_delete=models.CASCADE, related_name='developer_profile')
    # Add more fields specific to developer profile

    def __str__(self):
        return self.developer.developer_name
