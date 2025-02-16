from __future__ import absolute_import, unicode_literals

import os
from celery import Celery
from celery.schedules import crontab
import django

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'M_tambo.settings')

# Explicitly initialize Django settings
django.setup()

# Create Celery app
app = Celery('M_tambo')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related config keys should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs, including jobs and payments
app.autodiscover_tasks(lambda: [
    'jobs',         # Include tasks from the jobs app
    'payments',     # Include tasks from the payments app
])

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))

# Optional: Add the line below to start periodic tasks
app.conf.beat_schedule = {
    'check-overdue-schedules-every-5-minutes': {
        'task': 'jobs.tasks.check_overdue_schedules',
        'schedule': crontab(minute='*/5'),
    },
    # You can add other periodic tasks from the payments app here
    'monthly-payment-calculations': {
        'task': 'payments.tasks.run_monthly_tasks',  # Chain of tasks from payments app
        'schedule': crontab(hour=0, minute=0, day_of_month='25'),  # Runs on the 25th at midnight
    },
}

app.conf.beat_schedule = {
    'check-overdue-payments-every-6th': {
        'task': 'your_app_name.tasks.check_and_update_overdue_payments',
        'schedule': crontab(minute=0, hour=0, day_of_month=6),
    },
}
