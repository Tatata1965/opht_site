import React, { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    source: '',      // вместо clinic
    category: '',
    city: 'Минск'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/services/');
      if (!response.ok) {
        throw new Error('Ошибка загрузки услуг');
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Правильная фильтрация по реальным данным
  const filteredServices = services.filter(service => {
    return (
      (filters.source === '' || service.source === filters.source) &&
      (filters.category === '' || service.category === filters.category)
    );
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Офтальмологические услуги в РБ
      </h1>

      {/* Фильтры */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Клиника</label>
          <select
            style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
          >
            <option value="">Все клиники</option>
            <option value="voka">Voka</option>
            <option value="optimed">Optimed</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Категория</label>
          <select
            style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">Все категории</option>
            <option value="Диагностика зрения">Диагностика</option>
            <option value="Микрохирургия">Микрохирургия</option>
            <option value="Лазерная коррекция">Лазерная коррекция</option>
            <option value="Лечение заболеваний">Лечение</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Город</label>
          <select
            style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <option value="Минск">Минск</option>
            <option value="Гродно">Гродно</option>
          </select>
        </div>
      </div>

      {/* Список услуг */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Загрузка услуг...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Ошибка: {error}</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Услуги по выбранным фильтрам не найдены</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>

          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;