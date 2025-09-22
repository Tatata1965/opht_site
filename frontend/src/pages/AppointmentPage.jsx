import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AppointmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const serviceId = queryParams.get('service');

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    service: serviceId || '',
    doctor: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Для записи на прием необходимо войти в систему');
      navigate('/login');
      return;
    }

    fetchServices();
    fetchDoctors();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/services/');
      if (response.ok) {
        const servicesData = await response.json();
        setServices(servicesData);
      }
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/doctors/');
      if (response.ok) {
        const doctorsData = await response.json();
        setDoctors(doctorsData);
      }
    } catch (error) {
      console.error('Ошибка загрузки врачей:', error);
    }
  };

  const selectedService = services.find(service => service.id.toString() === serviceId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.doctor) {
      setError('Пожалуйста, выберите врача из списка');
      setIsLoading(false);
      return;
    }

    alert('Проверяем данные: врач - ' + formData.doctor + ', услуга - ' + formData.service);

    try {
      const token = localStorage.getItem('authToken');

      const appointmentData = {
        doctor_id: formData.doctor,    // изменили doctor на doctor_id
        service_id: formData.service,  // изменили service на service_id
        date_time: new Date(`${formData.date}T${formData.time}:00`).toISOString(),
        notes: formData.notes
      };

      const response = await fetch('http://localhost:8000/api/appointments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(appointmentData)
      });

      if (response.ok) {
        alert('Заявка на запись успешно отправлена! Мы свяжемся с вами для подтверждения.');
        navigate('/');
      } else {
        throw new Error('Ошибка при отправке записи');
      }

    } catch (err) {
      setError('Ошибка при отправке. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!services.length || !doctors.length) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#1e40af'
      }}>
        {selectedService ? `Запись на "${selectedService.name}"` : 'Запись на прием'}
      </h2>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        {error && (
          <div style={{
            color: '#dc2626',
            backgroundColor: '#fef2f2',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {selectedService && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#eef2ff', borderRadius: '6px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Выбранная услуга:</h3>
              <p style={{ margin: '5px 0' }}>{selectedService.name}</p>
              {selectedService.price && (
                <p style={{ margin: '5px 0' }}>Стоимость: {selectedService.price} BYN</p>
              )}
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Врач *</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            >
              <option value="">Выберите врача</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.last_name} {doctor.first_name} {doctor.middle_name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {!serviceId && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Услуга *</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
              >
                <option value="">Выберите услугу</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} {service.price && `- ${service.price} BYN`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Дата *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Время *</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
              >
                <option value="">Выберите время</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Комментарий</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {isLoading ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentPage;