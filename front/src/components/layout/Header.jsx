import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/Imagen .jpg';

const menuItems = [
  { path: '/', label: 'Inicio' },
  { path: '/users', label: 'Usuarios' },
  { path: '/devices', label: 'Dispositivos' },
  { path: '/alerts', label: 'Alertas' },
  { path: '/history', label: 'Historial' },
  { path: '/programs', label: 'Programas' },
  { path: '/cards', label: 'Carnets' },
  { path: '/cases', label: 'Casos' }
];

const Header = () => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      }
      .main-header-menu-link:hover, .main-header-menu-link.active {
        color: #0d6efd !important;
        border-bottom: 2.5px solid #0d6efd !important;
      }
      .main-header-separator {
        height: 44px;
        width: 1.5px;
        background: #e0e0e0;
        margin: 0 18px;
        border-radius: 2px;
        align-self: center;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <header 
      role="banner"
      aria-label="Barra de navegación principal"
      style={{ 
        background: '#fff', 
        borderBottom: '1.5px solid #e5e7eb', 
        boxShadow: scrolled ? '0 4px 18px 0 rgba(0,0,0,0.10)' : '0 2px 8px 0 rgba(0,0,0,0.03)', 
        padding: 0, 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        width: '100vw',
        left: 0
      }}
    >
      <div
        className="header-inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 90,
          width: '100vw',
          margin: 0,
          padding: '0 24px',
          boxSizing: 'border-box',
          overflow: 'visible'
        }}
      >
        {/* IZQUIERDA: Logo y nombre */}
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 220, flexShrink: 0 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }} aria-label="Inicio CompuScan">
            <img
              src={logo}
              alt="Logo CompuScan"
              style={{
                width: 54,
                height: 54,
                borderRadius: 12,
                border: '2px solid #0d6efd',
                backgroundColor: 'white',
                padding: '2px',
                objectFit: 'contain',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)'
              }}
            />
            <span className="fw-bold fs-3 text-primary" style={{ fontWeight: 800, fontSize: 30, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>CompuSCan</span>
          </a>
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
            overflow: 'hidden',
            padding: '0 16px'
          }}
        >
          <ul
            style={{
              display: 'flex',
              gap: 24,
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
                <li key={item.path} style={{ minWidth: 70, textAlign: 'center' }}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `main-header-menu-link nav-link fw-semibold px-2 ${isActive ? 'active' : ''}`
                    }
                    end={item.path === '/'}
                    style={{
                      fontSize: 15,
                      color: '#222',
                      fontWeight: 500,
                      padding: '4px 0',
                      display: 'inline-block',
                      whiteSpace: 'nowrap'
                    }}
                    aria-label={item.label}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))
            ) : (
              <>
                <li style={{ minWidth: 70, textAlign: 'center' }}>
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
                      whiteSpace: 'nowrap'
                    }}
                    aria-label="Inicio"
                  >
                    Inicio
                  </NavLink>
                </li>
                <li style={{ minWidth: 70, textAlign: 'center' }}>
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
                      whiteSpace: 'nowrap'
                    }}
                    aria-label="Mi Perfil"
                  >
                    Mi Perfil
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
        {/* DERECHA: Usuario, fecha/hora y logout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 280, flexShrink: 0, gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 100 }}>
            <span style={{ fontWeight: 700, fontSize: 17, color: '#222' }}>{user?.nombre || 'Usuario'}</span>
            <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{user?.rol || 'Rol'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 100 }}>
            <span style={{ fontSize: 13, color: '#888' }}>{formatDate(currentTime)}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 15, color: '#0d6efd', fontWeight: 700 }}>{formatTime(currentTime)}</span>
          </div>
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            style={{
              fontSize: 15,
              padding: '7px 16px',
              minWidth: '110px',
              justifyContent: 'center',
              fontWeight: 600,
              borderWidth: 2
            }}
            onClick={logout}
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt style={{ fontSize: 18 }} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 