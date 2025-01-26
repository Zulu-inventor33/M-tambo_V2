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

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))

# Optional: Add the line below to start periodic tasks
app.conf.beat_schedule = {
    'check-overdue-schedules-every-5-minutes': {
        'task': 'jobs.tasks.check_overdue_schedules',
        'schedule': crontab(minute='*/5'),
    },
}
