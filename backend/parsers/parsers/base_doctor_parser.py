import requests
import re
from django.utils import timezone
from django.core.files.base import ContentFile
from doctors.models import Doctor
from services.models import Service
import logging

logger = logging.getLogger(__name__)


class BaseParser:
    SOURCE_NAME = None
    BASE_URL = None
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    def __init__(self):
        if not self.SOURCE_NAME or not self.BASE_URL:
            raise NotImplementedError("Дочерние классы должны определить SOURCE_NAME и BASE_URL")
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)

    def get_html(self, url):
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            logger.error(f"Ошибка при запросе к {url}: {e}")
            return None

    def parse_doctors(self, update=False):
        raise NotImplementedError("Дочерние классы должны реализовать этот метод")

    def parse_experience(self, text):
        """Извлечение опыта работы из текста"""
        if not text:
            return 0

        text = text.lower()

        # Ищем паттерны типа "стаж: более 15 лет", "стаж: 20 лет" и т.д.
        patterns = [
            r'стаж[:\s]*более\s*(\d+)',
            r'стаж[:\s]*(\d+)',
            r'опыт[:\s]*более\s*(\d+)',
            r'опыт[:\s]*(\d+)',
            r'(\d+)\s*год',
            r'(\d+)\s*лет'
        ]

        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                try:
                    return int(match.group(1))
                except:
                    pass

        return 0

    def save_doctor(self, data):
        """Сохранение врача в базу"""
        # Извлекаем услуги
        service_names = data.pop('services', [])

        # Создаем/обновляем врача
        doctor, created = Doctor.objects.update_or_create(
            source=self.SOURCE_NAME,
            external_id=data.get('external_id'),
            defaults={
                'first_name': data.get('first_name', ''),
                'last_name': data.get('last_name', ''),
                'middle_name': data.get('middle_name', ''),
                'phone': data.get('phone', ''),
                'email': data.get('email', ''),
                'specialization': data.get('specialization', ''),
                'experience': data.get('experience', 0),
                'education': data.get('education', ''),
                'bio': data.get('bio', ''),
                'parsed_at': timezone.now(),
                'raw_data': data,
                'is_verified': False,
            }
        )

        # Обработка услуг
        services = []
        for name in service_names:
            service, _ = Service.objects.get_or_create(
                name=name,
                defaults={
                    'description': f"{name} - услуга клиники",
                    'price': 0,  # Цену можно установить позже
                    'duration': timezone.timedelta(minutes=30)
                }
            )
            services.append(service)

        doctor.services.set(services)

        # Скачивание фото
        if data.get('photo_url'):
            self.download_photo(doctor, data['photo_url'])

        return doctor

    def download_photo(self, doctor, url):
        """Скачивание и сохранение фото врача"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()

            # Генерируем имя файла
            file_name = f"{self.SOURCE_NAME}_{doctor.external_id}.jpg"

            # Сохраняем в поле photo
            doctor.photo.save(file_name, ContentFile(response.content))
            doctor.save()
            logger.info(f"Фото сохранено для врача {doctor.id}")
        except Exception as e:
            logger.error(f"Ошибка загрузки фото: {e}")
