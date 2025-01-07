from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from account.models import User, Maintenance
from maintenance_companies.models import MaintenanceCompanyProfile
import uuid

class UpdateMaintenanceCompanyViewTests(APITestCase):
    def setUp(self):
        """
        Set up test data.
        """
        # Create a user for the maintenance company
        self.user = User.objects.create_user(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            password="password123",
            phone_number="1234567890"
        )

        # Create a maintenance company
        self.maintenance = Maintenance.objects.create(
            user=self.user,
            company_name="Test Company",
            company_address="123 Test Street",
            company_registration_number="REG123456",
            specialization="HVAC"
        )

        # Create maintenance company profile
        self.company_profile = MaintenanceCompanyProfile.objects.create(
            maintenance=self.maintenance
        )

        # URL for updating the maintenance company
        self.url = reverse('update-maintenance-company', kwargs={'uuid_id': self.maintenance.id})

        # Valid update data
        self.valid_payload = {
            'company_name': 'Updated Company Name',
            'company_address': 'Updated Address',
            'company_registration_number': 'REG789012',
            'specialization': 'Plumbing'
        }

        self.partial_payload = {
            'company_name': 'Partially Updated Name'
        }

    def test_update_maintenance_company_full(self):
        """
        Test full update of a maintenance company with valid data.
        """
        response = self.client.put(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company_name'], 'Updated Company Name')
        self.assertEqual(response.data['company_address'], 'Updated Address')
        self.assertEqual(response.data['company_registration_number'], 'REG789012')
        self.assertEqual(response.data['specialization'], 'Plumbing')

        # Verify database was updated
        updated_maintenance = Maintenance.objects.get(id=self.maintenance.id)
        self.assertEqual(updated_maintenance.company_name, 'Updated Company Name')

    def test_partial_update_maintenance_company(self):
        """
        Test partial update (PATCH) of a maintenance company.
        """
        response = self.client.patch(self.url, self.partial_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company_name'], 'Partially Updated Name')
        # Other fields should remain unchanged
        self.assertEqual(response.data['company_address'], '123 Test Street')
        self.assertEqual(response.data['specialization'], 'HVAC')

    def test_update_non_existent_company(self):
        """
        Test updating a non-existent maintenance company.
        """
        non_existent_id = uuid.uuid4()
        url = reverse('update-maintenance-company', kwargs={'uuid_id': non_existent_id})
        
        response = self.client.put(url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_with_invalid_uuid(self):
        """
        Test updating with an invalid UUID format.
        """
        # Directly construct the URL instead of using reverse()
        url = '/maintenance_companies/maintenance-companies/invalid-uuid/'
        
        response = self.client.put(url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_with_invalid_data(self):
        """
        Test updating with invalid data.
        """
        invalid_payload = {
            'company_name': '',  # Empty company name should be invalid
            'specialization': 'HVAC'
        }
        
        response = self.client.put(self.url, invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_with_missing_required_fields(self):
        """
        Test updating with missing required fields in PUT request.
        """
        incomplete_payload = {
            'company_name': 'Updated Company Name'
            # Missing other required fields
        }
        
        response = self.client.put(self.url, incomplete_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_specialization_update(self):
        """
        Test updating company specialization.
        """
        payload = {
            'specialization': 'Electrical'
        }
        
        response = self.client.patch(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['specialization'], 'Electrical')

    def test_update_preserves_user_relationship(self):
        """
        Test that updating company details doesn't affect the user relationship.
        """
        response = self.client.put(self.url, self.valid_payload, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_maintenance = Maintenance.objects.get(id=self.maintenance.id)
        self.assertEqual(updated_maintenance.user, self.user)

    def test_update_respects_read_only_fields(self):
        """
        Test that read-only fields (like id) cannot be updated but other fields can be.
        """
        original_id = self.maintenance.id
        new_id = uuid.uuid4()
        
        payload = {
            'id': new_id,
            'company_name': 'Updated Company Name',
            'company_address': 'Updated Address',
            'company_registration_number': 'REG789012',
            'specialization': 'Plumbing'
        }
        
        response = self.client.put(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the ID hasn't changed but other fields were updated
        updated_maintenance = Maintenance.objects.get(id=original_id)
        self.assertEqual(str(updated_maintenance.id), str(original_id))
        self.assertEqual(updated_maintenance.company_name, 'Updated Company Name')

