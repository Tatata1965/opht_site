import React, { useState, useEffect } from 'react';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/doctors/');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки врачей:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка врачей...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Наши врачи</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {doctors.map(doctor => (
          <div key={doctor.id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Заголовок с именем и клиникой */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#1e40af' }}>
                {doctor.last_name} {doctor.first_name} {doctor.middle_name}
              </h3>
              <span style={{
                padding: '6px 12px',
                backgroundColor: doctor.clinic === 'voka' ? '#3b82f6' : '#10b981',
                color: 'white',
                borderRadius: '15px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}>
                {doctor.clinic_display}
              </span>
            </div>

            {/* Фото врача */}
            {doctor.photo_url && (
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <img
                  src={doctor.photo_url}
                  alt={`Фото ${doctor.last_name}`}
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #f3f4f6'
                  }}
                />
              </div>
            )}

            {/* Информация о враче */}
            <div style={{ lineHeight: '1.6' }}>
              <p style={{ margin: '8px 0', fontWeight: '500' }}>
                {doctor.specialization}
              </p>

              {doctor.experience > 0 && (
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <strong>Стаж:</strong> {doctor.experience} лет
                </p>
              )}

              {doctor.bio && (
                <p style={{ margin: '8px 0', color: '#555', fontSize: '0.9rem' }}>
                  {doctor.bio.length > 150 ? doctor.bio.substring(0, 150) + '...' : doctor.bio}
                </p>
              )}

              {/* Услуги врача */}
              {doctor.services && doctor.services.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ margin: '5px 0', fontWeight: '500', fontSize: '0.9rem' }}>Основные услуги:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {doctor.services.slice(0, 3).map(service => (
                      <span key={service.id} style={{
                        padding: '2px 8px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}>
                        {service.name}
                      </span>
                    ))}
                    {doctor.services.length > 3 && (
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>
                        +{doctor.services.length - 3} еще
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;