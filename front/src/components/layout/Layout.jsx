import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  const location = useLocation();
  const isDevices = location.pathname.startsWith('/devices');
  const isUsers = location.pathname.startsWith('/users');
  const isHistory = location.pathname.startsWith('/history');

  const useFullWidth = isDevices || isUsers || isHistory;
  
  // Estilos específicos para la página de historial
  const getPageStyles = () => {
    if (isHistory) {
      return {
        padding: 0,
        paddingTop: '20px',
        borderRadius: 0,
        boxShadow: 'none',
        marginBottom: 0
      };
    }
    return {};
  };
  
  // Margen superior ajustado para el historial
  const getMainContentStyles = () => {
    if (isHistory) {
      return { 
        marginTop: 0,
        background: '#fff'
      };
    }
    return { marginTop: 60 };
  };

  // Fondo específico para cada página
  const getContainerClass = () => {
    if (isHistory) {
      return "d-flex justify-content-center bg-white";
    }
    return "d-flex justify-content-center bg-light";
  };
  
  // Contenedor principal, eliminamos bg-light para historial
  const getMainContainerClass = () => {
    if (isHistory) {
      return "container-fluid p-0 min-vh-100";
    }
    return "container-fluid p-0 min-vh-100 bg-light";
  };

  return (
    <div className={getMainContainerClass()}>
      <Header />
      <div className="main-content" style={getMainContentStyles()}>
        <div className={getContainerClass()}>
          <div className="w-100" style={useFullWidth ? {} : { maxWidth: 900 }}>
            <div className={`bg-white rounded-4 shadow p-4 mb-4 ${isHistory ? 'history-content' : ''}`} style={getPageStyles()}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 