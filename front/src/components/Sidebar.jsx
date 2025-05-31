import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaDesktop, 
  FaBell, 
  FaHistory, 
  FaClipboardList,
  FaIdCard,
  FaFolder,
  FaUserCog,
  FaUser,
  FaLaptop
} from 'react-icons/fa';
import '../styles/sidebar.css';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdminOrValidator = user && (user.rol === 'administrador' || user.rol === 'validador');

  if (!user) return null;

  // Menú para admin y validador
  if (user.rol === 'administrador' || user.rol === 'validador') {
    return (
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <NavLink to="/home" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaHome /> <span>Inicio</span></NavLink>
          <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaUsers /> <span>Usuarios</span></NavLink>
          <NavLink to="/devices" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaDesktop /> <span>Dispositivos</span></NavLink>
          <NavLink to="/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaClipboardList /> <span>Reportes</span></NavLink>
          <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaHistory /> <span>Historial</span></NavLink>
          <NavLink to="/programs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaClipboardList /> <span>Programas</span></NavLink>
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaUserCog /> <span>Mi Perfil</span></NavLink>
          {isAdminOrValidator && (
            <NavLink to="/device-validation" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaLaptop /> <span>Validación de Dispositivos</span></NavLink>
          )}
        </nav>
      </aside>
    );
  }

  // Menú para usuario común
  if (user.rol === 'aprendiz' || user.rol === 'instructor') {
    return (
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <NavLink to="/home-user" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaHome /> <span>Inicio</span></NavLink>
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaUserCog /> <span>Mi Perfil</span></NavLink>
          <NavLink to="/my-devices" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><FaDesktop /> <span>Mis Dispositivos</span></NavLink>
        </nav>
      </aside>
    );
  }

  // Por defecto, no mostrar menú
  return null;
};

export default Sidebar; 