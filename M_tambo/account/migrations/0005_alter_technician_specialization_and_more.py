# Generated by Django 5.1.3 on 2024-12-02 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_alter_specialization_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='technician',
            name='specialization',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='maintenance',
            name='specialization',
            field=models.CharField(max_length=100),
        ),
        migrations.DeleteModel(
            name='Specialization',
        ),
    ]
