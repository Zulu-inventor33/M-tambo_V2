# Generated by Django 5.1.3 on 2024-12-20 13:20

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
        ('elevators', '0001_initial'),
        ('maintenance_companies', '0001_initial'),
        ('technicians', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdHocMaintenanceTask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('scheduled_date', models.DateTimeField()),
                ('completed', models.BooleanField(default=False)),
                ('comments', models.TextField(blank=True, null=True)),
                ('assigned_to', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='adhoc_tasks', to='technicians.technicianprofile')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='adhoc_tasks', to='maintenance_companies.maintenancecompanyprofile')),
            ],
        ),
        migrations.CreateModel(
            name='MaintenanceLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('maintenance_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('work_done', models.TextField(help_text='Details of the maintenance performed.')),
                ('parts_used', models.TextField(help_text='Parts replaced or repaired.')),
                ('maintenance_type', models.CharField(choices=[('repair', 'Repair'), ('inspection', 'Inspection'), ('upgrade', 'Upgrade')], max_length=50)),
                ('elevator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_logs', to='elevators.elevator')),
                ('maintenance_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_logs', to='maintenance_companies.maintenancecompanyprofile')),
                ('technician', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='maintenance_logs', to='technicians.technicianprofile')),
            ],
        ),
        migrations.CreateModel(
            name='MaintenanceSchedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scheduled_date', models.DateTimeField()),
                ('next_schedule', models.CharField(choices=[('1_month', '1 Month'), ('3_months', '3 Months'), ('6_months', '6 Months'), ('set_date', 'Set Date')], default='set_date', max_length=10)),
                ('description', models.TextField()),
                ('status', models.CharField(choices=[('scheduled', 'Scheduled'), ('overdue', 'Overdue'), ('completed', 'Completed')], default='scheduled', max_length=20)),
                ('elevator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_schedules', to='elevators.elevator')),
                ('maintenance_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_schedules', to='account.maintenance')),
                ('technician', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='maintenance_schedules', to='account.technician')),
            ],
        ),
        migrations.CreateModel(
            name='MaintenanceCheck',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_description', models.CharField(max_length=255)),
                ('passed', models.BooleanField(default=False)),
                ('comments', models.TextField(blank=True, null=True)),
                ('maintenance_schedule', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='checks', to='jobs.maintenanceschedule')),
            ],
        ),
    ]
