// // pages/RegisterPage.jsx
// import React, { useState, useEffect } from 'react';
// import RegisterForm from '../components/RegisterForm';
//
// const RegisterPage = () => {
//   const [formKey, setFormKey] = useState(0); // 🔑 Ключ для сброса формы
//
//   // Сбрасываем форму при загрузке страницы
//   useEffect(() => {
//     setFormKey(prev => prev + 1); // 🔑 Увеличиваем ключ при загрузке
//   }, []);
//
//   const handleSwitchToLogin = () => {
//     window.location.href = '/login'; // Перенаправляем на страницу входа
//   };
//
//   return (
//     <div style={{
//       maxWidth: '400px',
//       margin: '50px auto',
//       padding: '20px',
//       border: '1px solid #ddd',
//       borderRadius: '8px'
//     }}>
//       <RegisterForm
//         key={formKey} // 🔑 Передаем ключ форме!
//         onSwitchToLogin={handleSwitchToLogin}
//       />
//     </div>
//   );
// };
//
// export default RegisterPage;

// pages/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;