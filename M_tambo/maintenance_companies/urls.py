from django.urls import path
from .views import (
    MaintenanceCompanyListView,
    MaintenanceCompanyDetailView,
    MaintenanceCompanyTechniciansView,
    RemoveTechnicianFromCompanyView,
    CompanyAddTechnicianView,
    ListPendingTechniciansView,
    UpdateMaintenanceCompanyView,
    MaintenanceCompanyBySpecializationView,
)
urlpatterns = [
    path('', MaintenanceCompanyListView.as_view(), name='maintenance_company_list'),
    path('<uuid:uuid_id>/', MaintenanceCompanyDetailView.as_view(), name='maintenance-company-detail'),
    path('<uuid:uuid_id>/technicians/', MaintenanceCompanyTechniciansView.as_view(), name='technicians-list'),
    path(
        'maintenance-companies/<uuid:uuid_id>/technicians/<uuid:technician_id>/',
        RemoveTechnicianFromCompanyView.as_view(),
        name='remove-technician-from-company'
    ),
    path('companies/technicians/<uuid:technician_id>/approve/', 
     CompanyAddTechnicianView.as_view(), 
     name='company-add-technician'),
    path('companies/<uuid:company_id>/technicians/pending/', 
     ListPendingTechniciansView.as_view(), 
     name='list-pending-technicians'),
    path('maintenance-companies/<uuid:uuid_id>/', 
         UpdateMaintenanceCompanyView.as_view(), 
         name='update-maintenance-company'),
    path('specialization/<str:specialization>/', MaintenanceCompanyBySpecializationView.as_view(), name='maintenance_company_by_specialization'),
]
