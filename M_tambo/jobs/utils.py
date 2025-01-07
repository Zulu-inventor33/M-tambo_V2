from datetime import datetime
from django.utils import timezone
from dateutil.relativedelta import relativedelta

def get_next_scheduled_date(scheduled_date, months_to_add):
    """
    Given a scheduled date and the number of months to add, returns the new scheduled date.
    """
    if months_to_add > 0:
        return scheduled_date + relativedelta(months=+months_to_add)
    return scheduled_date

def update_schedule_status_and_create_new_schedule(maintenance_schedule):
    """
    Updates the status to 'overdue' if the scheduled date has passed and the status is not 'completed'.
    Also triggers a new maintenance schedule creation if needed.
    """
    # Avoid circular import by deferring the import
    from .models import MaintenanceSchedule

    # Automatically update the status to 'overdue' if the scheduled date has passed
    # and the status is not 'completed'
    if maintenance_schedule.scheduled_date < timezone.now() and maintenance_schedule.status != 'completed':
        maintenance_schedule.status = 'overdue'
    
    # Only create a new schedule if the status is either 'completed' or 'overdue' 
    if maintenance_schedule.status in ['completed', 'overdue'] and maintenance_schedule.next_schedule != 'set_date':
        # If the status was manually changed from 'overdue' to 'completed', don't create a new schedule
        if maintenance_schedule.status == 'completed' or (maintenance_schedule.status == 'overdue' and maintenance_schedule._status_changed_to_completed):
            months_to_add = 1 if maintenance_schedule.next_schedule == '1_month' else 3 if maintenance_schedule.next_schedule == '3_months' else 6
            next_scheduled_date = get_next_scheduled_date(maintenance_schedule.scheduled_date, months_to_add)

            # Check if the schedule already exists (avoid duplicates)
            if not MaintenanceSchedule.objects.filter(elevator=maintenance_schedule.elevator, scheduled_date=next_scheduled_date).exists():
                _generate_new_schedule(maintenance_schedule, next_scheduled_date)

def _generate_new_schedule(maintenance_schedule, next_scheduled_date):
    """
    Helper function to generate the next scheduled maintenance.
    """
    # Creating a new schedule based on the current schedule's values
    from .models import MaintenanceSchedule  # Defer import to avoid circular import issues
    new_schedule = MaintenanceSchedule(
        elevator=maintenance_schedule.elevator,
        technician=maintenance_schedule.technician,
        maintenance_company=maintenance_schedule.maintenance_company,
        scheduled_date=next_scheduled_date,
        next_schedule=maintenance_schedule.next_schedule,
        description=maintenance_schedule.description,
        status='scheduled'  # Status is set to scheduled for the new schedule
    )
    new_schedule.save()

