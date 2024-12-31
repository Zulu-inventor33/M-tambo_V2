from rest_framework import serializers
from .models import Elevator
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