from rest_framework import serializers
from .models import Building
from account.models import Developer

class BuildingSerializer(serializers.ModelSerializer):
    # Explicitly include developer_name in the request data
    developer = serializers.PrimaryKeyRelatedField(queryset=Developer.objects.all())
    developer_name = serializers.CharField(write_only=True, required=False)  # Only used when creating a building

    class Meta:
        model = Building
        fields = ['id', 'name', 'address', 'contact', 'developer', 'developer_name']

    def create(self, validated_data):
        # If developer_name is not provided in the data, fetch it from the developer
        developer = validated_data.get('developer')
        developer_name = validated_data.get('developer_name') or developer.developer_name

        # Set the developer_name before saving the Building
        validated_data['developer_name'] = developer_name

        # Proceed with the regular create logic
        return super().create(validated_data)

    def to_representation(self, instance):
        # This will include the developer's information when serializing the Building
        data = super().to_representation(instance)
        data['developer'] = {
            'id': instance.developer.id,
            'developer_name': instance.developer.developer_name
        }
        return data

