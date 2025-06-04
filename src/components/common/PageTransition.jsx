import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/PageTransition.css';

const PageTransition = ({ children }) => {
  const location = useLocation();
  
  // Asegurar que el fondo siempre sea blanco durante las transiciones
  useEffect(() => {
    document.body.style.background = '#fff';
    
    return () => {
      document.body.style.background = '';
    };
  }, []);
  
  // Enfoque más sutil y moderno: simplemente usar la clase fade-in en todas las páginas
  // sin utilizar CSSTransition que puede causar problemas de posicionamiento
  return (
    <div className="page-wrapper fade-in" style={{ 
      background: '#fff', 
      minHeight: '100%', 
      position: 'relative',
      width: '100%' 
    }}>
      {children}
    </div>
  );
};

export default PageTransition; 