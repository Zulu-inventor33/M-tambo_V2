from django.contrib import admin
from .models import WithdrawalRequest

@admin.register(WithdrawalRequest)
class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = ['broker', 'amount', 'status', 'request_date', 'mpesa_receipt_number']
    list_filter = ['status']
    search_fields = ['broker__email', 'mpesa_receipt_number']

