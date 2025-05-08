import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Home />} />
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
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
