import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from rest_framework import status
from elevators.models import Elevator
from maintenance_companies.models import Maintenance
from technicians.models import Technician
from jobs.models import MaintenanceSchedule

@pytest.fixture
def maintenance_company():
    return baker.make('account.Maintenance')

@pytest.fixture
def technician(maintenance_company):
    return baker.make('account.Technician', maintenance_company=maintenance_company)

@pytest.fixture
def elevator(maintenance_company, technician):
    return baker.make(
        'elevators.Elevator',
        maintenance_company=maintenance_company,
        technician=technician
    )

@pytest.fixture
def maintenance_schedule(elevator, technician):
    return baker.make(
        'jobs.MaintenanceSchedule',
        elevator=elevator,
        technician=technician,
        status='scheduled'
    )

@pytest.fixture
def client():
    return APIClient()

# Test: When maintenance company doesn't exist
@pytest.mark.django_db
def test_maintenance_company_not_found(client):
    url = '/api/maintenance-companies/99999/technicians/1/remove/'

    response = client.delete(url)

    # Check that the response returns a "Maintenance company not found" error
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Maintenance company not found." in response.data['error']

# Test: When technician doesn't exist
@pytest.mark.django_db
def test_technician_not_found(client, maintenance_company):
    url = f'/api/maintenance-companies/{maintenance_company.id}/technicians/99999/remove/'

    response = client.delete(url)

    # Check that the response returns a "Technician not found" error
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Technician not found or not linked to this company." in response.data['error']

# Test: When the technician is removed from the maintenance company
@pytest.mark.django_db
def test_remove_technician_from_company(client, maintenance_company, technician, elevator, maintenance_schedule):
    url = f'/api/maintenance-companies/{maintenance_company.id}/technicians/{technician.id}/remove/'

    response = client.delete(url)

    # Check for successful response
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert "Successfully removed technician from the maintenance company" in response.data['message']

    # Ensure the technician is removed from the elevator and maintenance schedule
    elevator.refresh_from_db()
    maintenance_schedule.refresh_from_db()

    assert elevator.technician is None
    assert maintenance_schedule.technician is None

# Test: When no elevators are linked to the maintenance company
@pytest.mark.django_db
def test_no_elevators_linked_to_maintenance_company(client, maintenance_company, technician):
    # Create a building with no elevators linked to the maintenance company
    empty_building = baker.make('buildings.Building')

    # Send DELETE request to remove technician
    url = f'/api/maintenance-companies/{maintenance_company.id}/technicians/{technician.id}/remove/'

    response = client.delete(url)

    # Check that the response returns "No elevators linked"
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No elevators linked to the maintenance company." in response.data['message']

# Test: When there are elevators linked to the maintenance company, but no technician linked to them
@pytest.mark.django_db
def test_elevators_linked_but_no_technician(client, maintenance_company):
    # Create elevators linked to maintenance company but no technician
    elevator = baker.make('elevators.Elevator', maintenance_company=maintenance_company)

    # Create a maintenance schedule with no technician linked
    maintenance_schedule = baker.make('jobs.MaintenanceSchedule', elevator=elevator, maintenance_company=maintenance_company, status='scheduled')

    # Send DELETE request to remove technician
    url = f'/api/maintenance-companies/{maintenance_company.id}/technicians/1/remove/'

    response = client.delete(url)

    # Check that the response states that there are no technicians
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert "Successfully removed technician from the maintenance company" in response.data['message']

    # Ensure the elevator and schedule technician remain unaffected (since they didn't have a technician to begin with)
    elevator.refresh_from_db()
    maintenance_schedule.refresh_from_db()

    assert elevator.technician is None
    assert maintenance_schedule.technician is None

# Test: When multiple elevators and schedules are linked to the maintenance company and technician
@pytest.mark.django_db
def test_multiple_elevators_and_schedules_removed(client, maintenance_company, technician):
    # Create multiple elevators linked to the same maintenance company and technician
    elevator1 = baker.make('elevators.Elevator', maintenance_company=maintenance_company, technician=technician)
    elevator2 = baker.make('elevators.Elevator', maintenance_company=maintenance_company, technician=technician)

    # Create maintenance schedules for both elevators
    maintenance_schedule1 = baker.make('jobs.MaintenanceSchedule', elevator=elevator1, technician=technician, maintenance_company=maintenance_company, status='scheduled')
    maintenance_schedule2 = baker.make('jobs.MaintenanceSchedule', elevator=elevator2, technician=technician, maintenance_company=maintenance_company, status='overdue')

    # Send DELETE request to remove technician
    url = f'/api/maintenance-companies/{maintenance_company.id}/technicians/{technician.id}/remove/'

    response = client.delete(url)

    # Check that the technician was removed from both elevators and schedules
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert "Successfully removed technician from the maintenance company" in response.data['message']

    # Refresh the elevators and schedules
    elevator1.refresh_from_db()
    elevator2.refresh_from_db()
    maintenance_schedule1.refresh_from_db()
    maintenance_schedule2.refresh_from_db()

    # Ensure technician is removed from both elevators and maintenance schedules
    assert elevator1.technician is None
    assert elevator2.technician is None
    assert maintenance_schedule1.technician is None
    assert maintenance_schedule2.technician is None

# Edge Case: Maintenance company and technician don't exist
@pytest.mark.django_db
def test_both_not_found(client):
    url = '/api/maintenance-companies/99999/technicians/99999/remove/'

    response = client.delete(url)

    # Ensure both the maintenance company and technician are not found
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Maintenance company not found." in response.data['error'] or "Technician not found." in response.data['error']
