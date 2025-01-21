# Generated by Django 5.1.3 on 2025-01-17 14:07

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
        ('elevators', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdHocElevatorConditionReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_inspected', models.DateTimeField(default=django.utils.timezone.now)),
                ('components_checked', models.CharField(help_text='List of components or parts of the elevator inspected during this visit.', max_length=255)),
                ('condition', models.TextField(help_text='Condition of the components checked.')),
                ('technician', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ad_hoc_condition_reports', to='account.technician')),
            ],
            options={
                'verbose_name': 'Ad-Hoc Elevator Condition Report',
                'verbose_name_plural': 'Ad-Hoc Elevator Condition Reports',
            },
        ),
        migrations.CreateModel(
            name='AdHocMaintenanceSchedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scheduled_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('description', models.TextField(help_text='Briefly describe the purpose of this ad-hoc schedule.')),
                ('status', models.CharField(choices=[('scheduled', 'Scheduled'), ('overdue', 'Overdue'), ('completed', 'Completed')], default='scheduled', max_length=20)),
                ('elevator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ad_hoc_schedules', to='elevators.elevator')),
                ('maintenance_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ad_hoc_schedules', to='account.maintenance')),
                ('technician', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ad_hoc_schedules', to='account.technician')),
            ],
            options={
                'verbose_name': 'Ad-Hoc Maintenance Schedule',
                'verbose_name_plural': 'Ad-Hoc Maintenance Schedules',
            },
        ),
        migrations.CreateModel(
            name='AdHocMaintenanceLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_completed', models.DateTimeField(default=django.utils.timezone.now)),
                ('summary_title', models.CharField(help_text='Brief summary of the work done during this maintenance.', max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('overseen_by', models.CharField(blank=True, max_length=255, null=True)),
                ('approved_by', models.CharField(blank=True, max_length=255, null=True)),
                ('condition_report', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='ad_hoc_maintenance_log', to='jobs.adhocelevatorconditionreport')),
                ('technician', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ad_hoc_maintenance_logs', to='account.technician')),
                ('ad_hoc_schedule', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_logs', to='jobs.adhocmaintenanceschedule')),
            ],
            options={
                'verbose_name': 'Ad-Hoc Maintenance Log',
                'verbose_name_plural': 'Ad-Hoc Maintenance Logs',
            },
        ),
        migrations.AddField(
            model_name='adhocelevatorconditionreport',
            name='ad_hoc_schedule',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='condition_reports', to='jobs.adhocmaintenanceschedule'),
        ),
        migrations.CreateModel(
            name='AdHocMaintenanceTask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('scheduled_date', models.DateTimeField()),
                ('completed', models.BooleanField(default=False)),
                ('comments', models.TextField(blank=True, null=True)),
                ('assigned_to', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='adhoc_tasks', to='account.technician')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='adhoc_tasks', to='account.maintenance')),
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
                ('maintenance_company', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='maintenance_schedules', to='account.maintenance')),
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
        migrations.CreateModel(
            name='ElevatorConditionReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_inspected', models.DateTimeField(default=django.utils.timezone.now)),
                ('alarm_bell', models.CharField(blank=True, max_length=255, null=True)),
                ('noise_during_motion', models.CharField(blank=True, max_length=255, null=True)),
                ('cabin_lights', models.CharField(blank=True, max_length=255, null=True)),
                ('position_indicators', models.CharField(blank=True, max_length=255, null=True)),
                ('hall_lantern_indicators', models.CharField(blank=True, max_length=255, null=True)),
                ('cabin_flooring', models.CharField(blank=True, max_length=255, null=True)),
                ('additional_comments', models.TextField(blank=True, null=True)),
                ('technician', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='condition_reports', to='account.technician')),
                ('maintenance_schedule', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='condition_reports', to='jobs.maintenanceschedule')),
            ],
            options={
                'verbose_name': 'Elevator Condition Report',
                'verbose_name_plural': 'Elevator Condition Reports',
            },
        ),
        migrations.CreateModel(
            name='ScheduledMaintenanceLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_completed', models.DateTimeField(default=django.utils.timezone.now)),
                ('check_machine_gear', models.BooleanField(default=False)),
                ('check_machine_brake', models.BooleanField(default=False)),
                ('check_controller_connections', models.BooleanField(default=False)),
                ('blow_dust_from_controller', models.BooleanField(default=False)),
                ('clean_machine_room', models.BooleanField(default=False)),
                ('clean_guide_rails', models.BooleanField(default=False)),
                ('observe_operation', models.BooleanField(default=False)),
                ('description', models.TextField(blank=True, null=True)),
                ('overseen_by', models.CharField(blank=True, max_length=255, null=True)),
                ('approved_by', models.CharField(blank=True, max_length=255, null=True)),
                ('condition_report', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_log', to='jobs.elevatorconditionreport')),
                ('maintenance_schedule', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_logs', to='jobs.maintenanceschedule')),
                ('technician', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_logs', to='account.technician')),
            ],
            options={
                'verbose_name': 'Scheduled Maintenance Log',
                'verbose_name_plural': 'Scheduled Maintenance Logs',
            },
        ),
    ]
