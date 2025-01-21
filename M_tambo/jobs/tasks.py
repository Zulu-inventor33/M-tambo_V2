from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from jobs.models import MaintenanceSchedule, AdHocMaintenanceSchedule, BuildingLevelAdhocSchedule
import logging

# Set up logging
logger = logging.getLogger(__name__)

@shared_task
def check_overdue_schedules():
    """
    Check if any maintenance schedules (normal, ad-hoc, or building-level ad-hoc) are overdue and update their status
    to 'overdue' if necessary. Normal schedules will trigger the creation of new schedules,
    while ad-hoc schedules will not.
    """
    from jobs.utils import update_schedule_status_and_create_new_schedule

    # Get the current time
    now = timezone.now()

    # Query all normal maintenance schedules that are still 'scheduled'
    overdue_normal_schedules = MaintenanceSchedule.objects.filter(status='scheduled')

    # Query all ad-hoc maintenance schedules that are still 'scheduled'
    overdue_adhoc_schedules = AdHocMaintenanceSchedule.objects.filter(status='scheduled')

    # Query all building-level ad-hoc maintenance schedules that are still 'scheduled'
    overdue_building_adhoc_schedules = BuildingLevelAdhocSchedule.objects.filter(status='scheduled')

    overdue_normal_count = 0
    overdue_adhoc_count = 0
    overdue_building_adhoc_count = 0

    # Process normal maintenance schedules
    for schedule in overdue_normal_schedules:
        # Adjust the scheduled_date to the end of the day (23:59:59)
        scheduled_date_end_of_day = timezone.make_aware(
            timezone.datetime.combine(schedule.scheduled_date.date(), timezone.datetime.min.time()) + timedelta(days=1) - timedelta(microseconds=1)
        )

        if scheduled_date_end_of_day < now:
            overdue_normal_count += 1
            try:
                if schedule.status not in ['completed', 'overdue']:
                    schedule.status = 'overdue'
                    schedule.save()
                    logger.info(f"Updated normal schedule {schedule.id} status to 'overdue'.")

                    # Create a new maintenance schedule for the next period
                    update_schedule_status_and_create_new_schedule(schedule)
                    logger.info(f"New maintenance schedule created for normal schedule {schedule.id}.")

            except Exception as e:
                logger.error(f"Error processing normal schedule {schedule.id}: {str(e)}")

    # Process ad-hoc maintenance schedules
    for schedule in overdue_adhoc_schedules:
        # Adjust the scheduled_date to the end of the day (23:59:59)
        scheduled_date_end_of_day = timezone.make_aware(
            timezone.datetime.combine(schedule.scheduled_date.date(), timezone.datetime.min.time()) + timedelta(days=1) - timedelta(microseconds=1)
        )

        if scheduled_date_end_of_day < now:
            overdue_adhoc_count += 1
            try:
                if schedule.status not in ['completed', 'overdue']:
                    schedule.status = 'overdue'
                    schedule.save()
                    logger.info(f"Updated ad-hoc schedule {schedule.id} status to 'overdue'.")

            except Exception as e:
                logger.error(f"Error processing ad-hoc schedule {schedule.id}: {str(e)}")

    # Process building-level ad-hoc maintenance schedules
    for schedule in overdue_building_adhoc_schedules:
        # Adjust the scheduled_date to the end of the day (23:59:59)
        scheduled_date_end_of_day = timezone.make_aware(
            timezone.datetime.combine(schedule.scheduled_date.date(), timezone.datetime.min.time()) + timedelta(days=1) - timedelta(microseconds=1)
        )

        if scheduled_date_end_of_day < now:
            overdue_building_adhoc_count += 1
            try:
                if schedule.status not in ['completed', 'overdue']:
                    schedule.status = 'overdue'
                    schedule.save()
                    logger.info(f"Updated building-level ad-hoc schedule {schedule.id} status to 'overdue'.")

            except Exception as e:
                logger.error(f"Error processing building-level ad-hoc schedule {schedule.id}: {str(e)}")

    logger.info(f"Processed {overdue_normal_count} overdue normal schedules.")
    logger.info(f"Processed {overdue_adhoc_count} overdue ad-hoc schedules.")
    logger.info(f"Processed {overdue_building_adhoc_count} overdue building-level ad-hoc schedules.")
