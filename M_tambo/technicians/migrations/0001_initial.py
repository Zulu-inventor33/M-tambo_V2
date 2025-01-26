# Generated by Django 5.1.3 on 2025-01-26 10:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TechnicianProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('technician', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='technician_profile', to='account.technician')),
            ],
        ),
    ]
