from django.urls import path
from .views import *

urlpatterns = [
#NON-PROTECTED ENDPOINTS:
    path('', MaintenanceCompanyListView.as_view(), name='maintenance_company_list'),
    path('<str:specialization>/', MaintenanceCompanyBySpecializationView.as_view(), name='maintenance_company_by_specialization'),
#PROTECTED ENDPOINTS
    path('<int:company_id>/', MaintenanceCompanyDetailView.as_view(), name='maintenance_company_detail'),
    path('update/<int:company_id>/', UpdateMaintenanceCompanyView.as_view(), name='update_maintenance_company'),
    path('<int:company_id>/technicians/', MaintenanceCompanyTechniciansView.as_view(), name='company_technicians_list'),
    path('<int:company_id>/technicians/<int:technician_id>/remove/', RemoveTechnicianFromCompanyView.as_view(), name='remove_technician_from_company'),
    path('<int:company_id>/technicians/<int:technician_id>/add/', AddTechnicianToCompanyView.as_view(), name='add_technician_to_company'),
    path('<int:company_id>/technicians/<int:technician_id>/', TechnicianDetailForCompanyView.as_view(), name='technician_detail_for_company'),
]

