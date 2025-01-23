# Generated by Django 5.1.3 on 2025-01-22 10:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('buildings', '0001_initial'),
        ('developers', '0001_initial'),
        ('elevators', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ElevatorIssueLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reported_date', models.DateTimeField(auto_now_add=True, help_text='The date and time when the issue was reported.')),
                ('issue_description', models.TextField(help_text='A detailed description of the elevator issue reported by the developer.')),
                ('building', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='elevator_issue_logs', to='buildings.building')),
                ('developer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reported_issues', to='developers.developerprofile')),
                ('elevator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='issue_logs', to='elevators.elevator')),
            ],
            options={
                'verbose_name': 'Elevator Issue Log',
                'verbose_name_plural': 'Elevator Issue Logs',
                'ordering': ['-reported_date'],
            },
        ),
    ]
