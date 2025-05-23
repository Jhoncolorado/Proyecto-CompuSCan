import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/DeviceValidation.css';

const DeviceValidation = () => {
  const { user } = useAuth();
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
      const res = await axios.get('http://localhost:3000/api/dispositivos/pendientes');
      setDevices(res.data);
      console.log('Dispositivos pendientes recibidos:', res.data);
    } catch (err) {
      setMessage('Error al cargar dispositivos');
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
      await axios.put(`http://localhost:3000/api/dispositivos/${selectedDevice.id}`, {
        rfid,
        estado_validacion: 'aprobado',
      });
      setMessage('RFID asignado y dispositivo aprobado.');
      setSelectedDevice(null);
      setRfid('');
      fetchPendingDevices();
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
    <div className="device-validation">
      <h2>Validación y Asignación de RFID</h2>
      {message && <div className="success-message">{message}</div>}
      {loading && <div>Cargando...</div>}
      {!selectedDevice ? (
        <>
          <h3>Dispositivos pendientes</h3>
          {devices && devices.length > 0 ? (
            <ul>
              {devices.map(device => (
                <li key={device.id} style={{ marginBottom: 10 }}>
                  <b>{device.nombre}</b> - {device.tipo} - Serial: {device.serial} <br />
                  <span>Usuario: {device.nombre_usuario}</span>
                  <button style={{ marginLeft: 10 }} onClick={() => handleSelect(device)}>
                    Validar y asignar RFID
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>No hay dispositivos pendientes.</div>
          )}
        </>
      ) : (
        <div className="validation-form">
          <h4>Asignar RFID a: {selectedDevice.nombre}</h4>
          <p><b>Tipo:</b> {selectedDevice.tipo}</p>
          <p><b>Serial:</b> {selectedDevice.serial}</p>
          <label>
            Pase la tarjeta RFID:
            <input
              type="text"
              value={rfid}
              onChange={handleRfidChange}
              autoFocus
              placeholder="Escanee la tarjeta..."
            />
          </label>
          <div style={{ marginTop: 15 }}>
            <button onClick={handleAssignRfid} disabled={loading || !rfid}>
              Asignar RFID y aprobar
            </button>
            <button style={{ marginLeft: 10 }} onClick={() => setSelectedDevice(null)} disabled={loading}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceValidation; 