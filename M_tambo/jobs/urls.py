from django.urls import path
from . import views

urlpatterns = [
    path('maintenance-schedule/elevator/<int:elevator_id>/create_initial_schedule', views.CreateRoutineMaintenanceScheduleView.as_view(), name='create_maintenance_schedule'),
    path('maintenance-schedule/elevator/<int:elevator_id>/create_adhoc', views.CreateAdHocMaintenanceScheduleView.as_view(), name='create_adhoc_maintenance_schedule'),
    path('maintenance-schedule/<int:schedule_id>/completed/', views.ChangeMaintenanceScheduleToCompletedView.as_view(), name='update-maintenance-schedule-status'),
    path('maintenance-schedule/', views.MaintenanceScheduleListView.as_view(), name='maintenance-schedule-list'),
    path('maintenance-schedule/<int:schedule_id>/remove/', views.MaintenanceScheduleDeleteView.as_view(), name='delete-maintenance-schedule'),
    path('maintenance-schedule/technician/<int:technician_id>/', views.TechnicianMaintenanceSchedulesView.as_view(), name='technician-maintenance-schedules'),
    path('maintenance-schedule/developer/<int:developer_id>/', views.DeveloperMaintenanceSchedulesView.as_view(), name='developer-maintenance-schedules'),
    path('maintenance-schedule/elevator/<int:elevator_id>/', views.ElevatorMaintenanceSchedulesView.as_view(), name='elevator-maintenance-schedules'),
    path('maintenance-schedule/maintenance_company/<int:company_id>/', views.MaintenanceCompanyMaintenanceSchedulesView.as_view(), name='maintenance-company-maintenance-schedules'),
    path('maintenance-schedule/building/<int:building_id>/', views.BuildingMaintenanceSchedulesView.as_view(), name='building-maintenance-schedules'),
    path('maintenance-schedule/change_technician/<str:schedule_type>/<int:schedule_id>/', views.ChangeTechnicianView.as_view(), name='change-technician'),
    path('maintenance-schedule/filter/', views.MaintenanceScheduleFilterView.as_view(), name='maintenance-schedule-filter'),
    path('maintenance-schedule/null_technician/', views.MaintenanceScheduleNullTechnicianFilterView.as_view(), name='filter-null-technician'),
    path('maintenance-schedule/<int:schedule_id>/file_maintenance_log/', views.FileMaintenanceLogView.as_view(), name='file-maintenance-log'),
    path('maintenance-schedule/elevator/<int:elevator_id>/history/', views.ElevatorMaintenanceHistoryView.as_view(),name='elevator-maintenance-history'),
    path('maintenance-schedule/technician/<int:technician_id>/<str:job_status>/', views.TechnicianJobStatusView.as_view(), name='technician-job-status'),
    path('maintenance-schedule/maintenance_company/<int:company_id>/<str:job_status>/', views.MaintenanceCompanyJobStatusView.as_view(), name='maintenance-company-job-status'),
    path('maintenance-schedule/building/<int:building_id>/create_building_adhoc', views.CreateBuildingAdhocScheduleView.as_view(), name='create-building-adhoc-schedule'),
    path('maintenance-schedule/<int:building_schedule_id>/complete_building_adhoc/', views.CompleteBuildingScheduleView.as_view(), name='complete-building-schedule'),
]
