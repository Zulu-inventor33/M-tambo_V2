from django.urls import path
from . import views

urlpatterns = [
    path('', views.TechnicianListView.as_view(), name='technician_list'),
    path('specialization/<str:specialization>/', views.TechnicianListBySpecializationView.as_view(), name='technician_list_by_specialization'),
    path('id/<int:id>/', views.TechnicianDetailView.as_view(), name='technician_detail'),
    path('email/<str:technician_email>/', views.TechnicianDetailByEmailView.as_view(), name='technician-detail-by-email'),
    path('unlinked/', views.UnlinkedTechniciansView.as_view(), name='unlinked_technicians'),
    path('unlinked/<str:specialization>/', views.UnlinkedTechniciansBySpecializationView.as_view(), name='unlinked_technicians_by_specialization'),
    path('<int:id>/unlink/', views.UnlinkTechnicianFromCompanyView.as_view(), name='unlink_technician'),
]
