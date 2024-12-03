from rest_framework import serializers
from .models import User, Developer, Maintenance, Technician


# User Serializer for account creation and validation
class UserSerializer(serializers.ModelSerializer):
    specialization = serializers.CharField(required=False)  # Optional field for maintenance users and technicians

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'password', 'account_type', 'specialization']
        extra_kwargs = {'password': {'write_only': True}}  # Ensure password is not included in responses

    def validate(self, data):
        # You can add any extra validation here if needed
        return data

    def create(self, validated_data):
        # Extract specialization name if it's provided
        specialization_name = validated_data.pop('specialization', None)
        
        # Create the user object (password will be hashed)
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password

        # Handle the creation of associated profiles based on account type
        if user.account_type == 'maintenance':
            Maintenance.objects.create(user=user, specialization=specialization_name)
        elif user.account_type == 'technician':
            Technician.objects.create(user=user, specialization=specialization_name)

        # Save the user object
        user.save()
        return user


# Developer Profile Serializer
class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ['developer_name', 'address']


# Maintenance Profile Serializer
class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = ['company_name', 'company_address', 'company_registration_number', 'specialization', 'user']

    def update(self, instance, validated_data):
        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.company_address = validated_data.get('company_address', instance.company_address)
        instance.company_registration_number = validated_data.get('company_registration_number', instance.company_registration_number)
        instance.specialization = validated_data.get('specialization', instance.specialization)
        instance.save()
        return instance


# Technician Profile Serializer
class TechnicianSerializer(serializers.ModelSerializer):
    maintenance_company_id = serializers.IntegerField(write_only=True)  # Accept only the ID

    class Meta:
        model = Technician
        fields = ['user', 'specialization', 'maintenance_company_id']

    def create(self, validated_data):
        maintenance_company_id = validated_data.pop('maintenance_company_id')
        maintenance_company = Maintenance.objects.get(id=maintenance_company_id)
        technician = Technician.objects.create(
            maintenance_company=maintenance_company, **validated_data
        )
        return technician


# Login Serializer (For login purposes)
class LoginSerializer(serializers.Serializer):
    email_or_phone = serializers.CharField()  # Allow email or phone number as login identifier
    password = serializers.CharField()


# Maintenance List Serializer (For listing maintenance companies)
class MaintenanceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = ['id', 'company_name']
