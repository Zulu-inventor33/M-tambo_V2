from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from uuid import uuid4
from maintenance_companies.models import MaintenanceCompanyProfile
from account.models import Maintenance, User

class MaintenanceCompanyDetailViewTest(APITestCase):
    def setUp(self):
        # Create a User object with the required fields
        user = User.objects.create_user(
            email='test@example.com',  # Use email as the unique identifier
            password='testpassword',  # Password for the user
            phone_number='1234567890',  # Phone number is required
            first_name='John',  # First name is required
            last_name='Doe'  # Last name is required
        )
        
        # Create a Maintenance object with valid fields
        maintenance = Maintenance.objects.create(
            user=user,
            company_name="Test Company",
            company_address="123 Test Address",
            company_registration_number="1234567890",
            specialization="Plumbing"
        )
        
        # Now create the MaintenanceCompanyProfile linked to the Maintenance object
        self.valid_company = MaintenanceCompanyProfile.objects.create(
            maintenance=maintenance  # Link the profile to the created maintenance object
        )
        
        self.valid_uuid = self.valid_company.id  # Get the UUID of the created company profile
        self.nonexistent_uuid = uuid4()  # A UUID that doesn't exist

    def test_retrieve_with_valid_uuid(self):
        # Test retrieving a company profile with a valid UUID
        response = self.client.get(reverse('maintenance-company-detail', kwargs={'uuid_id': self.valid_uuid}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_with_nonexistent_uuid(self):
        # Test retrieving a company profile with a nonexistent UUID
        response = self.client.get(reverse('maintenance-company-detail', kwargs={'uuid_id': self.nonexistent_uuid}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

