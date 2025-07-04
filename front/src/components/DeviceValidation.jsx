import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePendientes } from '../context/PendientesContext';
import '../styles/DeviceValidation.css';

const DeviceValidation = () => {
  const { user } = useAuth();
  const { setPendientes } = usePendientes();
  console.log('Usuario en DeviceValidation:', user);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [rfid, setRfid] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && ['admin', 'validador', 'administrador'].includes((user.rol || '').toLowerCase())) {
      fetchPendingDevices();
    }
  }, [user]);

  const fetchPendingDevices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/dispositivos/pendientes');
      setDevices(res.data);
      setPendientes(res.data.length);
      console.log('Dispositivos pendientes recibidos:', res.data);
    } catch (err) {
      setMessage('Error al cargar dispositivos');
      setPendientes(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (device) => {
    setSelectedDevice(device);
    setRfid('');
    setMessage('');
  };

  const handleRfidChange = (e) => {
    setRfid(e.target.value);
  };

  const handleAssignRfid = async () => {
    if (!rfid) {
      setMessage('Por favor, pase la tarjeta RFID.');
      return;
    }
    try {
      setLoading(true);
      await api.put(`/api/dispositivos/${selectedDevice.id}`, {
        rfid,
        estado_validacion: 'aprobado',
      });
      setMessage('RFID asignado y dispositivo aprobado.');
      setSelectedDevice(null);
      setRfid('');
      await fetchPendingDevices();
    } catch (err) {
      setMessage('Error al asignar RFID');
    } finally {
      setLoading(false);
    }
  };

  const normalizeRol = rol => (rol || '').toLowerCase().normalize('NFD').replace(/[ -]/g, '');
  if (!user || !['admin', 'validador', 'administrador'].includes(normalizeRol(user.rol))) {
    return <div>No autorizado</div>;
  }

  console.log('Renderizando DeviceValidation, devices:', devices);

  return (
    <div className="device-validation-fullhd">
      <h2 className="dv-title dv-title-compact">Validación y Asignación de RFID</h2>
      {message && <div className="dv-success-message">{message}</div>}
      {loading && <div className="dv-loading">Cargando...</div>}
      <div className="dv-content">
        {selectedDevice ? (
          <div className="dv-card dv-card-assign dv-card-vertical dv-card-active">
            <div className="dv-card-top">
              <div className="dv-user-profile">
                {selectedDevice.foto_usuario ? (
                  <img src={selectedDevice.foto_usuario} alt="Foto usuario" className="dv-user-photo" />
                ) : (
                  <div className="dv-user-photo dv-user-photo-default">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#e0e0e0"/><path d="M24 25c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7zm0 3c-5.33 0-16 2.686-16 8v4h32v-4c0-5.314-10.67-8-16-8z" fill="#bdbdbd"/></svg>
                  </div>
                )}
                <div className="dv-user-name">{selectedDevice.nombre_usuario}</div>
              </div>
              <div className="dv-imgs dv-imgs-row">
                {[0,1,2].map(idx => (
                  <div key={idx} className="dv-img-block">
                    {selectedDevice.foto && selectedDevice.foto[idx] ? (
                      <img
                        src={`http://localhost:3000/uploads/${selectedDevice.foto[idx]}`}
                        alt={`Foto ${idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}`}
                        className="dv-img dv-img-vertical"
                        onError={e => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI0OCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZTBkZWUwIi8+PHRleHQgeD0iMzAiIHk9IjI0IiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg=="; }}
                      />
                    ) : (
                      <div className="dv-img dv-img-placeholder dv-img-vertical">Sin imagen</div>
                    )}
                    <div className="dv-img-label">{idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}</div>
                  </div>
                ))}
              </div>
              <div className="dv-info dv-info-compact dv-info-center">
                <div className="dv-info-title dv-info-title-compact dv-device-name">{selectedDevice.nombre}</div>
                <div className="dv-info-row dv-info-row-compact"><span className="dv-chip dv-chip-compact">{selectedDevice.tipo}</span> <span className="dv-chip dv-chip-serial dv-chip-compact">Serial: {selectedDevice.serial}</span></div>
              </div>
            </div>
            <div className="dv-card-bottom">
              <form className="dv-form dv-form-compact dv-form-center" onSubmit={e => { e.preventDefault(); handleAssignRfid(); }}>
                <label className="dv-label dv-label-compact dv-label-rfid">Pase la tarjeta RFID:</label>
                <input
                  type="text"
                  value={rfid}
                  onChange={handleRfidChange}
                  autoFocus
                  placeholder="Escanee la tarjeta..."
                  className="dv-input dv-input-compact"
                  disabled={loading}
                />
                <small className="dv-help-text">Pase la tarjeta por el lector para asignarla a este equipo.</small>
                <div className="dv-btn-row dv-btn-row-compact dv-btn-row-center">
                  <button type="submit" className="dv-btn dv-btn-green dv-btn-compact" disabled={loading || !rfid}>Asignar RFID y aprobar</button>
                  <button type="button" className="dv-btn dv-btn-outline dv-btn-compact" onClick={() => setSelectedDevice(null)} disabled={loading}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="dv-list-grid dv-list-grid-center">
            {devices && devices.length > 0 ? (
              devices.map(device => (
                <div key={device.id} className="dv-card dv-card-hover dv-card-compact">
                  <div className="dv-imgs dv-imgs-mini">
                    {[0,1,2].map(idx => (
                      <div key={idx} className="dv-img-block dv-img-block-mini">
                        {device.foto && device.foto[idx] ? (
                          <img
                            src={`http://localhost:3000/uploads/${device.foto[idx]}`}
                            alt={`Foto ${idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}`}
                            className="dv-img dv-img-mini"
                            onError={e => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NCIgaGVpZ2h0PSIzNiI+PHJlY3Qgd2lkdGg9IjQ0IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZTBkZWUwIi8+PHRleHQgeD0iMjIiIHk9IjE4IiBmb250LXNpemU9IjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPlNpbjwvdGV4dD48L3N2Zz4="; }}
                          />
                        ) : (
                          <div className="dv-img dv-img-mini dv-img-placeholder">Sin imagen</div>
                        )}
                        <div className="dv-img-label dv-img-label-mini">{idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="dv-info dv-info-compact">
                    <div className="dv-info-title dv-info-title-compact">{device.nombre}</div>
                    <div className="dv-info-row dv-info-row-compact"><span className="dv-chip dv-chip-compact">{device.tipo}</span> <span className="dv-chip dv-chip-serial dv-chip-compact">Serial: {device.serial}</span></div>
                    <div className="dv-info-row dv-info-row-compact"><b>Usuario:</b> {device.nombre_usuario}</div>
                  </div>
                  <button className="dv-btn dv-btn-green dv-btn-full dv-btn-compact" onClick={() => handleSelect(device)}>Validar y asignar RFID</button>
                </div>
              ))
            ) : (
              <div className="dv-no-devices">No hay dispositivos pendientes.</div>
            )}
          </div>
        )}
      </div>
      {/* --- ESTILOS PREMIUM FULL HD Y COMPACTOS --- */}
      <style>{`
        .device-validation-fullhd {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 0 36px 0;
          min-height: 90vh;
          background: #fff;
        }
        .dv-title {
          font-weight: 900;
          font-size: 2.1rem;
          color: #17632a;
          margin-bottom: 22px;
          letter-spacing: 0.5px;
          text-align: center;
        }
        .dv-title-compact {
          font-size: 2rem;
          margin-bottom: 18px;
        }
        .dv-success-message {
          background: #e8f5e9;
          color: #1b5e20;
          border-radius: 8px;
          padding: 14px 0;
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0 auto 18px auto;
          max-width: 420px;
          text-align: center;
          box-shadow: 0 2px 12px #43a04718;
        }
        .dv-loading {
          text-align: center;
          color: #388e3c;
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
        .dv-content {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 400px;
        }
        .dv-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 28px;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }
        .dv-list-grid-center {
          justify-items: center;
        }
        .dv-card {
          background: #fff;
          border-radius: 14px;
          position: relative;
          box-shadow: 0 4px 18px 0 rgba(44,62,80,0.10);
          padding: 32px 32px 40px 32px;
          min-width: 0;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.18s, border 0.18s;
          border: none;
        }
        .dv-card-compact {
          padding: 18px 10px 14px 10px;
          max-width: 350px;
        }
        .dv-card-hover:hover {
          box-shadow: 0 8px 24px 0 #43a04722;
          border: 1.2px solid #43a047;
          transform: translateY(-2px) scale(1.01);
        }
        .dv-card-assign {
          flex-direction: row;
          align-items: stretch;
          max-width: 700px;
          min-height: 260px;
          padding: 0;
        }
        .dv-card-left, .dv-card-right {
          flex: 1;
          padding: 24px 18px 24px 18px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .dv-card-right-align-top {
          align-items: flex-start !important;
          justify-content: flex-start !important;
        }
        .dv-imgs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 10px;
        }
        .dv-img-block {
          text-align: center;
        }
        .dv-img {
          width: 60px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          border: 2px solid #2196f3;
          margin-bottom: 2px;
          background: #f5f5f5;
          box-shadow: 0 2px 8px #2196f322;
        }
        .dv-img-placeholder {
          background: #f0f0f0;
          color: #aaa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
        }
        .dv-img-label {
          font-size: 11px;
          color: #388e3c;
          font-weight: 700;
        }
        .dv-info {
          margin-top: 6px;
          margin-bottom: 6px;
        }
        .dv-info-compact {
          margin-top: 2px;
          margin-bottom: 2px;
        }
        .dv-info-title {
          font-weight: 800;
          font-size: 1.08rem;
          color: #1b5e20;
          margin-bottom: 3px;
        }
        .dv-info-title-compact {
          font-size: 1rem;
        }
        .dv-info-row {
          font-size: 0.98rem;
          color: #444;
          margin-bottom: 3px;
        }
        .dv-info-row-compact {
          font-size: 0.93rem;
          margin-bottom: 2px;
        }
        .dv-chip {
          display: inline-block;
          background: #e0f2f1;
          color: #2196f3;
          border-radius: 7px;
          padding: 2px 8px;
          font-size: 0.92em;
          font-weight: 600;
          margin-right: 4px;
        }
        .dv-chip-serial {
          background: #f5f5f5;
          color: #888;
        }
        .dv-chip-compact {
          font-size: 0.88em;
          padding: 2px 7px;
        }
        .dv-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
          align-items: center;
        }
        .dv-input,
        .dv-btn-row {
          width: 94%;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }
        .dv-form-compact {
          gap: 8px;
        }
        .dv-label {
          font-weight: 700;
          color: #17632a;
          margin-bottom: 4px;
          font-size: 1rem;
        }
        .dv-label-compact {
          font-size: 0.98rem;
        }
        .dv-input {
          width: 100%;
          padding: 0.7rem;
          border: 1.2px solid #43a047;
          border-radius: 7px;
          font-size: 0.98rem;
          background: #f7faf7;
          margin-bottom: 2px;
          transition: border 0.18s, box-shadow 0.18s;
        }
        .dv-input-compact {
          padding: 0.6rem;
          font-size: 0.95rem;
        }
        .dv-input:focus {
          outline: none;
          border: 2px solid #2196f3;
          box-shadow: 0 0 0 2px #2196f344;
        }
        .dv-btn-row {
          display: flex;
          gap: 10px;
          margin-top: 4px;
          margin-bottom: 18px;
        }
        .dv-btn-row-compact {
          gap: 8px;
        }
        .dv-btn {
          flex: 1;
          padding: 0.7rem 0;
          font-size: 0.98rem;
          font-weight: 800;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, border 0.18s;
        }
        .dv-btn-compact {
          padding: 0.6rem 0;
          font-size: 0.95rem;
        }
        .dv-btn-green {
          background: #43a047;
          color: #fff;
          box-shadow: 0 2px 8px #43a04722;
        }
        .dv-btn-green:hover:not(:disabled) {
          background: #388e3c;
        }
        .dv-btn-outline {
          background: #fff;
          color: #43a047;
          border: 2px solid #43a047;
        }
        .dv-btn-outline:hover:not(:disabled) {
          background: #e8f5e9;
        }
        .dv-btn:disabled {
          background: #e0e0e0;
          color: #aaa;
          cursor: not-allowed;
        }
        .dv-btn-full {
          width: 100%;
          margin-top: 10px;
        }
        .dv-no-devices {
          text-align: center;
          color: #888;
          font-size: 1.05rem;
          padding: 1.5rem 0;
        }
        /* Mini grid para cards de dispositivos */
        .dv-imgs-mini {
          flex-direction: row;
          gap: 7px;
          margin-bottom: 7px;
        }
        .dv-img-block-mini {
          width: 36px;
        }
        .dv-img-mini {
          width: 36px;
          height: 28px;
          border-radius: 5px;
        }
        .dv-img-label-mini {
          font-size: 8px;
        }
        @media (max-width: 1100px) {
          .dv-list-grid {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          }
        }
        @media (max-width: 900px) {
          .dv-card-assign {
            flex-direction: column;
            max-width: 98vw;
          }
          .dv-card-left, .dv-card-right {
            padding: 16px 8px 16px 8px;
          }
        }
        @media (max-width: 700px) {
          .device-validation-fullhd {
            padding: 6px 0 18px 0;
          }
          .dv-title {
            font-size: 1.1rem;
            margin-bottom: 10px;
          }
          .dv-card {
            padding: 8px 2px 8px 2px;
            border-radius: 7px;
          }
          .dv-card-assign {
            flex-direction: column;
            padding: 0;
          }
          .dv-card-left, .dv-card-right {
            padding: 8px 2px 8px 2px;
          }
        }
        .dv-card-vertical {
          flex-direction: column !important;
          align-items: center !important;
          max-width: 420px !important;
          min-width: 0;
          margin: 0 auto;
          padding: 0 0 18px 0;
        }
        .dv-card-top {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .dv-imgs-row {
          flex-direction: row !important;
          gap: 10px !important;
          justify-content: center;
          align-items: flex-end;
          margin-bottom: 0;
        }
        .dv-img-vertical {
          width: 60px !important;
          height: 60px !important;
          margin-bottom: 0 !important;
        }
        .dv-info-center {
          align-items: center !important;
          text-align: center !important;
          width: 100%;
        }
        .dv-card-bottom {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dv-form-center {
          align-items: center !important;
          width: 100%;
        }
        .dv-btn-row-center {
          justify-content: center !important;
          width: 100%;
        }
        @media (max-width: 600px) {
          .dv-card-vertical {
            max-width: 98vw !important;
            padding: 0 2vw 12px 2vw;
          }
          .dv-img-vertical {
            width: 48px !important;
            height: 48px !important;
          }
        }
        .dv-card-active {
          z-index: 0;
        }
        .dv-card > * {
          position: relative;
          z-index: 2;
        }
        .dv-card-active::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          border-radius: 14px;
          padding: 0;
          border: 3px solid transparent;
          background: linear-gradient(270deg, #43a047, #2196f3, #ffeb3b, #e91e63, #43a047, #2196f3) border-box;
          background-size: 600% 600%;
          animation: borderRainbowMove 3.5s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .dv-user-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 8px;
        }
        .dv-user-photo {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid #43a047;
          margin-bottom: 4px;
          background: #f5f5f5;
        }
        .dv-user-photo-default {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0e0e0;
        }
        .dv-user-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: #17632a;
          margin-bottom: 2px;
        }
        .dv-device-name {
          font-size: 1.08rem;
          font-weight: 800;
          color: #1b5e20;
        }
        .dv-label-rfid {
          color: #1b5e20;
          font-size: 1.08rem;
        }
        .dv-help-text {
          color: #888;
          font-size: 0.93em;
          margin-top: 2px;
          margin-bottom: 4px;
        }
        @keyframes borderRainbowMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default DeviceValidation; 