import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import PageTransition from '../common/PageTransition';
import '../../styles/PageTransition.css';

const Layout = () => {
  const location = useLocation();
  const isDevices = location.pathname.startsWith('/devices') || location.pathname.startsWith('/my-devices');
  const isUsers = location.pathname.startsWith('/users');
  const isHistory = location.pathname.startsWith('/history') || location.pathname.startsWith('/my-history');
  const isHome = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/home-user';
  const isProfile = location.pathname.startsWith('/profile');

  // Páginas que usan ancho completo
  const useFullWidth = isDevices || isUsers || isHistory || isHome || isProfile;
  
  // Estilos específicos para la página de historial
  const getPageStyles = () => {
    if (isHistory || isDevices) {
      return {
        padding: 0,
        paddingTop: '20px',
        borderRadius: 0,
        boxShadow: 'none',
        marginBottom: 0,
        backgroundColor: '#fff',
        minHeight: 'calc(100vh - 80px)',
        position: 'relative'
      };
    }
    // Reducir el padding para la página de inicio para aprovechar mejor el espacio
    if (isHome) {
      return {
        padding: '0.75rem',
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: '#fff',
        minHeight: 'calc(100vh - 80px)',
        position: 'relative'
      };
    }
    return {
      backgroundColor: '#fff',
      minHeight: 'calc(100vh - 80px)',
      position: 'relative'
    };
  };
  
  // Margen superior ajustado para el historial
  const getMainContentStyles = () => {
    const commonStyles = {
      paddingTop: '80px', 
      background: '#fff',
      position: 'relative'
    };

    if (isHistory || isDevices) {
      return commonStyles;
    }
    if (isHome) {
      return { ...commonStyles, paddingBottom: 0 };
    }
    return commonStyles;
  };

  // Fondo específico para cada página
  const getContainerClass = () => {
    if (isHistory || isDevices) {
      return "d-flex justify-content-center bg-white";
    }
    return "d-flex justify-content-center bg-white";
  };
  
  // Contenedor principal, mantenemos bg-white para todas las páginas
  const getMainContainerClass = () => {
    return "container-fluid p-0 bg-white";
  };

  return (
    <div className={getMainContainerClass()}>
      <Header />
      <div className="main-content" style={getMainContentStyles()}>
        <div className={getContainerClass()}>
          <div className="w-100" style={useFullWidth ? { maxWidth: '100%' } : { maxWidth: 900 }}>
            <div className={`bg-white rounded-4 shadow p-3 mb-2 ${isHistory ? 'history-content' : ''}`} style={getPageStyles()}>
              <PageTransition>
                <Outlet />
              </PageTransition>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 