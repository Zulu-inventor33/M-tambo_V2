from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from account.models import User, Maintenance, Technician
import uuid

class UnlinkTechnicianFromCompanyViewTests(APITestCase):
    def setUp(self):
        """
        Set up the test environment by creating necessary data.
        Creates a maintenance company, linked technician, and unlinked technician.
        """
        # Create a maintenance user and company
        self.maintenance_user = User.objects.create_user(
            email="maintenance@example.com",
            phone_number="1234567890",
            password="password123",
            first_name="Maintenance",
            last_name="Manager",
            account_type="maintenance"
        )
        self.maintenance_company = Maintenance.objects.create(
            user=self.maintenance_user,
            company_name="Test Maintenance Co.",
            company_address="123 Test Lane",
            company_registration_number="REG123456",
            specialization="HVAC"
        )

        # Create a linked technician
        self.linked_technician_user = User.objects.create_user(
            email="linkedtech@example.com",
            phone_number="0987654321",
            password="password123",
            first_name="Linked",
            last_name="Technician",
            account_type="technician"
        )
        self.linked_technician = Technician.objects.create(
            user=self.linked_technician_user,
            specialization="HVAC",
            maintenance_company=self.maintenance_company,
            is_approved=True
        )

        # Create an unlinked technician
        self.unlinked_technician_user = User.objects.create_user(
            email="unlinkedtech@example.com",
            phone_number="1122334455",
            password="password123",
            first_name="Unlinked",
            last_name="Technician",
            account_type="technician"
        )
        self.unlinked_technician = Technician.objects.create(
            user=self.unlinked_technician_user,
            specialization="Electrical",
            maintenance_company=None,
            is_approved=False
        )

        # Define the URL for unlinked technicians and for unlinking technician
        self.unlink_url = reverse('unlink_technician', kwargs={'id': str(self.unlinked_technician.id)})  # Use 'id' instead of 'uuid'
        self.linked_technician_url = reverse('unlink_technician', kwargs={'id': str(self.linked_technician.id)})  # Use 'id' instead of 'uuid'

