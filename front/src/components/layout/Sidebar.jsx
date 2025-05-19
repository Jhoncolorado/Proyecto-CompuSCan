import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Imagen .jpg';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: 'fa fa-home' },
    { path: '/users', label: 'Usuarios', icon: 'fa fa-users' },
    { path: '/devices', label: 'Dispositivos', icon: 'fa fa-laptop' },
    { path: '/alerts', label: 'Alertas', icon: 'fa fa-bell' },
    { path: '/history', label: 'Historial', icon: 'fa fa-history' },
    { path: '/cards', label: 'Carnets', icon: 'fa fa-id-card' },
    { path: '/cases', label: 'Casos', icon: 'fa fa-folder' }
  ];

  return (
    <nav className="d-flex flex-column align-items-center bg-dark text-white min-vh-100 py-3" style={{ width: 240 }}>
      <div className="mb-4 w-100 d-flex flex-column align-items-center">
        <img src={logo} alt="Logo" style={{ width: 80, height: 80, borderRadius: 16, border: '3px solid #0d6efd', objectFit: 'cover', background: '#fff' }} />
        <span className="fw-bold fs-5 mt-2 text-center">CompuScan<br />Security</span>
      </div>
      <ul className="nav nav-pills flex-column w-100 mb-4">
        {menuItems.map((item, idx) => (
          <li className="nav-item" key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-4 py-3 fs-6 ${isActive ? 'active bg-primary text-white' : 'text-white-50'}`
              }
              style={{ fontWeight: 500, fontSize: 18 }}
            >
              <i className={`${item.icon} fs-4`}></i>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto w-100 text-center border-top border-secondary pt-3 small text-white-50">
        <div className="fw-semibold">{user?.nombre || 'Usuario'}</div>
        <div className="text-muted">{user?.rol || ''}</div>
      </div>
    </nav>
  );
};

export default Sidebar; 