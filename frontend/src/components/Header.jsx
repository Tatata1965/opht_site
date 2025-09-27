import { Link } from 'react-router-dom';
import AuthButtons from './AuthButtons';

const Header = () => {
  return (
    <header className="header">
      <div className="container"> {/* ВЕРНУЛИ КОНТЕЙНЕР */}
        <div className="header-inner">
          <Link to="/" className="logo">
            <h1>ОфтальмоЦентр</h1>
            <p>Ваше зрение - наша забота</p>
          </Link>

          <nav className="main-nav">
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/services">Услуги</Link></li>
              <li><Link to="/doctors">Врачи</Link></li>
              <li><Link to="/appointment">Запись</Link></li>
            </ul>
          </nav>

          <div className="header-actions">
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;