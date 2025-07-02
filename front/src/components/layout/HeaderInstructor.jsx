import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/CompuSCan2025.jfif';
import './Header.css';
import { FaSignOutAlt } from 'react-icons/fa';

const HeaderInstructor = () => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Solo para instructor
  if (!user || user.rol !== 'instructor') return null;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Inyectar los mismos estilos globales del menú que en Header.jsx
    const style = document.createElement('style');
    style.innerHTML = `
      .main-header-menu-link {
        transition: color 0.18s, border-color 0.18s;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        padding-bottom: 2px;
        text-align: center;
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
        bottom: 0;
        width: 70%;
        height: 3px;
        background: #fff;
        border-radius: 2px;
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
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .btn-logout:hover {
        background: #43a047 !important;
        color: #fff !important;
        border-color: #388e3c !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const formatDate = (date) => new Intl.DateTimeFormat('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(date);
  const formatTime = (date) => new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(date);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menú solo para instructor
  const menuItems = [
    { path: '/', label: 'Inicio' },
    { path: '/profile', label: 'Mi Perfil' },
    { path: '/my-devices', label: 'Mis Dispositivos' },
    { path: '/my-history', label: 'Mi Historial' },
    { path: '/asistencia', label: 'Asistencia' },
    { path: '/historial-asistencia', label: 'Historial asistencia' },
  ];

  return (
    <header className={`header-fixed ${scrolled ? 'scrolled' : ''}`}
      role="banner"
      aria-label="Barra de navegación instructor"
      style={{ background: 'linear-gradient(90deg, #388e3c 80%, #43a047 100%)', color: '#fff', borderBottom: '1.5px solid #e5e7eb', boxShadow: scrolled ? '0 4px 18px 0 rgba(0,0,0,0.10)' : '0 2px 8px 0 rgba(0,0,0,0.03)', padding: 0, position: 'fixed', top: 0, zIndex: 1000, width: '100%', left: 0 }}
    >
      <style>{`
        @media (max-width: 600px) {
          .header-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .header-date-time { display: none !important; }
          .btn-logout { display: none !important; }
          .header-inner {
            display: grid !important;
            grid-template-columns: auto 1fr auto !important;
            align-items: center !important;
            padding: 0 !important;
            width: 100vw !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            gap: 0 !important;
          }
          .header-mobile-logo { justify-self: start !important; }
          .header-mobile-title { justify-self: center !important; text-align: center !important; }
          .header-mobile-menu-btn { justify-self: end !important; padding: 0 !important; margin: 0 !important; }
          .header-logo-text { font-size: 18px !important; }
          .only-mobile { display: flex !important; }
          .only-desktop { display: none !important; }
        }
        @media (min-width: 601px) {
          .mobile-menu-btn, .mobile-menu { display: none !important; }
          .only-mobile { display: none !important; }
          .only-desktop { display: flex !important; }
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
      `}</style>
      <div className="header-inner" style={{ minHeight: 70, width: '100%', margin: 0, boxSizing: 'border-box', overflow: 'visible', gap: 0 }}>
        {/* Logo SOLO para móvil */}
        <div className="header-mobile-logo only-mobile">
          <Link to="/home-user" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 10 }} className="hover-effect">
            <img src={logo} alt="Logo CompuScan" style={{ width: 36, height: 36, borderRadius: 8, border: '2px solid #2e7d32', backgroundColor: 'white', padding: '2px', objectFit: 'contain', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)', transition: 'transform 0.2s ease-in-out' }} />
          </Link>
        </div>
        {/* Nombre SOLO para móvil */}
        <div className="header-mobile-title only-mobile">
          <span className="header-logo-text fw-bold fs-3" style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.5, whiteSpace: 'nowrap', color: '#fff', textShadow: '0 2px 8px rgba(44, 62, 80, 0.10)' }}>CompuSCan</span>
        </div>
        {/* Menú hamburguesa SOLO para móvil */}
        <div className="header-mobile-menu-btn only-mobile">
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(m => !m)} aria-label="Abrir menú" style={{ background: 'none', border: 'none', fontSize: 28, color: '#fff', zIndex: 2002, padding: 0, margin: 0 }}>
            ☰
          </button>
        </div>
        {/* Logo y nombre SOLO para escritorio */}
        <div className="only-desktop" style={{ alignItems: 'center', minWidth: 0, maxWidth: 220, flexShrink: 0, gap: 0 }}>
          <Link to="/home-user" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 10 }} className="hover-effect">
            <img src={logo} alt="Logo CompuScan" style={{ width: 36, height: 36, borderRadius: 8, border: '2px solid #2e7d32', backgroundColor: 'white', padding: '2px', objectFit: 'contain', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)', transition: 'transform 0.2s ease-in-out' }} />
            <span className="header-logo-text fw-bold fs-3" style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.5, whiteSpace: 'nowrap', marginLeft: 6, color: '#fff', textShadow: '0 2px 8px rgba(44, 62, 80, 0.10)' }}>CompuSCan</span>
          </Link>
        </div>
        {/* Menú */}
        <nav className="header-nav" role="navigation" aria-label="Menú instructor" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0, padding: '0 16px', overflow: 'hidden', maxWidth: 850, marginRight: '10px' }}>
          <ul style={{ display: 'flex', flex: 1, gap: 0, margin: 0, padding: 0, listStyle: 'none', flexWrap: 'nowrap', minWidth: 0, width: '100%', justifyContent: 'center', whiteSpace: 'nowrap', overflow: 'visible' }}>
            {menuItems.map((item) => (
              <li
                className="header-menu-item"
                key={item.path}
                style={{ flex: 1, minWidth: 0, textAlign: 'center', maxWidth: '120px', margin: '0 18px' }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`}
                  end
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    padding: '4px 0 6px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    whiteSpace: 'normal',
                    width: '100%',
                    lineHeight: 1.15,
                    minHeight: 40
                  }}
                  aria-label={item.label}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {/* Fecha/hora y logout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 220, flexShrink: 1, gap: 16, marginLeft: 'auto', paddingRight: 0, position: 'relative' }}>
          <div className="header-date-time" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 220, maxWidth: 350, lineHeight: 1.1, marginRight: 8 }}>
            <span style={{ fontSize: 15, color: '#fff', fontWeight: 600, textAlign: 'right', letterSpacing: 0.2 }}>{formatDate(currentTime)}</span>
            <span style={{ fontSize: 15, color: '#fff', fontWeight: 600, textAlign: 'right', letterSpacing: 0.2, fontFamily: 'monospace', marginTop: 0 }}>{formatTime(currentTime)}</span>
          </div>
          <button className="btn btn-logout button-effect" onClick={handleLogout} aria-label="Cerrar sesión">
            <FaSignOutAlt style={{ fontSize: 16 }} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
      <div className="mobile-menu">
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `main-header-menu-link nav-link fw-semibold px-2 link-effect ${isActive ? 'active' : ''}`}
                end
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: 17, fontWeight: 600, padding: '12px 0', display: 'block', width: '100%' }}
                aria-label={item.label}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default HeaderInstructor; 