import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleAppointment = () => {
    // Переходим на страницу записи с ID услуги
    navigate(`/appointment?service=${service.id}`);
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: '100%'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.1rem' }}>
        {service.name}
      </h3>

      <div style={{ marginBottom: '10px' }}>
        <span style={{
          padding: '4px 8px',
          backgroundColor: service.source === 'voka' ? '#e3f2fd' : '#f3e5f5',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: service.source === 'voka' ? '#1976d2' : '#7b1fa2'
        }}>
          {service.source.toUpperCase()}
        </span>
      </div>

      {service.price && service.price !== "0.00" && (
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1976d2', margin: '10px 0' }}>
          {service.price} руб.
        </p>
      )}

      {service.category && (
        <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>
          <strong>Категория:</strong> {service.category}
        </p>
      )}

      {service.description && (
        <p style={{
          margin: '10px 0',
          color: '#555',
          lineHeight: '1.4',
          fontSize: '0.9rem'
        }}>
          {service.description}
        </p>
      )}

      <button
        onClick={handleAppointment}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '15px',
          fontSize: '0.9rem'
        }}
      >
        Записаться
      </button>
    </div>
  );
};

export default ServiceCard;