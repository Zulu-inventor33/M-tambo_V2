from django.urls import path
from . import views

urlpatterns = [
    path('', views.DeveloperListView.as_view(), name='developer-list'),
    path('<int:developer_id>/', views.DeveloperDetailView.as_view(), name='developer-detail'),
    path('email/<str:developer_email>/', views.DeveloperDetailByEmailView.as_view(), name='developer-detail-by-email'),
    path('<int:developer_id>/approve-maintenance-logs/', views.DeveloperMaintenanceLogApprovalView.as_view(), name='developer-approve-maintenance-logs'),
]