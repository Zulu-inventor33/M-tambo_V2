# Generated by Django 5.1.3 on 2025-02-01 01:52

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PaymentSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('min_charge_per_elevator', models.DecimalField(decimal_places=2, default=700.0, help_text='Default minimum charge per elevator per month.', max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('default_commission', models.DecimalField(decimal_places=2, default=12.5, help_text='Default commission percentage for brokers (e.g., 12.5%).', max_digits=5, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('default_commission_duration', models.PositiveIntegerField(default=24, help_text='Default duration (in months) for which brokers earn commissions (e.g., 24 months).', validators=[django.core.validators.MinValueValidator(1)])),
                ('default_calculation_date', models.PositiveIntegerField(default=25, help_text='Default day of the month for calculating expected payments (e.g., 25th).', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(31)])),
                ('default_due_date', models.PositiveIntegerField(default=5, help_text='Default day of the month for payment due dates (e.g., 5th).', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(31)])),
            ],
            options={
                'verbose_name': 'Payment Settings',
                'verbose_name_plural': 'Payment Settings',
            },
        ),
    ]
