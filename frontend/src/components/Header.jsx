// components/Header.jsx
import { Link } from 'react-router-dom';
import AuthButtons from './AuthButtons'; // Добавьте этот импорт

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          {/* Логотип с ссылкой на главную */}
          <Link to="/" className="logo">
            <h1>ОфтальмоЦентр</h1>
            <p>Ваше зрение - наша забота</p>
          </Link>

          {/* Основная навигация */}
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/services">Услуги</Link></li>
              <li><Link to="/appointment">Запись</Link></li>
              <li><a href="doctors">Врачи</a></li>
              <li><a href="#contacts">Контакты</a></li>
            </ul>
          </nav>

          {/* Кнопки действий - ЗАМЕНИТЕ этот блок */}
          <div className="header-actions">
            <AuthButtons /> {/* Заменили кнопки на компонент авторизации */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;