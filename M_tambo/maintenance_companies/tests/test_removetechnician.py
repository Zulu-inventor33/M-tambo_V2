from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from uuid import uuid4
from account.models import Maintenance, Technician, User
from maintenance_companies.models import MaintenanceCompanyProfile
from technicians.models import TechnicianProfile
def test_remove_technician_success(self):
    technician_id = self.technician_1.id
    response = self.client.delete(
            reverse('remove-technician-from-company', 
                   kwargs={
                       'company_id': self.maintenance.id,  # Changed from uuid_id to company_id
                       'technician_id': technician_id
                   })
    )
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertNotIn(self.technician_1, self.maintenance.technician_set.all())
def test_remove_nonexistent_technician(self):
    nonexistent_technician_id = str(uuid4())
    response = self.client.delete(
            reverse('remove-technician-from-company', 
                   kwargs={
                       'company_id': self.maintenance.id,  # Changed from uuid_id to company_id
                       'technician_id': nonexistent_technician_id
                   })
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
def test_remove_technician_nonexistent_company(self):
    nonexistent_company_id = str(uuid4())
    response = self.client.delete(
            reverse('remove-technician-from-company', 
                   kwargs={
                       'company_id': nonexistent_company_id,  # Changed from uuid_id to company_id
                       'technician_id': self.technician_1.id
                   })
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
def test_remove_technician_not_associated_with_company(self):
    another_technician_user = User.objects.create_user(
        email='tech3@example.com',
        phone_number='1234567893',
        password='testpassword123',
        first_name='Tech',
        last_name='Three'
    )
    another_technician = Technician.objects.create(
        user=another_technician_user,
        maintenance_company=None
    )
    response = self.client.delete(
            reverse('remove-technician-from-company', 
                   kwargs={
                       'company_id': self.maintenance.id,  # Changed from uuid_id to company_id
                       'technician_id': another_technician.id
                   })
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
