from rest_framework import serializers
from account.models import Maintenance

class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = ['id', 'company_name', 'company_address', 'company_registration_number', 'specialization']
