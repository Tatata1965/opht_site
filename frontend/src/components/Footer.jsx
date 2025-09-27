import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Слева: телефон */}
          <div className="footer-left">
            <p>тел: +375-29-2345672</p>
          </div>

          {/* Центр: неотложная помощь */}
          <div className="footer-center">
            <p>Неотложная офтальмологическая помощь: ул. Уборевича, 73</p>
          </div>

          {/* Право: партнеры */}
          <div className="footer-right">
            <a href="https://voka.by" target="_blank" rel="noopener noreferrer">Voka</a>
            <a href="https://optimed.by" target="_blank" rel="noopener noreferrer">Optimed</a>
            <span>Наши партнеры: </span>
            <a href="https://lode.by" target="_blank" rel="noopener noreferrer">Lode</a>
            <a href="https://mercimed.by" target="_blank" rel="noopener noreferrer">Merci</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;