# parsers/parsers/voka_service_parser.py
import re
from datetime import timedelta
from bs4 import BeautifulSoup
from .base_service_parser import BaseServiceParser


class VokaServiceParser(BaseServiceParser):
    SOURCE_NAME = 'voka'
    BASE_URL = 'https://voka.by'
    SERVICES_URL = f'{BASE_URL}/prices'

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

        return services

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

        # Безопасное извлечение длительности
        duration = None
        try:
            duration = self.extract_duration(description) or self.extract_duration(name)
        except Exception as e:
            print(f"Ошибка извлечения длительности: {e}")

        # Генерация уникального ID с учетом категории
        external_id = f"voka_{category}_{name}"
        external_id = re.sub(r'\W+', '_', external_id.lower())[:100]

        return {
            'external_id': external_id,
            'name': name[:255],
            'description': description[:1000],
            'price': price,
            'duration': duration,
            'category': category
        }

    def parse_price(self, text):
        """Извлекает цену из текста"""
        if 'бесплатно' in text.lower() or 'даром' in text.lower():
            return 0.0

        text = text.replace(' ', '').replace(' ', '')

        # Игнорируем некорректные значения цен
        if '-' in text or '—' in text:
            return None

        match = re.search(r'(\d+[.,]?\d*)', text)
        if match:
            try:
                price_str = match.group(1).replace(',', '.')
                return float(price_str)
            except ValueError:
                return None
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