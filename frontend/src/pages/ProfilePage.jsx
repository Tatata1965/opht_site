// components/AuthButtons.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AuthButtons = () => {
  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  if (isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link
          to="/profile"
          className="btn btn-secondary"
          style={{ marginRight: '10px' }}
        >
          Личный кабинет
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-secondary"
        >
          Выйти
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Link to="/login" className="btn btn-secondary">
        Войти
      </Link>
      <Link to="/register" className="btn btn-primary">
        Регистрация
      </Link>
    </div>
  );
};

export default AuthButtons;