from django.contrib import admin
from .models import MaintenanceCompanyProfile

@admin.register(MaintenanceCompanyProfile)
class MaintenanceCompanyProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'maintenance')  # Customize fields to display in the admin list view
    search_fields = ('maintenance__company_name',)  # Allow search by related company name
    list_filter = ('maintenance',)  # Add filters for the admin list view


