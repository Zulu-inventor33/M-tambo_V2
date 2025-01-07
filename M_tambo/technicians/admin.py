from django.contrib import admin
from .models import TechnicianProfile

@admin.register(TechnicianProfile)
class TechnicianProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'technician_name', 'created_at', 'updated_at')
    search_fields = ('technician__user__first_name', 'technician__user__last_name', 'technician__user__email')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    def technician_name(self, obj):
        return f"{obj.technician.user.first_name} {obj.technician.user.last_name}"
    technician_name.short_description = 'Technician Name'

