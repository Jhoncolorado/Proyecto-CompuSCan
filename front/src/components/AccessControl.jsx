import React, { useRef, useState } from 'react';
import api from '../services/api';
import QRCode from 'react-qr-code';
import { FaLaptop, FaKey, FaBarcode, FaCheckCircle, FaTimesCircle, FaDesktop } from 'react-icons/fa';

const AccessControl = () => {
  const [rfid, setRfid] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const timerRef = useRef();

  // Mantener el input enfocado siempre
  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    // Asegura el foco en cualquier click
    const focusInput = () => {
      if (inputRef.current) inputRef.current.focus();
    };
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, [data, error]);

  // Temporizador para cerrar modal automáticamente
  React.useEffect(() => {
    if (data || error) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setData(null);
        setError('');
        if (inputRef.current) inputRef.current.focus();
      }, 20000); // 20 segundos
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, error]);

  const handleChange = (e) => {
    setRfid(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rfid) return;
    try {
      const res = await api.post('/api/dispositivos/acceso-rfid', { rfid });
      setData(res.data);
      console.log('Respuesta del backend:', res.data);
      setError('');
    } catch (err) {
      setData(null);
      if (err.response && err.response.status === 404) {
        setError('No se encontró un usuario o equipo con ese RFID');
      } else if (err.response && err.response.status === 403) {
        setError('Usuario deshabilitado, acceso denegado');
      } else {
        setError('Error inesperado al procesar el acceso. Intenta de nuevo.');
      }
    } finally {
      setRfid('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleModalClose = () => {
    setData(null);
    setError('');
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  // Manejar cierre con Enter
  React.useEffect(() => {
    if (!data) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data]);

  // Limpiar el string base64 de la foto para evitar prefijos duplicados
  const getCleanFoto = (foto) => {
    if (!foto) return '';
    return foto.replace(/^(data:image\/[a-zA-Z]+;base64,)+/, 'data:image/jpeg;base64,');
  };

  return (
    <div className="access-bg access-bg-full" style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <h1 className="acceso-titulo" style={{
        color: '#fff',
        textShadow: '0 2px 8px #1b5e20cc, 0 1px 0 #0004',
        fontSize: '2.4rem',
        fontWeight: 800,
        letterSpacing: '1px',
        margin: '1.2rem 0 0.5rem 0',
        textAlign: 'center',
        textTransform: 'uppercase',
      }}>
        registro de entrada/salida
      </h1>
      <form className="access-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          ref={inputRef}
          type="text"
          value={rfid}
          onChange={handleChange}
          placeholder="Pase la tarjeta RFID..."
          className="rfid-invisible-input"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          style={{ position: 'absolute', left: '-9999px', opacity: 0, width: 1, height: 1 }}
        />
        <button type="submit" style={{ display: 'none' }}>Buscar</button>
      </form>
      {error && <div style={{ color: 'red', margin: 10 }}>{error}</div>}
      {/* MODAL DE ACCESO */}
      {data && data.usuario && data.dispositivo && (
        <div className="modal-overlay-access">
          <div className="modal-access-content">
            <div className="modal-access-header">
              <h2 style={{ color: '#2e7d32', fontWeight: 800, marginBottom: 8 }}>Acceso Autorizado</h2>
              <span style={{ color: '#888', fontSize: 14 }}>Se cerrará automáticamente en 20 segundos</span>
            </div>
            <div className="modal-access-body">
              {/* Carnet Aprendiz (restaurado al formato original) */}
              <div className="carnet-tarjeta carnet-aprendiz">
                <div className="carnet-fisico-header">
                  <div className="carnet-fisico-logo-aprendiz">
                    <img src="/images.png" alt="Logo SENA" className="carnet-fisico-logo" />
                    <div className="carnet-fisico-aprendiz" style={{ color: '#2e7d32' }}>APRENDIZ</div>
                  </div>
                  <div className="carnet-fisico-foto">
                    <img
                      src={getCleanFoto(data.usuario.foto) || '/images/default-avatar.png'}
                      alt="Foto usuario"
                      className="carnet-fisico-foto-img"
                    />
                  </div>
                </div>
                <div className="carnet-fisico-divider" style={{ background: '#2e7d32' }}></div>
                <div className="carnet-fisico-info">
                  <div className="carnet-fisico-nombre" style={{ color: '#2e7d32', fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>{data.usuario.nombre}</div>
                  <div className="carnet-fisico-dato"><b>C.C:</b> {data.usuario.documento} &nbsp; <b>RH:</b> {data.usuario.rh || '-'}</div>
                  <div className="carnet-fisico-dato">Regional Quindío</div>
                  <div className="carnet-fisico-dato" style={{ color: '#2e7d32', fontWeight: 'bold' }}>{data.nombrePrograma || 'Programa de formación no registrado'}</div>
                  <div className="carnet-fisico-dato">Grupo No. {data.usuario.ficha}</div>
                  <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <QRCode
                      value={`http://${window.location.hostname}:${window.location.port}/usuario/${data.usuario.documento}`}
                      size={120}
                      bgColor="#fff"
                      fgColor="#2e7d32"
                      level="H"
                      style={{ background: '#fff', padding: 8, borderRadius: 8 }}
                    />
                  </div>
                </div>
              </div>
              {/* Carnet Equipo (diseño segunda imagen) */}
              <div className="modal-access-card equipo-card">
                {/* Imagen principal grande (frontal) */}
                <div className="equipo-main-photo">
                  {Array.isArray(data.dispositivo.foto) && data.dispositivo.foto[0] ? (
                    <img
                      src={`http://localhost:3000/uploads/${data.dispositivo.foto[0]}`}
                      alt="Frontal"
                      style={{ width: 260, height: 170, borderRadius: 14, objectFit: 'cover', border: '2.5px solid #2196f3', background: '#fff' }}
                      onError={e => { e.target.onerror = null; e.target.src = "/images/no-image.png"; }}
                    />
                  ) : (
                    <div style={{ width: 260, height: 170, background: '#eee', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #2196f3', color: '#888', fontSize: 16 }}>
                      Sin imagen
                    </div>
                  )}
                </div>
                {/* Imágenes pequeñas (trasera y cerrado) */}
                <div className="equipo-secondary-photos">
                  {[1, 2].map(idx => (
                    <div key={idx} className="equipo-secondary-photo">
                      {Array.isArray(data.dispositivo.foto) && data.dispositivo.foto[idx] ? (
                        <img
                          src={`http://localhost:3000/uploads/${data.dispositivo.foto[idx]}`}
                          alt={['Trasera', 'Cerrado'][idx - 1]}
                          style={{ width: 130, height: 90, borderRadius: 8, objectFit: 'cover', border: '2.5px solid #2196f3', background: '#fff' }}
                          onError={e => { e.target.onerror = null; e.target.src = "/images/no-image.png"; }}
                        />
                      ) : (
                        <div style={{ width: 130, height: 90, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #2196f3', color: '#888', fontSize: 13 }}>
                          Sin imagen
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: '#388e3c', fontWeight: 700, marginTop: 2 }}>
                        {['Trasera', 'Cerrado'][idx - 1]}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Equipo, tipo y estado alineados profesionalmente */}
                <div className="equipo-info" style={{ marginTop: 18, width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FaLaptop style={{ color: '#2196f3', fontSize: 22, minWidth: 26 }} />
                      <span style={{ fontWeight: 700, minWidth: 70 }}>Equipo</span>
                      <span style={{ fontWeight: 500, marginLeft: 4 }}>{data.dispositivo.nombre}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FaDesktop style={{ color: '#2196f3', fontSize: 22, minWidth: 26 }} />
                      <span style={{ fontWeight: 700, minWidth: 70 }}>Tipo</span>
                      <span style={{ fontWeight: 500, marginLeft: 4 }}>{data.dispositivo.tipo}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FaCheckCircle style={{ color: '#43a047', fontSize: 22, minWidth: 26 }} />
                      <span style={{ fontWeight: 700, minWidth: 70 }}>Estado</span>
                      <span className="badge-estado" style={{ background: '#43a047', color: '#fff', borderRadius: 12, padding: '2px 18px', fontWeight: 700, fontSize: 17, marginLeft: 4, minWidth: 90, textAlign: 'center', display: 'inline-block' }}>
                        {data.dispositivo.estado_validacion || 'Aprobado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = `
.modal-overlay-access {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44,62,80,0.18);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s;
}
.modal-access-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.18);
  padding: 2.2rem 2.5rem 2.2rem 2.5rem;
  min-width: 700px;
  max-width: 98vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  animation: popIn 0.18s;
}
.modal-access-header {
  text-align: center;
  width: 100%;
}
.modal-access-body {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  justify-content: center;
  align-items: flex-start;
}
.modal-access-card {
  background: #f9f9f9;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.07);
  padding: 1.2rem 1.5rem;
  min-width: 260px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}
.aprendiz-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.5rem;
}
.aprendiz-label {
  color: #2e7d32;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 1px;
}
.aprendiz-photo {
  margin-bottom: 0.5rem;
}
.aprendiz-info {
  text-align: center;
  color: #222;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.aprendiz-nombre {
  color: #2e7d32;
  font-weight: 700;
  font-size: 1.1rem;
}
.aprendiz-doc, .aprendiz-region, .aprendiz-programa, .aprendiz-ficha {
  font-size: 0.98rem;
}
.equipo-card {
  min-width: 340px;
  max-width: 400px;
  background: #f8fafc;
  padding: 1.2rem 1.5rem 1.5rem 1.5rem;
}
.equipo-main-photo {
  margin-bottom: 0.7rem;
  display: flex;
  justify-content: center;
}
.equipo-secondary-photos {
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  justify-content: center;
  margin-bottom: 0.7rem;
}
.equipo-secondary-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.equipo-info {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 1.01rem;
}
.equipo-info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #222;
}
.badge-estado {
  background: #43a047;
  color: #fff;
  border-radius: 12px;
  padding: 2px 14px;
  font-weight: 700;
  font-size: 15px;
  margin-left: 6px;
}
@media (max-width: 900px) {
  .modal-access-content { min-width: 98vw; padding: 1.2rem 0.2rem; }
  .modal-access-body { flex-direction: column; gap: 1.5rem; }
  .modal-access-card { min-width: 220px; max-width: 98vw; }
  .equipo-card { min-width: 220px; max-width: 98vw; }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popIn { from { transform: scale(0.95); opacity: 0.7; } to { transform: scale(1); opacity: 1; } }
`;

if (typeof document !== 'undefined' && !document.getElementById('modal-access-styles')) {
  const style = document.createElement('style');
  style.id = 'modal-access-styles';
  style.innerHTML = modalStyles;
  document.head.appendChild(style);
}

export default AccessControl; 