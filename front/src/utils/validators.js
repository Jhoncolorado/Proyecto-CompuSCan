/**
 * Módulo de utilidades para validación de formularios
 */

/**
 * Valida si un correo electrónico tiene formato válido
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} - true si el correo es válido
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  // Expresión regular para validar correos electrónicos
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} - Resultado de la validación con nivel de fortaleza
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, strength: 0, message: 'La contraseña es requerida' };
  }

  let strength = 0;
  const messages = [];

  // Longitud mínima
  if (password.length < 8) {
    messages.push('La contraseña debe tener al menos 8 caracteres');
  } else {
    strength += 1;
  }

  // Contiene números
  if (/\d/.test(password)) {
    strength += 1;
  } else {
    messages.push('Debe incluir al menos un número');
  }

  // Contiene letras minúsculas
  if (/[a-z]/.test(password)) {
    strength += 1;
  } else {
    messages.push('Debe incluir al menos una letra minúscula');
  }

  // Contiene letras mayúsculas
  if (/[A-Z]/.test(password)) {
    strength += 1;
  } else {
    messages.push('Debe incluir al menos una letra mayúscula');
  }

  // Contiene caracteres especiales
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 1;
  } else {
    messages.push('Debe incluir al menos un carácter especial');
  }

  // Determinar resultado
  const isValid = strength >= 3;
  const message = messages.length > 0 ? messages[0] : 'Contraseña válida';

  return {
    isValid,
    strength: Math.min(5, strength),
    message,
    allMessages: messages
  };
};

/**
 * Valida si dos contraseñas coinciden
 * @param {string} password - Contraseña original
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {Object} - Resultado de la validación
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Debe confirmar la contraseña' };
  }

  return {
    isValid: password === confirmPassword,
    message: password === confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'
  };
};

/**
 * Valida un número de documento según su tipo
 * @param {string} documento - Número de documento
 * @param {string} tipo - Tipo de documento (CC, TI, CE, etc.)
 * @returns {Object} - Resultado de la validación
 */
export const validateDocumento = (documento, tipo) => {
  if (!documento) {
    return { isValid: false, message: 'El documento es requerido' };
  }

  // Validaciones específicas según el tipo de documento
  switch (tipo) {
    case 'CC':
      // Cédula de ciudadanía: solo números, entre 8 y 10 dígitos
      if (!/^\d{8,10}$/.test(documento)) {
        return { isValid: false, message: 'La cédula debe tener entre 8 y 10 dígitos numéricos' };
      }
      break;
    case 'TI':
      // Tarjeta de identidad: solo números, entre 10 y 11 dígitos
      if (!/^\d{10,11}$/.test(documento)) {
        return { isValid: false, message: 'La tarjeta de identidad debe tener entre 10 y 11 dígitos numéricos' };
      }
      break;
    case 'CE':
      // Cédula de extranjería: puede contener letras y números
      if (!/^[A-Za-z0-9]{6,12}$/.test(documento)) {
        return { isValid: false, message: 'La cédula de extranjería debe tener entre 6 y 12 caracteres' };
      }
      break;
    default:
      // Para otros tipos, al menos 5 caracteres
      if (documento.length < 5) {
        return { isValid: false, message: 'El documento debe tener al menos 5 caracteres' };
      }
  }

  return { isValid: true, message: 'Documento válido' };
};

/**
 * Valida un número de teléfono
 * @param {string} telefono - Número de teléfono
 * @returns {Object} - Resultado de la validación
 */
export const validateTelefono = (telefono) => {
  if (!telefono) {
    return { isValid: true, message: 'El teléfono es opcional' }; // Opcional
  }

  // Validar formato: solo números, guiones y espacios
  if (!/^[\d\s-]+$/.test(telefono)) {
    return { isValid: false, message: 'El teléfono solo debe contener números, espacios y guiones' };
  }

  // Validar longitud
  const digitsOnly = telefono.replace(/[^\d]/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return { isValid: false, message: 'El teléfono debe tener entre 7 y 15 dígitos' };
  }

  return { isValid: true, message: 'Teléfono válido' };
};

