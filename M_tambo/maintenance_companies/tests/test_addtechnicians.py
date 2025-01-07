from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from uuid import uuid4
from account.models import Maintenance, Technician, User
from maintenance_companies.models import MaintenanceCompanyProfile
from technicians.models import TechnicianProfile

class AddTechnicianToCompanyViewTest(TestCase):
    def setUp(self):
        # Setup users, maintenance companies, and technicians
        self.user = User.objects.create_user(
            email="company@example.com",
            phone_number="1234567890",
            password="password123",
            first_name="Test",
            last_name="User",
            account_type="maintenance"
        )
        self.maintenance_company = Maintenance.objects.create(
            user=self.user,
            company_name="Test Maintenance Company",
            company_address="123 Main Street",
            company_registration_number="ABC123",
            specialization="Elevators"
        )
        self.technician_user = User.objects.create_user(
            email="technician@example.com",
            phone_number="0987654321",
            password="password123",
            first_name="John",
            last_name="Doe",
            account_type="technician"
        )
        self.technician = Technician.objects.create(
            user=self.technician_user,
            specialization="Elevators"
        )
        def test_add_technician_already_linked(self):
            """Test adding a technician who is already linked to another company."""
            # Create another maintenance company
            other_company_user = User.objects.create_user(
                email="other_company@example.com",
                phone_number="1122334455",
                password="password123",
                first_name="Other",
                last_name="Company",
                account_type="maintenance"
            )
            other_company = Maintenance.objects.create(
                user=other_company_user,
                company_name="Other Maintenance Company",
                company_address="456 Elm Street",
                company_registration_number="DEF456",
                specialization="Plumbing"
            )

        # Create MaintenanceCompanyProfile for the other company
            other_company_profile = MaintenanceCompanyProfile.objects.create(
                maintenance=other_company
            )
            # First, assign the technician to the first company via API
            url = reverse('add-technician-to-company', args=[self.company_profile.id])
            first_assignment = self.client.post(url, {
                'technician_id': str(self.technician.id)
            })
            self.assertEqual(first_assignment.status_code, status.HTTP_200_OK)
            # Then attempt to assign the same technician to another company
            url = reverse('add-technician-to-company', args=[other_company_profile.id])
            response = self.client.post(url, {
                'technician_id': str(self.technician.id)
            })
            # Check that the request was rejected
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn('already assigned', response.data['error'])
            # Verify that the technician is still assigned to the first company
            self.technician.refresh_from_db()
            self.assertEqual(self.technician.maintenance_company, self.maintenance_company)    
    def test_technician_not_found(self):
        """Test when the specified technician does not exist."""
        non_existent_technician_id = "123e4567-e89b-12d3-a456-426614174999"
        with self.assertRaises(Technician.DoesNotExist):
            Technician.objects.get(id=non_existent_technician_id)
