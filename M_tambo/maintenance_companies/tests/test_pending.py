from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from account.models import User, Maintenance, Technician
import uuid

class ListPendingTechniciansViewTests(APITestCase):
    
    def setUp(self):
        """
        Set up data for the tests.
        """
        # Create maintenance company owners
        self.company_owner_1 = User.objects.create_user(
            first_name="John", 
            last_name="Doe", 
            email="john.doe@example.com", 
            password="password",
            phone_number="1234567890"
        )
        
        self.company_owner_2 = User.objects.create_user(
            first_name="Jane", 
            last_name="Doe", 
            email="jane.doe@example.com", 
            password="password",
            phone_number="2345678901"
        )

        # Create technician users
        self.tech_user_1 = User.objects.create_user(
            first_name="Mike", 
            last_name="Smith", 
            email="mike.smith@example.com", 
            password="password",
            phone_number="3456789012"
        )

        self.tech_user_2 = User.objects.create_user(
            first_name="Sarah", 
            last_name="Johnson", 
            email="sarah.johnson@example.com", 
            password="password",
            phone_number="4567890123"
        )

        self.tech_user_3 = User.objects.create_user(
            first_name="Tom", 
            last_name="Wilson", 
            email="tom.wilson@example.com", 
            password="password",
            phone_number="5678901234"
        )

        # Create maintenance companies
        self.maintenance_company_1 = Maintenance.objects.create(
            company_name="Maintenance Company 1",
            company_address="123 Street",
            company_registration_number="123456789",
            specialization="HVAC",
            user=self.company_owner_1
        )
        
        self.maintenance_company_2 = Maintenance.objects.create(
            company_name="Maintenance Company 2",
            company_address="456 Avenue",
            company_registration_number="987654321",
            specialization="Elevators",
            user=self.company_owner_2
        )

        # Create pending technicians (assigned to maintenance company 1)
        self.technician_1 = Technician.objects.create(
            user=self.tech_user_1,
            specialization="Electrician",
            maintenance_company=self.maintenance_company_1,
            is_approved=False
        )

        self.technician_2 = Technician.objects.create(
            user=self.tech_user_2,
            specialization="Plumber",
            maintenance_company=self.maintenance_company_1,
            is_approved=False
        )

        # Create approved technician (assigned to maintenance company 2)
        self.technician_3 = Technician.objects.create(
            user=self.tech_user_3,
            specialization="Technician",
            maintenance_company=self.maintenance_company_2,
            is_approved=True
        )

        # URL for listing pending technicians of a specific company
        self.url = reverse('list-pending-technicians', kwargs={'company_id': self.maintenance_company_1.id})

    def test_list_pending_technicians(self):
        """
        Test listing pending technicians for a maintenance company.
        """
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Ensure the correct data is returned
        pending_technicians = response.data['pending_technicians']
        self.assertEqual(len(pending_technicians), 2)  # Only 2 pending technicians for company_1
        self.assertEqual(pending_technicians[0]['name'], "Mike Smith")
        self.assertEqual(pending_technicians[1]['name'], "Sarah Johnson")
        
        # Check the count
        self.assertEqual(response.data['count'], 2)

    def test_list_no_pending_technicians(self):
        """
        Test that no pending technicians are listed for a maintenance company with no pending technicians.
        """
        # Create a new user for the additional technician
        additional_tech_user = User.objects.create_user(
            first_name="Alex",
            last_name="Brown",
            email="alex.brown@example.com",
            password="password",
            phone_number="6789012345"
        )

        # Create another technician but approve them
        self.technician_4 = Technician.objects.create(
            user=additional_tech_user,
            specialization="Electrician",
            maintenance_company=self.maintenance_company_1,
            is_approved=True
        )

        # Delete existing pending technicians
        self.technician_1.delete()
        self.technician_2.delete()

        # URL for company 1
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Ensure no pending technicians are returned
        pending_technicians = response.data['pending_technicians']
        self.assertEqual(len(pending_technicians), 0)  # No pending technicians

        # Check the count
        self.assertEqual(response.data['count'], 0)

    def test_list_pending_technicians_for_non_existent_company(self):
        """
        Test that attempting to list pending technicians for a non-existent company returns a 404 error.
        """
        # Non-existent company ID
        non_existent_company_id = uuid.uuid4()
        url = reverse('list-pending-technicians', kwargs={'company_id': non_existent_company_id})
        
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
