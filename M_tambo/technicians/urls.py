from django.urls import path
from . import views
from .views import TechnicianListView
from .views import UnlinkTechnicianFromCompanyView

urlpatterns = [
    path('<uuid:company_uuid>/', TechnicianListView.as_view(), name='technician-list'),
    path('', TechnicianListView.as_view(), name='technician-list-all'),
    path('specialization/<str:specialization>/', views.TechnicianListBySpecializationView.as_view(), name='technician_list_by_specialization'),
    path('technicians/<uuid:id>/', views.TechnicianDetailView.as_view(), name='technician-detail'),
    path('email/<str:technician_email>/', views.TechnicianDetailByEmailView.as_view(), name='technician-detail-by-email'),
    path('<uuid:pk>/unlink/', UnlinkTechnicianFromCompanyView.as_view(), name='unlink-technician'),
]
