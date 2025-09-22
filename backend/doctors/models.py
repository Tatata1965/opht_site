from django.db import models
from django.utils import timezone
from django.conf import settings
from services.models import Service


class Doctor(models.Model):
    # Личная информация
    first_name = models.CharField(max_length=50, verbose_name='Имя')
    last_name = models.CharField(max_length=50, verbose_name='Фамилия')
    middle_name = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Отчество'
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Телефон'
    )
    email = models.EmailField(
        blank=True,
        verbose_name='Email'
    )

    # Профессиональная информация
    specialization = models.CharField(
        max_length=100,
        verbose_name='Специализация'
    )
    experience = models.PositiveIntegerField(
        default=0,
        verbose_name='Опыт работы (лет)'
    )
    education = models.TextField(
        blank=True,
        verbose_name='Образование'
    )
    bio = models.TextField(
        blank=True,
        verbose_name='Биография'
    )

    # Фото врача
    photo = models.ImageField(
        upload_to='doctors/',
        blank=True,
        null=True,
        verbose_name='Фотография'
    )

    # Связь с пользователем (необязательная)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='doctor_profile',
        verbose_name='Пользовательская запись'
    )

    # Услуги врача
    services = models.ManyToManyField(
        Service,
        related_name='doctors',
        blank=True,
        verbose_name='Услуги'
    )

    # Поля для парсинга
    source = models.CharField(
        max_length=50,
        choices=[
            ('voka', 'Voka'),
            ('optimed', 'Optimed'),
            ('manual', 'Ручное добавление'),
        ],
        default='manual',
        verbose_name='Источник данных'
    )
    external_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Внешний ID'
    )
    parsed_at = models.DateTimeField(
        null=True,  # Разрешить NULL в базе
        blank=True,  # Разрешить пустое значение в формах
        verbose_name='Время последнего парсинга'
    )

    raw_data = models.JSONField(
        blank=True,
        null=True,
        verbose_name='Сырые данные парсинга'
    )

    # Дополнительные поля
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Проверен администратором'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    class Meta:
        verbose_name = 'Врач'
        verbose_name_plural = 'Врачи'
        ordering = ['last_name', 'first_name']
        unique_together = [('source', 'external_id')]
        indexes = [
            models.Index(fields=['last_name', 'first_name']),
            models.Index(fields=['specialization']),
        ]

    def __str__(self):
        return f"{self.last_name} {self.first_name} {self.middle_name or ''}".strip()

    def get_full_name(self):
        """Возвращает полное имя врача"""
        return f"{self.last_name} {self.first_name} {self.middle_name or ''}".strip()

    def get_photo_url(self):
        """Возвращает URL фотографии или None"""
        return self.photo.url if self.photo else None
