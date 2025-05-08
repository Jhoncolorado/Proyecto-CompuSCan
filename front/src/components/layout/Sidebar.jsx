import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: 'fas fa-home' },
    { path: '/devices', label: 'Equipos', icon: 'fas fa-laptop' },
    { path: '/users', label: 'Usuarios', icon: 'fas fa-users' },
    { path: '/alerts', label: 'Alertas', icon: 'fas fa-bell' },
    { path: '/history', label: 'Historial', icon: 'fas fa-history' },
    { path: '/programs', label: 'Programas', icon: 'fas fa-graduation-cap' },
    { path: '/cards', label: 'Carnets', icon: 'fas fa-id-card' },
    { path: '/cases', label: 'Casos', icon: 'fas fa-folder' }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 