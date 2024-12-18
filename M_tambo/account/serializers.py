from rest_framework import serializers
from .models import User, Developer, Maintenance, Technician


# User Serializer for account creation and validation
class UserSerializer(serializers.ModelSerializer):
    specialization = serializers.CharField(required=False)  # Optional for maintenance users and technicians
    maintenance_company_id = serializers.IntegerField(write_only=True, required=False)  # Added for technician users

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number', 'password', 
            'account_type', 'specialization', 'maintenance_company_id'
        ]
        extra_kwargs = {'password': {'write_only': True}}  # Ensure password is not included in responses

    def validate(self, data):
        account_type = data.get("account_type")

        # Validate required fields for each account type
        if account_type == 'maintenance':
            required_fields = [
                'first_name', 'last_name', 'email', 'phone_number', 'password',
                'company_name', 'company_address', 'company_registration_number', 'specialization'
            ]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                raise serializers.ValidationError(
                    f"Missing required fields for maintenance account: {missing_fields}"
                )

        elif account_type == 'technician':
            required_fields = [
                'first_name', 'last_name', 'email', 'phone_number', 'password',
                'specialization', 'maintenance_company_id'
            ]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                raise serializers.ValidationError(
                    f"Missing required fields for technician account: {missing_fields}"
                )

        elif account_type == 'developer':
            required_fields = [
                'first_name', 'last_name', 'email', 'phone_number', 'password',
                'developer_name', 'address'
            ]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                raise serializers.ValidationError(
                    f"Missing required fields for developer account: {missing_fields}"
                )

        return data

class UserSerializer(serializers.ModelSerializer):
    specialization = serializers.CharField(required=False)  # Optional for maintenance users and technicians
    maintenance_company_id = serializers.IntegerField(write_only=True, required=False)  # Added for technician users

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'password', 'account_type', 'specialization', 'maintenance_company_id']
        extra_kwargs = {'password': {'write_only': True}}  # Ensure password is not included in responses

    def validate(self, data):
        account_type = data.get("account_type")
    
    # Validate required fields for each account type
        if account_type == 'maintenance':
            required_fields = ['first_name', 'last_name', 'email', 'phone_number', 'password', 
                               'company_name', 'company_address', 'company_registration_number', 'specialization']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                raise serializers.ValidationError(f"Missing required fields for maintenance account: {missing_fields}")
    
        elif account_type == 'technician':
            required_fields = ['first_name', 'last_name', 'email', 'phone_number', 'password', 
                               'specialization', 'maintenance_company_id']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                raise serializers.ValidationError(f"Missing required fields for technician account: {missing_fields}")
    
        elif account_type == 'developer':
            required_fields = ['first_name', 'last_name', 'email', 'phone_number', 'password', 
                               'developer_name', 'address']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                raise serializers.ValidationError(f"Missing required fields for developer account: {missing_fields}")
    

        return data


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
