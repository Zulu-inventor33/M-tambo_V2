from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
import uuid
from account.models import Maintenance, Technician, User
from maintenance_companies.models import MaintenanceCompanyProfile
from technicians.models import TechnicianProfile
from rest_framework.test import APITestCase



class MaintenanceCompanyTechniciansViewTests(APITestCase):
    def setUp(self):
        super().setUp()
        
        self.client = APIClient()
        
        # Create main maintenance company and related data
        self.user = self._create_user("Test", "User", "test@example.com", "1234567890", "maintenance")
        self.maintenance = self._create_maintenance("Test Maintenance Company", self.user)
        self.maintenance_company = self._create_company_profile(self.maintenance)
        
        # Create two technicians for the main company
        self.tech1_user = self._create_user("John", "Doe", "john@example.com", "1234567891", "technician")
        self.technician1 = self._create_technician(self.tech1_user, self.maintenance)
        
        self.tech2_user = self._create_user("Jane", "Smith", "jane@example.com", "1234567892", "technician")
        self.technician2 = self._create_technician(self.tech2_user, self.maintenance)
        
        # Create another company and technician for filtering test
        self.other_user = self._create_user("Other", "Company", "other@example.com", "1234567893", "maintenance")
        self.other_maintenance = self._create_maintenance("Other Maintenance Company", self.other_user)
        self.other_company = self._create_company_profile(self.other_maintenance)
        
        # Create technician for other company
        self.other_tech_user = self._create_user("Other", "Tech", "othertech@example.com", "1234567894", "technician")
        self.other_technician = self._create_technician(self.other_tech_user, self.other_maintenance)
        
        # Authenticate the client
        self.client.force_authenticate(user=self.user)

    def _create_user(self, first_name, last_name, email, phone_number, account_type):
        return User.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone_number=phone_number,
            account_type=account_type
        )

    def _create_maintenance(self, company_name, user):
        return Maintenance.objects.create(
            company_name=company_name,
            user=user
        )

    def _create_company_profile(self, maintenance):
        return MaintenanceCompanyProfile.objects.create(
            maintenance=maintenance
        )

    def _create_technician(self, user, maintenance_company):
        technician = Technician.objects.create(
            user=user,
            maintenance_company=maintenance_company
        )
        
        technician_profile = TechnicianProfile.objects.create(
            technician=technician
        )
        
        return technician

    def test_filter_by_company(self):
        """Test that technicians are properly filtered by company"""
        response = self.client.get(f'/maintenance_companies/{self.maintenance_company.id}/technicians/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        
        technician_ids = [tech['id'] for tech in response.data]
        
        # Verify correct technicians are returned
        self.assertIn(str(self.technician1.id), technician_ids)
        self.assertIn(str(self.technician2.id), technician_ids)
        self.assertNotIn(str(self.other_technician.id), technician_ids)
        self.assertEqual(len(technician_ids), 2)

    def test_nonexistent_company(self):
        """Test response for non-existent company"""
        non_existent_uuid = uuid.uuid4()
        response = self.client.get(f'/maintenance_companies/{non_existent_uuid}/technicians/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_empty_technicians_list(self):
        """Test response for company with no technicians"""
        empty_user = self._create_user("Empty", "Company", "empty@example.com", "1234567895", "maintenance")
        empty_maintenance = self._create_maintenance("Empty Maintenance Company", empty_user)
        empty_company = self._create_company_profile(empty_maintenance)
        
        # Authenticate as the empty company user
        self.client.force_authenticate(user=empty_user)
        
        response = self.client.get(f'/maintenance_companies/{empty_company.id}/technicians/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
