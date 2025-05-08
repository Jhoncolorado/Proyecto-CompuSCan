import React from 'react';
import { FaUsers, FaDesktop, FaBell, FaHistory } from 'react-icons/fa';
import './home.css';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const now = new Date();
  const formatDate = (date) =>
    new Intl.DateTimeFormat('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);

  return (
    <div className="home-container">
      {user && (
        <div className="dashboard-welcome">
          <h2>¡Hola, <span className="dashboard-user-name">{user.nombre}</span>!</h2>
          <p>Último acceso: <b>{formatDate(now)}</b></p>
          <p>Rol: <b>{user.rol}</b></p>
        </div>
      )}
      <h1 className="page-title">Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Usuarios Activos</h2>
            <div className="card-icon">
              <FaUsers />
            </div>
          </div>
          <div className="card-value">150</div>
          <p className="card-description">Total de usuarios registrados en el sistema</p>
          <div className="card-footer">
            <div className="card-trend trend-up">
              <span>↑ 12% este mes</span>
            </div>
            <a href="/users" className="card-link">Ver detalles</a>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Dispositivos</h2>
            <div className="card-icon">
              <FaDesktop />
            </div>
          </div>
          <div className="card-value">45</div>
          <p className="card-description">Dispositivos monitoreados actualmente</p>
          <div className="card-footer">
            <div className="card-trend trend-up">
              <span>↑ 5% esta semana</span>
            </div>
            <a href="/devices" className="card-link">Ver detalles</a>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Alertas</h2>
            <div className="card-icon">
              <FaBell />
            </div>
          </div>
          <div className="card-value">8</div>
          <p className="card-description">Alertas pendientes de revisión</p>
          <div className="card-footer">
            <div className="card-trend trend-down">
              <span>↓ 3% desde ayer</span>
            </div>
            <a href="/alerts" className="card-link">Ver detalles</a>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Actividad Reciente</h2>
            <div className="card-icon">
              <FaHistory />
            </div>
          </div>
          <div className="card-value">24</div>
          <p className="card-description">Eventos registrados en las últimas 24 horas</p>
          <div className="card-footer">
            <div className="card-trend trend-up">
              <span>↑ 8% desde ayer</span>
            </div>
            <a href="/history" className="card-link">Ver detalles</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 