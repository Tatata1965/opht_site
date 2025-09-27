import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Компактный баннер */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '1.8rem',
          color: '#1e40af',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          Офтальмологический центр
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#4b5563',
          marginBottom: '20px'
        }}>
          Современная диагностика и лечение заболеваний глаз
        </p>
        <button
          onClick={() => navigate('/appointment')}
          style={{
            padding: '10px 20px',
            fontSize: '0.9rem',
            backgroundColor: '#ff6b00',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Записаться на прием
        </button>
      </div>

      {/* Фото и краткие преимущества */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXllJTIwZXhhbWluYXRpb258ZW58MHx8MHx8fDA%3D"
            alt="Диагностика зрения"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <p style={{ marginTop: '10px', fontWeight: '500' }}>Современная диагностика</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1758656321519-02fb5f48dc7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGV5ZSUyMGV4YW1pbmF0aW9ufGVufDB8fDB8fHww"
            alt="Офтальмологическое оборудование"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <p style={{ marginTop: '10px', fontWeight: '500' }}>Новейшее оборудование</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=200&fit=crop"
            alt="Врач офтальмолог"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <p style={{ marginTop: '10px', fontWeight: '500' }}>Опытные специалисты</p>
        </div>
      </div>

      {/* Минимум текста */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/services')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Услуги
          </button>
          <button
            onClick={() => navigate('/doctors')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Врачи
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;