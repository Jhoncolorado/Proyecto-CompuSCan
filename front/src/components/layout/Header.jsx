import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaUsers, FaDesktop, FaHistory, FaClipboardList, FaPlus } from 'react-icons/fa';
import logo from '../../assets/CompuSCan2025.jfif';
import './Header.css';

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHistory = location.pathname.startsWith('/history');
  const navigate = useNavigate();
  const [showQuickAccess, setShowQuickAccess] = useState(false);

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

  return (
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
        marginBottom: isHistory ? '20px' : undefined
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
        {/* IZQUIERDA: Logo y nombre */}
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, maxWidth: 220, flexShrink: 0, gap: 10 }}>
          <Link to={logoLink} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 10 }} className="hover-effect">
            <img
              src={logo}
              alt="Logo CompuScan"
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
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
        </div>
        {/* CENTRO: Menú de navegación */}
        <nav
          className="header-nav"
          role="navigation"
          aria-label="Menú principal"
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 0,
            padding: '0 16px',
            overflow: 'hidden',
            maxWidth: 850,
            marginRight: '10px'
          }}
        >
          <ul
            style={{
              display: 'flex',
              flex: 1,
              gap: 0,
              margin: 0,
              padding: 0,
              listStyle: 'none',
              flexWrap: 'nowrap',
              minWidth: 0,
              width: '100%',
              justifyContent: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            {user && (user.rol === 'administrador' || user.rol === 'validador') ? (
              menuItems.map((item) => (
                <li
                  key={item.path}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 48,
                    height: 48,
                    padding: 0,
                    maxWidth: item.label === 'Validación de Dispositivos' ? '180px' : '130px'
                  }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`
                    }
                    end={item.path === '/home'}
                    style={{
                      fontSize: item.label === 'Validación de Dispositivos' ? 13 : 15,
                      color: '#222',
                      fontWeight: 500,
                      padding: 0,
                      margin: 0,
                      display: 'inline-block',
                      whiteSpace: item.label === 'Validación de Dispositivos' ? 'normal' : 'nowrap',
                      width: '100%',
                      lineHeight: 1.15,
                      height: 'auto',
                      minHeight: 24
                    }}
                    aria-label={item.label}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))
            ) : (
              <>
                <li className="header-menu-item" style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '120px', margin: '0 12px' }}>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`
                    }
                    end
                    style={{
                      fontSize: 15,
                      color: '#222',
                      fontWeight: 500,
                      padding: '4px 0',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}
                    aria-label="Inicio"
                  >
                    Inicio
                  </NavLink>
                </li>
                <li className="header-menu-item" style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '120px', margin: '0 12px' }}>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`
                    }
                    end
                    style={{
                      fontSize: 15,
                      color: '#222',
                      fontWeight: 500,
                      padding: '4px 0',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}
                    aria-label="Mi Perfil"
                  >
                    Mi Perfil
                  </NavLink>
                </li>
                <li className="header-menu-item" style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '150px', margin: '0 12px' }}>
                  <NavLink
                    to="/my-devices"
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`
                    }
                    end
                    style={{
                      fontSize: 15,
                      color: '#222',
                      fontWeight: 500,
                      padding: '4px 0',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}
                    aria-label="Mis Dispositivos"
                  >
                    Mis Dispositivos
                  </NavLink>
                </li>
                <li className="header-menu-item" style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '130px', margin: '0 12px' }}>
                  <NavLink
                    to="/my-history"
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`
                    }
                    end
                    style={{
                      fontSize: 15,
                      color: '#222',
                      fontWeight: 500,
                      padding: '4px 0',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      width: '100%'
                    }}
                    aria-label="Mi Historial"
                  >
                    Mi Historial
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
        {/* DERECHA: Solo fecha/hora y logout */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          minWidth: 220, 
          flexShrink: 1, 
          gap: 16,
          marginLeft: 'auto', // Asegura que esté lo más a la derecha posible
          paddingRight: 0,
          position: 'relative' // Para posicionar el speed dial
        }}>
          <div className="header-date-time" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            minWidth: 220, 
            maxWidth: 350, 
            lineHeight: 1.1,
            marginRight: 8
          }}>
            <span style={{ fontSize: 15, color: '#fff', fontWeight: 600, textAlign: 'right', letterSpacing: 0.2 }}>
              {formatDate(currentTime)}
            </span>
            <span style={{ fontSize: 15, color: '#fff', fontWeight: 600, textAlign: 'right', letterSpacing: 0.2, fontFamily: 'monospace', marginTop: 0 }}>
              {formatTime(currentTime)}
            </span>
          </div>
          <button
            className="btn btn-logout button-effect"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt style={{ fontSize: 16 }} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 