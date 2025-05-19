import React, { useEffect, useState } from 'react';
import { 
  FaUsers, 
  FaDesktop, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaChartLine, 
  FaBell, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaCalendarAlt,
  FaUserCircle,
  FaIdCard,
  FaCrown,
  FaRegClock,
  FaBriefcase
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './home.css';
import { Link } from 'react-router-dom';

// Componente para mostrar la fecha actual
const CurrentDateDisplay = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  return (
    <div className="current-date">
      <FaCalendarAlt />
      <span>{currentDate.toLocaleDateString('es-ES', options)}</span>
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const formatDate = (date) =>
    new Intl.DateTimeFormat('es-ES', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('http://localhost:3000/api/dashboard/stats');
        if (!res.ok) throw new Error('Error al cargar estadísticas');
        
        // Usamos los datos reales del backend sin simular nada
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <h3>Error al cargar el dashboard</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="reload-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section ELIMINADO */}
      {/* <header className="dashboard-header">
        <div className="welcome-message">
          <div className="user-avatar">
            {user?.foto ? (
              <img src={user.foto} alt="Avatar" />
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div className="welcome-text">
            <h2>¡Bienvenido, <span className="highlight-name">{user?.nombre || 'Usuario'}</span>!</h2>
            <p>Último acceso: {formatDate(new Date())}</p>
          </div>
        </div>
        <CurrentDateDisplay />
      </header> */}
      <h1 className="dashboard-title">Panel de Control</h1>
      {/* Panel de Bienvenida con estilos directos */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        marginBottom: '1.8rem',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.07)',
        overflow: 'hidden',
        border: '1px solid rgba(230, 235, 240, 0.6)'
      }}>
        {/* Encabezado verde con foto y nombre */}
        <div style={{
          background: 'linear-gradient(90deg, #388e3c 80%, #43a047 100%)',
          padding: '1.3rem 2rem',
          textAlign: 'left',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)'
          }}>
            {user?.foto ? (
              <img src={user.foto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <FaUserCircle style={{ color: '#71c585', fontSize: '2rem' }} />
            )}
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0'
          }}>
            ¡Bienvenido, <span style={{
              color: 'white',
              fontWeight: '700'
            }}>{user?.nombre || 'Administrador'}</span>!
          </h2>
        </div>
        
        {/* Grid de información */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '1.5rem',
          gap: '1rem',
          backgroundColor: 'white'
        }}>
          {/* Usuario */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.8rem',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: '0'
            }}>
              <FaIdCard style={{ fontSize: '1rem', color: '#71c585' }} />
            </div>
            <div>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#666',
                margin: '0 0 0.3rem'
              }}>Usuario</h4>
              <p style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#333',
                margin: '0'
              }}>{user?.usuario || user?.email || 'admin'}</p>
            </div>
          </div>
          
          {/* Rol */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.8rem',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: '0'
            }}>
              <FaCrown style={{ fontSize: '1rem', color: '#71c585' }} />
            </div>
            <div>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#666',
                margin: '0 0 0.3rem'
              }}>Rol</h4>
              <p style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#333',
                margin: '0'
              }}>{user?.rol || 'administrador'}</p>
            </div>
          </div>
          
          {/* Último acceso */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.8rem',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: '0'
            }}>
              <FaRegClock style={{ fontSize: '1rem', color: '#71c585' }} />
            </div>
            <div>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#666',
                margin: '0 0 0.3rem'
              }}>Último acceso</h4>
              <p style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#333',
                margin: '0'
              }}>{user?.ultimoAcceso ? formatDate(new Date(user.ultimoAcceso)) : '17 de mayo de 2025, 20:24'}</p>
            </div>
          </div>
          
          {/* Sesión activa */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.8rem',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: '0'
            }}>
              <FaBriefcase style={{ fontSize: '1rem', color: '#71c585' }} />
            </div>
            <div>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#666',
                margin: '0 0 0.3rem'
              }}>Sesión activa desde</h4>
              <p style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#333',
                margin: '0'
              }}>{formatDate(new Date())}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Stats Cards */}
      <div className="stats-overview">
        <div className="stat-card users">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Usuarios</h3>
            <div className="stat-value">{stats?.usuarios || 0}</div>
            <p>Total registrados</p>
          </div>
          <Link to="/users" className="stat-link">Ver detalles</Link>
        </div>
        
        <div className="stat-card devices">
          <div className="stat-icon">
            <FaDesktop />
          </div>
          <div className="stat-content">
            <h3>Dispositivos</h3>
            <div className="stat-value">{stats?.dispositivos || 0}</div>
            <p>Total registrados</p>
          </div>
          <Link to="/devices" className="stat-link">Ver detalles</Link>
        </div>
        
        <div className="stat-card activity">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Actividad Hoy</h3>
            <div className="stat-value">{stats?.actividad?.total || 0}</div>
            <div className="activity-breakdown">
              <div className="activity-item">
                <FaSignInAlt className="in-icon" />
                <span>{stats?.actividad?.entradas || 0}</span>
                </div>
              <div className="activity-item">
                <FaSignOutAlt className="out-icon" />
                <span>{stats?.actividad?.salidas || 0}</span>
              </div>
            </div>
          </div>
          <Link to="/history" className="stat-link">Ver historial</Link>
        </div>
      </div>
      
      {/* Secondary Content */}
      <div className="dashboard-panels">
        {/* Device Status */}
        <div className="dashboard-panel device-status">
          <h3 className="panel-title">Estado de Dispositivos</h3>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-icon approved">
                <FaCheckCircle />
              </div>
              <div className="status-count">{stats?.estadoDispositivos?.aprobados || 0}</div>
              <div className="status-label">Aprobados</div>
            </div>
            <div className="status-item">
              <div className="status-icon pending">
                <FaClock />
              </div>
              <div className="status-count">{stats?.estadoDispositivos?.pendientes || 0}</div>
              <div className="status-label">Pendientes</div>
                </div>
            <div className="status-item">
              <div className="status-icon rejected">
                <FaTimesCircle />
              </div>
              <div className="status-count">{stats?.estadoDispositivos?.rechazados || 0}</div>
              <div className="status-label">Rechazados</div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="dashboard-panel recent-activity">
          <h3 className="panel-title">Actividad Reciente</h3>
          <div className="activity-list">
            {stats?.actividadReciente?.length > 0 ? (
              stats.actividadReciente.map(activity => (
                <div key={activity.id} className="activity-item-card">
                  <div className={`activity-type ${activity.tipo.toLowerCase()}`}>
                    {activity.tipo === "ENTRADA" ? <FaSignInAlt /> : <FaSignOutAlt />}
                  </div>
                  <div className="activity-details">
                    <div className="activity-user">{activity.usuario}</div>
                    <div className="activity-device">{activity.dispositivo}</div>
                  </div>
                  <div className="activity-time">{activity.fecha}</div>
                </div>
              ))
            ) : (
              <p className="no-data">No hay actividad reciente</p>
            )}
          </div>
          <Link to="/history" className="view-all-link">Ver todo el historial</Link>
        </div>
        
        {/* Alerts */}
        <div className="dashboard-panel alerts">
          <h3 className="panel-title">Alertas Recientes</h3>
          <div className="alerts-list">
            {stats?.alertas?.length > 0 ? (
              stats.alertas.map(alerta => (
                <div key={alerta.id} className={`alert-item ${alerta.nivel}`}>
                  <div className="alert-icon">
                    <FaBell />
                  </div>
                  <div className="alert-details">
                    <div className="alert-message">{alerta.mensaje}</div>
                    <div className="alert-time">{alerta.fecha}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-alerts">
                <FaCheckCircle />
                <p>No hay alertas activas</p>
        </div>
      )}
          </div>
        </div>
      </div>
      
      {/* Quick Access */}
      <div className="quick-access">
        <h3 className="section-title">Acceso Rápido</h3>
        <div className="quick-links">
          <Link to="/users" className="quick-link">
            <FaUsers />
            <span>Usuarios</span>
          </Link>
          <Link to="/devices" className="quick-link">
            <FaDesktop />
            <span>Dispositivos</span>
          </Link>
          <Link to="/history" className="quick-link">
            <FaChartLine />
            <span>Historial</span>
          </Link>
          <Link to="/alerts" className="quick-link">
            <FaBell />
            <span>Alertas</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 

