import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import '../../styles/header.css';
import logo from '../../assets/Imagen .jpg';

const Header = () => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <header className="header header-institutional">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="header-center">
        <h1>CompuScan Security</h1>
      </div>
      <div className="header-right">
        <div className="header-user-info">
          <span className="header-user-name">{user?.nombre || 'Usuario'}</span>
          <small className="header-user-role">{user?.rol || 'Rol'}</small>
        </div>
        <div className="header-time">
          <div className="date">{formatDate(currentTime)}</div>
          <div className="time">{formatTime(currentTime)}</div>
        </div>
        <button className="logout-button" onClick={logout}>
          <FaSignOutAlt />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header; 