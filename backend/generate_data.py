import os
import django
from faker import Faker
from datetime import timedelta, datetime
import random
import pytz

# 1. Настройка окружения Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ophthalmology.settings')
django.setup()

# 2. Импорт моделей ПОСЛЕ настройки окружения
from users.models import User
from doctors.models import Doctor
from services.models import Service
from appointments.models import Appointment

# 3. Генерация данных
fake = Faker('ru_RU')

def create_data():
    # Создаем пользователей (пациентов)
    patients = []
    for _ in range(10):
        user = User.objects.create_user(
            username=fake.user_name(),
            password='testpass123',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.email(),
            phone=fake.phone_number(),
            birth_date=fake.date_of_birth(minimum_age=18, maximum_age=90)
        )
        patients.append(user)
        print(f'Создан пациент: {user.username}')

    # Создаем врачей
    specialization = ['Ретинолог', 'Витреальный хирург', 'Лазерный хирург',
                     'Детский офтальмолог', 'Онкоофтальмолог']
    doctors = []
    for _ in range(5):
        # Создаем врача напрямую, без привязки к User
        doctor = Doctor.objects.create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            middle_name=fake.middle_name(),  # Добавили отчество
            phone=fake.phone_number(),
            email=fake.email(),
            specialization=random.choice(specialization),
            experience=random.randint(3, 30),
            education=fake.text(max_nb_chars=200),
            bio=fake.text(max_nb_chars=500),
            # Указываем источник и уникальный ID
            source='manual',
            external_id=f"manual_{fake.uuid4()}"[:50],
            # Устанавливаем время парсинга
            parsed_at=datetime.now(pytz.utc)
        )
        doctors.append(doctor)
        print(f'Создан врач: {doctor.get_full_name()}')

    # Создаем услуги
    services = []
    service_names = ['Консультация', 'Диагностика', 'Лазерная коррекция',
                    'Лечение глаукомы', 'УЗИ глаза']
    for name in service_names:
        service = Service.objects.create(
            name=name,
            description=fake.text(max_nb_chars=300),
            price=random.uniform(500, 10000),
            duration=timedelta(minutes=random.randint(15, 120))
        )
        services.append(service)
        print(f'Создана услуга: {name}')

    # Связываем врачей с услугами
    for doctor in doctors:
        # Каждому врачу назначаем 2-4 случайные услуги
        selected_services = random.sample(services, k=random.randint(2, 4))
        doctor.services.set(selected_services)
        print(f'Врачу {doctor.get_full_name()} назначены услуги: {", ".join(s.name for s in selected_services)}')

    # Создаем записи на прием
    for i in range(15):
        start_date = fake.date_time_between(start_date='-30d', end_date='+30d', tzinfo=pytz.utc)
        appointment = Appointment.objects.create(
            patient=random.choice(patients),
            doctor=random.choice(doctors),
            service=random.choice(services),
            date_time=start_date,
            notes=fake.text(max_nb_chars=200),
            status=random.choice(['pending', 'confirmed'])
        )
        print(f'Создана запись #{i + 1} на {start_date} для {appointment.patient}')

    print("✅ Тестовые данные успешно созданы!")

if __name__ == '__main__':
    create_data()