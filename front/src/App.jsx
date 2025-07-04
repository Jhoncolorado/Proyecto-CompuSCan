import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Home from './pages/home/Home';
import Devices from './pages/devices/Devices';
import Users from './pages/users/Users';
import Reports from './pages/alerts/Alerts';
import History, { UserHistory } from './pages/history/History';
import Programs from './pages/programs/Programs';
import Cards from './pages/cards/Cards';
import Cases from './pages/cases/Cases';
import Profile from './pages/profile/Profile';
import PrivateRoute from './components/common/PrivateRoute';
import DeviceValidation from './components/DeviceValidation';
import AccessControl from './components/AccessControl';
import { HomeUser } from './pages/home/Home';
import { UserDevicesPage } from './pages/devices/Devices';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/PageTransition.css';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import UserProfile from './pages/users/UserProfile';
import LandingPage from './pages/LandingPage';
import Asistencia from './pages/Asistencia';

// Componente de carga para Suspense
const LoadingFallback = () => (
  <div className="loading-container fade-in" style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    background: '#f8f9fa'
  }}>
    <div className="pulse" style={{
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: '#43a047',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontWeight: 'bold'
    }}>
      CS
    </div>
  </div>
);

// Configuración de las banderas futuras de React Router
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <BrowserRouter {...router}>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingOrRedirect />} />
            <Route path="/login" element={<LoginRedirectIfAuth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/acceso" element={<AccessControl />} />
            <Route path="/usuario/:documento" element={<UserProfile />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<Home />} />
              <Route path="home" element={<Navigate to="/dashboard" replace />} />
              <Route path="devices" element={<Devices />} />
              <Route 
                path="users" 
                element={
                  <PrivateRoute requiredRole="administrador">
                    <Users />
                  </PrivateRoute>
                } 
              />
              <Route path="reports" element={<Reports />} />
              <Route path="history" element={
                <PrivateRoute>
                  <HistoryOrUserHistory />
                </PrivateRoute>
              } />
              <Route path="programs" element={<Programs />} />
              <Route path="cards" element={<Cards />} />
              <Route path="cases" element={<Cases />} />
              <Route 
                path="profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route path="device-validation" element={<DeviceValidation />} />
              <Route path="home-user" element={<HomeUser />} />
              <Route path="my-devices" element={<UserDevicesPage />} />
              <Route path="my-history" element={<UserHistory />} />
              <Route path="asistencia" element={<Asistencia />} />
              <Route 
                path="historial-asistencia" 
                element={
                  <PrivateRoute requiredRole="instructor">
                    <History />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Componente para redirigir a dashboard si ya está autenticado
function LoginRedirectIfAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (user) {
      if (user.rol === 'aprendiz' || user.rol === 'instructor') {
        navigate('/home-user', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);
  return <Login />;
}

// Componente para mostrar landing solo si NO está autenticado
function LandingOrRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (user) {
      if (user.rol === 'aprendiz' || user.rol === 'instructor') {
        navigate('/home-user', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);
  return <LandingPage />;
}

// Componente para mostrar el historial adecuado según el rol
function HistoryOrUserHistory() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.rol === 'administrador') return <UserHistory />;
  if (user.rol === 'instructor') return <History />;
  // Si es aprendiz u otro, puedes personalizar aquí
  return <UserHistory />;
}

export default App;
