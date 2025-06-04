import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './PasswordStrength.css';

/**
 * Componente que muestra la fortaleza de una contraseña
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.password - Contraseña a evaluar
 * @returns {JSX.Element|null} Componente de fortaleza de contraseña
 */
const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState({
    score: 0,
    label: '',
    color: '',
    width: '0%'
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        label: '',
        color: '',
        width: '0%'
      });
      return;
    }

    // Criterios de evaluación
    const hasLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Calcular puntuación (0-4)
    let score = 0;
    if (hasLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChar) score++;

    // Determinar etiqueta y color basados en la puntuación
    let label, color;
    switch (score) {
      case 0:
      case 1:
        label = 'Muy débil';
        color = '#c62828'; // Rojo
        break;
      case 2:
        label = 'Débil';
        color = '#ff9800'; // Naranja
        break;
      case 3:
        label = 'Moderada';
        color = '#ffc107'; // Amarillo
        break;
      case 4:
        label = 'Fuerte';
        color = '#4caf50'; // Verde claro
        break;
      case 5:
        label = 'Muy fuerte';
        color = '#2e7d32'; // Verde oscuro
        break;
      default:
        label = '';
        color = '';
    }

    // Calcular ancho de la barra de progreso
    const width = `${(score / 5) * 100}%`;

    setStrength({ score, label, color, width });
  }, [password]);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength-bar">
        <div 
          className="password-strength-progress" 
          style={{ 
            width: strength.width, 
            backgroundColor: strength.color 
          }}
        ></div>
      </div>
      {strength.label && (
        <div className="password-strength-label" style={{ color: strength.color }}>
          {strength.label}
        </div>
      )}
    </div>
  );
};

PasswordStrength.propTypes = {
  password: PropTypes.string
};

export default PasswordStrength; 