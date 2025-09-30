// components/AuthButtons.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AuthButtons = () => {
  const isLoggedIn = !!localStorage.getItem('authToken');

  // Получаем данные пользователя
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  // Проверяем является ли пользователь админом
  const isAdmin = userData.is_staff || userData.is_superuser;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#fbbf24', fontWeight: '500' }}>
          Добро пожаловать!
        </span>

        {/* 👇 ПОКАЗЫВАЕМ СТАТИСТИКУ ТОЛЬКО АДМИНАМ 👇 */}
        {isAdmin && (
          <Link to="/admin/dashboard" className="btn btn-secondary">
            📊 Статистика
          </Link>
        )}

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