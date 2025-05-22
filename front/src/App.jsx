import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Home from './pages/home/Home';
import Devices from './pages/devices/Devices';
import Users from './pages/users/Users';
import Alerts from './pages/alerts/Alerts';
import History from './pages/history/History';
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
import { UserHistory } from './pages/history/History';
import './styles/PageTransition.css';

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

function IndexRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.rol === 'aprendiz' || user.rol === 'instructor') {
        navigate('/home-user', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter {...router}>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/acceso" element={<AccessControl />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<IndexRedirect />} />
              <Route path="dashboard" element={<Home />} />
              <Route path="devices" element={<Devices />} />
              <Route 
                path="users" 
                element={
                  <PrivateRoute requiredRole="administrador">
                    <Users />
                  </PrivateRoute>
                } 
              />
              <Route path="alerts" element={<Alerts />} />
              <Route path="history" element={<History />} />
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
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
