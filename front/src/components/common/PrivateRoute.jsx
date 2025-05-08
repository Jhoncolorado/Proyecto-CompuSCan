import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    if (requiredRole === 'administrador' || requiredRole === 'validador') {
      if (user.rol !== 'administrador' && user.rol !== 'validador') {
        return <Navigate to="/" replace />;
      }
    } else if (user.rol !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const adminOrValidadorAllowed = allowedRoles.includes('administrador') || allowedRoles.includes('validador');
    
    if (adminOrValidadorAllowed) {
      if (user.rol !== 'administrador' && user.rol !== 'validador') {
        return <Navigate to="/" replace />;
      }
    } else if (!allowedRoles.includes(user.rol)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute; 