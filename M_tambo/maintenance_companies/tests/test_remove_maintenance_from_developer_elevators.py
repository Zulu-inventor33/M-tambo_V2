import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from rest_framework import status
from elevators.models import Elevator
from maintenance_companies.models import Maintenance
from developers.models import Developer
from buildings.models import Building
from jobs.models import MaintenanceSchedule

@pytest.fixture
def maintenance_company():
    return baker.make('account.Maintenance')

@pytest.fixture
def developer():
    return baker.make('account.Developer')

@pytest.fixture
def building(developer):
    return baker.make('buildings.Building', developer=developer)

@pytest.fixture
def elevator(building, maintenance_company):
    return baker.make(
        'elevators.Elevator',
        building=building,
        maintenance_company=maintenance_company
    )

@pytest.fixture
def maintenance_schedule(elevator, maintenance_company):
    return baker.make(
        'jobs.MaintenanceSchedule',
        elevator=elevator,
        maintenance_company=maintenance_company,
        status='scheduled'
    )

@pytest.fixture
def client():
    return APIClient()

# Test when no buildings are found for the developer
@pytest.mark.django_db
def test_no_buildings_linked_to_developer(client, maintenance_company):
    # Create a developer with no buildings
    empty_developer = baker.make('account.Developer')

    # Update the URL according to the correct endpoint path
    url = f'/api/maintenance-companies/{maintenance_company.id}/developers/{empty_developer.id}/remove/'

    response = client.delete(url)

    # Check that the response returns the "No buildings found" message
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No buildings found for this developer." in response.data['message']

# Test when the developer exists but has no elevators linked to the specific maintenance company
@pytest.mark.django_db
def test_no_elevators_linked_to_maintenance_company(client, developer, maintenance_company):
    # Create a building for the developer but with no elevators linked to the maintenance company
    empty_building = baker.make('buildings.Building', developer=developer)

    # Send the delete request to the endpoint
    url = f'/api/maintenance-companies/{maintenance_company.id}/developers/{developer.id}/remove/'

    response = client.delete(url)

    # Check that the response returns a message stating no elevators are linked
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No elevators found for this developer." in response.data['message']

# Test when elevators are linked to the developer but none are linked to the specific maintenance company
@pytest.mark.django_db
def test_building_exists_but_no_elevators_linked_to_maintenance_company(client, developer, maintenance_company):
    # Create a building for the developer
    building = baker.make('buildings.Building', developer=developer)
    
    # Create an elevator but not linked to the specified maintenance company
    elevator = baker.make('elevators.Elevator', building=building)

    # Send the delete request
    url = f'/api/maintenance-companies/{maintenance_company.id}/developers/{developer.id}/remove/'

    response = client.delete(url)

    # Check that the response states no elevators linked to the maintenance company
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No elevators linked to the provided maintenance company for this developer." in response.data['message']

# Test for successful removal when elevators and schedules are linked
@pytest.mark.django_db
def test_remove_maintenance_from_developer_elevators(client, developer, maintenance_company, building, maintenance_schedule):
    # Send DELETE request to remove maintenance company and technician
    url = f'/api/maintenance-companies/{maintenance_company.id}/developers/{developer.id}/remove/'

    response = client.delete(url)

    # Check the response
    assert response.status_code == status.HTTP_200_OK
    assert "Successfully removed the maintenance company and technician" in response.data['message']

    # Refresh the elevator and maintenance schedule from the database
    elevator = building.elevators.first()
    elevator.refresh_from_db()
    maintenance_schedule.refresh_from_db()

    # Ensure the maintenance company and technician are removed
    assert elevator.maintenance_company is None
    assert elevator.technician is None
    assert maintenance_schedule.maintenance_company is None
    assert maintenance_schedule.technician is None

# Test when multiple elevators exist, some linked to the maintenance company
@pytest.mark.django_db
def test_multiple_elevators_removed(client, maintenance_company, building):
    # Create first elevator linked to the maintenance company
    elevator1 = baker.make(
        'elevators.Elevator',
        building=building,
        maintenance_company=maintenance_company
    )

    # Create second elevator linked to the same maintenance company
    elevator2 = baker.make(
        'elevators.Elevator',
        building=building,
        maintenance_company=maintenance_company
    )

    # Create maintenance schedules for both elevators
    baker.make('jobs.MaintenanceSchedule', elevator=elevator1, maintenance_company=maintenance_company, status='scheduled')
    baker.make('jobs.MaintenanceSchedule', elevator=elevator2, maintenance_company=maintenance_company, status='scheduled')

    # Debugging: Ensure both elevators are created correctly
    elevators = Elevator.objects.filter(building=building)
    print(f"Created elevators: {[elevator.id for elevator in elevators]}")
    for elevator in elevators:
        print(f"Elevator {elevator.id} linked to maintenance company {elevator.maintenance_company.id if elevator.maintenance_company else None}")

    # Check if schedules are created for each elevator
    schedules = MaintenanceSchedule.objects.filter(elevator__in=elevators)
    for schedule in schedules:
        print(f"Schedule {schedule.id} for elevator {schedule.elevator.id} with maintenance company {schedule.maintenance_company.id if schedule.maintenance_company else None}")

    url = f'/api/maintenance-companies/{maintenance_company.id}/developers/{building.developer.id}/remove/'

    # Send DELETE request
    response = client.delete(url)

    # Ensure the response code is 200 OK
    assert response.status_code == status.HTTP_200_OK

    # Verify the response message matches expected text with both elevators and schedules
    assert "Successfully removed the maintenance company and technician from 2 elevator(s)" in response.data['message']

# Edge Case 1: Developer or Maintenance company doesn't exist
@pytest.mark.django_db
def test_developer_or_maintenance_company_not_found(client):
    url = f'/api/maintenance-companies/99999/developers/99999/remove/'

    response = client.delete(url)

    # Check that the response returns a 404 not found error for both
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Developer not found." in response.data['error'] or "Maintenance company not found." in response.data['error']


