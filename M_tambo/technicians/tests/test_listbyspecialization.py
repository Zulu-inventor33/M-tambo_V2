from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from account.models import Maintenance, Technician
from technicians.models import TechnicianProfile
import uuid

User = get_user_model()

class TechnicianViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create a maintenance company user
        self.company_user = User.objects.create_user(
            email='company@test.com',
            password='testpass123',
            first_name='Company',
            last_name='Test',
            account_type='maintenance',  # Changed from user_type to account_type
            phone_number='+27123456789'
        )
        
        # Create a maintenance company
        self.maintenance_company = Maintenance.objects.create(
            user=self.company_user,
            company_name='Test Company',
            company_address='123 Test St',
            company_registration_number='REG123',
            specialization='Elevator Maintenance'
        )
        
        # Create technician users
        self.tech_user1 = User.objects.create_user(
            email='tech1@test.com',
            password='testpass123',
            first_name='Tech',
            last_name='One',
            account_type='technician',  # Changed from user_type to account_type
            phone_number='+27123456790'
        )
        
        self.tech_user2 = User.objects.create_user(
            email='tech2@test.com',
            password='testpass123',
            first_name='Tech',
            last_name='Two',
            account_type='technician',  # Changed from user_type to account_type
            phone_number='+27123456791'
        )
        
        # Create technicians
        self.technician1 = Technician.objects.create(
            user=self.tech_user1,
            specialization='Elevator Maintenance',
            maintenance_company=self.maintenance_company,
            is_approved=True
        )
        
        self.technician2 = Technician.objects.create(
            user=self.tech_user2,
            specialization='HVAC',
            maintenance_company=self.maintenance_company,
            is_approved=True
        )
        
        # Create technician profiles
        self.tech_profile1 = TechnicianProfile.objects.create(
            technician=self.technician1
        )
        
        self.tech_profile2 = TechnicianProfile.objects.create(
            technician=self.technician2
        )

    def test_list_technicians_by_company(self):
        """Test listing technicians for a specific company"""
        url = reverse('technician-list', kwargs={'company_uuid': self.maintenance_company.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Should return both technicians
        
    def test_list_all_technicians(self):
        """Test listing all technicians"""
        url = reverse('technician-list-all')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_technicians_by_specialization(self):
        """Test listing technicians by specialization"""
        url = reverse('technician_list_by_specialization', 
                     kwargs={'specialization': 'Elevator Maintenance'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Should only return technician1
        self.assertEqual(response.data[0]['specialization'], 'Elevator Maintenance')

    def test_list_technicians_by_nonexistent_specialization(self):
        """Test listing technicians with a specialization that doesn't exist"""
        url = reverse('technician_list_by_specialization', 
                     kwargs={'specialization': 'Nonexistent'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should return empty list

    def test_invalid_company_uuid(self):
        """Test passing an invalid company UUID"""
        url = reverse('technician-list', 
                     kwargs={'company_uuid': uuid.uuid4()})  # Random UUID
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should return empty list

    def test_technician_profile_str_method(self):
        """Test the string representation of TechnicianProfile"""
        expected_str = f"{self.tech_user1.first_name} {self.tech_user1.last_name}"
        self.assertEqual(str(self.tech_profile1), expected_str)

    def test_technician_str_method(self):
        """Test the string representation of Technician"""
        expected_str = (f"{self.tech_user1.first_name} {self.tech_user1.last_name} - "
                       f"{self.maintenance_company}")
        self.assertEqual(str(self.technician1), expected_str)
