import React, { useRef, useState } from 'react';
import api from '../services/api';

const AccessControl = () => {
  const [rfid, setRfid] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

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
      setError('No se encontró un usuario o equipo con ese RFID');
    } finally {
      setRfid('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="access-bg access-bg-full">
      <form className="access-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={rfid}
          onChange={handleChange}
          placeholder="Pase la tarjeta RFID..."
          className="rfid-invisible-input"
          autoFocus
        />
        <button type="submit" style={{ display: 'none' }}>Buscar</button>
      </form>
      <h2 className="carnet-main-title">CARNET DE ACCESO</h2>
      {error && <div style={{ color: 'red', margin: 10 }}>{error}</div>}
      {data && data.usuario && data.dispositivo && (
        <div className="carnet-separado-wrapper">
          {/* Tarjeta de Usuario estilo carnet SENA */}
          <div className="carnet-tarjeta-sena">
            <div className="carnet-sena-header">
              <img src="/descarga.png" alt="Logo SENA" className="carnet-sena-logo" />
              <div className="carnet-sena-rol">APRENDIZ</div>
            </div>
            <div className="carnet-sena-divider"></div>
            <div className="carnet-sena-body">
              <div className="carnet-sena-info">
                <div className="carnet-sena-nombre">{data.usuario.nombre}</div>
                <div className="carnet-sena-dato"><b>C.C:</b> {data.usuario.documento}</div>
                <div className="carnet-sena-dato"><b>Ficha:</b> {data.usuario.ficha}</div>
                <div className="carnet-sena-dato"><b>Correo:</b> {data.usuario.correo}</div>
                <div className="carnet-sena-dato"><b>RH:</b> {data.usuario.rh || '-'}</div>
              </div>
              <div className="carnet-sena-foto">
                <img src={data.usuario.foto || '/images/default-avatar.png'} alt="Foto usuario" />
              </div>
            </div>
            <div className="carnet-sena-footer">
              <div>Regional Quindío</div>
              <div className="carnet-sena-centro">Centro de Comercio y Turismo</div>
              <div>Tecnólogo Análisis y Desarrollo de Software</div>
              <div>Grupo No. {data.usuario.ficha}</div>
            </div>
          </div>
          {/* Tarjeta de Equipo (sencilla) */}
          <div className="carnet-tarjeta carnet-tarjeta-equipo">
            <div className="carnet-tarjeta-foto">
              <img src={data.dispositivo.foto || '/images/default-device.png'} alt="Foto equipo" />
            </div>
            <div className="carnet-tarjeta-info">
              <div><b>Equipo:</b> {data.dispositivo.nombre}</div>
              <div><b>Tipo:</b> {data.dispositivo.tipo}</div>
              <div><b>Serial:</b> {data.dispositivo.serial}</div>
              <div><b>Estado:</b> <span className={`badge-estado ${data.dispositivo.estado_validacion?.toLowerCase()}`}>{data.dispositivo.estado_validacion || 'Pendiente'}</span></div>
              <div><b>RFID:</b> {data.dispositivo.rfid}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl; 