from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, Maintenance, Developer, Technician

# Test for User Sign-Up
class SignUpTests(APITestCase):

    def test_sign_up_maintenance(self):
        url = reverse('signup')  # Ensure this is the correct URL name
        data = {
            'email': 'maintenance@example.com',
            'phone_number': '1234567890',
            'first_name': 'John',
            'last_name': 'Doe',
            'account_type': 'maintenance',
            'company_name': 'ACME Corp',
            'company_address': '123 ACME St',
            'company_registration_number': 'ACME12345',
            'specialization': 'HVAC'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('maintenance_profile', response.data)

    def test_sign_up_invalid_account_type(self):
        url = reverse('signup')
        data = {
            'email': 'user@example.com',
            'phone_number': '0987654321',
            'first_name': 'Jane',
            'last_name': 'Doe',
            'account_type': 'invalid',
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid account type provided.')

    def test_sign_up_missing_fields(self):
        url = reverse('signup')
        data = {
            'email': 'developer@example.com',
            'phone_number': '1234567890',
            'first_name': 'Developer',
            'last_name': 'Test',
            'account_type': 'developer'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('developer_name', response.data)
        self.assertIn('address', response.data)

# Test for User Login
class LoginTests(APITestCase):

    def setUp(self):
        # Creating a sample user
        self.user = User.objects.create_user(
            email='user@example.com',
            phone_number='1234567890',
            password='password123',
            first_name='Test',
            last_name='User'
        )

    def test_login_with_email(self):
        url = reverse('login')  # Ensure this is the correct URL name
        data = {
            'email_or_phone': 'user@example.com',
            'password': 'password123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_with_phone(self):
        url = reverse('login')
        data = {
            'email_or_phone': '1234567890',
            'password': 'password123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        url = reverse('login')
        data = {
            'email_or_phone': 'wrong@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

# Test for Specialization List
class SpecializationListTests(APITestCase):

    def test_specialization_list(self):
        url = reverse('specializations-list')  # Ensure this is the correct URL name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('option1', response.data)
        self.assertIn('option2', response.data)
        self.assertIn('option3', response.data)

# Test for Maintenance List
class MaintenanceListTests(APITestCase):

    def setUp(self):
        # Creating a sample Maintenance company
        self.maintenance = Maintenance.objects.create(
            user=User.objects.create_user(
                email='maintenance@example.com',
                phone_number='1234567890',
                password='password123',
                first_name='John',
                last_name='Doe',
                account_type='maintenance'
            ),
            company_name='ACME Corp',
            company_address='123 ACME St',
            company_registration_number='ACME12345',
            specialization='HVAC'
        )

    def test_maintenance_list_with_specialization(self):
        url = reverse('maintenance-list')  # Ensure this is the correct URL name
        response = self.client.get(url, {'specialization': 'HVAC'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_maintenance_list_without_specialization(self):
        url = reverse('maintenance-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

# Test for Developer Profile Creation
class DeveloperProfileTests(APITestCase):

    def test_create_developer_profile(self):
        url = reverse('signup')
        data = {
            'email': 'developer@example.com',
            'phone_number': '1234567890',
            'first_name': 'John',
            'last_name': 'Doe',
            'account_type': 'developer',
            'developer_name': 'John Dev',
            'address': 'Dev Street, City'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('developer_profile', response.data)

