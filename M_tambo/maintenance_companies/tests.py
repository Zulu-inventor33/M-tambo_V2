import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from rest_framework import status
from elevators.models import Elevator
from maintenance_companies.models import Maintenance
from developers.models import Developer
from buildings.models import Building
from jobs.models import MaintenanceSchedule
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'M_tambo.settings'

# Fixtures
@pytest.fixture
def maintenance_company():
    return baker.make('account.Maintenance')

@pytest.fixture
def technician():
    return baker.make('account.Technician')

@pytest.fixture
def developer():
    return baker.make('account.Developer')

@pytest.fixture
def building(developer):
    return baker.make('buildings.Building', developer=developer)

@pytest.fixture
def elevator(building, maintenance_company, technician):
    return baker.make(
        'elevators.Elevator',
        building=building,
        maintenance_company=maintenance_company,
        technician=technician
    )

@pytest.fixture
def maintenance_schedule(elevator, technician, maintenance_company):
    return baker.make(
        'jobs.MaintenanceSchedule',
        elevator=elevator,
        technician=technician,
        maintenance_company=maintenance_company,
        status='scheduled'
    )

@pytest.fixture
def client():
    return APIClient()


# Test: Remove maintenance company from elevators in building
@pytest.mark.django_db
def test_remove_maintenance_from_building_elevators(client, elevator, maintenance_company, building, maintenance_schedule):
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{building.id}/remove/'

    # Ensure the elevator and maintenance schedule are initially linked
    assert elevator.maintenance_company == maintenance_company
    assert elevator.technician == maintenance_schedule.technician
    assert maintenance_schedule.maintenance_company == maintenance_company

    # Send DELETE request to remove maintenance company
    response = client.delete(url)

    # Check the response
    assert response.status_code == status.HTTP_200_OK
    assert "Successfully removed the maintenance company and technician from 1 elevator(s)" in response.data['message']

    # Refresh the elevator and maintenance schedule from the database
    elevator.refresh_from_db()
    maintenance_schedule.refresh_from_db()

    # Ensure the maintenance company and technician are removed
    assert elevator.maintenance_company is None
    assert elevator.technician is None
    assert maintenance_schedule.maintenance_company is None
    assert maintenance_schedule.technician is None


# Test: No elevators linked to the maintenance company for the building
@pytest.mark.django_db
def test_no_elevators_linked_to_maintenance_company(client, maintenance_company):
    # Create a building with no elevators linked to the maintenance company
    empty_building = baker.make('buildings.Building')
    
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{empty_building.id}/remove/'
    response = client.delete(url)

    # Check that the response returns a message stating no elevators were found
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No elevators linked to the provided maintenance company in this building." in response.data['message']


# Test: Remove maintenance company only for scheduled or overdue elevators
@pytest.mark.django_db
def test_remove_maintenance_company_only_for_scheduled_or_overdue(client, elevator, maintenance_company, maintenance_schedule):
    # Create a completed maintenance schedule
    completed_schedule = baker.make(
        'jobs.MaintenanceSchedule',
        elevator=elevator,
        technician=maintenance_schedule.technician,
        maintenance_company=maintenance_company,
        status='completed'
    )

    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{elevator.building.id}/remove/'

    # Ensure there is a completed schedule with a different status
    assert completed_schedule.status == 'completed'

    # Send DELETE request
    response = client.delete(url)

    # Check the response
    assert response.status_code == status.HTTP_200_OK
    assert "Successfully removed the maintenance company and technician from 1 elevator(s)" in response.data['message']

    # Ensure the completed maintenance schedule is not modified
    completed_schedule.refresh_from_db()
    assert completed_schedule.maintenance_company == maintenance_company
    assert completed_schedule.technician == maintenance_schedule.technician


# Test: Multiple elevators removed from maintenance company
@pytest.mark.django_db
def test_multiple_elevators_removed(client, elevator, maintenance_company, building):
    # Create another elevator linked to the same maintenance company
    elevator2 = baker.make(
        'elevators.Elevator',
        building=building,
        maintenance_company=maintenance_company,
        technician=elevator.technician
    )
    
    # Create maintenance schedules for both elevators
    baker.make('jobs.MaintenanceSchedule', elevator=elevator, technician=elevator.technician, maintenance_company=maintenance_company, status='scheduled')
    baker.make('jobs.MaintenanceSchedule', elevator=elevator2, technician=elevator.technician, maintenance_company=maintenance_company, status='scheduled')

    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{building.id}/remove/'

    # Send DELETE request
    response = client.delete(url)

    # Check the response for both elevators
    assert response.status_code == status.HTTP_200_OK
    assert "Successfully removed the maintenance company and technician from 2 elevator(s)" in response.data['message']

    # Check that both elevators have been updated correctly
    elevator.refresh_from_db()
    elevator2.refresh_from_db()

    assert elevator.maintenance_company is None
    assert elevator.technician is None
    assert elevator2.maintenance_company is None
    assert elevator2.technician is None

    # Ensure maintenance schedules are updated for both elevators
    schedules = MaintenanceSchedule.objects.filter(elevator__in=[elevator, elevator2])
    for schedule in schedules:
        schedule.refresh_from_db()
        assert schedule.maintenance_company is None
        assert schedule.technician is None


# Edge Case 1: Building doesn't exist
@pytest.mark.django_db
def test_building_does_not_exist(client, maintenance_company):
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/99999/remove/'
    
    response = client.delete(url)
    
    # Check that the response indicates the building doesn't exist
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Building not found." in response.data['error']


# Edge Case 2: Building exists but has no elevators linked to the maintenance company
@pytest.mark.django_db
def test_building_no_elevators_linked_to_maintenance_company(client, maintenance_company):
    # Create a building with no elevators linked to the maintenance company
    building_with_no_elevators = baker.make('buildings.Building')
    
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{building_with_no_elevators.id}/remove/'
    
    response = client.delete(url)
    
    # Check that the response states no elevators are linked to the maintenance company
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No elevators linked to the provided maintenance company under this developer." in response.data['message']


# Edge Case 3: Building has elevators belonging to different maintenance companies
@pytest.mark.django_db
def test_building_has_elevators_belonging_to_different_maintenance_companies(client, maintenance_company):
    # Create a building with multiple elevators, some linked to the target maintenance company
    building = baker.make('buildings.Building')
    
    elevator1 = baker.make('elevators.Elevator', building=building, maintenance_company=maintenance_company)
    elevator2 = baker.make('elevators.Elevator', building=building)
    
    # Create maintenance schedules
    baker.make('jobs.MaintenanceSchedule', elevator=elevator1, maintenance_company=maintenance_company, status='scheduled')
    baker.make('jobs.MaintenanceSchedule', elevator=elevator2, maintenance_company=elevator2.maintenance_company, status='scheduled')
    
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{building.id}/remove/'
    
    # Send DELETE request
    response = client.delete(url)
    
    # Check that the response includes only the elevator linked to the maintenance company
    assert response.status_code == status.HTTP_200_OK
    assert "Successfully removed the maintenance company and technician from 1 elevator(s)" in response.data['message']
    
    # Check that only the elevator linked to the maintenance company is affected
    elevator1.refresh_from_db()
    elevator2.refresh_from_db()
    
    assert elevator1.maintenance_company is None
    assert elevator2.maintenance_company == elevator2.maintenance_company  # Not affected
    
    # Ensure maintenance schedules are updated only for the affected elevator
    schedules = MaintenanceSchedule.objects.filter(elevator=elevator1)
    for schedule in schedules:
        schedule.refresh_from_db()
        assert schedule.maintenance_company is None
        assert schedule.technician is None

