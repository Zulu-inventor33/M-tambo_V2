from rest_framework import serializers
from account.models import Technician  # Assuming 'Technician' model is in 'account' app

# Serializer for listing all technicians (name, specialization, and company)
class TechnicianListSerializer(serializers.ModelSerializer):
    # Combine first_name and last_name to create the full name of the technician
    technician_name = serializers.SerializerMethodField()

    def get_technician_name(self, obj):
        # Combine first name and last name from the related user model
        return f"{obj.user.first_name} {obj.user.last_name}"
    specialization = serializers.CharField()
    maintenance_company = serializers.CharField(source='maintenance_company.company_name',allow_null=True, required=False)  # Assuming maintenance_company has 'company_name'

    class Meta:
        model = Technician
        fields = ['id', 'technician_name', 'specialization', 'maintenance_company']

# Serializer for listing technicians by specialization
class TechnicianSpecializationSerializer(serializers.ModelSerializer):
    # Concatenate first_name and last_name to create the full name
    technician_name = serializers.SerializerMethodField()

    def get_technician_name(self, obj):
        # Combine first name and last name from the related user model
        return f"{obj.user.first_name} {obj.user.last_name}"

    # Get the company name from the related maintenance_company model
    maintenance_company_name = serializers.CharField(source='maintenance_company.company_name',allow_null=True, required=False)

    class Meta:
        model = Technician
        fields = ['id', 'technician_name', 'maintenance_company_name']

# Serializer for technician detailed view
class TechnicianDetailSerializer(serializers.ModelSerializer):
    # Concatenate first_name and last_name to create the full name
    technician_name = serializers.SerializerMethodField()

    def get_technician_name(self, obj):
        # Combine first name and last name from the related user model
        return f"{obj.user.first_name} {obj.user.last_name}"

    # Reference maintenance company name
    maintenance_company_name = serializers.CharField(source='maintenance_company.company_name',allow_null=True, required=False)

    # Correctly access user fields using the 'source' argument
    email = serializers.EmailField(source='user.email')
    phone_number = serializers.CharField(source='user.phone_number')

    class Meta:
        model = Technician
        fields = ['id', 'technician_name', 'specialization', 'maintenance_company_name', 'email', 'phone_number']
