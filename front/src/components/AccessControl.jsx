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
      <h2 className="access-title">Control de Acceso</h2>
      <form className="access-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={rfid}
          onChange={handleChange}
          placeholder="Pase la tarjeta RFID..."
          className="access-input"
          autoFocus
        />
        <button type="submit" style={{ display: 'none' }}>Buscar</button>
      </form>
      <h2 className="carnet-main-title">CARNET DE ACCESO</h2>
      {error && <div style={{ color: 'red', margin: 10 }}>{error}</div>}
      {data && data.usuario && data.dispositivo && (
        <div className="carnet-real">
          <div className="carnet-real-logo">
            <img src="/descarga.png" alt="Logo SENA" />
          </div>
          <div className="carnet-real-content">
            <div className="carnet-real-main">
              <div className="carnet-real-user-photo carnet-photo-shadow">
                <img src={data.usuario.foto || '/images/default-avatar.png'} alt="Foto usuario" />
              </div>
              <div className="carnet-real-user-name carnet-real-user-name-big">{data.usuario.nombre}</div>
              <div className="carnet-real-user-info carnet-real-user-info-small carnet-data-compact">
                <div><b>Documento:</b> {data.usuario.documento}</div>
                <div><b>Ficha:</b> {data.usuario.ficha}</div>
                <div><b>Correo:</b> {data.usuario.correo}</div>
                <div><b>Rol:</b> {data.usuario.rol}</div>
              </div>
            </div>
            <div className="carnet-divider"></div>
            <div className="carnet-real-device">
              <div className="carnet-real-device-photo carnet-photo-shadow">
                <img src={data.dispositivo.foto || '/images/default-device.png'} alt="Foto equipo" />
              </div>
              <div className="carnet-real-device-info carnet-data-compact">
                <div><b>Equipo:</b> {data.dispositivo.nombre}</div>
                <div><b>Tipo:</b> {data.dispositivo.tipo}</div>
                <div><b>Serial:</b> {data.dispositivo.serial}</div>
                <div><b>Estado:</b> {data.dispositivo.estado_validacion || 'Pendiente'}</div>
                <div><b>RFID:</b> {data.dispositivo.rfid}</div>
              </div>
            </div>
          </div>
          <div className={`carnet-real-event carnet-real-event-${data.tipoEvento === 'ENTRADA' ? 'entrada' : 'salida'}`}>{data.tipoEvento}</div>
          <div className="carnet-fecha-emision">Emitido: {new Date().toLocaleDateString()}</div>
        </div>
      )}
    </div>
  );
};

export default AccessControl; 