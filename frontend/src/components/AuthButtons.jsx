// components/AuthButtons.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AuthButtons = () => {
  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/'; // Перезагружаем страницу
  };

  if (isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#4b5563' }}>Добро пожаловать!</span>
        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{ marginLeft: '10px' }}
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