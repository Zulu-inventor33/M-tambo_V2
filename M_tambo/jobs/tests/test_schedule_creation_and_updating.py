import pytest
from faker import Faker
from django.utils import timezone
from unittest.mock import patch
from elevators.models import Elevator
from jobs.models import MaintenanceSchedule
from account.models import Technician, Maintenance, User, Developer
from buildings.models import Building
from jobs.tasks import check_overdue_schedules
from unittest.mock import patch
from datetime import timedelta
from django_celery_results.models import TaskResult
from jobs.utils import *
import time

fake = Faker()

# Fixture for creating a User instance with unique data
@pytest.fixture
def user(db):
    return User.objects.create(
        email=fake.email(),  # Unique email
        phone_number=fake.phone_number(),  # Unique phone number
        first_name="John",
        last_name="Doe",
        account_type="technician",  # Adjust this based on your model
    )

# Fixture for creating a Developer instance
@pytest.fixture
def developer(db, user):
    return Developer.objects.create(
        user=user,  # Associate with the user instance
        developer_name="Test Developer",
        address="campus Towers 4th floor"
    )

# Fixture for creating a Building instance
@pytest.fixture
def building(db, developer):
    return Building.objects.create(
        name="Test Building", 
        address="123 Test St.", 
        contact="123-456-7890", 
        developer=developer,
        developer_name="Test Developer"
    )

# Fixture for creating an Elevator instance
@pytest.fixture
def elevator(db, building):
    return Elevator.objects.create(
        user_name="Lift1", 
        controller_type="Digital",
        machine_type="gearless",
        building=building,
        machine_number="E1234",
        capacity=1000,
        manufacturer="XYZ Corp",
        installation_date="2022-01-01"
    )

# Fixture for creating a Technician instance
@pytest.fixture
def technician(db):
    # Create a user (Technician type)
    user = User.objects.create(
        email=fake.email(),  # Unique email
        phone_number=fake.phone_number(),  # Unique phone number
        first_name="John",
        last_name="Doe",
        account_type="technician"
    )
    
    maintenance = Maintenance.objects.create(
        user=user,
        company_name="TechMaintenance",
        company_address="123 Tech Street",
        company_registration_number="T1234",
        specialization="Electrical"
    )
    
    technician = Technician.objects.create(
        user=user,
        specialization="Lift Repairs",
        maintenance_company=maintenance
    )
    return technician

# Fixture for creating a MaintenanceSchedule instance
@pytest.fixture
def maintenance_schedule(db, elevator, technician):
    return MaintenanceSchedule.objects.create(
        elevator=elevator,
        technician=technician,
        scheduled_date=timezone.now() + timezone.timedelta(days=1),  # Corrected field name
        status="Scheduled"
    )

# Test case: Check if overdue schedule status is updated and new schedule is created
@pytest.mark.django_db
def test_check_overdue_schedules_updates_status_and_creates_new_schedule(client, maintenance_schedule):
    # Set schedule to be overdue
    maintenance_schedule.scheduled_date = timezone.now() - timedelta(days=1)
    maintenance_schedule.status = 'scheduled'
    maintenance_schedule.save()

    # Run the task
    check_overdue_schedules()

    # Refresh and assert the status is updated to 'overdue'
    maintenance_schedule.refresh_from_db()
    assert maintenance_schedule.status == 'overdue'

    # Optionally, wait a second to ensure the task has completed if async
    time.sleep(1)

    # Assert a new schedule was created and has status 'scheduled'
    new_schedule = MaintenanceSchedule.objects.filter(elevator=maintenance_schedule.elevator).exclude(id=maintenance_schedule.id).first()
    assert new_schedule is not None
    assert new_schedule.status == 'scheduled'

# Test case: Check that a schedule doesn't transition if already completed
@pytest.mark.django_db
def test_check_overdue_schedules_does_not_update_completed_schedule(client, maintenance_schedule):
    maintenance_schedule.scheduled_date = timezone.now() - timedelta(days=1)
    maintenance_schedule.status = 'completed'
    maintenance_schedule.save()

    # Run the task
    check_overdue_schedules()

    # Refresh and assert that the status remains 'completed'
    maintenance_schedule.refresh_from_db()
    assert maintenance_schedule.status == 'completed'

