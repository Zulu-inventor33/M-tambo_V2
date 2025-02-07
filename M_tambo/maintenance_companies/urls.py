from django.urls import path
from .views import *

urlpatterns = [
#NON-PROTECTED ENDPOINTS:
    path('', MaintenanceCompanyListView.as_view(), name='maintenance_company_list'),
    path('<str:specialization>/', MaintenanceCompanyBySpecializationView.as_view(), name='maintenance_company_by_specialization'),
    path('id/<int:company_id>/', MaintenanceCompanyDetailView.as_view(), name='maintenance_company_detail'),
    path('email/<str:email>/', MaintenanceCompanyByEmailView.as_view(), name='maintenance-company-by-email'),
    path('update/<int:company_id>/', UpdateMaintenanceCompanyView.as_view(), name='update_maintenance_company'),
    path('<int:company_id>/technicians/', MaintenanceCompanyTechniciansView.as_view(), name='company_technicians_list'),
    path('<int:company_id>/technicians/<int:technician_id>/remove/', RemoveTechnicianFromCompanyView.as_view(), name='remove_technician_from_company'),
    path('<int:company_id>/technicians/<int:technician_id>/add/', AddTechnicianToCompanyView.as_view(), name='add_technician_to_company'),
    path('<int:company_id>/technicians/<int:technician_id>/', TechnicianDetailForCompanyView.as_view(), name='technician_detail_for_company'),
    path('<int:company_id>/buildings/', BuildingListView.as_view(), name='maintenance-company-buildings'),
    path('<int:company_id>/buildings/<int:building_id>/', BuildingDetailView.as_view(), name='maintenance-company-building-detail'),
    path('<int:company_id>/elevators/', ElevatorsUnderCompanyView.as_view(), name='elevators-under-company'),
    path('<int:company_id>/buildings/<int:building_id>/elevators/', ElevatorsInBuildingView.as_view(), name='elevators-in-building'),
    path('<int:company_id>/elevators/<int:elevator_id>/', ElevatorDetailView.as_view(), name='elevator-detail'),
    path('<int:company_id>/elevators/<str:machine_number>/', ElevatorDetailByMachineNumberView.as_view(), name='elevator-detail-by-machine-number'),
    path('<int:company_id>/developers/', DevelopersUnderCompanyView.as_view(), name='developers-under-company'),
    path('<int:company_id>/developers/<int:developer_id>/', DeveloperDetailUnderCompanyView.as_view(), name='developer-detail-under-company'),
    path('<int:company_id>/developers/<int:developer_id>/buildings/', BuildingsUnderDeveloperView.as_view(), name='developer-buildings'),
    path('<int:company_id>/elevators/technicians/<int:technician_id>/', ElevatorsUnderTechnicianView.as_view(), name='elevators_under_technician'),
    path('<int:company_id>/technicians/<int:technician_id>/buildings/', BuildingsUnderTechnicianView.as_view(), name='buildings-under-technician'),
    path('<int:company_id>/buildings/<int:building_id>/update_technician/', UpdateTechnicianOnBuildingsView.as_view(), name='update-technician-on-buildings'),
    path('<int:company_id>/elevators/<int:elevator_id>/update_technician/', UpdateTechnicianOnElevatorView.as_view(), name='update-technician-on-elevator'),
    path('<int:company_id>/buildings/add', AddBuildingView.as_view(), name='add-building'),
    path('<int:company_id>/buildings/<int:building_id>/elevators/add', AddElevatorToBuildingView.as_view(), name='add-elevator-to-building'),
    path('<int:company_id>/buildings/<int:building_id>/remove/', RemoveMaintenanceFromBuildingElevatorsView.as_view(), name='remove-maintenance-from-building-elevators'),
    path('<int:company_id>/developers/<int:developer_id>/remove/', RemoveMaintenanceFromDeveloperElevatorsView.as_view(), name='remove-maintenance-from-developer-elevators'),
    path('<int:company_id>/buildings/<int:building_id>/technicians/', TechnicianListForBuildingView.as_view(), name='technician-list-for-building'),
]

