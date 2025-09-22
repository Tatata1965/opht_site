from rest_framework import serializers

from doctors.models import Doctor
from services.models import Service
from .models import Appointment
from users.serializers import UserSerializer
from doctors.serializers import DoctorSerializer
from services.serializers import ServiceSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)

    # ДОБАВЬТЕ ЭТИ ПОЛЯ ДЛЯ ЗАПИСИ:
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(),
        source='doctor',
        write_only=True
    )
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True
    )

    class Meta:
        model = Appointment
        fields = '__all__'