import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/Imagen .jpg';
import './Header.css';

const menuItems = [
  { path: '/', label: 'Inicio' },
  { path: '/users', label: 'Usuarios' },
  { path: '/devices', label: 'Dispositivos' },
  { path: '/alerts', label: 'Alertas' },
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
      .btn-outline-danger {
        color: #43a047 !important;
        border-color: #43a047 !important;
        background: #fff !important;
        transition: background 0.2s, color 0.2s;
      }
      .btn-outline-danger:hover {
        background: #43a047 !important;
        color: #fff !important;
        border-color: #388e3c !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          minHeight: 80,
          width: '100vw',
          margin: 0,
          padding: '0 32px',
          boxSizing: 'border-box',
          overflow: 'visible',
          gap: 0
        }}
      >
        {/* IZQUIERDA: Logo y nombre */}
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, maxWidth: 220, flexShrink: 0, gap: 10 }}>
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
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)'
            }}
          />
          <span className="fw-bold fs-3" style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.5, whiteSpace: 'nowrap', marginLeft: 6, color: '#fff', textShadow: '0 2px 8px rgba(44, 62, 80, 0.10)' }}>CompuSCan</span>
        </div>
        {/* CENTRO: Menú de navegación */}
        <nav
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
            maxWidth: 950
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
                    padding: 0
                  }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 ${isActive ? 'active' : ''}`
                    }
                    end={item.path === '/'}
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
                <li style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 ${isActive ? 'active' : ''}`
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
                <li style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 ${isActive ? 'active' : ''}`
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
                <li style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
                  <NavLink
                    to="/my-devices"
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 ${isActive ? 'active' : ''}`
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
                <li style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
                  <NavLink
                    to="/my-history"
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 ${isActive ? 'active' : ''}`
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 220, flexShrink: 1, gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 80, maxWidth: 180, lineHeight: 1.1 }}>
            <span style={{ fontSize: 13, color: '#fff', fontWeight: 700, letterSpacing: 0.2, textShadow: '0 1px 6px rgba(26,35,126,0.18)' }}>
              {formatDate(currentTime)}
            </span>
            <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 700, fontSize: 18, marginTop: 2, textShadow: '0 1px 6px rgba(26,35,126,0.18)' }}>
              {formatTime(currentTime)}
            </span>
          </div>
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            style={{
              fontSize: 13,
              padding: '5px 12px',
              minWidth: '90px',
              justifyContent: 'center',
              fontWeight: 600,
              borderWidth: 2,
              boxShadow: '0 2px 8px 0 rgba(67,160,71,0.08)'
            }}
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