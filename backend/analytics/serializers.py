# backend/analytics/serializers.py
from rest_framework import serializers


class PopularServiceSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    appointment_count = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)


class PopularDoctorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    middle_name = serializers.CharField(allow_blank=True)
    full_name = serializers.SerializerMethodField()  # Вычисляемое поле
    appointment_count = serializers.IntegerField()
    specialization = serializers.CharField()
    experience = serializers.IntegerField()

    def get_full_name(self, obj):
        return obj.get_full_name()


# backend/analytics/serializers.py
class GeneralStatsSerializer(serializers.Serializer):
    total_appointments = serializers.IntegerField()
    confirmed_appointments = serializers.IntegerField()
    confirmed_rate = serializers.FloatField()        # ← переименовали
    pending_appointments = serializers.IntegerField()
    pending_rate = serializers.FloatField()          # ← добавили
    cancelled_appointments = serializers.IntegerField()
    cancelled_rate = serializers.FloatField()        # ← добавили