from django.db import models
from account.models import Developer

class Building(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    contact = models.CharField(max_length=255)
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name="buildings")
    developer_name = models.CharField(max_length=255, blank=True, null=True)  # Ensure this is included

    def __str__(self):
        return f"{self.name} - {self.developer_name}"
