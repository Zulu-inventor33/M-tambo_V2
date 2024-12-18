from rest_framework import serializers
from buildings.models import Building
from .models import Developer

class DeveloperListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ['id', 'developer_name', 'address']

class DeveloperDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = '__all__'
