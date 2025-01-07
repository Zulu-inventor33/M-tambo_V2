from rest_framework import serializers
from account.models import Maintenance, Technician
from .models import MaintenanceCompanyProfile
from technicians.models import TechnicianProfile

class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = ['id', 'company_name', 'company_address', 'company_registration_number', 'specialization']

class MaintenanceCompanyProfileSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='maintenance.company_name')
    company_address = serializers.CharField(source='maintenance.company_address')
    company_registration_number = serializers.CharField(source='maintenance.company_registration_number')
    specialization = serializers.CharField(source='maintenance.specialization')

    class Meta:
        model = MaintenanceCompanyProfile
        fields = ['id', 'company_name', 'company_address', 'company_registration_number', 'specialization']

#class AddTechnicianSerializer(serializers.Serializer):
    #technician_id = serializers.UUIDField()

#class AddTechnicianToCompanyView(APIView):
    #serializer_class = AddTechnicianSerializer

    #def post(self, request, company_id):

