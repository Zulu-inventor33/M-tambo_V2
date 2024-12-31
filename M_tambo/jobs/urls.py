from django.urls import path
from . import views

urlpatterns = [
    path('maintenance-schedule/create/elevator/<int:elevator_id>/', views.CreateMaintenanceScheduleView.as_view(), name='create_maintenance_schedule'),
    path('maintenance-schedule/<int:schedule_id>/update/', views.MaintenanceScheduleStatusUpdateView.as_view(), name='update-maintenance-schedule-status'),
    path('maintenance-schedule/', views.MaintenanceScheduleListView.as_view(), name='maintenance-schedule-list'),
    path('maintenance-schedule/<int:schedule_id>/remove/', views.MaintenanceScheduleDeleteView.as_view(), name='delete-maintenance-schedule'),
    path('maintenance-schedule/technician/<int:technician_id>/', views.TechnicianMaintenanceSchedulesView.as_view(), name='technician-maintenance-schedules'),
    path('maintenance-schedule/developer/<int:developer_id>/', views.DeveloperMaintenanceSchedulesView.as_view(), name='developer-maintenance-schedules'),
    path('maintenance-schedule/elevator/<int:elevator_id>/', views.ElevatorMaintenanceSchedulesView.as_view(), name='elevator-maintenance-schedules'),
    path('maintenance-schedule/maintenance_company/<int:company_id>/', views.MaintenanceCompanyMaintenanceSchedulesView.as_view(), name='maintenance-company-maintenance-schedules'),
    path('maintenance-schedule/building/<int:building_id>/', views.BuildingMaintenanceSchedulesView.as_view(), name='building-maintenance-schedules'),
    path('maintenance-schedule/change_technician/<int:schedule_id>/', views.ChangeTechnicianView.as_view(), name='change-technician'),
    path('maintenance-schedule/filter/', views.MaintenanceScheduleFilterView.as_view(), name='maintenance-schedule-filter'),
]
