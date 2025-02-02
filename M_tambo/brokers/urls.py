# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('register/', BrokerRegistrationView.as_view(), name='broker-register'),
    path('', BrokerListView.as_view(), name='broker-list'),
    path('<int:broker_id>/maintenance_companies/', MaintenanceCompaniesListView.as_view(), name='maintenance-companies-list'),
]