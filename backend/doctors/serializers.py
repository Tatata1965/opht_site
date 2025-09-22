from rest_framework import serializers
from .models import Doctor
from services.serializers import ServiceSerializer


class DoctorSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = '__all__'

    def get_photo_url(self, obj):
        if obj.photo:
            return self.context['request'].build_absolute_uri(obj.photo.url)
        return None