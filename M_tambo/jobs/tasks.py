from celery import shared_task
from django.utils import timezone
from jobs.models import MaintenanceSchedule
import logging

# Set up logging
logger = logging.getLogger(__name__)

@shared_task
def check_overdue_schedules():
    """
    Check if any maintenance schedules are overdue and update their status
    to 'overdue' if necessary. It will also trigger the creation of a new schedule.
    """
    # Import the helper function that updates the schedule and creates a new one
    from jobs.utils import update_schedule_status_and_create_new_schedule

    # Get all schedules where the scheduled date has passed and the status is 'scheduled'
    overdue_schedules = MaintenanceSchedule.objects.filter(
        scheduled_date__lt=timezone.now().replace(hour=0, minute=0, second=0, microsecond=0) + timezone.timedelta(days=1),  # Check if the scheduled date is before 00:00 of the next day
        status='scheduled'
    )

    logger.info(f"Found {overdue_schedules.count()} overdue schedules.")

    for schedule in overdue_schedules:
        try:
            # If the status is not 'completed', change it to 'overdue'
            if schedule.status != 'completed':
                schedule.status = 'overdue'
                schedule.save()
                logger.info(f"Updated schedule {schedule.id} status to 'overdue'.")
                
                logger.info(f"Processing schedule {schedule.id}. Status: {schedule.status}")
                # Create a new schedule for the next maintenance period (next month)
                update_schedule_status_and_create_new_schedule(schedule)  # Helper function to create a new schedule
                logger.info(f"New maintenance schedule created for schedule {schedule.id}.")
        except Exception as e:
            logger.error(f"Error processing schedule {schedule.id}: {str(e)}")
