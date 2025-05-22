import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone, FaTint, FaIdBadge, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/CompuSCan2025.jfif';

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
    observacion: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    setRegisterStep(1);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(loginData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Validación simple para el primer paso
  const validateStep1 = () => {
    if (!registerData.nombre || !registerData.tipo_documento || !registerData.documento || !registerData.correo || !registerData.contrasena || !registerData.confirmar_contrasena) {
      setError('Por favor completa todos los campos obligatorios.');
      return false;
    }
    if (registerData.contrasena !== registerData.confirmar_contrasena) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    setError('');
    return true;
  };

  const handleRegisterNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setRegisterStep(2);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar que todos los campos requeridos estén completos
    if (!registerData.nombre || !registerData.correo || !registerData.contrasena || 
        !registerData.tipo_documento || !registerData.documento || !registerData.rol) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.correo)) {
      setError('Por favor ingresa un correo electrónico válido');
      setLoading(false);
      return;
    }

    // Validar longitud de contraseña
    if (registerData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

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
        ficha: registerData.ficha || null,
        observacion: registerData.observacion || null,
        estado: 'activo'
      };

      console.log('Enviando datos de registro:', userData); // Para debugging

      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      setSuccess('Usuario registrado correctamente');
      
      // Login automático después del registro
      await login({ 
        email: registerData.correo, 
        password: registerData.contrasena 
      });
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="auth-container">
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
        <h1 className="auth-title">Sistema integral de gestión y seguridad</h1>
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
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <h2>Iniciar Sesión</h2>
              <div className="input-icon-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="input-icon-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Contraseña"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="show-password-btn"
                  tabIndex={-1}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8 }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Cargando...' : 'Entrar'}
              </button>
            </form>
          )}
          {activeTab === 'register' && (
            <form className="auth-form" onSubmit={registerStep === 1 ? handleRegisterNext : handleRegisterSubmit}>
              <h2>Registrarse</h2>
              <div className="auth-form-fields">
                {registerStep === 1 ? (
                  <>
                    <div className="input-icon-group">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre completo"
                        value={registerData.nombre}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="input-icon-group">
                      <FaIdCard className="input-icon" />
                      <select
                        name="tipo_documento"
                        value={registerData.tipo_documento}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="">Tipo de documento</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PAS">Pasaporte</option>
                      </select>
                    </div>
                    <div className="input-icon-group">
                      <FaIdCard className="input-icon" />
                      <input
                        type="text"
                        name="documento"
                        placeholder="Número de documento"
                        value={registerData.documento}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="input-icon-group">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        value={registerData.correo}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="input-icon-group">
                      <FaLock className="input-icon" />
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        name="contrasena"
                        placeholder="Contraseña"
                        value={registerData.contrasena}
                        onChange={handleRegisterChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="show-password-btn"
                        tabIndex={-1}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8 }}
                        aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <div className="input-icon-group">
                      <FaLock className="input-icon" />
                      <input
                        type={showRegisterConfirm ? 'text' : 'password'}
                        name="confirmar_contrasena"
                        placeholder="Confirmar contraseña"
                        value={registerData.confirmar_contrasena}
                        onChange={handleRegisterChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterConfirm(!showRegisterConfirm)}
                        className="show-password-btn"
                        tabIndex={-1}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8 }}
                        aria-label={showRegisterConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showRegisterConfirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-icon-group">
                      <FaIdBadge className="input-icon" />
                      <select
                        name="rol"
                        value={registerData.rol}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="">Rol</option>
                        <option value="aprendiz">Aprendiz</option>
                        <option value="instructor">Instructor</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </div>
                    <div className="input-icon-group">
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        name="telefono1"
                        placeholder="Teléfono principal"
                        value={registerData.telefono1}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="input-icon-group">
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        name="telefono2"
                        placeholder="Teléfono secundario"
                        value={registerData.telefono2}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="input-icon-group">
                      <FaTint className="input-icon" />
                      <input
                        type="text"
                        name="rh"
                        placeholder="RH (Ej: O+, A-, B+)"
                        value={registerData.rh}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="input-icon-group">
                      <FaIdBadge className="input-icon" />
                      <input
                        type="text"
                        name="ficha"
                        placeholder="Número de ficha (solo aprendices)"
                        value={registerData.ficha}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="input-icon-group">
                      <textarea
                        name="observacion"
                        placeholder="Observaciones"
                        value={registerData.observacion}
                        onChange={handleRegisterChange}
                      />
                    </div>
                  </>
                )}
              </div>
              {error && <div className="auth-error">{error}</div>}
              {success && <div className="auth-success">{success}</div>}
              {registerStep === 1 ? (
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1.2rem' }}>
                  Siguiente
                </button>
              ) : (
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1.2rem' }}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              )}
              {registerStep === 2 && (
                <button type="button" className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => setRegisterStep(1)}>
                  Volver
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 