# Generated by Django 5.1.3 on 2024-12-02 23:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0005_alter_technician_specialization_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='technician',
            name='maintenance_company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='technicians', to='account.maintenance'),
        ),
    ]
