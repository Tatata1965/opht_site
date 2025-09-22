import React from 'react';

const HomePage = () => {
  return (
    <div style={{
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        color: '#1e40af',
        marginBottom: '20px',
        fontWeight: 'bold'
      }}>
        Добро пожаловать в офтальмологический центр!
      </h2>
      <p style={{
        fontSize: '1.1rem',
        color: '#4b5563',
        lineHeight: '1.6'
      }}>
        Мы предлагаем современные методы диагностики и лечения заболеваний глаз
      </p>
    </div>
  );
};

export default HomePage;