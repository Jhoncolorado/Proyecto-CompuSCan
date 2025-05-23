import React from 'react';
import PropTypes from 'prop-types';
import './FormError.css';

/**
 * Componente para mostrar errores de formulario
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje de error a mostrar
 * @param {boolean} props.visible - Si el error debe mostrarse
 * @param {string} props.className - Clase CSS adicional
 * @returns {JSX.Element|null} Componente de error o null si no es visible
 */
const FormError = ({ message, visible = true, className = '' }) => {
  if (!visible || !message) return null;
  
  return (
    <div className={`form-error ${className}`}>
      <span className="form-error-icon">!</span>
      <span className="form-error-message">{message}</span>
    </div>
  );
};

FormError.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  className: PropTypes.string
};

export default FormError; 