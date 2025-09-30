
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count
from appointments.models import Appointment
from services.models import Service
from doctors.models import Doctor
from .serializers import GeneralStatsSerializer, PopularServiceSerializer, PopularDoctorSerializer


class GeneralStatsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        total_appointments = Appointment.objects.count()
        confirmed_appointments = Appointment.objects.filter(status='confirmed').count()
        pending_appointments = Appointment.objects.filter(status='pending').count()

        confirmation_rate = 0
        if total_appointments > 0:
            confirmation_rate = round((confirmed_appointments / total_appointments) * 100, 2)

        data = {
            'total_appointments': total_appointments,
            'confirmed_appointments': confirmed_appointments,
            'pending_appointments': pending_appointments,
            'confirmation_rate': confirmation_rate
        }

        serializer = GeneralStatsSerializer(data)
        return Response(serializer.data)


class PopularServicesAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # ИСПРАВЛЕНО: используем правильное имя связи
        popular_services = Service.objects.annotate(
            appointment_count=Count('appointment')  # ← appointment вместо appointments
        ).order_by('-appointment_count')[:10]

        serializer = PopularServiceSerializer(popular_services, many=True)
        return Response(serializer.data)


class PopularDoctorsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # ИСПРАВЛЕНО: используем правильное имя связи
        popular_doctors = Doctor.objects.annotate(
            appointment_count=Count('appointment')  # ← appointment вместо appointments
        ).order_by('-appointment_count')[:10]

        serializer = PopularDoctorSerializer(popular_doctors, many=True)
        return Response(serializer.data)


# backend/analytics/views.py
class DashboardStatsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # 1. Общая статистика
        total_appointments = Appointment.objects.count()
        confirmed_appointments = Appointment.objects.filter(status='confirmed').count()
        pending_appointments = Appointment.objects.filter(status='pending').count()
        cancelled_appointments = Appointment.objects.filter(status='cancelled').count()

        # 2. Расчет процентов от общего числа
        if total_appointments > 0:
            confirmed_rate = round((confirmed_appointments / total_appointments) * 100, 2)
            pending_rate = round((pending_appointments / total_appointments) * 100, 2)
            cancelled_rate = round((cancelled_appointments / total_appointments) * 100, 2)
        else:
            confirmed_rate = 0
            pending_rate = 0
            cancelled_rate = 0

        # 3. Популярные услуги и врачи
        popular_services = Service.objects.annotate(
            appointment_count=Count('appointment')
        ).order_by('-appointment_count')[:5]

        popular_doctors = Doctor.objects.annotate(
            appointment_count=Count('appointment')
        ).order_by('-appointment_count')[:5]

        return Response({
            'general_stats': {
                'total_appointments': total_appointments,
                'confirmed_appointments': confirmed_appointments,
                'confirmed_rate': confirmed_rate,  # ← переименовали
                'pending_appointments': pending_appointments,
                'pending_rate': pending_rate,  # ← добавили
                'cancelled_appointments': cancelled_appointments,
                'cancelled_rate': cancelled_rate,  # ← добавили
            },
            'popular_services': PopularServiceSerializer(popular_services, many=True).data,
            'popular_doctors': PopularDoctorSerializer(popular_doctors, many=True).data
        })