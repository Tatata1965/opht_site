from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    # В list_display ДОБАВЛЯЕМ 'status' для list_editable
    list_display = (
        'id',
        'get_patient_name',
        'get_doctor_name',
        'get_service_name',
        'date_time',
        'status'  # ← ДОБАВЛЯЕМ ЭТО ПОЛЕ
    )

    # ТЕПЕРЬ можно использовать list_editable
    list_editable = ('status',)

    list_filter = ('status', 'doctor', 'service', 'date_time')
    search_fields = (
        'patient__first_name',
        'patient__last_name',
        'doctor__first_name',
        'doctor__last_name',
        'service__name'
    )
    date_hierarchy = 'date_time'

    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}"
        return "-"

    get_patient_name.short_description = 'Пациент'

    def get_doctor_name(self, obj):
        return f"{obj.doctor.first_name} {obj.doctor.last_name}"

    get_doctor_name.short_description = 'Врач'

    def get_service_name(self, obj):
        return obj.service.name

    get_service_name.short_description = 'Услуга'

    # Массовые действия
    actions = ['make_confirmed', 'make_completed', 'make_cancelled', 'make_pending']

    def make_pending(self, request, queryset):
        count = queryset.update(status='pending')
        self.message_user(request, f'{count} записей переведено в ожидание')

    make_pending.short_description = '🔄 Перевести в ожидание'

    def make_confirmed(self, request, queryset):
        count = queryset.update(status='confirmed')
        self.message_user(request, f'{count} записей подтверждено')

    make_confirmed.short_description = '✅ Подтвердить записи'

    def make_completed(self, request, queryset):
        count = queryset.update(status='completed')
        self.message_user(request, f'{count} записей завершено')

    make_completed.short_description = '✅ Завершить записи'

    def make_cancelled(self, request, queryset):
        count = queryset.update(status='cancelled')
        self.message_user(request, f'{count} записей отменено')

    make_cancelled.short_description = '❌ Отменить записи'