# backend/analytics/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardStatsAPIView.as_view(), name='dashboard-stats'),
    path('general/', views.GeneralStatsAPIView.as_view(), name='general-stats'),
    path('popular-services/', views.PopularServicesAPIView.as_view(), name='popular-services'),
    path('popular-doctors/', views.PopularDoctorsAPIView.as_view(), name='popular-doctors'),
]