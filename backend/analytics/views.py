from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count
from appointments.models import Appointment
from services.models import Service
from doctors.models import Doctor
from .serializers import GeneralStatsSerializer, PopularServiceSerializer, PopularDoctorSerializer
from datetime import datetime, timedelta


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
# backend/analytics/views.py
class DashboardStatsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # 1. Общая статистика (уже есть)
        total_appointments = Appointment.objects.count()
        confirmed_appointments = Appointment.objects.filter(status='confirmed').count()
        pending_appointments = Appointment.objects.filter(status='pending').count()
        cancelled_appointments = Appointment.objects.filter(status='cancelled').count()
        completed_appointments = Appointment.objects.filter(status='completed').count()

        # 2. Расчет процентов (уже есть)
        if total_appointments > 0:
            confirmed_rate = round((confirmed_appointments / total_appointments) * 100, 2)
            pending_rate = round((pending_appointments / total_appointments) * 100, 2)
            cancelled_rate = round((cancelled_appointments / total_appointments) * 100, 2)
            completed_rate = round((completed_appointments / total_appointments) * 100, 2)
        else:
            pending_rate = confirmed_rate = completed_rate = cancelled_rate = 0

        # 3. Популярные услуги и врачи (уже есть)
        popular_services = Service.objects.annotate(
            appointment_count=Count('appointment')
        ).order_by('-appointment_count')[:5]

        popular_doctors = Doctor.objects.annotate(
            appointment_count=Count('appointment')
        ).order_by('-appointment_count')[:5]

        # 4. ✅ ДОБАВЛЯЕМ: Данные для диаграммы статусов
        status_chart_data = [
            {
                'status': 'pending',
                'count': pending_appointments,
                'color': '#FFA500',  # Оранжевый
                'percentage': pending_rate
            },
            {
                'status': 'confirmed',
                'count': confirmed_appointments,
                'color': '#007BFF',  # Синий
                'percentage': confirmed_rate
            },
            {
                'status': 'completed',
                'count': completed_appointments,
                'color': '#28A745',  # Зеленый
                'percentage': completed_rate
            },
            {
                'status': 'cancelled',
                'count': cancelled_appointments,
                'color': '#DC3545',  # Красный
                'percentage': cancelled_rate
            }
        ]

        # backend/analytics/views.py (внутри DashboardStatsAPIView)

        return Response({
            'general_stats': {
                'total_appointments': total_appointments,
                'confirmed_appointments': confirmed_appointments,
                'confirmed_rate': confirmed_rate,
                'completed_appointments': completed_appointments,
                'completed_rate': completed_rate,
                'pending_appointments': pending_appointments,
                'pending_rate': pending_rate,
                'cancelled_appointments': cancelled_appointments,
                'cancelled_rate': cancelled_rate,
            },
            'popular_services': PopularServiceSerializer(popular_services, many=True).data,
            'popular_doctors': PopularDoctorSerializer(popular_doctors, many=True).data,
            # ✅ ДОБАВЛЯЕМ ДАННЫЕ ДЛЯ ДИАГРАММЫ
            'status_chart': [
                {
                    'status': 'pending',
                    'count': pending_appointments,  # Используем уже посчитанное значение
                    'color': '#FFA500',  # Оранжевый
                    'percentage': pending_rate  # Используем уже посчитанный процент
                },
                {
                    'status': 'confirmed',
                    'count': confirmed_appointments,
                    'color': '#007BFF',  # Синий
                    'percentage': confirmed_rate
                },
                {
                    'status': 'completed',
                    'count': completed_appointments,
                    'color': '#28A745',  # Зеленый
                    'percentage': completed_rate
                },
                {
                    'status': 'cancelled',
                    'count': cancelled_appointments,
                    'color': '#DC3545',  # Красный
                    'percentage': cancelled_rate
                }
            ]
        })


class AppointmentsTrendAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Get the period from request parameters (default to 30 days)
        days = int(request.GET.get('days', 30))
        start_date = datetime.now() - timedelta(days=days)

        # Group appointments by DATE (not datetime) and count them
        trend_data = Appointment.objects.filter(
            date_time__gte=start_date  # ← CHANGED: Use 'date_time' here
        ).annotate(
            date=TruncDate('date_time')  # ← CHANGED: And use 'date_time' here
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')

        # Format data for the frontend
        result = [
            {
                'date': item['date'].strftime('%Y-%m-%d'),
                'count': item['count']
            }
            for item in trend_data
        ]

        return Response(result)


class DoctorWorkloadAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Считаем количество записей для каждого врача
        workload_data = Doctor.objects.annotate(
            appointment_count=Count('appointment')
        ).values('id', 'first_name', 'last_name', 'appointment_count')

        # Форматируем данные
        result = [
            {
                'id': item['id'],
                'name': f"{item['first_name']} {item['last_name']}",
                'appointment_count': item['appointment_count']
            }
            for item in workload_data
        ]

        return Response(result)
