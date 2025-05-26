import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaExclamationCircle } from 'react-icons/fa';
import './Devices.css';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const estadoBadge = (estado) => {
  if (estado === 'aprobado') return <span className="badge badge-success device-badge"><FaCheckCircle style={{marginRight:4}}/>Aprobado</span>;
  if (estado === 'rechazado') return <span className="badge badge-error device-badge"><FaTimesCircle style={{marginRight:4}}/>Rechazado</span>;
  if (estado === 'pendiente') return <span className="badge badge-warning device-badge"><FaHourglassHalf style={{marginRight:4}}/>Pendiente</span>;
  return <span className="badge badge-secondary device-badge"><FaExclamationCircle style={{marginRight:4}}/>Sin estado</span>;
};

const Devices = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError('');
        let url = '/api/dispositivos';
        if (user && (user.rol === 'aprendiz' || user.rol === 'instructor')) {
          url = `/api/dispositivos/usuario/${user.id}`;
        }
        const res = await api.get(url);
        setDevices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('No se pudieron cargar los dispositivos.');
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [user]);

  return (
    <div className="devices-bg">
      <div className="devices-panel">
        <div className="devices-header-row">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1b5e20', margin: 0, letterSpacing: 0.5 }}>
              Gestión de Dispositivos
            </h1>
          </div>
        <div className="devices-table-wrapper">
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
            <table className="devices-table">
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
export const UserDevicesPage = Devices; 