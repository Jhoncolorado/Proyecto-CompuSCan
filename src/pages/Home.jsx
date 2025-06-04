import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Bienvenido a CompuScan Security</h1>
        <p className="subtitle">Sistema integral de gestión para aprendices y equipos del SENA</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <i className="fas fa-user-shield"></i>
          <h3>Registro Seguro</h3>
          <p>Protección de datos con cifrado avanzado</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-laptop-code"></i>
          <h3>Control de Equipos</h3>
          <p>Gestión detallada de dispositivos tecnológicos</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-bell"></i>
          <h3>Sistema de Alertas</h3>
          <p>Notificaciones en tiempo real</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-history"></i>
          <h3>Historial Completo</h3>
          <p>Seguimiento detallado de actividades</p>
        </div>
      </div>

      {user && (
        <div className="user-welcome">
          <h2>¡Hola, {user.nombre}!</h2>
          <p>Último acceso: {new Date().toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default Home; 