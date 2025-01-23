from rest_framework import serializers
from .models import Elevator, ElevatorIssueLog
from buildings.models import Building

class ElevatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Elevator
        fields = [
            'id', 'user_name', 'controller_type', 'machine_type', 'building', 'machine_number', 
            'capacity', 'manufacturer', 'installation_date', 'maintenance_company', 
            'developer', 'technician'
        ]

    def validate_machine_number(self, value):
        # Get the elevator instance (if it's an update operation)
        elevator_instance = self.instance

        # Check if the model_number is unique across all elevators, excluding the current elevator's machine_number
        if elevator_instance and elevator_instance.machine_number != value:
            if Elevator.objects.filter(machine_number=value).exists():
                raise serializers.ValidationError("An elevator with this model number already exists.")
        
        return value

    def validate_user_name(self, value):
        building = self.initial_data.get('building')  # Get building ID from input data
        if building:
            # Check if the username already exists within the same building
            if Elevator.objects.filter(user_name=value, building=building).exists():
                raise serializers.ValidationError(f"A user name '{value}' already exists in this building.")
        return value
    

class ElevatorIssueLogSerializer(serializers.ModelSerializer):
    building_name = serializers.CharField(source='building.name', read_only=True)
    elevator_username = serializers.CharField(source='elevator.user_name', read_only=True)
    elevator_machine_number = serializers.CharField(source='elevator.machine_number', read_only=True)
    issue_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = ElevatorIssueLog
        fields = ['issue_id', 'elevator', 'developer', 'building', 'reported_date', 'issue_description', 'building_name', 'elevator_username', 'elevator_machine_number']

    def create(self, validated_data):
        # Automatically fill elevator, developer, and building from the elevator instance
        elevator = validated_data['elevator']
        developer = elevator.developer  # Assuming the elevator has a linked developer
        building = elevator.building  # Assuming the elevator is linked to a building

        issue_log = ElevatorIssueLog.objects.create(
            elevator=elevator,
            developer=developer,
            building=building,
            issue_description=validated_data['issue_description']
        )
        return issue_log