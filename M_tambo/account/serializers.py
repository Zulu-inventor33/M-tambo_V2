from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User, Developer, Maintenance, Technician


# User Serializer for account creation and validation
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email', 'phone_number', 'first_name', 'last_name', 'password', 'account_type']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Extract profile-specific data
        account_type = validated_data.pop('account_type')
        
        # Create the user first
        user = get_user_model().objects.create_user(
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            account_type=account_type
        )

        # Create the corresponding profile based on account type
        if account_type == 'developer':
            Developer.objects.create(
                user=user,
                developer_name=self.initial_data.get('developer_name'),
                address=self.initial_data.get('address')
            )
        elif account_type == 'maintenance':
            Maintenance.objects.create(
                user=user,
                company_name=self.initial_data.get('company_name'),
                company_address=self.initial_data.get('company_address'),
                company_registration_number=self.initial_data.get('company_registration_number')
            )
        elif account_type == 'technician':
            Technician.objects.create(
                user=user,
                specialization=self.initial_data.get('specialization'),
                maintenance_company_id=self.initial_data.get('maintenance_company_id')
            )

        return user

class TechnicianSerializer(serializers.ModelSerializer):
    maintenance_company_id = serializers.IntegerField(write_only=True)  # Accept the ID for linking to Maintenance

    class Meta:
        model = Technician
        fields = ['user', 'specialization', 'maintenance_company_id']

    def create(self, validated_data):
        maintenance_company_id = validated_data.pop('maintenance_company_id', None)

        if not maintenance_company_id:
            raise serializers.ValidationError("Maintenance company ID is required.")
        
        # Retrieve the maintenance company using the ID
        try:
            maintenance_company = Maintenance.objects.get(id=maintenance_company_id)
        except Maintenance.DoesNotExist:
            raise serializers.ValidationError("Maintenance company with the given ID does not exist.")
        
        # Create Technician instance and link it to the Maintenance company
        technician = Technician.objects.create(
            maintenance_company=maintenance_company, **validated_data
        )
        return technician

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

class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ['developer_name', 'address']

    def update(self, instance, validated_data):
        instance.developer_name = validated_data.get('developer_name', instance.developer_name)
        instance.address = validated_data.get('address', instance.address)
        instance.save()
        return instance


# Login Serializer (For login purposes)
class LoginSerializer(serializers.Serializer):
    email_or_phone = serializers.CharField()  # Allow email or phone number as login identifier
    password = serializers.CharField()


# Maintenance List Serializer (For listing maintenance companies)
class MaintenanceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = ['id', 'company_name']