# Test case: Check if a new schedule is created without falling on a weekend
@pytest.mark.django_db
def test_new_schedule_does_not_fall_on_weekend(client, maintenance_schedule):
    # Set schedule to be overdue
    maintenance_schedule.scheduled_date = timezone.now() - timedelta(days=1)
    maintenance_schedule.status = 'scheduled'
    maintenance_schedule.save()

    # Run the task
    check_overdue_schedules()

    # Refresh the schedule
    maintenance_schedule.refresh_from_db()

    # Get the new schedule
    new_schedule = MaintenanceSchedule.objects.filter(elevator=maintenance_schedule.elevator).exclude(id=maintenance_schedule.id).first()
    assert new_schedule is not None
    # Ensure the new scheduled date is a weekday (not Saturday or Sunday)
    assert new_schedule.scheduled_date.weekday() < 5  # 0-4 are weekdays (Monday to Friday)

# Test case: Check that the maintenance company and technician are correctly handled during the creation of a new schedule
@pytest.mark.django_db
def test_new_schedule_maintenance_company_and_technician(client, maintenance_schedule, technician):
    # Set schedule to be overdue
    maintenance_schedule.scheduled_date = timezone.now() - timedelta(days=1)
    maintenance_schedule.status = 'scheduled'
    maintenance_schedule.save()

    # Assign a new technician (this will test reassignment logic)
    new_technician = Technician.objects.create(
        user=maintenance_schedule.technician.user,
        specialization="Elevator Maintenance",
        maintenance_company=maintenance_schedule.technician.maintenance_company
    )
    maintenance_schedule.technician = new_technician
    maintenance_schedule.save()

    # Run the task
    check_overdue_schedules()

    # Get the new schedule
    new_schedule = MaintenanceSchedule.objects.filter(elevator=maintenance_schedule.elevator).exclude(id=maintenance_schedule.id).first()
    assert new_schedule is not None

    # Assert that the new schedule retains the elevator's assigned maintenance company
    assert new_schedule.maintenance_company == maintenance_schedule.elevator.maintenance_company
    # Assert the technician has been reassigned to the new technician
    assert new_schedule.technician == new_technician

# Test case: Check that errors during new schedule creation are logged
@pytest.mark.django_db
@patch("jobs.utils.update_schedule_status_and_create_new_schedule")
def test_check_overdue_schedules_handles_errors_in_creation(mock_update_schedule, client, maintenance_schedule):
    # Set schedule to be overdue
    maintenance_schedule.scheduled_date = timezone.now() - timedelta(days=1)
    maintenance_schedule.status = 'scheduled'
    maintenance_schedule.save()

    # Mock the helper function to raise an exception
    mock_update_schedule.side_effect = Exception("Test exception")

    # Run the task and check for error handling
    check_overdue_schedules()

    # Assert that the schedule status is updated to 'overdue' even if creating a new schedule failed
    maintenance_schedule.refresh_from_db()
    assert maintenance_schedule.status == 'overdue'

# Test case: Check that logging works correctly
@pytest.mark.django_db
def test_check_overdue_schedules_logs_info_and_error(client, maintenance_schedule, caplog):
    # Set the maintenance schedule to be overdue
    maintenance_schedule.scheduled_date = timezone.now() - timedelta(days=1)
    maintenance_schedule.status = 'scheduled'
    maintenance_schedule.save()

    # Run the task and capture logs
    with caplog.at_level("INFO"):
        check_overdue_schedules()

    # Check the logs
    assert "Found 1 overdue schedules." in caplog.text
    assert "Updated schedule" in caplog.text
    assert "New maintenance schedule created for schedule" in caplog.text

    # Test that errors are logged correctly if they occur
    with patch("jobs.utils.update_schedule_status_and_create_new_schedule", side_effect=Exception("Test error")):
        with caplog.at_level("ERROR"):
            check_overdue_schedules()
        assert "Error processing schedule" in caplog.text