/**
 * Valida un tipo de sangre (RH)
 * @param {string} rh - Tipo de sangre
 * @returns {Object} - Resultado de la validación
 */
export const validateRH = (rh) => {
  if (!rh) {
    return { isValid: true, message: 'El RH es opcional' }; // Opcional
  }

  // Validar formato: A+, A-, B+, B-, AB+, AB-, O+, O-
  const rhRegex = /^(A|B|AB|O)[+-]$/;
  if (!rhRegex.test(rh)) {
    return { isValid: false, message: 'El RH debe tener un formato válido (ej: A+, O-, AB+)' };
  }

  return { isValid: true, message: 'RH válido' };
};

/**
 * Valida un número de ficha
 * @param {string} ficha - Número de ficha
 * @returns {Object} - Resultado de la validación
 */
export const validateFicha = (ficha) => {
  if (!ficha) {
    return { isValid: false, message: 'El número de ficha es requerido para aprendices' };
  }

  // Validar formato: solo números, entre 5 y 8 dígitos
  if (!/^\d{5,8}$/.test(ficha)) {
    return { isValid: false, message: 'El número de ficha debe tener entre 5 y 8 dígitos numéricos' };
  }

  return { isValid: true, message: 'Ficha válida' };
};

/**
 * Valida un formulario de usuario completo
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Objeto con resultado, mensaje y errores específicos
 */
export const validateUserForm = (formData) => {
  const errors = {};
  let isValid = true;
  
  // Validar nombre
  if (!formData.nombre || formData.nombre.trim().length < 3) {
    errors.nombre = 'El nombre es requerido y debe tener al menos 3 caracteres';
    isValid = false;
  }
  
  // Validar correo
  if (!isValidEmail(formData.correo)) {
    errors.correo = 'El correo electrónico no es válido';
    isValid = false;
  }
  
  // Validar documento
  const docResult = validateDocumento(formData.documento, formData.tipo_documento);
  if (!docResult.isValid) {
    errors.documento = docResult.message;
    isValid = false;
  }
  
  // Validar teléfono
  const telResult = validateTelefono(formData.telefono1);
  if (!telResult.isValid) {
    errors.telefono1 = telResult.message;
    isValid = false;
  }
  
  // Validar RH
  const rhResult = validateRH(formData.rh);
  if (!rhResult.isValid) {
    errors.rh = rhResult.message;
    isValid = false;
  }
  
  // Validar ficha (solo para aprendices)
  if (formData.rol === 'aprendiz') {
    const fichaResult = validateFicha(formData.ficha);
    if (!fichaResult.isValid) {
      errors.ficha = fichaResult.message;
      isValid = false;
    }
  }
  
  return {
    isValid,
    errors,
    message: isValid ? 'Formulario válido' : 'Por favor corrija los errores en el formulario'
  };
};

/**
 * Valida un formulario de dispositivo completo
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Objeto con resultado, mensaje y errores específicos
 */
export const validateDeviceForm = (formData) => {
  const errors = {};
  let isValid = true;
  
  // Validar nombre
  if (!formData.nombre || formData.nombre.trim().length < 3) {
    errors.nombre = 'El nombre es requerido y debe tener al menos 3 caracteres';
    isValid = false;
  }
  
  // Validar marca
  if (!formData.marca || formData.marca.trim().length < 2) {
    errors.marca = 'La marca es requerida y debe tener al menos 2 caracteres';
    isValid = false;
  }
  
  // Validar modelo
  if (!formData.modelo || formData.modelo.trim().length < 2) {
    errors.modelo = 'El modelo es requerido y debe tener al menos 2 caracteres';
    isValid = false;
  }
  
  // Validar serial
  if (!formData.serial || formData.serial.trim().length < 5) {
    errors.serial = 'El serial es requerido y debe tener al menos 5 caracteres';
    isValid = false;
  }
  
  // Validar tipo
  if (!formData.tipo) {
    errors.tipo = 'El tipo de dispositivo es requerido';
    isValid = false;
  }
  
  return {
    isValid,
    errors,
    message: isValid ? 'Formulario válido' : 'Por favor corrija los errores en el formulario'
  };
}; 