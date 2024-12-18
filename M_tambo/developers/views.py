from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework import status
from .models import Developer
from .serializers import DeveloperListSerializer, DeveloperDetailSerializer

# View to list all developers
class DeveloperListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DeveloperListSerializer

    def get_queryset(self):
        return Developer.objects.all()

# View to get developer details by ID
class DeveloperDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = DeveloperDetailSerializer
    lookup_field = 'id'  # Assumes 'id' is the field you use to identify the developer

    def get_queryset(self):
        return Developer.objects.all()

    def get_object(self):
        try:
            return Developer.objects.get(id=self.kwargs['developer_id'])
        except Developer.DoesNotExist:
            raise NotFound(detail="Developer not found", code=404)

# View to get developer details by email
class DeveloperDetailByEmailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]  # Modify this as per your permissions
    serializer_class = DeveloperDetailSerializer
    lookup_field = 'user__email'  # Use the email field of the related User model

    def get_queryset(self):
        return Developer.objects.all()

    def get_object(self):
        try:
            # Retrieve the developer by email via the related User model
            return Developer.objects.get(user__email=self.kwargs['developer_email'])
        except Developer.DoesNotExist:
            raise NotFound(detail="Developer with this email not found.", code=404)
