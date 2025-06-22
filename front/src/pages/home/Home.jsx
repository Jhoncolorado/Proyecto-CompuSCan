import React, { useEffect, useState, useRef } from 'react';
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
  FaBriefcase,
  FaHistory,
  FaClipboardList,
  FaClipboardCheck
} from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import './home.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/CompuSCan2025.jfif';
import { io as socketIOClient } from 'socket.io-client';
import api from '../../services/api';
import ReactDOM from 'react-dom';

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

// QuickAccessMenuPortal: renderiza el menú en el body usando portal
function QuickAccessMenuPortal({ anchorRef, show, onClose, children }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (show && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  }, [show, anchorRef]);
  if (!show) return null;
  return ReactDOM.createPortal(
    <div style={{
      position: 'absolute',
      top: pos.top,
      left: pos.left,
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 2px 8px 0 rgba(44,62,80,0.13)',
      padding: '2px 0',
      minWidth: 140,
      zIndex: 2147483647,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      overflow: 'visible'
    }}>
      {children}
    </div>,
    document.body
  );
}

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  
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
        const res = await fetch('/api/dashboard/stats');
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
    const socket = socketIOClient(`http://${window.location.hostname}:3000`);
    socket.on('actividad_actualizada', (newStats) => {
      console.log('Evento actividad_actualizada recibido:', newStats);
      setStats(prev => ({
        ...prev,
        actividad: newStats.actividad,
        actividadReciente: newStats.actividadReciente
      }));
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAdmin = user && ['admin', 'administrador', 'validador'].includes((user.rol || '').toLowerCase());
  const quickAccessBtnRef = useRef(null);

  const handleQuickAccessClick = () => setShowQuickAccess(false);

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
    <div className="dashboard-container" style={{ position: 'relative', minHeight: '90vh' }}>
      {/* --- ESTILOS RESPONSIVE SOLO PARA ESTA PANTALLA --- */}
      <style>{`
        @media (max-width: 600px) {
          .dashboard-welcome-header {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 1.2rem 0.5rem 0.7rem 0.5rem !important;
            gap: 0.7rem !important;
            text-align: center !important;
          }
          .dashboard-welcome-header > div:first-child {
            width: 80px !important;
            height: 80px !important;
            margin: 0 auto 0.7rem auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50% !important;
            overflow: hidden !important;
            background: #fff !important;
            box-shadow: 0 2px 8px #43a04722 !important;
          }
          .dashboard-welcome-header img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 50% !important;
          }
          .dashboard-welcome-header h2 {
            font-size: 1.25rem !important;
            text-align: center !important;
            margin: 0 0 0.5rem 0 !important;
            word-break: break-word;
            color: #fff !important;
          }
          .dashboard-welcome-header a {
            display: block !important;
            margin: 0.5rem auto 0 auto !important;
            font-size: 1.05rem !important;
            text-align: center !important;
            background: #fff !important;
            color: #43a047 !important;
            border-radius: 8px !important;
            padding: 0.7rem 1.2rem !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            box-shadow: 0 2px 8px #43a04722 !important;
            border: none !important;
            width: 90% !important;
            transition: background 0.18s, color 0.18s;
          }
          .dashboard-welcome-header a:active, .dashboard-welcome-header a:focus {
            background: #e8f5e9 !important;
            color: #17632a !important;
          }
          /* Datos de usuario apilados */
          .user-info-grid {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            grid-template-columns: none !important;
            padding: 0.7rem 0.2rem !important;
            gap: 0.7rem !important;
          }
          .user-info-grid > div {
            width: 95% !important;
            max-width: 340px !important;
            margin: 0 auto !important;
            background: #f8f9fa !important;
            border-radius: 10px !important;
            box-shadow: 0 1px 4px #0001 !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.7rem !important;
            padding: 0.7rem 1rem !important;
            text-align: left !important;
            justify-content: flex-start !important;
          }
          .user-info-grid .user-info-icon-circle {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            background: #e0f2f1 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #43a047 !important;
            font-size: 1.3rem !important;
            flex-shrink: 0 !important;
          }
          .user-info-grid h4 {
            font-size: 1.01rem !important;
            font-weight: 700 !important;
            color: #17632a !important;
            margin: 0 0 0.1rem 0 !important;
          }
          .user-info-grid p {
            font-size: 0.98rem !important;
            font-weight: 600 !important;
            color: #333 !important;
            margin: 0 !important;
          }
        }
      `}</style>
      {/* --- FIN ESTILOS RESPONSIVE --- */}
      <div className="dashboard-header" style={{display:'flex',alignItems:'center',gap:16,position:'relative',background:'transparent',boxShadow:'none',border:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,position:'relative'}}>
          {isAdmin && (
            <>
              <button
                ref={quickAccessBtnRef}
                title="Acceso rápido"
                style={{
                  background: '#43a047',
                  border: 'none',
                  borderRadius: '50%',
                  width: 44,
                  height: 44,
                  boxShadow: '0 4px 16px 0 rgba(67,160,71,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.18s, transform 0.25s',
                  outline: showQuickAccess ? '2.5px solid #388e3c' : 'none',
                  zIndex: 1200,
                  transform: showQuickAccess ? 'rotate(135deg)' : 'none'
                }}
                onClick={() => setShowQuickAccess(v => !v)}
              >
                <AiOutlinePlus style={{ color: '#111', fontSize: 26, transition: 'transform 0.25s' }} />
              </button>
              <QuickAccessMenuPortal anchorRef={quickAccessBtnRef} show={showQuickAccess} onClose={handleQuickAccessClick}>
                <Link to="/users" className="quick-link" style={{display:'flex',alignItems:'center',gap:6,padding:'7px 16px',color:'#222',fontWeight:500,fontSize:13,textDecoration:'none',borderRadius:0,border:'none',background:'transparent'}} onClick={handleQuickAccessClick}><FaUsers style={{fontSize:15,color:'#43a047'}}/> Usuarios</Link>
                <Link to="/devices" className="quick-link" style={{display:'flex',alignItems:'center',gap:6,padding:'7px 16px',color:'#222',fontWeight:500,fontSize:13,textDecoration:'none',borderRadius:0,border:'none',background:'transparent'}} onClick={handleQuickAccessClick}><FaDesktop style={{fontSize:15,color:'#43a047'}}/> Dispositivos</Link>
                <Link to="/reports" className="quick-link" style={{display:'flex',alignItems:'center',gap:6,padding:'7px 16px',color:'#222',fontWeight:500,fontSize:13,textDecoration:'none',borderRadius:0,border:'none',background:'transparent'}} onClick={handleQuickAccessClick}><FaClipboardList style={{fontSize:15,color:'#43a047'}}/> Reportes</Link>
                <Link to="/history" className="quick-link" style={{display:'flex',alignItems:'center',gap:6,padding:'7px 16px',color:'#222',fontWeight:500,fontSize:13,textDecoration:'none',borderRadius:0,border:'none',background:'transparent'}} onClick={handleQuickAccessClick}><FaHistory style={{fontSize:15,color:'#43a047'}}/> Historial</Link>
                <Link to="/device-validation" className="quick-link" style={{display:'flex',alignItems:'center',gap:6,padding:'7px 16px',color:'#222',fontWeight:500,fontSize:13,textDecoration:'none',borderRadius:0,border:'none',background:'transparent'}} onClick={handleQuickAccessClick}><FaClipboardCheck style={{fontSize:15,color:'#43a047'}}/> Validación</Link>
              </QuickAccessMenuPortal>
            </>
          )}
          <h1 className="dashboard-title" style={{marginBottom:0}}>Panel de Control</h1>
        </div>
      </div>
      {/* Panel de Bienvenida */}
      {isMobile ? (
        <div className="simple-welcome-panel">
          <div className="simple-welcome-header">
            {user?.foto ? (
              <img src={user.foto} alt="Avatar" />
            ) : (
              <FaUserCircle style={{ color: '#71c585', fontSize: '3.2rem', marginBottom: 8 }} />
            )}
            <h2>
              ¡Bienvenido,<br />
              <span className="highlight-name">{user?.nombre || 'Administrador'}</span>!
            </h2>
            <a href="/profile">Ir a mi perfil</a>
          </div>
          <div className="user-info-grid">
            <div className="user-info-item">
              <span className="user-info-icon-circle"><FaIdCard /></span>
              <div>
                <h4>Usuario</h4>
                <p>{user?.usuario || user?.email || 'admin'}</p>
              </div>
            </div>
            <div className="user-info-item">
              <span className="user-info-icon-circle"><FaCrown /></span>
              <div>
                <h4>Rol</h4>
                <p>{user?.rol || 'administrador'}</p>
              </div>
            </div>
            <div className="user-info-item">
              <span className="user-info-icon-circle"><FaRegClock /></span>
              <div>
                <h4>Último acceso</h4>
                <p>{user?.ultimoAcceso ? formatDate(new Date(user.ultimoAcceso)) : '17 de mayo de 2025, 20:24'}</p>
              </div>
            </div>
            <div className="user-info-item">
              <span className="user-info-icon-circle"><FaBriefcase /></span>
              <div>
                <h4>Sesión activa desde</h4>
                <p>{formatDate(new Date())}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
            boxShadow: '0 2px 8px 0 rgba(44,62,80,0.10)',
            position: 'relative',
            flexDirection: 'column'
          }}>
            {user?.foto ? (
              <img src={user.foto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <FaUserCircle style={{ color: '#71c585', fontSize: '2rem' }} />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
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
            {/* Enlace a perfil */}
            <a href="/profile" style={{
              color: '#fff',
              fontSize: '0.95rem',
              textDecoration: 'underline',
              marginLeft: '0.5rem',
              fontWeight: 400
            }}>Ir a mi perfil</a>
          </div>
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
      )}
      
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
      <div className="dashboard-panels" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.8rem' }}>
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
              stats.actividadReciente.map(activity => {
                const tipo = activity.descripcion?.toLowerCase().includes('entrada') ? 'entrada' : 'salida';
                return (
                  <div key={activity.id_historial} className={`activity-item-card`}>
                    <div className={`activity-type ${tipo}`}>
                      {tipo === "entrada" ? <FaSignInAlt /> : <FaSignOutAlt />}
                    </div>
                    <div className="activity-details">
                      <div className="activity-user">{activity.descripcion}</div>
                      <div className="activity-device">{activity.dispositivo_nombre}</div>
                    </div>
                    <div className="activity-time">
                      {activity.fecha_hora_salida
                        ? formatDate(new Date(activity.fecha_hora_salida))
                        : activity.fecha_hora_entrada
                          ? formatDate(new Date(activity.fecha_hora_entrada))
                          : 'Fecha desconocida'}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-data">No hay actividad reciente</p>
            )}
          </div>
          <Link to="/history" className="view-all-link">Ver todo el historial</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

// Inicio de usuario (aprendiz/instructor)
export const HomeUser = () => {
  const { user } = useAuth();
  const [deviceCount, setDeviceCount] = useState(0);
  const [userDevices, setUserDevices] = useState([]);
  const [lastAccess, setLastAccess] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Obtener dispositivos del usuario
        if (user?.id) {
          const devRes = await api.get(`/api/dispositivos/usuario/${user.id}`);
          const devices = devRes.data;
            setDeviceCount(devices.length);
            setUserDevices(devices); // Guardar los dispositivos del usuario
          
          // Obtener historial reciente
          const historyRes = await api.get(`/api/historiales`);
          const historyRaw = historyRes.data;
            const history = Array.isArray(historyRaw) ? historyRaw : (Array.isArray(historyRaw.data) ? historyRaw.data : []);
            // Filtrar solo los eventos relacionados con este usuario
            const userEvents = history.filter(ev => 
              ev.descripcion && ev.descripcion.includes(user.nombre)
            ).slice(0, 5); // Solo los 5 más recientes
            setRecentActivity(userEvents);
        }
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
    
    // Actualizar último acceso
    if (user?.ultimo_acceso) {
      setLastAccess(new Date(user.ultimo_acceso));
    } else {
      setLastAccess(new Date());
    }
  }, [user]);

  // Función para obtener el nombre del dispositivo
  const getDeviceName = () => {
    if (userDevices && userDevices.length > 0) {
      // Si el usuario tiene dispositivos registrados, mostrar el nombre del primero
      return userDevices[0].nombre || `${userDevices[0].marca} ${userDevices[0].modelo}` || `PC-${userDevices[0].id_dispositivo}`;
    }
    return "PC de Control de Acceso";
  };

  // Función para formatear fechas
  const formatDate = (date) => {
    if (!date) return "No disponible";
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="dashboard-container">
      {/* Panel de bienvenida mejorado */}
      <div className="welcome-panel" style={{
        background: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid rgba(230, 235, 240, 0.6)',
        position: 'relative'
      }}>
        {/* Patrón de fondo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.5
        }}></div>
        
        <div style={{
          padding: '2.5rem 3rem',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)'
            }}>
              {user?.foto ? (
                <img src={user.foto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FaUserCircle style={{ color: '#71c585', fontSize: '3.5rem' }} />
              )}
            </div>
            <div>
              <h1 style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                margin: '0 0 0.5rem',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                ¡Bienvenido, {user?.nombre || 'Usuario'}!
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.9)',
                margin: 0
              }}>
                <FaRegClock style={{ marginRight: '0.5rem' }} /> 
                Último acceso: {formatDate(lastAccess)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Título de sección */}
      <h2 className="dashboard-title" style={{
        textAlign: 'center',
        marginBottom: '2rem',
        fontSize: '1.8rem',
        fontWeight: '600',
        color: '#2e7d32',
        position: 'relative',
        display: 'inline-block',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        Mi Panel Personal
        <div style={{
          height: '4px',
          width: '60%',
          background: 'linear-gradient(90deg, #43a047, #2e7d32)',
          borderRadius: '2px',
          margin: '0.5rem auto 0'
        }}></div>
      </h2>

      {/* Tarjetas de información */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Tarjeta de perfil */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: '#e8f5e9',
              padding: '0.8rem',
              borderRadius: '12px',
              marginRight: '1rem'
            }}>
              <FaIdCard style={{ fontSize: '1.8rem', color: '#43a047' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>Mi Perfil</h3>
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0 0 0.3rem', color: '#666', fontSize: '0.9rem' }}>Rol</p>
              <p style={{ 
                margin: 0, 
                fontWeight: '600',
                background: '#e8f5e9',
                color: '#2e7d32',
                display: 'inline-block',
                padding: '0.3rem 0.8rem',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>{user?.rol || 'Usuario'}</p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0 0 0.3rem', color: '#666', fontSize: '0.9rem' }}>Documento</p>
              <p style={{ margin: 0, fontWeight: '600' }}>{user?.documento || 'No disponible'}</p>
            </div>
            
            {user?.rol === 'aprendiz' && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.3rem', color: '#666', fontSize: '0.9rem' }}>Ficha</p>
                <p style={{ margin: 0, fontWeight: '600' }}>{user?.ficha_codigo || user?.ficha_nombre || 'No disponible'}</p>
              </div>
            )}
          </div>
          
          <Link to="/profile" style={{
            background: '#43a047',
            color: 'white',
            padding: '0.8rem',
            borderRadius: '8px',
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: '600',
            marginTop: '1rem',
            display: 'block',
            transition: 'background-color 0.2s'
          }}>
            Ver perfil completo
          </Link>
        </div>
        
        {/* Tarjeta de dispositivos */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: '#e8f5e9',
              padding: '0.8rem',
              borderRadius: '12px',
              marginRight: '1rem'
            }}>
              <FaDesktop style={{ fontSize: '1.8rem', color: '#43a047' }} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>Mis Dispositivos</h3>
          </div>
          
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem 0'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#e8f5e9',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '3rem', fontWeight: '700', color: '#43a047' }}>{deviceCount}</span>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {deviceCount === 0 ? 'No tienes dispositivos registrados' : 
                deviceCount === 1 ? 'Dispositivo registrado' : 
                'Dispositivos registrados'}
            </p>
          </div>
          
          <Link to="/devices" style={{
            background: '#43a047',
            color: 'white',
            padding: '0.8rem',
            borderRadius: '8px',
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: '600',
            marginTop: '1rem',
            display: 'block',
            transition: 'background-color 0.2s'
          }}>
            {deviceCount === 0 ? 'Registrar dispositivo' : 'Administrar dispositivos'}
          </Link>
        </div>
      </div>

      {/* Actividad reciente */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            background: '#e8f5e9',
            padding: '0.8rem',
            borderRadius: '12px',
            marginRight: '1rem'
          }}>
            <FaChartLine style={{ fontSize: '1.8rem', color: '#43a047' }} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>Actividad Reciente</h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Cargando actividad...</p>
          </div>
        ) : recentActivity.length > 0 ? (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {recentActivity.map((activity, index) => (
              <div key={activity.id_historial || index} style={{
                padding: '1rem',
                borderRadius: '8px',
                background: '#f9f9f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #eee'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: activity.descripcion?.includes('entrada') ? '#e8f5e9' : '#fbe9e7',
                    padding: '0.5rem',
                    borderRadius: '8px'
                  }}>
                    {activity.descripcion?.includes('entrada') ? (
                      <FaSignInAlt style={{ color: '#43a047', fontSize: '1.2rem' }} />
                    ) : (
                      <FaSignOutAlt style={{ color: '#e53935', fontSize: '1.2rem' }} />
                    )}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.3rem', fontWeight: '600' }}>{activity.descripcion}</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                      Dispositivo: {getDeviceName()}
                    </p>
                  </div>
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  whiteSpace: 'nowrap'
                }}>
                  {activity.fecha_hora_salida
                    ? formatDate(new Date(activity.fecha_hora_salida))
                    : activity.fecha_hora_entrada
                      ? formatDate(new Date(activity.fecha_hora_entrada))
                      : 'Fecha desconocida'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#666',
            background: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <FaClock style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
            <p style={{ margin: 0, fontWeight: '600' }}>No hay actividad reciente registrada</p>
          </div>
        )}
      </div>
    </div>
  );
}; 

const quickAccessStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: '#388e3c',
  fontWeight: 600,
  fontSize: 16,
  textDecoration: 'none',
  padding: '7px 10px',
  borderRadius: 8,
  transition: 'background 0.15s, color 0.15s',
  cursor: 'pointer',
};
const iconStyle = {
  fontSize: 18,
  color: '#43a047',
};
// Animación fadeInQuickAccess
if (typeof window !== 'undefined' && !document.getElementById('quickaccess-anim')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'quickaccess-anim';
  styleSheet.innerText = `@keyframes fadeInQuickAccess { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1; transform: none; } }`;
  document.head.appendChild(styleSheet);
}

