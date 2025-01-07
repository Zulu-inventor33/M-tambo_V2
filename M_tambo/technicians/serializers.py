from rest_framework import serializers
from account.models import Technician

# Serializer for listing all technicians (name, specialization, and company)
class TechnicianListSerializer(serializers.ModelSerializer):
    technician_name = serializers.SerializerMethodField()
    id = serializers.UUIDField()  # Change from 'uuid' to 'id' as that's your primary key

    def get_technician_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    specialization = serializers.CharField()
    maintenance_company = serializers.CharField(source='maintenance_company.company_name', allow_null=True, required=False)

    class Meta:
        model = Technician
        fields = ['id', 'user', 'technician_name', 'specialization', 'maintenance_company']

# Serializer for listing technicians by specialization
class TechnicianSpecializationSerializer(serializers.ModelSerializer):
    technician_name = serializers.SerializerMethodField()
    id = serializers.UUIDField()  # Change from 'uuid' to 'id'

    def get_technician_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    maintenance_company_name = serializers.CharField(source='maintenance_company.company_name', allow_null=True, required=False)

    class Meta:
        model = Technician
        fields = ['id', 'technician_name', 'maintenance_company_name', 'specialization']

# Serializer for technician detailed view
class TechnicianDetailSerializer(serializers.ModelSerializer):
    technician_name = serializers.SerializerMethodField()
    id = serializers.UUIDField()  # Change from 'uuid' to 'id'

    def get_technician_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    maintenance_company_name = serializers.CharField(source='maintenance_company.company_name', allow_null=True, required=False)
    email = serializers.EmailField(source='user.email')
    phone_number = serializers.CharField(source='user.phone_number')

    class Meta:
        model = Technician
        fields = ['id', 'technician_name', 'specialization', 'maintenance_company_name', 'email', 'phone_number']

