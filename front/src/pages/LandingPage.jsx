import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Logo from '../assets/logo-compSCan.png.png';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-bg">
      <div className="landing-content">
        <img src={Logo} alt="Logo CompuScan" className="landing-logo" />
        <h1 className="landing-title">CompuSCan</h1>
        <h2 className="landing-subtitle">Gestión y Control de Acceso de Dispositivos</h2>
        <p className="landing-description">
        Bienvenido a tu plataforma amiga compuscan, dónde podrás gestionar tus dispositivos<br />
          <span className="landing-highlight">Automatiza, controla y protege</span> el acceso con tecnología RFID y reportes inteligentes.
        </p>
        <ul className="landing-benefits">
          <li>✔️ Control de acceso con tarjetas RFID</li>
          <li>✔️ Carnet digital personalizado</li>
          <li>✔️ Registro y validación de dispositivos</li>
          <li>✔️ Reportes y alertas en tiempo real</li>
          <li>✔️ Seguridad y trazabilidad para tu institución</li>
        </ul>
        <button className="landing-login-btn" onClick={() => navigate('/login')}>
          Iniciar sesión
        </button>
      </div>
      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} CompuScan | SENA Regional Quindío</span>
      </footer>
    </div>
  );
};

export default LandingPage; 