import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from rest_framework import status
from maintenance_companies.models import Maintenance
from elevators.models import Elevator
from buildings.models import Building
from account.models import Technician

@pytest.fixture
def maintenance_company():
    return baker.make('account.Maintenance')

@pytest.fixture
def building():
    return baker.make('buildings.Building')

@pytest.fixture
def elevator(building, maintenance_company):
    return baker.make(
        'elevators.Elevator',
        building=building,
        maintenance_company=maintenance_company
    )

@pytest.fixture
def technician(maintenance_company):
    return baker.make(
        'account.Technician',
        maintenance_company=maintenance_company
    )

@pytest.fixture
def client():
    return APIClient()

# Test when no technicians are found for a building
@pytest.mark.django_db
def test_no_technicians_found_for_building(client, maintenance_company, building):
    # Create a building with no technicians assigned
    empty_building = baker.make('buildings.Building')

    # Send the GET request to the endpoint
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{empty_building.id}/technicians/'

    response = client.get(url)

    # Check if the response correctly states there are no technicians
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No technicians assigned to elevators in this building." in response.data['message']

# Test when no elevators are linked to a building
@pytest.mark.django_db
def test_no_elevators_linked_to_building(client, maintenance_company, building):
    # Create a building with no elevators linked to it
    empty_building = baker.make('buildings.Building')

    # Send the GET request to the endpoint
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{empty_building.id}/technicians/'

    response = client.get(url)

    # Check if the response states there are no elevators
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No elevators linked to this building." in response.data['message']

# Test when technicians are available, but no elevators are linked to the maintenance company
@pytest.mark.django_db
def test_no_elevators_linked_to_maintenance_company(client, maintenance_company, technician, building):
    # Create an elevator not linked to the maintenance company
    elevator = baker.make('elevators.Elevator', building=building)

    # Send the GET request to the endpoint
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{building.id}/technicians/'

    response = client.get(url)

    # Ensure the response is 404 and indicates no elevators linked to the maintenance company
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No elevators linked to this maintenance company in this building." in response.data['message']

# Test when elevators are linked to the building and technicians are available
@pytest.mark.django_db
def test_technicians_assigned_to_elevators(client, maintenance_company, technician, building, elevator):
    # Assign the technician to the elevator (ensure the technician has a linked user)
    elevator.technician = technician
    elevator.save()

    # Ensure the technician's user has first_name and last_name set
    technician.user.first_name = "John"
    technician.user.last_name = "Doe"
    technician.user.save()

    # Send the GET request to the endpoint
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/{building.id}/technicians/'

    response = client.get(url)

    # Ensure the response is 200 OK and includes the technician data
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data['technicians']) > 0

    # Check if the technician's name appears in the response
    technician_name = f"{technician.user.first_name} {technician.user.last_name}"
    assert technician_name in response.data['technicians'][0]['technician_name']

# Test when the maintenance company does not exist
@pytest.mark.django_db
def test_maintenance_company_not_found(client):
    url = f'/api/maintenance-companies/99999/buildings/1/technicians/'

    response = client.get(url)

    # Ensure the response indicates the maintenance company is not found
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Maintenance company not found." in response.data['error']

# Test when the building does not exist
@pytest.mark.django_db
def test_building_not_found(client, maintenance_company):
    url = f'/api/maintenance-companies/{maintenance_company.id}/buildings/999/technicians/'

    response = client.get(url)

    # Ensure the response indicates the building is not found
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Building not found." in response.data['error']

# Test when both maintenance company and building do not exist
@pytest.mark.django_db
def test_both_not_found(client):
    url = f'/api/maintenance-companies/99999/buildings/999/technicians/'

    response = client.get(url)

    # Ensure the response indicates both the maintenance company and building are not found
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Maintenance company not found." in response.data['error'] or "Building not found." in response.data['error']
