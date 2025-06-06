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
      <h2 style={{ fontWeight: 800, fontSize: '2.2rem', color: '#1b5e20', marginBottom: 32, letterSpacing: 0.5, textAlign: 'center' }}>
        Validación y Asignación de RFID
      </h2>
      {message && <div className="success-message">{message}</div>}
      {loading && <div>Cargando...</div>}
      <div className="devices-list devices-list-grid">
          {devices && devices.length > 0 ? (
          devices.map(device => {
            if (selectedDevice && selectedDevice.id === device.id) {
              return (
                <div key={device.id} className="device-card" style={{ background: '#fff', borderRadius: 14, boxShadow: '0 4px 16px rgba(44,62,80,0.10)', padding: 24, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid #43a047', position: 'relative', maxWidth: 370 }}>
                  <h4 style={{ fontWeight: 700, fontSize: 20, color: '#1b5e20', marginBottom: 18 }}>Asignar RFID a: <span style={{ color: '#222' }}>{selectedDevice.nombre}</span></h4>
                  <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Tipo:</b> {selectedDevice.tipo}</div>
                  <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Serial:</b> {selectedDevice.serial}</div>
                  <div style={{ fontSize: 15, color: '#444', marginBottom: 18 }}><b>Usuario:</b> {selectedDevice.nombre_usuario}</div>
                  {Array.isArray(selectedDevice.foto) && selectedDevice.foto.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                      {[0,1,2].map(idx => (
                        <div key={idx} style={{ textAlign: 'center' }}>
                          {selectedDevice.foto[idx] ? (
                            <img
                              src={`http://localhost:3000/uploads/${selectedDevice.foto[idx]}`}
                              alt={`Foto ${idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}`}
                              style={{ width: 60, height: 48, borderRadius: 8, objectFit: 'cover', border: '2px solid #2196f3', marginBottom: 2, background: '#f5f5f5' }}
                              onError={e => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI0OCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZTBkZWUwIi8+PHRleHQgeD0iMzAiIHk9IjI0IiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg=="; }}
                            />
      ) : (
                            <div style={{ width: 60, height: 48, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #2196f3', marginBottom: 2, color: '#888', fontSize: 11 }}>
                              Sin imagen
                            </div>
                          )}
                          <div style={{ fontSize: 10, color: '#388e3c', fontWeight: 700 }}>
                            {idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="rfid-input" style={{ marginBottom: 18, width: '100%' }}>
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6, display: 'block' }}>Pase la tarjeta RFID:</label>
            <input
              type="text"
              value={rfid}
              onChange={handleRfidChange}
              autoFocus
              placeholder="Escanee la tarjeta..."
                      style={{ width: '100%', padding: '0.8rem', border: '1.5px solid #43a047', borderRadius: 6, fontSize: 16, marginBottom: 8, background: '#f7faf7' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 10, width: '100%' }}>
                    <button
                      className="validate-button"
                      style={{ flex: 1, padding: '0.8rem 0', fontSize: 16, fontWeight: 700, background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 2px 8px #43a04722', transition: 'background 0.2s' }}
                      onClick={handleAssignRfid}
                      disabled={loading || !rfid}
                    >
              Asignar RFID y aprobar
            </button>
                    <button
                      style={{ flex: 1, padding: '0.8rem 0', fontSize: 16, fontWeight: 700, background: '#fff', color: '#43a047', border: '2px solid #43a047', borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s' }}
                      onClick={() => setSelectedDevice(null)}
                      disabled={loading}
                    >
              Cancelar
            </button>
          </div>
        </div>
              );
            }
            return (
              <div
                key={device.id}
                className="device-card"
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
                  padding: 16,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '2px solid #e0e0e0',
                  transition: 'box-shadow 0.2s',
                  position: 'relative',
                }}
              >
                {Array.isArray(device.foto) && device.foto.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                    {[0,1,2].map(idx => (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        {device.foto[idx] ? (
                          <img
                            src={`http://localhost:3000/uploads/${device.foto[idx]}`}
                            alt={`Foto ${idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}`}
                            style={{ width: 44, height: 36, borderRadius: 6, objectFit: 'cover', border: '2px solid #2196f3', marginBottom: 1, background: '#f5f5f5' }}
                            onError={e => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NCIgaGVpZ2h0PSIzNiI+PHJlY3Qgd2lkdGg9IjQ0IiBoZWlnaHQ9IjM2IiBmaWxsPSIjZTBkZWUwIi8+PHRleHQgeD0iMjIiIHk9IjE4IiBmb250LXNpemU9IjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPlNpbjwvdGV4dD48L3N2Zz4="; }}
                          />
                        ) : (
                          <div style={{ width: 44, height: 36, background: '#eee', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #2196f3', marginBottom: 1, color: '#888', fontSize: 9 }}>
                            Sin imagen
                          </div>
                        )}
                        <div style={{ fontSize: 9, color: '#388e3c', fontWeight: 700 }}>
                          {idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div style={{ width: '100%', textAlign: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#222', marginBottom: 2 }}>{device.nombre}</div>
                  <span style={{ fontSize: 11, color: '#666', fontWeight: 500, background: '#e0f2f1', borderRadius: 6, padding: '2px 8px', marginRight: 4 }}>{device.tipo}</span>
                  <span style={{ fontSize: 11, color: '#888', fontWeight: 500, background: '#f5f5f5', borderRadius: 6, padding: '2px 8px' }}>Serial: {device.serial}</span>
                </div>
                <div style={{ fontSize: 12, color: '#444', marginBottom: 8 }}>
                  <b>Usuario:</b> {device.nombre_usuario}
                </div>
                <button
                  className="validate-button"
                  style={{ width: '100%', marginTop: 4, padding: '0.7rem 0', fontSize: 14, fontWeight: 700, background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 2px 8px #43a04722', transition: 'background 0.2s' }}
                  onClick={() => handleSelect(device)}
                >
                  Validar y asignar RFID
                </button>
              </div>
            );
          })
        ) : (
          <div className="select-device-message">No hay dispositivos pendientes.</div>
        )}
      </div>
    </div>
  );
};

export default DeviceValidation; 