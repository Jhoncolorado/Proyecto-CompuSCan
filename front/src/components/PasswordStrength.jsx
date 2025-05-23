import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente que muestra visualmente la fortaleza de una contraseña
 * @param {Object} props - Propiedades del componente
 * @param {number} props.strength - Nivel de fortaleza (0-5)
 * @param {string} props.message - Mensaje descriptivo de la fortaleza
 * @returns {JSX.Element} - Componente de visualización de fortaleza
 */
const PasswordStrength = ({ strength, message }) => {
  // Determinar color según fortaleza
  const getColor = () => {
    switch (strength) {
      case 0: return '#e0e0e0'; // Gris (vacío)
      case 1: return '#f44336'; // Rojo (muy débil)
      case 2: return '#ff9800'; // Naranja (débil)
      case 3: return '#ffeb3b'; // Amarillo (moderada)
      case 4: return '#8bc34a'; // Verde claro (fuerte)
      case 5: return '#4caf50'; // Verde (muy fuerte)
      default: return '#e0e0e0';
    }
  };

  // Determinar texto según fortaleza
  const getStrengthText = () => {
    switch (strength) {
      case 0: return 'Sin contraseña';
      case 1: return 'Muy débil';
      case 2: return 'Débil';
      case 3: return 'Moderada';
      case 4: return 'Fuerte';
      case 5: return 'Muy fuerte';
      default: return 'Sin contraseña';
    }
  };

  return (
    <div className="password-strength-container" style={{ marginBottom: '1rem' }}>
      <div className="password-strength-bars" style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            style={{
              height: '6px',
              flex: 1,
              backgroundColor: level <= strength ? getColor() : '#e0e0e0',
              borderRadius: '2px',
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        <span style={{ color: getColor(), fontWeight: 500 }}>{getStrengthText()}</span>
        {message && <span style={{ color: '#666' }}>{message}</span>}
      </div>
    </div>
  );
};

PasswordStrength.propTypes = {
  strength: PropTypes.number.isRequired,
  message: PropTypes.string
};

PasswordStrength.defaultProps = {
  strength: 0,
  message: ''
};

export default PasswordStrength; 