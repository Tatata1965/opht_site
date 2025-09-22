import React, { useState, useEffect } from 'react';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/doctors/');
      if (!response.ok) {
        throw new Error('Ошибка загрузки врачей');
      }
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка врачей...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Наши врачи</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {doctors.map(doctor => (
          <div key={doctor.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <h3>{doctor.first_name} {doctor.last_name}</h3>
            <p>{doctor.specialization}</p>
            {doctor.photo && (
              <img
                src={doctor.photo}
                alt={doctor.first_name}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;