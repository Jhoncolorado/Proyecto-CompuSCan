import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaUsers, FaDesktop, FaHistory, FaClipboardList, FaPlus } from 'react-icons/fa';
import logo from '../../assets/CompuSCan2025.jfif';
import './Header.css';
import api from '../../services/api';
import { usePendientes } from '../../context/PendientesContext';

const menuItems = [
  { path: '/dashboard', label: 'Inicio' },
  { path: '/users', label: 'Usuarios' },
  { path: '/devices', label: 'Dispositivos' },
  { path: '/reports', label: 'Reportes' },
  { path: '/history', label: 'Historial' },
  { path: '/device-validation', label: 'Validación de Dispositivos' }
];

const Header = () => {
  const { user, logout } = useAuth();
  const { pendientes, setPendientes } = usePendientes();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHistory = location.pathname.startsWith('/history');
  const navigate = useNavigate();
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Determinar a dónde debe llevar el logo
  let logoLink = '/';
  if (user) {
    if (user.rol === 'aprendiz' || user.rol === 'instructor') {
      logoLink = '/home-user';
    } else {
      logoLink = '/dashboard';
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!user) return; // Solo si hay usuario autenticado
    // Solo admin, administrador o validador deben consultar el endpoint
    if (!['administrador', 'validador', 'admin'].includes((user.rol || '').toLowerCase())) return;
    api.get('/api/dispositivos/pendientes/count')
      .then(res => setPendientes(res.data.pendientes))
      .catch(err => {
        setPendientes(0); // No mostrar error en consola
      });
  }, [user]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }).format(date);
  };
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(date);
  };

  // Estilos globales para el hover y transición del menú
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .main-header-menu-link {
        transition: color 0.18s, border-color 0.18s;
        display: inline-block;
        position: relative;
        padding-bottom: 2px;
        text-align: center;
        line-height: 1.15;
        min-width: 90px;
        color: #fff !important;
        text-shadow: 0 1px 6px rgba(44, 62, 80, 0.18);
      }
      .main-header-menu-link:hover, .main-header-menu-link.active {
        color: #fff !important;
      }
      .main-header-menu-link.active::after, .main-header-menu-link:hover::after {
        content: '';
        display: block;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -2px;
        width: 70%;
        height: 3px;
        background: #fff;
        border-radius: 2px;
      }
      .main-header-separator {
        height: 44px;
        width: 1.5px;
        background: #e0e0e0;
        margin: 0 18px;
        border-radius: 2px;
        align-self: center;
      }
      .btn-logout {
        color: #43a047 !important;
        border-color: #43a047 !important;
        background: #fff !important;
        transition: background 0.2s, color 0.2s;
        font-size: 13px;
        padding: 5px 12px;
        min-width: 130px;
        justify-content: center;
        font-weight: 600;
        border-width: 2px;
        box-shadow: 0 2px 8px 0 rgba(67,160,71,0.08);
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .btn-logout:hover {
        background: #43a047 !important;
        color: #fff !important;
        border-color: #388e3c !important;
      }
      
      @media (max-width: 992px) {
        .header-logo-text {
          display: none;
        }
        .header-date-time {
          display: none;
        }
        .btn-logout span {
          display: none;
        }
        .btn-logout {
          min-width: auto;
          padding: 5px 10px;
        }
      }
      
      @media (max-width: 768px) {
        .header-inner {
          padding: 0 16px !important;
        }
        .header-nav {
          padding: 0 8px !important;
        }
        .header-menu-item {
          margin: 0 6px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
  const styleSheet = document.createElement('style');
  styleSheet.innerText = `@keyframes fadeInQuickAccess { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1; transform: none; } }`;
  document.head.appendChild(styleSheet);

  // Agregar animación CSS para el badge (ajustada)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes badge-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const isAdmin = user && (['admin', 'administrador'].includes((user.rol || '').toLowerCase()) || (user.rol || '').toLowerCase() === 'validador');

  return (
    <>
      {/* --- ESTILOS RESPONSIVE Y MENÚ HAMBURGUESA --- */}
      <style>{`
        @media (max-width: 600px) {
          .header-inner {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 0 6px !important;
            min-height: 56px !important;
            gap: 0 !important;
            position: relative;
          }
          .header-logo-text {
            display: none !important;
          }
          .header-date-time {
            font-size: 12px !important;
            min-width: 0 !important;
            max-width: 120px !important;
            margin-right: 0 !important;
            margin-top: 2px !important;
            display: block !important;
            text-align: left !important;
          }
          .header-nav {
            display: none !important;
          }
          .btn-logout {
            min-width: 0 !important;
            padding: 5px 10px !important;
            font-size: 12px !important;
          }
          .mobile-menu-btn {
            display: block !important;
            background: none;
            border: none;
            font-size: 28px;
            color: #fff;
            margin-left: 8px;
            z-index: 2002;
          }
          .mobile-menu {
            display: ${menuOpen ? 'block' : 'none'};
            position: absolute;
            top: 56px;
            left: 0;
            width: 100vw;
            background: linear-gradient(90deg, #388e3c 80%, #43a047 100%);
            z-index: 2001;
            box-shadow: 0 8px 32px 0 rgba(44,62,80,0.18);
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
          }
          .mobile-menu .main-header-menu-link {
            display: block !important;
            padding: 16px 18px;
            border-bottom: 1px solid #fff2;
            color: #fff !important;
            font-size: 1.1rem !important;
            text-align: left;
            width: 100%;
          }
        }
        @media (min-width: 601px) {
          .mobile-menu-btn, .mobile-menu { display: none !important; }
        }
      `}</style>
      {/* --- FIN ESTILOS RESPONSIVE --- */}
      <header className={`header-fixed ${scrolled ? 'scrolled' : ''}`}
        role="banner"
        aria-label="Barra de navegación principal"
        style={{ 
          background: 'linear-gradient(90deg, #388e3c 80%, #43a047 100%)',
          color: '#fff',
          borderBottom: isHistory ? 'none' : '1.5px solid #e5e7eb', 
          boxShadow: isHistory ? 'none' : (scrolled ? '0 4px 18px 0 rgba(0,0,0,0.10)' : '0 2px 8px 0 rgba(0,0,0,0.03)'), 
          padding: 0, 
          position: 'fixed',
          top: 0, 
          zIndex: 1000,
          width: '100%',
          left: 0,
          marginBottom: isHistory ? '20px' : undefined,
          overflow: 'visible'
        }}
      >
        <div
          className="header-inner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 70,
            width: '100%',
            margin: 0,
            padding: '0 32px',
            boxSizing: 'border-box',
            overflow: 'visible',
            gap: 0
          }}
        >
          {/* IZQUIERDA: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, maxWidth: 220, flexShrink: 0, gap: 0 }}>
            <Link to={logoLink} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 10 }} className="hover-effect">
              <img
                src={logo}
                alt="Logo CompuScan"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: '2px solid #2e7d32',
                  backgroundColor: 'white',
                  padding: '2px',
                  objectFit: 'contain',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s ease-in-out'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><rect width="44" height="44" fill="%2343a047"/><text x="50%" y="50%" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="white">CS</text></svg>';
                }}
              />
              <span className="header-logo-text fw-bold fs-3" style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.5, whiteSpace: 'nowrap', marginLeft: 6, color: '#fff', textShadow: '0 2px 8px rgba(44, 62, 80, 0.10)' }}>CompuSCan</span>
            </Link>
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(m => !m)} aria-label="Abrir menú" style={{ display: 'none', marginLeft: 0 }}>
              ☰
            </button>
          </div>
          {/* CENTRO: Menú de navegación (oculto en móvil) */}
          <nav className="header-nav" role="navigation" aria-label="Menú principal" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0, padding: '0 16px', overflow: 'hidden', maxWidth: 850, marginRight: '10px' }}>
            <ul style={{ display: 'flex', flex: 1, gap: 0, margin: 0, padding: 0, listStyle: 'none', flexWrap: 'nowrap', minWidth: 0, width: '100%', justifyContent: 'center', whiteSpace: 'nowrap', overflow: 'visible' }}>
              {isAdmin ? (
                menuItems.map((item) => (
                  <li key={item.path} style={{ flex: 1, minWidth: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 48, height: 48, padding: 0, maxWidth: item.label === 'Validación de Dispositivos' ? '180px' : '130px', position: 'relative', overflow: 'visible' }}>
                    <NavLink to={item.path} className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end={item.path === '/home'} style={{ fontSize: item.label === 'Validación de Dispositivos' ? 13 : 15, color: '#222', fontWeight: 500, padding: 0, margin: 0, display: 'inline-block', whiteSpace: item.label === 'Validación de Dispositivos' ? 'normal' : 'nowrap', width: '100%', lineHeight: 1.15, height: 'auto', minHeight: 24 }} aria-label={item.label}>
                      {item.label}
                      {item.label === 'Validación de Dispositivos' && pendientes > 0 && (
                        <span className="badge" style={{ position: 'absolute', top: '2px', right: '-6px', background: '#ff9800', color: '#fff', fontSize: '1em', padding: '4px 10px', borderRadius: '50%', fontWeight: 'bold', zIndex: 2, boxShadow: '0 2px 8px #0002', border: '2px solid #fff', minWidth: 28, minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'badge-bounce 1.2s infinite', transition: 'background 0.2s, top 0.2s, right 0.2s' }}>
                          {pendientes}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))
              ) : (
                <>
                  <li className="header-menu-item" style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '120px', margin: '0 12px' }}>
                    <NavLink to="/" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end style={{ fontSize: 15, color: '#222', fontWeight: 500, padding: '4px 0', display: 'inline-block', whiteSpace: 'nowrap', width: '100%' }} aria-label="Inicio">Inicio</NavLink>
                  </li>
                  <li className="header-menu-item" style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '120px', margin: '0 12px' }}>
                    <NavLink to="/profile" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end style={{ fontSize: 15, color: '#222', fontWeight: 500, padding: '4px 0', display: 'inline-block', whiteSpace: 'nowrap', width: '100%' }} aria-label="Mi Perfil">Mi Perfil</NavLink>
                  </li>
                  <li className="header-menu-item" style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '150px', margin: '0 12px' }}>
                    <NavLink to="/my-devices" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end style={{ fontSize: 15, color: '#222', fontWeight: 500, padding: '4px 0', display: 'inline-block', whiteSpace: 'nowrap', width: '100%' }} aria-label="Mis Dispositivos">Mis Dispositivos</NavLink>
                  </li>
                  <li className="header-menu-item" style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '130px', margin: '0 12px' }}>
                    <NavLink to="/my-history" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end style={{ fontSize: 15, color: '#222', fontWeight: 500, padding: '4px 0', display: 'inline-block', whiteSpace: 'nowrap', width: '100%' }} aria-label="Mi Historial">Mi Historial</NavLink>
                  </li>
                  {user && user.rol === 'instructor' ? (
                    <li className="header-menu-item" style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '140px', margin: '0 12px' }}>
                      <NavLink to="/asistencia" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end style={{ fontSize: 15, color: '#222', fontWeight: 500, padding: '4px 0', display: 'inline-block', whiteSpace: 'nowrap', width: '100%' }} aria-label="Asistencia">Asistencia</NavLink>
                    </li>
                  ) : null}
                </>
              )}
            </ul>
          </nav>
          {/* MENÚ HAMBURGUESA VERTICAL SOLO EN MÓVIL */}
          <div className="mobile-menu">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {isAdmin ? (
                menuItems.map((item) => (
                  <li key={item.path}>
                    <NavLink to={item.path} className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end={item.path === '/home'} onClick={() => setMenuOpen(false)}>
                      {item.label}
                      {item.label === 'Validación de Dispositivos' && pendientes > 0 && (
                        <span className="badge" style={{ position: 'absolute', top: '2px', right: '-6px', background: '#ff9800', color: '#fff', fontSize: '1em', padding: '4px 10px', borderRadius: '50%', fontWeight: 'bold', zIndex: 2, boxShadow: '0 2px 8px #0002', border: '2px solid #fff', minWidth: 28, minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'badge-bounce 1.2s infinite', transition: 'background 0.2s, top 0.2s, right 0.2s' }}>
                          {pendientes}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <NavLink to="/" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end onClick={() => setMenuOpen(false)}>Inicio</NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end onClick={() => setMenuOpen(false)}>Mi Perfil</NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-devices" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end onClick={() => setMenuOpen(false)}>Mis Dispositivos</NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-history" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end onClick={() => setMenuOpen(false)}>Mi Historial</NavLink>
                  </li>
                  {user && user.rol === 'instructor' ? (
                    <li>
                      <NavLink to="/asistencia" className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`} end onClick={() => setMenuOpen(false)}>Asistencia</NavLink>
                    </li>
                  ) : null}
                </>
              )}
            </ul>
          </div>
          {/* DERECHA: Fecha/hora y logout */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 220, flexShrink: 1, gap: 16, marginLeft: 'auto', paddingRight: 0, position: 'relative' }}>
            <div className="header-date-time" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 220, maxWidth: 350, lineHeight: 1.1, marginRight: 8 }}>
              <span style={{ fontSize: 15, color: '#fff', fontWeight: 600, textAlign: 'right', letterSpacing: 0.2 }}>
                {formatDate(currentTime)}
              </span>
              <span style={{ fontSize: 15, color: '#fff', fontWeight: 600, textAlign: 'right', letterSpacing: 0.2, fontFamily: 'monospace', marginTop: 0 }}>
                {formatTime(currentTime)}
              </span>
            </div>
            <button className="btn btn-logout button-effect" onClick={handleLogout} aria-label="Cerrar sesión">
              <FaSignOutAlt style={{ fontSize: 16 }} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header; 