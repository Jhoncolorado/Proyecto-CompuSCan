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
        fontSize: '0.875rem',
        marginTop: '0.25rem',
        marginBottom: '0.5rem',
        padding: '0.5rem',
        backgroundColor: 'rgba(211, 47, 47, 0.08)',
        borderRadius: '4px',
        transition: 'all 0.2s ease'
      }}
    >
      <FaExclamationTriangle style={{ flexShrink: 0 }} />
      <span>{message}</span>
    </div>
  );
};

FormError.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string
};

export default FormError; 