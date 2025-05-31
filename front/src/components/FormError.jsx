import React from 'react';
import PropTypes from 'prop-types';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Componente para mostrar errores de formulario de manera consistente
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje de error a mostrar
 * @param {boolean} props.visible - Indica si el error debe mostrarse
 * @param {string} props.className - Clases CSS adicionales
 * @returns {JSX.Element|null} - Componente de error o null si no es visible
 */
const FormError = ({ message, visible = true, className = '' }) => {
  if (!visible || !message) return null;

  return (
    <div 
      className={`form-error ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#d32f2f',
        fontSize: '0.95rem',
        marginTop: '0.25rem',
        marginBottom: '0.5rem',
        padding: '0.65rem 1rem',
        background: 'linear-gradient(90deg, #ffebee 0%, #fff 100%)',
        borderLeft: '4px solid #d32f2f',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(211,47,47,0.07)',
        animation: 'fadeInError 0.35s cubic-bezier(0.4,0,0.2,1)',
        transition: 'all 0.2s ease'
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}><circle cx="12" cy="12" r="12" fill="#d32f2f"/><path d="M12 7V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="16" r="1" fill="white"/></svg>
      <span>{message}</span>
      <style>{`@keyframes fadeInError { from { opacity: 0; transform: translateY(-8px);} to { opacity: 1; transform: translateY(0);} }`}</style>
    </div>
  );
};

FormError.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string
};

export default FormError; 