from django.urls import path
from . import views

urlpatterns = [
    path('', views.ElevatorListView.as_view(), name='elevator-list'),
    path('add/', views.AddElevatorView.as_view(), name='add_elevator'),
    path('id/<int:elevator_id>/', views.ElevatorDetailByIdView.as_view(), name='elevator-detail-id'),
    path('machine_number/<str:machine_number>/', views.ElevatorDetailByMachineNumberView.as_view(), name='elevator-detail-machine-number'),
    path('building/<int:building_id>/', views.ElevatorsInBuildingView.as_view(), name='elevators_in_building'),
    path('update/<int:id>/', views.UpdateElevatorView.as_view(), name='update_elevator'),
    path('delete/<int:id>/', views.DeleteElevatorView.as_view(), name='delete_elevator'),
]
