import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone, FaTint, FaIdBadge, FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import logo from '../../assets/CompuSCan2025.jfif';
import FormError from '../../components/FormError';
import PasswordStrength from '../../components/PasswordStrength';
import { isValidEmail, validatePassword, validatePasswordMatch, validateDocumento } from '../../utils/validators';
import api from '../../services/api';

const Login = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [registerStep, setRegisterStep] = useState(1);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    nombre: '',
    correo: '',
    documento: '',
    tipo_documento: '',
    contrasena: '',
    confirmar_contrasena: '',
    rol: '',
    telefono1: '',
    telefono2: '',
    rh: '',
    ficha: '',
    observacion: '',
    programa: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, message: '' });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [registerPhotoPreview, setRegisterPhotoPreview] = useState('');
  const [programas, setProgramas] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Dar tiempo para la animación de desvanecimiento
    setTimeout(() => {
      setActiveTab(tab);
      setErrors({});
      setSuccess('');
      setRegisterStep(1);
      
      // Reiniciar el estado de transición después de un breve retraso
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    
    // Validar email mientras escribe
    if (e.target.name === 'email') {
      if (!e.target.value) {
        setErrors(prev => ({ ...prev, email: 'El correo electrónico es requerido' }));
      } else if (!isValidEmail(e.target.value)) {
        setErrors(prev => ({ ...prev, email: 'Ingrese un correo electrónico válido' }));
      } else {
        setErrors(prev => ({ ...prev, email: null }));
      }
    }
    
    // Limpiar error de password si comienza a escribir
    if (e.target.name === 'password' && e.target.value) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
    
    // Validaciones en tiempo real
    validateField(name, value);
  };
  
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          setErrors(prev => ({ ...prev, nombre: 'El nombre es requerido' }));
        } else if (value.trim().length < 3) {
          setErrors(prev => ({ ...prev, nombre: 'El nombre debe tener al menos 3 caracteres' }));
        } else {
          setErrors(prev => ({ ...prev, nombre: null }));
        }
        break;
        
      case 'correo':
        if (!value) {
          setErrors(prev => ({ ...prev, correo: 'El correo es requerido' }));
        } else if (!isValidEmail(value)) {
          setErrors(prev => ({ ...prev, correo: 'Ingrese un correo electrónico válido' }));
        } else {
          setErrors(prev => ({ ...prev, correo: null }));
        }
        break;
        
      case 'documento':
        const docResult = validateDocumento(value, registerData.tipo_documento);
        if (!docResult.isValid) {
          setErrors(prev => ({ ...prev, documento: docResult.message }));
        } else {
          setErrors(prev => ({ ...prev, documento: null }));
        }
        break;
        
      case 'contrasena':
        const passResult = validatePassword(value);
        setPasswordStrength({ 
          strength: passResult.strength, 
          message: passResult.message 
        });
        if (!passResult.isValid) {
          setErrors(prev => ({ ...prev, contrasena: passResult.message }));
        } else {
          setErrors(prev => ({ ...prev, contrasena: null }));
        }
        
        // Validar también la confirmación si ya existe
        if (registerData.confirmar_contrasena) {
          const matchResult = validatePasswordMatch(value, registerData.confirmar_contrasena);
          if (!matchResult.isValid) {
            setErrors(prev => ({ ...prev, confirmar_contrasena: matchResult.message }));
          } else {
            setErrors(prev => ({ ...prev, confirmar_contrasena: null }));
          }
        }
        break;
        
      case 'confirmar_contrasena':
        const matchResult = validatePasswordMatch(registerData.contrasena, value);
        if (!matchResult.isValid) {
          setErrors(prev => ({ ...prev, confirmar_contrasena: matchResult.message }));
        } else {
          setErrors(prev => ({ ...prev, confirmar_contrasena: null }));
        }
        break;
        
      case 'rol':
        if (!value) {
          setErrors(prev => ({ ...prev, rol: 'El rol es requerido' }));
        } else {
          setErrors(prev => ({ ...prev, rol: null }));
        }
        break;
        
      default:
        break;
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario antes de enviar
    let formErrors = {};
    
    if (!loginData.email) {
      formErrors.email = 'El correo electrónico es requerido';
    } else if (!isValidEmail(loginData.email)) {
      formErrors.email = 'Ingrese un correo electrónico válido';
    }
    
    if (!loginData.password) {
      formErrors.password = 'La contraseña es requerida';
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    try {
      await login(loginData);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setErrors({ general: 'Usuario deshabilitado, acceso denegado' });
      } else if (err.response && err.response.status === 401) {
        setErrors({ general: 'Correo o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo.' });
      } else {
        setErrors({ general: 'Error inesperado al iniciar sesión. Intenta de nuevo.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Validación para el primer paso
  const validateStep1 = () => {
    let formErrors = {};
    let isValid = true;
    
    // Validar campos obligatorios
    if (!registerData.nombre) {
      formErrors.nombre = 'El nombre es requerido';
      isValid = false;
    }
    
    if (!registerData.tipo_documento) {
      formErrors.tipo_documento = 'El tipo de documento es requerido';
      isValid = false;
    }
    
    if (!registerData.documento) {
      formErrors.documento = 'El documento es requerido';
      isValid = false;
    } else {
      const docResult = validateDocumento(registerData.documento, registerData.tipo_documento);
      if (!docResult.isValid) {
        formErrors.documento = docResult.message;
        isValid = false;
      }
    }
    
    if (!registerData.correo) {
      formErrors.correo = 'El correo es requerido';
      isValid = false;
    } else if (!isValidEmail(registerData.correo)) {
      formErrors.correo = 'Ingrese un correo electrónico válido';
      isValid = false;
    }
    
    if (!registerData.contrasena) {
      formErrors.contrasena = 'La contraseña es requerida';
      isValid = false;
    } else {
      const passResult = validatePassword(registerData.contrasena);
      if (!passResult.isValid) {
        formErrors.contrasena = passResult.message;
        isValid = false;
      }
    }
    
    if (!registerData.confirmar_contrasena) {
      formErrors.confirmar_contrasena = 'Debe confirmar la contraseña';
      isValid = false;
    } else {
      const matchResult = validatePasswordMatch(registerData.contrasena, registerData.confirmar_contrasena);
      if (!matchResult.isValid) {
        formErrors.confirmar_contrasena = matchResult.message;
        isValid = false;
    }
    }
    
    setErrors(formErrors);
    return isValid;
  };

  const handleRegisterNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setIsTransitioning(true);
      
      // Dar tiempo para la animación de transición
      setTimeout(() => {
        setRegisterStep(2);
        
        // Reiniciar el estado de transición después de un breve retraso
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }
  };

  const handleRegisterPrevious = () => {
    setIsTransitioning(true);
    
    // Dar tiempo para la animación de transición
    setTimeout(() => {
      setRegisterStep(1);
      
      // Reiniciar el estado de transición después de un breve retraso
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Validar que el rol esté seleccionado
    if (!registerData.rol) {
      setErrors(prev => ({ ...prev, rol: 'El rol es requerido' }));
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      // Preparar los datos para el registro
      const userData = {
        nombre: registerData.nombre,
        correo: registerData.correo,
        contrasena: registerData.contrasena,
        tipo_documento: registerData.tipo_documento,
        documento: registerData.documento,
        rol: registerData.rol,
        telefono1: registerData.telefono1 || null,
        telefono2: registerData.telefono2 || null,
        rh: registerData.rh || null,
        observacion: registerData.observacion || null,
        estado: 'activo',
        foto: registerData.foto || null
      };
      // Si es aprendiz, agregar id_ficha y id_programa como enteros
      if (registerData.rol === 'aprendiz') {
        userData.id_ficha = registerData.ficha ? parseInt(registerData.ficha, 10) : null;
        userData.id_programa = registerData.programa ? parseInt(registerData.programa, 10) : null;
      } else if (registerData.rol === 'instructor') {
        userData.id_programa = registerData.programa ? parseInt(registerData.programa, 10) : null;
      }

      console.log('Enviando datos de registro:', userData); // Para debugging

      const response = await api.post('/api/usuarios', userData);
      const data = response.data;

      setSuccess('Usuario registrado correctamente');
      // Login automático después del registro
      await login({ 
        email: registerData.correo, 
        password: registerData.contrasena 
      });
    } catch (err) {
      console.error('Error en registro:', err);
      let msg = err.response?.data?.error || err.message || 'Error al registrar usuario';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  // Función para determinar las clases de los formularios
  const getFormClasses = (isRegisterForm) => {
    let classes = "auth-form";
    
    if (isTransitioning) {
      classes += " transitioning";
    } else if (isRegisterForm) {
      classes += " with-scroll";
    }
    
    return classes;
  };

  useEffect(() => {
    if (activeTab === 'register' && registerStep === 2 && registerData.rol === 'aprendiz') {
      api.get('/api/programas')
        .then(res => setProgramas(res.data))
        .catch(() => setProgramas([]));
    }
  }, [activeTab, registerStep, registerData.rol]);

  return (
    <div className="auth-bg-gradient">
      <img 
        src={logo} 
        alt="Robot institucional" 
        className="robot-bg" 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%2343a047"/><text x="50%" y="50%" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white">CompuSCan</text></svg>';
        }}
      />
      <div className="auth-container auth-compact">
        <div className="auth-logo-box">
          <img 
            src={logo} 
            alt="Logo" 
            className="auth-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%2343a047"/><text x="50%" y="50%" font-size="20" text-anchor="middle" dominant-baseline="middle" fill="white">CS</text></svg>';
            }}
          />
        </div>
        <h1 className="auth-title">Sistema de Gestión de Dispositivos</h1>
        <div className="auth-tabs">
          <button
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => handleTabChange('login')}
          >
            Iniciar Sesión
          </button>
          <button
            className={activeTab === 'register' ? 'active' : ''}
            onClick={() => handleTabChange('register')}
          >
            Registrarse
          </button>
        </div>
        <div className="auth-content">
          {activeTab === 'login' && (
            <form className={getFormClasses(false)}>
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Ingresa tu correo"
                  className={errors.email ? 'input-error' : ''}
                />
                <FormError message={errors.email} visible={!!errors.email} />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock /> Contraseña
                </label>
                <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                    id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                    placeholder="Ingresa tu contraseña"
                    className={errors.password ? 'input-error' : ''}
                />
                <button
                  type="button"
                    className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>
                <FormError message={errors.password} visible={!!errors.password} />
              </div>
              {errors.general && <FormError message={errors.general} visible={true} />}
              <button type="submit" className="auth-button" disabled={loading} onClick={handleLoginSubmit}>
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '0.5rem', marginBottom: 0 }}>
                <a href="/forgot-password" style={{ color: '#388e3c', textDecoration: 'underline', fontWeight: 500 }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </form>
          )}

          {activeTab === 'register' && registerStep === 1 && (
            <form className={getFormClasses(true)}>
              <div className="form-group">
                <label htmlFor="nombre">
                  <FaUser /> Nombre completo
                </label>
                      <input
                        type="text"
                  id="nombre"
                        name="nombre"
                        value={registerData.nombre}
                        onChange={handleRegisterChange}
                  placeholder="Ingresa tu nombre completo"
                  className={errors.nombre ? 'input-error' : ''}
                  autoComplete="off"
                />
                <FormError message={errors.nombre} visible={!!errors.nombre} />
              </div>
              
              <div className="auth-form-group">
                <div className="auth-form-group-title">
                  <FaIdCard /> Información de documento
                    </div>
                <div className="form-group">
                  <label htmlFor="tipo_documento">
                    Tipo de documento
                  </label>
                      <select
                    id="tipo_documento"
                        name="tipo_documento"
                        value={registerData.tipo_documento}
                        onChange={handleRegisterChange}
                    className={errors.tipo_documento ? 'input-error' : ''}
                      >
                    <option value="">Selecciona tipo</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PAS">Pasaporte</option>
                      </select>
                  <FormError message={errors.tipo_documento} visible={!!errors.tipo_documento} />
                    </div>
                
                <div className="form-group">
                  <label htmlFor="documento">
                    Número de documento
                  </label>
                      <input
                        type="text"
                    id="documento"
                        name="documento"
                        value={registerData.documento}
                        onChange={handleRegisterChange}
                    placeholder="Ingresa tu documento"
                    className={errors.documento ? 'input-error' : ''}
                    autoComplete="off"
                      />
                  <FormError message={errors.documento} visible={!!errors.documento} />
                </div>
                    </div>
              
              <div className="form-group">
                <label htmlFor="correo">
                  <FaEnvelope /> Correo electrónico
                </label>
                      <input
                        type="email"
                  id="correo"
                        name="correo"
                        value={registerData.correo}
                        onChange={handleRegisterChange}
                  placeholder="Ingresa tu correo electrónico"
                  className={errors.correo ? 'input-error' : ''}
                  autoComplete="off"
                />
                <FormError message={errors.correo} visible={!!errors.correo} />
              </div>
              
              <div className="auth-form-group">
                <div className="auth-form-group-title">
                  <FaLock /> Configuración de contraseña
                    </div>
                <div className="form-group">
                  <label htmlFor="contrasena">
                    Contraseña
                  </label>
                  <div className="password-input-container">
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                      id="contrasena"
                        name="contrasena"
                        value={registerData.contrasena}
                        onChange={handleRegisterChange}
                      placeholder="Crea tu contraseña"
                      className={errors.contrasena ? 'input-error' : ''}
                      />
                      <button
                        type="button"
                      className="password-toggle"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      >
                        {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  <PasswordStrength 
                    strength={passwordStrength.strength} 
                    message={passwordStrength.message} 
                  />
                  <FormError message={errors.contrasena} visible={!!errors.contrasena} />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmar_contrasena">
                    Confirmar contraseña
                  </label>
                  <div className="password-input-container">
                      <input
                        type={showRegisterConfirm ? 'text' : 'password'}
                      id="confirmar_contrasena"
                        name="confirmar_contrasena"
                        value={registerData.confirmar_contrasena}
                        onChange={handleRegisterChange}
                      placeholder="Confirma tu contraseña"
                      className={errors.confirmar_contrasena ? 'input-error' : ''}
                      />
                      <button
                        type="button"
                      className="password-toggle"
                        onClick={() => setShowRegisterConfirm(!showRegisterConfirm)}
                      >
                        {showRegisterConfirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  <FormError message={errors.confirmar_contrasena} visible={!!errors.confirmar_contrasena} />
                </div>
              </div>
              
              {errors.general && <FormError message={errors.general} visible={true} />}
              <button type="button" className="auth-button" disabled={loading} onClick={handleRegisterNext}>
                Siguiente
              </button>
            </form>
          )}

          {activeTab === 'register' && registerStep === 2 && (
            <form className={getFormClasses(true)}>
              <div className="form-group">
                <label htmlFor="rol">
                  <FaUser /> Rol
                </label>
                      <select
                  id="rol"
                        name="rol"
                        value={registerData.rol}
                        onChange={handleRegisterChange}
                  className={errors.rol ? 'input-error' : ''}
                      >
                  <option value="">Selecciona tu rol</option>
                        <option value="aprendiz">Aprendiz</option>
                        <option value="instructor">Instructor</option>
                      </select>
                <FormError message={errors.rol} visible={!!errors.rol} />
              </div>
              
              <div className="auth-form-group">
                <div className="auth-form-group-title">
                  <FaPhone /> Información de contacto
                    </div>
                <div className="form-group">
                  <label htmlFor="telefono1">
                    Teléfono principal
                  </label>
                      <input
                        type="tel"
                    id="telefono1"
                        name="telefono1"
                        value={registerData.telefono1}
                        onChange={handleRegisterChange}
                    placeholder="Teléfono principal"
                    autoComplete="off"
                      />
                    </div>
                
                <div className="form-group">
                  <label htmlFor="telefono2">
                    Teléfono secundario
                  </label>
                      <input
                        type="tel"
                    id="telefono2"
                        name="telefono2"
                        value={registerData.telefono2}
                        onChange={handleRegisterChange}
                    placeholder="Opcional"
                    autoComplete="off"
                      />
                    </div>
              </div>
              
              <div className="auth-form-group">
                <div className="auth-form-group-title">
                  <FaIdBadge /> Datos adicionales
                </div>
                <div className="form-group">
                  <label htmlFor="rh">
                    <FaTint /> Grupo sanguíneo (RH)
                  </label>
                      <input
                        type="text"
                    id="rh"
                        name="rh"
                        value={registerData.rh}
                        onChange={handleRegisterChange}
                    placeholder="Ej: O+, A-, AB+"
                    autoComplete="off"
                      />
                    </div>
                
                {registerData.rol === 'aprendiz' && (
                  <div className="form-group">
                    <label htmlFor="ficha">Número de ficha</label>
                    <input
                      type="text"
                      id="ficha"
                      name="ficha"
                      value={registerData.ficha}
                      onChange={handleRegisterChange}
                      placeholder="Para aprendices"
                    />
                    <label htmlFor="programa">Programa de formación</label>
                    <select
                      id="programa"
                      name="programa"
                      value={registerData.programa}
                      onChange={handleRegisterChange}
                      required
                    >
                      <option value="">Selecciona un programa</option>
                      {programas.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre_programa}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="observacion">Observaciones</label>
                      <textarea
                  id="observacion"
                        name="observacion"
                        value={registerData.observacion}
                        onChange={handleRegisterChange}
                  placeholder="Observaciones adicionales (opcional)"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="foto">Foto de perfil (obligatoria)</label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  accept="image/*"
                  required
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setRegisterPhotoPreview(reader.result);
                        setRegisterData({ ...registerData, foto: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {registerPhotoPreview && (
                  <div style={{ marginTop: 8 }}>
                    <img src={registerPhotoPreview} alt="Preview" style={{ maxHeight: 80, borderRadius: '50%' }} />
                  </div>
                )}
              </div>
              
              {/* Términos y condiciones */}
              <div className="form-group" style={{ marginTop: 16, marginBottom: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                <label htmlFor="termsCheckbox" style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 15, color: '#222', margin: 0, cursor: 'pointer', gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    style={{ marginTop: 2, width: 16, height: 16 }}
                    required
                    id="termsCheckbox"
                  />
                  <span style={{ display: 'inline', fontWeight: 400 }}>
                    Acepto los
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, padding: 0, margin: 0, marginLeft: 4 }}
                    >
                      términos y condiciones
                    </button>
                    {' '}de la política de protección de datos.
                  </span>
                </label>
                <div style={{ color: '#888', fontSize: 15, paddingLeft: 24, marginTop: 2, userSelect: 'text', fontWeight: 400 }}>
                  Recibirás confirmación del registro por correo electrónico.
                </div>
              </div>
              
              {/* Modal de Términos y Condiciones */}
              {showTermsModal && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(44,62,80,0.18)', width: '90vw', maxWidth: 700, minHeight: 480, maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative',
                  }}>
                    <button
                      onClick={() => setShowTermsModal(false)}
                      style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer', zIndex: 2 }}
                      aria-label="Cerrar"
                    >
                      <IoMdClose />
                    </button>
                    <div style={{ padding: '18px 24px 0 24px', fontWeight: 700, fontSize: 20, color: '#1976d2', textAlign: 'center' }}>
                      Términos y Condiciones
                    </div>
                    <iframe
                      src="/politica_confidencialidad_sena.pdf"
                      title="Términos y Condiciones"
                      style={{ flex: 1, width: '100%', height: 500, border: 'none', marginTop: 12, borderRadius: 8 }}
                    />
                    <div style={{ padding: 16, textAlign: 'center' }}>
                      <button
                        onClick={() => setShowTermsModal(false)}
                        style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 8 }}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {success && <div className="auth-success">{success}</div>}
              {errors.general && <FormError message={errors.general} visible={true} />}
              
              <div className="auth-buttons">
                <button
                  type="button"
                  className="auth-button secondary"
                  onClick={handleRegisterPrevious}
                >
                  Anterior
                </button>
                <button type="button" className="auth-button" disabled={loading || !acceptedTerms} onClick={handleRegisterSubmit}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 