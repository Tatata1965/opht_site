import React from 'react';
import Accordion from './Accordion';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-columns">
          {/* Колонка 1: Контакты */}
          <div className="footer-col">
            <h3>Контакты</h3>
            <address>
              <p>тел: <a href="tel:+375-29-2345672">+375-29-2345672</a></p>
              <p>email: <a href="mailto:info@ophthalmocenter.by">info@ophthalmocenter.by</a></p>
            </address>
          </div>

          {/* Колонка 2: Часы работы */}
          <div className="footer-col">
            <h3>Часы работы</h3>
            <p>Пн-Пт: 9:00 - 21:00</p>
            <p>Сб-Вс: 10:00 - 18:00</p>
            <p>Без выходных</p>
          </div>

          {/* Колонка 3: Экстренная помощь */}
          <div className="footer-col">
            <h3>Экстренная помощь</h3>
            <p>При травмах глаза:</p>
            <p className="emergency-phone">++375-29-2345673</p>
           </div>

          {/* Колонка 4: Партнеры */}
          <div className="footer-col">
            <h3>Наши партнеры</h3>
            <div className="partners">
              <span>Voka</span>
              <span>Optimed</span>
              <span>Lode</span>
              <span>Mersi</span>
            </div>
          </div>
        </div>

        {/* Социальные сети и копирайт */}
        <div className="footer-bottom">
          <div className="social-links">
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="YouTube">YT</a>
          </div>
          <p>© {new Date().getFullYear()} Офтальмологический центр. Лицензия № ЛО-77-01-012345</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;