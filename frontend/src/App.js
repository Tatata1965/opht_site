// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AppointmentPage from './pages/AppointmentPage';
import LoginPage from './pages/LoginPage'; // Импортируем новые страницы
import RegisterPage from './pages/RegisterPage';
import DoctorsPage from './pages/DoctorsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Основной маршрут с Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="appointment" element={<AppointmentPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          {/* Добавляем новые маршруты для авторизации */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Маршрут для несуществующих страниц */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>404 - Страница не найдена</h2>
    <p>Извините, запрашиваемая страница не существует.</p>
  </div>
);

export default App;