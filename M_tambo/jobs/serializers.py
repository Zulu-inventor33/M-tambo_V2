from rest_framework import serializers
from elevators.models import Elevator
from technicians.models import Technician
from maintenance_companies.models import Maintenance
from .models import MaintenanceSchedule
from rest_framework.exceptions import ValidationError
from .utils import update_schedule_status_and_create_new_schedule

class MaintenanceScheduleSerializer(serializers.ModelSerializer):
    elevator = serializers.PrimaryKeyRelatedField(queryset=Elevator.objects.all())
    technician = serializers.PrimaryKeyRelatedField(queryset=Technician.objects.all(), required=False, allow_null=True)
    maintenance_company = serializers.PrimaryKeyRelatedField(queryset=Maintenance.objects.all(), required=False, allow_null=True)

    class Meta:
        model = MaintenanceSchedule
        fields = ['id', 'elevator', 'technician', 'maintenance_company', 'scheduled_date', 'next_schedule', 'description', 'status']

    def validate(self, data):
        elevator = data.get('elevator')
        technician = data.get('technician')
        maintenance_company = data.get('maintenance_company')

        # If technician is provided, it should belong to the same maintenance company as the elevator
        if technician:
            if technician.maintenance_company != elevator.maintenance_company:
                raise ValidationError("Technician does not belong to the same maintenance company as the elevator.")
        elif not technician:
            # Auto-assign technician if not provided, or leave as NULL
            technician = elevator.technician if elevator.technician else None
            data['technician'] = technician

        # Set the maintenance company from the elevator if not provided
        if not maintenance_company:
            maintenance_company = elevator.maintenance_company
        data['maintenance_company'] = maintenance_company

        return data

    def create(self, validated_data):
        # When creating the schedule, use the validated data directly
        elevator = validated_data['elevator']
        technician = validated_data.get('technician', elevator.technician)  # Use elevator technician if not provided
        maintenance_company = validated_data['maintenance_company']

        schedule = MaintenanceSchedule.objects.create(
            elevator=elevator,
            technician=technician,
            maintenance_company=maintenance_company,
            scheduled_date=validated_data['scheduled_date'],
            next_schedule=validated_data.get('next_schedule', 'set_date'),
            description=validated_data.get('description', ''),
            status=validated_data.get('status', 'scheduled')
        )

        return schedule

    def to_representation(self, instance):
        # Convert related objects to their IDs instead of full objects
        representation = super().to_representation(instance)
        representation['elevator'] = instance.elevator.id
        representation['technician'] = instance.technician.id if instance.technician else None
        representation['maintenance_company'] = instance.maintenance_company.id if instance.maintenance_company else None
        return representation


class MaintenanceScheduleStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=MaintenanceSchedule.STATUS_CHOICES)  # Only allow valid statuses

    class Meta:
        model = MaintenanceSchedule
        fields = ['status']  # Only allow updating the status field

    def update(self, instance, validated_data):
        """
        Updates the status of the maintenance schedule and triggers the creation of a new schedule if required.
        """
        # Update the status first
        instance.status = validated_data.get('status', instance.status)

        # Call the helper function to update the status and possibly create a new schedule
        update_schedule_status_and_create_new_schedule(instance)

        # Save the instance after status update and any necessary schedule creation
        instance.save()

        return instance
    

class FullMaintenanceScheduleSerializer(serializers.ModelSerializer):
    elevator = serializers.PrimaryKeyRelatedField(queryset=Elevator.objects.all())
    building = serializers.SerializerMethodField()
    developer = serializers.SerializerMethodField()

    class Meta:
        model = MaintenanceSchedule
        fields = ['id', 'elevator', 'technician', 'maintenance_company', 'scheduled_date', 'next_schedule', 'description', 'status', 'building', 'developer']

    def get_building(self, obj):
        # Get the building linked to the elevator
        building = obj.elevator.building  # Assuming `Elevator` has a `building` field
        return {'id': building.id, 'name': building.name}  # Customize fields as needed

    def get_developer(self, obj):
        # Get the developer linked to the building
        building = obj.elevator.building
        developer = building.developer  # Assuming `Building` has a `developer` field
        return {'id': developer.id, 'name': developer.developer_name}
