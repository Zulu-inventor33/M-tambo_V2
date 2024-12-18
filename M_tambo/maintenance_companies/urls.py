from django.urls import path
from .views import *

urlpatterns = [
#NON-PROTECTED ENDPOINTS:
<<<<<<< HEAD
    path('maintenance/', MaintenanceCompanyListView.as_view(), name='maintenance_company_list'),
    path('specialization/<str:specialization>/', MaintenanceCompanyBySpecializationView.as_view(), name='maintenance_company_by_specialization'),
=======
    path('', MaintenanceCompanyListView.as_view(), name='maintenance_company_list'),
    path('<str:specialization>/', MaintenanceCompanyBySpecializationView.as_view(), name='maintenance_company_by_specialization'),
>>>>>>> e0be0cb (Elevator APIs completed)
#PROTECTED ENDPOINTS
    path('id/<int:company_id>/', MaintenanceCompanyDetailView.as_view(), name='maintenance_company_detail'),
    path('email/<str:email>/', MaintenanceCompanyByEmailView.as_view(), name='maintenance-company-by-email'),
    path('update/<int:company_id>/', UpdateMaintenanceCompanyView.as_view(), name='update_maintenance_company'),
    path('<int:company_id>/technicians/', MaintenanceCompanyTechniciansView.as_view(), name='company_technicians_list'),
    path('<int:company_id>/technicians/<int:technician_id>/remove/', RemoveTechnicianFromCompanyView.as_view(), name='remove_technician_from_company'),
    path('<int:company_id>/technicians/<int:technician_id>/add/', AddTechnicianToCompanyView.as_view(), name='add_technician_to_company'),
    path('<int:company_id>/technicians/<int:technician_id>/', TechnicianDetailForCompanyView.as_view(), name='technician_detail_for_company'),
]

