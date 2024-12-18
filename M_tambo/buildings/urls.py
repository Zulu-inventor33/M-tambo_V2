from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListBuildingsView.as_view(), name='list_buildings'),
    path('add/', views.AddBuildingView.as_view(), name='add-building'),
    path('<int:building_id>/', views.GetBuildingDetailsView.as_view(), name='get_building_details'),
    path('developer/<int:developer_id>/', views.GetBuildingsByDeveloperView.as_view(), name='get-buildings-by-developer'),
]