import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaExclamationCircle } from 'react-icons/fa';
import './Devices.css';

const estadoBadge = (estado) => {
  if (estado === 'aprobado') return <span className="badge badge-success device-badge"><FaCheckCircle style={{marginRight:4}}/>Aprobado</span>;
  if (estado === 'rechazado') return <span className="badge badge-error device-badge"><FaTimesCircle style={{marginRight:4}}/>Rechazado</span>;
  if (estado === 'pendiente') return <span className="badge badge-warning device-badge"><FaHourglassHalf style={{marginRight:4}}/>Pendiente</span>;
  return <span className="badge badge-secondary device-badge"><FaExclamationCircle style={{marginRight:4}}/>Sin estado</span>;
};

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('http://localhost:3000/api/dispositivos');
        if (!res.ok) throw new Error('Error al cargar dispositivos');
        const data = await res.json();
        setDevices(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('No se pudieron cargar los dispositivos.');
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  return (
    <div className="devices-bg" style={{ background: '#f7f9fb', minHeight: '100vh', width: '100vw', display: 'block', margin: 0, padding: 0, overflowX: 'hidden' }}>
      <div className="devices-panel" style={{ background: '#fff', borderRadius: 0, boxShadow: '0 8px 32px rgba(44, 62, 80, 0.12)', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div className="devices-table-container" style={{ width: '100%', maxWidth: '100%', margin: 0, padding: '0 32px', overflowY: 'auto' }}>
          <div className="devices-header-row" style={{ marginTop: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1.2rem', flexWrap: 'wrap', minWidth: 900 }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1b5e20', margin: 0, letterSpacing: 1, textAlign: 'left', lineHeight: 1.1, flex: '0 0 auto' }}>
              Gestión de Dispositivos
            </h1>
          </div>
      {loading ? (
        <div className="devices-loading">
          <span className="spinner"></span>
          <span className="ml-4">Cargando dispositivos...</span>
        </div>
      ) : error ? (
        <div className="devices-error">
          <FaExclamationCircle style={{marginRight:8, color:'#c62828', fontSize:22}}/>
          <span>{error}</span>
        </div>
      ) : devices.length === 0 ? (
        <div className="devices-info">
          <FaExclamationCircle style={{marginRight:8, color:'#1976d2', fontSize:22}}/>
          No hay dispositivos registrados.
        </div>
      ) : (
            <table className="devices-table" style={{ fontSize: '0.93rem', width: '100%', minWidth: 900, borderRadius: 12, tableLayout: 'auto' }}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Serial</th>
                <th>Usuario</th>
                <th>RFID</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(device => (
                <tr key={device.id}>
                  <td>{device.foto ? <img src={device.foto} alt="foto" className="device-img" /> : <span className="device-noimg">(Sin imagen)</span>}</td>
                  <td>{device.nombre}</td>
                  <td>{device.tipo}</td>
                  <td>{device.serial}</td>
                  <td>{device.nombre_usuario}</td>
                  <td>{device.rfid || <span className="device-norfid">No asignado</span>}</td>
                  <td>{estadoBadge(device.estado_validacion || 'pendiente')}</td>
                  <td>{device.fecha_registro ? new Date(device.fecha_registro).toLocaleDateString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices; 