import React, { useRef, useState } from 'react';
import axios from 'axios';

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
      const res = await axios.get(`http://localhost:3000/api/acceso/rfid/${rfid}`);
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
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 30, textAlign: 'center' }}>
      <h2>Control de Acceso</h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={rfid}
          onChange={handleChange}
          placeholder="Pase la tarjeta RFID..."
          style={{ fontSize: 24, padding: 10, width: '80%', marginBottom: 20 }}
          autoFocus
        />
        <button type="submit" style={{ display: 'none' }}>Buscar</button>
      </form>
      {error && <div style={{ color: 'red', margin: 10 }}>{error}</div>}
      {data && data.usuario && data.dispositivo && (
        <div style={{ marginTop: 30, textAlign: 'center', background: '#f8f8f8', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px #0001' }}>
          <h3 style={{ marginBottom: 20 }}>Datos del Aprendiz</h3>
          <img
            src={data.usuario.foto || '/images/default-avatar.png'}
            alt="Foto del usuario"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid #4caf50', marginBottom: 10 }}
          />
          <div style={{ marginBottom: 20 }}>
            <p><b>Nombre:</b> {data.usuario.nombre}</p>
            <p><b>Correo:</b> {data.usuario.correo}</p>
            <p><b>Documento:</b> {data.usuario.documento}</p>
            <p><b>Ficha:</b> {data.usuario.ficha}</p>
            <p><b>Rol:</b> {data.usuario.rol}</p>
          </div>
          <h3 style={{ marginBottom: 20 }}>Equipo Asociado</h3>
          <img
            src={data.dispositivo.foto || '/images/default-device.png'}
            alt="Foto del equipo"
            style={{ width: 120, height: 90, borderRadius: 10, objectFit: 'cover', border: '2px solid #2196f3', marginBottom: 10 }}
          />
          <div>
            <p><b>Nombre:</b> {data.dispositivo.nombre}</p>
            <p><b>Tipo:</b> {data.dispositivo.tipo}</p>
            <p><b>Serial:</b> {data.dispositivo.serial}</p>
            <p><b>Estado:</b> {data.dispositivo.estado_validacion || 'Pendiente'}</p>
            <p><b>RFID:</b> {data.dispositivo.rfid}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl; 