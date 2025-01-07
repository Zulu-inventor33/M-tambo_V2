<<<<<<< HEAD
# Generated by Django 5.1.4 on 2024-12-20 06:43
=======
# Generated by Django 5.1.3 on 2025-01-04 17:51
>>>>>>> 599bc3919ee2d2b1d710c4b3cba10c43d769a0fb

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('contact', models.CharField(max_length=255)),
                ('developer_name', models.CharField(blank=True, max_length=255, null=True)),
                ('developer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='buildings', to='account.developer')),
            ],
        ),
    ]
