from django.urls import path
from .views import *

urlpatterns = [
    path('admin/configure_payment_settings/', ConfigurePaymentSettingsView.as_view(), name='configure-payment-settings'),
    path('admin/<int:broker_id>/configure_payment_settings/', BrokerCommissionSettingsView.as_view(), name='broker-commission-settings'),
    path('admin/expected_payments/<int:expected_payment_id>/configure_expected_payments/', ConfigureExpectedPaymentView.as_view(), name='configure-expected-payment'),
    path('payment_plans/', PaymentPlansListView.as_view(), name='payment-plans-list'),
    path('expected_payments/', ExpectedPaymentListView.as_view(), name='expected_payments_list'),
    path('expected_payments/<int:expected_payments_id>/', ExpectedPaymentDetailView.as_view(), name='expected_payment_detail'),
    path('expected_payments/maintenance_company/<int:maintenance_company_id>/', ExpectedPaymentsByCompanyView.as_view(), name='expected-payments-by-company'),
    path('expected_payments/maintenance_company/<int:maintenance_company_id>/latest/', LatestExpectedPaymentView.as_view(), name='latest-expected-payment'),
    path('expected_payments/maintenance_company/<int:maintenance_company_id>/<str:status_choice>/', ExpectedPaymentsByStatusView.as_view(), name='expected-payments-by-status'),
    path('expected_payments/filter/', FilterExpectedPaymentsView.as_view(), name='filter-expected-payments'),
    path('expected_payments/dashboard/maintenance_company/<int:maintenance_company_id>/', DashboardAccessView.as_view(), name='dashboard-access'),
    # Endpoint for fetching and initiating M-PESA STK Push
    path('expected_payments/<int:expected_payment_id>/make_payment_mpesa/', MakePaymentViaMpesaView.as_view(), name='make_payment_mpesa'),
    
    # Callback endpoint for handling M-PESA response
    path('expected_payments/<int:expected_payment_id>/mpesa_payment_callback', MpesaPaymentCallbackView.as_view(), name='mpesa_payment_callback'),
    path('', PaymentView.as_view(), name='payment-list'),
    path('revenue_split/', RevenueSplitListView.as_view(), name='revenue-split-list'),
    path('broker_balance/', BrokerBalanceView.as_view(), name='broker-balance-list'),
    path('withdrawal_requests/', WithdrawalRequestListView.as_view(), name='withdrawal-request-list'),
    path('broker/<int:broker_id>/withdraw_via_mpesa/', BrokerWithdrawViaMpesaView.as_view(), name='withdraw-via-mpesa'),
    path("broker/<int:broker_id>/mpesa-b2c-callback/", MpesaB2CCallbackView.as_view(), name="mpesa-b2c-callback"),
]