# parsers/parsers/voka_service_parser.py
import re
from datetime import timedelta
from bs4 import BeautifulSoup
from .base_service_parser import BaseServiceParser


class VokaServiceParser(BaseServiceParser):
    SOURCE_NAME = 'voka'
    BASE_URL = 'https://voka.by'
    SERVICES_URL = f'{BASE_URL}/prices'

    SERVICE_CATEGORIES = {
        'Диагностика': ['диагностика', 'обследование', 'проверка', 'анализ', 'тест', 'осмотр'],
        'Лазерная коррекция': ['лазерная', 'лазер', 'коррекция', 'фемто', 'рефракционная'],
        'Хирургия': ['операция', 'хирурги', 'хирургия', 'удаление', 'имплантация'],
        'Лечение': ['лечение', 'терапия', 'процедура', 'инъекция', 'капли', 'курс'],
        'Консультация': ['консультация', 'приём', 'осмотр врача', 'визит']
    }

    def parse_services(self):
        html = self.get_html(self.SERVICES_URL)
        if not html:
            return []

        soup = BeautifulSoup(html, 'html.parser')
        services = []
        processed_services = set()
        categories_without_services = []

        sections = soup.select('.price-section-second-type, .price-section')

        if not sections:
            print("Не найдены секции с услугами")
            return []

        for section in sections:
            category_header = section.select_one('.price-cat-header, .price-section-title')
            if not category_header:
                continue

            category = self.clean_category_name(category_header.get_text(strip=True))
            print(f"Найдена категория: {category}")

            service_cards = section.select('.price-element, .service-item')
            category_service_count = 0

            for card in service_cards:
                try:
                    if 'price-item-disabled' in card.get('class', []):
                        continue

                    service_data = self.parse_service_card(card, category)
                    if not service_data:
                        continue

                    # Проверка: является ли это настоящей услугой
                    if not self.is_real_service(service_data['name'], service_data['description']):
                        print(f"Пропущена категория/не услуга: {service_data['name']}")
                        continue

                    # Проверка на дубликаты по названию и категории
                    service_id = f"{category}_{service_data['name']}"
                    if service_id in processed_services:
                        print(f"Пропущен дубликат: {service_data['name']}")
                        continue

                    processed_services.add(service_id)

                    service = self.save_service(service_data)
                    if service:
                        services.append(service)
                        category_service_count += 1
                        price_info = f"{service.price} руб." if service.price else "цена не указана"
                        print(f"Добавлена услуга: {service.name} ({price_info})")
                except Exception as e:
                    print(f"Ошибка обработки карточки услуги: {e}")

            # Отслеживаем категории без услуг
            if category_service_count == 0:
                categories_without_services.append(category)

        # Вывод информации о категориях без услуг
        if categories_without_services:
            print("\nКатегории без доступных услуг:")
            for cat in categories_without_services:
                print(f" - {cat}")

        # Статистика парсинга
        services_with_price = len([s for s in services if s.price and s.price > 0])
        total_services = len(services)

        print(f"\n=== СТАТИСТИКА VOKA ===")
        print(f"Всего услуг: {total_services}")
        print(f"Услуг с ценами: {services_with_price}")
        print(f"Услуг без цен: {total_services - services_with_price}")
        if total_services > 0:
            print(f"Процент покрытия цен: {services_with_price / total_services * 100:.1f}%")

        return services

    def is_real_service(self, name, description):
        """Проверяет, является ли текст настоящей услугой, а не категорией"""
        # Исключаем слишком короткие названия
        if len(name.strip()) < 5:
            return False

        # Ключевые слова, указывающие на категории, а не услуги
        category_indicators = [
            'категория', 'отделение', 'услуги', 'диагностика', 'лечение',
            'обследование', 'консультация', 'лазерная', 'хирургическое',
            'комплекс', 'программа', 'пакет', 'направление', 'виды'
        ]

        # Проверяем название
        name_lower = name.lower()
        if any(indicator in name_lower for indicator in category_indicators):
            # Если это похоже на категорию, проверяем длину
            if len(name) < 25:  # Короткие названия скорее категории
                return False

        return True

    def clean_category_name(self, name):
        """Очистка названия категории от лишних символов"""
        return re.sub(r'[\d()]', '', name).strip()

    def parse_service_card(self, card, category):
        """Парсит карточку услуги"""
        name_elem = card.select_one('.price-item__title, .service-title')
        if not name_elem:
            return None

        name = name_elem.get_text(strip=True)

        # Очистка названия от лишних пробелов
        name = re.sub(r'\s+', ' ', name)

        description_elem = card.select_one('.price-item-description, .service-description')
        description = ""
        if description_elem:
            # Улучшенная обработка HTML-описания
            for br in description_elem.find_all('br'):
                br.replace_with('\n')

            if description_elem.find('ul'):
                list_items = description_elem.select('li')
                description = "\n".join([f"- {li.get_text(strip=True)}" for li in list_items])
            else:
                description = description_elem.get_text('\n', strip=True)

        price_elem = card.select_one('.price-item__price, .service-price')
        price = None
        if price_elem:
            price_text = price_elem.get_text(strip=True)
            price = self.parse_price(price_text)

        # Улучшенная категоризация
        final_category = self.categorize_service(name, description, category)

        # Безопасное извлечение длительности
        duration = None
        try:
            duration = self.extract_duration(description) or self.extract_duration(name)
        except Exception as e:
            print(f"Ошибка извлечения длительности: {e}")

        # Генерация уникального ID с учетом категории
        external_id = f"voka_{final_category}_{name}"
        external_id = re.sub(r'\W+', '_', external_id.lower())[:100]

        return {
            'external_id': external_id,
            'name': name[:255],
            'description': description[:1000],
            'price': price,
            'duration': duration,
            'category': final_category
        }

    def parse_price(self, text):
        """Улучшенное извлечение цены из текста"""
        if not text:
            return None

        text_lower = text.lower()

        # Проверка на бесплатные услуги
        if any(word in text_lower for word in ['бесплатно', 'даром', 'бесплатная']):
            return 0.0

        # Очистка текста
        text_clean = text.replace(' ', '').replace(' ', '').replace(' ', '')

        # Игнорируем диапазоны цен ("100-200 руб")
        if '-' in text_clean or '—' in text_clean or 'от' in text_lower:
            return None

        # Расширенные паттерны для поиска цен
        price_patterns = [
            r'(\d+[.,]\d+)\s*(?:BYN|руб|р\.|₽|б\.р\.)',
            r'(\d+)\s*(?:BYN|руб|р\.|₽|б\.р\.)',
            r'(?:стоимость|цена)[:\s]*(\d+[.,]?\d*)',
            r'(\d+[.,]?\d*)\s*(?:BYN|руб)',
        ]

        for pattern in price_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    price_str = match.group(1).replace(',', '.')
                    price_val = float(price_str)
                    # Проверка на разумность цены (от 1 до 10000 BYN)
                    if 1 <= price_val <= 10000:
                        return price_val
                except (ValueError, IndexError):
                    continue

        return None

    def extract_duration(self, text):
        """Извлекает длительность услуги из текста"""
        if not text:
            return None

        time_match = re.search(
            r'(\d+)\s*(мин|час|ч|м|минут|минуты|час\.|мин\.)',
            text,
            re.IGNORECASE
        )

        if time_match:
            value = int(time_match.group(1))
            unit = time_match.group(2).lower()

            if unit in ['час', 'ч', 'час.', 'часов']:
                return timedelta(hours=value)
            else:
                return timedelta(minutes=value)
        return None

    def categorize_service(self, name, description, original_category):
        """Улучшенная категоризация услуг"""
        text = f"{name} {description}".lower()

        for category, keywords in self.SERVICE_CATEGORIES.items():
            if any(keyword in text for keyword in keywords):
                return category

        # Если не нашли категорию, используем оригинальную из парсера
        return self.clean_category_name(original_category) if len(original_category) < 50 else 'Другие услуги'

    def save_service(self, service_info):
        """Сохранение или обновление услуги в базе данных"""
        external_id = f"voka_{service_info['category']}_{service_info['name']}"
        external_id = re.sub(r'\W+', '_', external_id.lower())[:100]

        service_data = {
            'external_id': external_id,
            'name': service_info['name'][:255],
            'description': service_info.get('description', '')[:1000],
            'price': service_info.get('price'),
            'duration': service_info.get('duration'),
            'category': service_info.get('category', 'Основные услуги'),
        }

        return super().save_service(service_data)