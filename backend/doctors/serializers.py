from rest_framework import serializers
from .models import Doctor
from services.serializers import ServiceSerializer


class DoctorSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    photo_url = serializers.SerializerMethodField()
    clinic = serializers.SerializerMethodField()  # ← ДОБАВИТЬ
    clinic_display = serializers.SerializerMethodField()  # ← ДОБАВИТЬ

    class Meta:
        model = Doctor
        fields = '__all__'

    def get_photo_url(self, obj):
        if obj.photo:
            return self.context['request'].build_absolute_uri(obj.photo.url)
        return None

    # ДОБАВИТЬ ЭТИ ДВА МЕТОДА:
    def get_clinic(self, obj):
        """Возвращает код клиники (voka/optimed)"""
        return obj.source

    def get_clinic_display(self, obj):
        """Возвращает читаемое название клиники"""
        clinic_map = {
            'voka': 'Voka',
            'optimed': 'Optimed',
            'manual': 'Ручной ввод'
        }
        return clinic_map.get(obj.source, obj.source)