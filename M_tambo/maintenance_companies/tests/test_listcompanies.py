from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from account.models import User, Maintenance
from maintenance_companies.models import MaintenanceCompanyProfile
import uuid

class MaintenanceCompanyListTests(APITestCase):
    def setUp(self):
        """Set up test data."""
        # Create test users
        self.user1 = User.objects.create_user(
            email='test1@example.com',
            password='testpass123',
            phone_number='+1234567890'
        )
        
        self.user2 = User.objects.create_user(
            email='test2@example.com',
            password='testpass123',
            phone_number='+0987654321'
        )
        
        # Create test maintenance companies with different users
        self.maintenance1 = Maintenance.objects.create(
            user=self.user1,
            company_name='Test Company 1'
        )
        
        self.maintenance2 = Maintenance.objects.create(
            user=self.user2,
            company_name='Test Company 2'
        )
        
        # Create company profiles
        self.profile1 = MaintenanceCompanyProfile.objects.create(
            maintenance=self.maintenance1
        )
        
        self.profile2 = MaintenanceCompanyProfile.objects.create(
            maintenance=self.maintenance2
        )

    def test_list_maintenance_companies(self):
        """Test retrieving a list of maintenance companies."""
        url = reverse('maintenance_company_list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        company_names = {company['company_name'] for company in response.data}
        self.assertEqual(company_names, {'Test Company 1', 'Test Company 2'})

    def test_maintenance_company_list_url(self):
        """Test the URL configuration for maintenance company list."""
        url = reverse('maintenance_company_list')
        self.assertEqual(url, '/maintenance_companies/')  # Updated to match actual URL

    def test_maintenance_company_count(self):
        """Test the total count of maintenance companies."""
        self.assertEqual(Maintenance.objects.count(), 2)
        self.assertEqual(MaintenanceCompanyProfile.objects.count(), 2)

    def test_maintenance_company_profile_relationship(self):
        """Test the relationship between Maintenance and MaintenanceCompanyProfile."""
        profile = MaintenanceCompanyProfile.objects.get(maintenance=self.maintenance1)
        self.assertEqual(str(profile), 'Test Company 1')
        self.assertEqual(profile.maintenance.company_name, 'Test Company 1')

class MaintenanceCompanyModelTests(TestCase):
    def setUp(self):
        """Set up test data for model testing."""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            phone_number='+1234567890'
        )
        
        self.maintenance = Maintenance.objects.create(
            user=self.user,
            company_name='Test Company'
        )

    def test_maintenance_company_profile_creation(self):
        """Test creating a maintenance company profile."""
        profile = MaintenanceCompanyProfile.objects.create(
            maintenance=self.maintenance
        )
        self.assertIsInstance(profile.id, uuid.UUID)
        self.assertEqual(str(profile), 'Test Company')

    def test_maintenance_company_profile_deletion(self):
        """Test cascade deletion when maintenance company is deleted."""
        profile = MaintenanceCompanyProfile.objects.create(
            maintenance=self.maintenance
        )
        profile_id = profile.id
        self.maintenance.delete()
        
        with self.assertRaises(MaintenanceCompanyProfile.DoesNotExist):
            MaintenanceCompanyProfile.objects.get(id=profile_id)
