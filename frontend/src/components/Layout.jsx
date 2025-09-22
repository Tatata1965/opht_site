import React from 'react';
import { Outlet } from 'react-router-dom'; // Импортируем Outlet
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        {/* Outlet будет отображать текущий маршрут */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;