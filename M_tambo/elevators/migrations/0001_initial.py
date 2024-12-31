# Generated by Django 5.1.3 on 2024-12-20 13:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
        ('buildings', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Elevator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(help_text='Identifier for the elevator (e.g., LIFT1, LIFT2).', max_length=100)),
                ('controller_type', models.CharField(blank=True, help_text='Specify the type of controller (e.g., Digital, Analog, etc.).', max_length=100)),
                ('machine_type', models.CharField(choices=[('gearless', 'Gearless'), ('geared', 'Geared')], default='gearless', help_text='Type of the elevator machine (e.g., Gearless, Geared).', max_length=100)),
                ('machine_number', models.CharField(max_length=100, unique=True)),
                ('capacity', models.PositiveIntegerField(help_text='Maximum weight capacity in kilograms.')),
                ('manufacturer', models.CharField(max_length=255)),
                ('installation_date', models.DateField()),
                ('building', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='elevators', to='buildings.building')),
                ('developer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='elevators', to='account.developer')),
                ('maintenance_company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='elevators', to='account.maintenance')),
                ('technician', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='elevators', to='account.technician')),
            ],
        ),
    ]
