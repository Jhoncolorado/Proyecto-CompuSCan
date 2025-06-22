import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const isAdminOrValidador = (rol) => ['admin', 'administrador', 'validador'].includes((rol || '').toLowerCase());

const PrivateRoute = ({ children, requiredRole, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    if (['administrador', 'admin', 'validador'].includes(requiredRole)) {
      if (!isAdminOrValidador(user.rol)) {
        return <Navigate to="/" replace />;
      }
    } else if ((user.rol || '').toLowerCase() !== requiredRole.toLowerCase()) {
      return <Navigate to="/" replace />;
    }
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const adminOrValidadorAllowed = allowedRoles.some(r => ['administrador', 'admin', 'validador'].includes(r));
    if (adminOrValidadorAllowed) {
      if (!isAdminOrValidador(user.rol)) {
        return <Navigate to="/" replace />;
      }
    } else if (!allowedRoles.map(r => r.toLowerCase()).includes((user.rol || '').toLowerCase())) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute; 