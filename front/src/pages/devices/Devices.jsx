import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaExclamationCircle, FaPlus } from 'react-icons/fa';
import './Devices.css';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import UserDevices from '../../components/UserDevices';

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
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError('');
        let url = '/api/dispositivos';
        if (user && (user.rol === 'aprendiz' || user.rol === 'instructor')) {
          url = `/api/dispositivos/usuario/${user.id}`;
        } else {
          url = `/api/dispositivos?page=${page}&limit=${limit}`;
        }
        const res = await api.get(url);
        if (user && (user.rol === 'aprendiz' || user.rol === 'instructor')) {
          setDevices(Array.isArray(res.data) ? res.data : []);
          setTotalPages(1);
          setTotal(res.data.length || 0);
        } else {
          setDevices(Array.isArray(res.data.data) ? res.data.data : []);
          setTotalPages(res.data.totalPages || 1);
          setTotal(res.data.total || 0);
        }
      } catch (err) {
        setError('No se pudieron cargar los dispositivos.');
        setDevices([]);
        setTotalPages(1);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
    // eslint-disable-next-line
  }, [user, showRegistrationForm, page, limit]);

  const handleToggleRegistrationForm = () => {
    setShowRegistrationForm(!showRegistrationForm);
  };

  const canRegisterDevice = user && (user.rol === 'aprendiz' || user.rol === 'instructor');

  const filteredDevices = devices.filter(device => {
    const search = searchTerm.toLowerCase();
    return (
      (device.nombre || '').toLowerCase().includes(search) ||
      (device.serial || '').toLowerCase().includes(search) ||
      (device.nombre_usuario || '').toLowerCase().includes(search) ||
      (device.tipo || '').toLowerCase().includes(search) ||
      (device.estado_validacion || '').toLowerCase().includes(search)
    );
  });

  return (
    <div className="devices-bg">
      <div className="devices-panel">
        <div className="devices-header-row">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1b5e20', margin: 0, letterSpacing: 0.5 }}>
              Gestión de Dispositivos
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1, justifyContent: 'flex-end' }}>
            <div className="search-bar">
              <FaCheckCircle className="search-icon" style={{ color: '#256029' }} />
              <input
                type="text"
                placeholder="Buscar dispositivo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ minWidth: 220 }}
              />
            </div>
            {canRegisterDevice && (
              <div className="devices-controls-wrapper">
                <button 
                  className="register-device-button"
                  onClick={handleToggleRegistrationForm}
                >
                  {showRegistrationForm ? 'Cancelar' : <><FaPlus style={{marginRight: '8px'}} /> Registrar Dispositivo</>}
                </button>
              </div>
            )}
          </div>
        </div>

        {showRegistrationForm ? (
          <UserDevices userId={user?.id} onClose={handleToggleRegistrationForm} />
        ) : (
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
            ) : filteredDevices.length === 0 ? (
              <div className="devices-info">
                <FaExclamationCircle style={{marginRight:8, color:'#1976d2', fontSize:22}}/>
                {canRegisterDevice ? (
                  <>
                    No hay dispositivos registrados. Haga clic en "Registrar Dispositivo" para añadir uno.
                  </>
                ) : (
                  <>No hay dispositivos registrados.</>
                )}
              </div>
            ) : (
              <>
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
                    {filteredDevices.map(device => (
                      <tr key={device.id}>
                        <td>
                          {Array.isArray(device.foto) && device.foto.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                              {device.foto.map((img, idx) => (
                                img ? (
                                  <div key={idx} style={{ textAlign: 'center' }}>
                                    <img
                                      src={`http://localhost:3000/uploads/${img}`}
                                      alt={`Foto ${idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}`}
                                      className="device-img"
                                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc', marginBottom: 2 }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzk5OTk5OSI+U2luIGltYWdlbjwvdGV4dD48L3N2Zz4=";
                                      }}
                                    />
                                    <div style={{ fontSize: 9, color: '#388e3c', fontWeight: 700 }}>
                                      {idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}
                                    </div>
                                  </div>
                                ) : null
                              ))}
                            </div>
                          ) : (
                            <span className="device-noimg">(Sin imagen)</span>
                          )}
                        </td>
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
                {totalPages > 1 && (
                  <div className="pagination">
                    <button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i+1} className={page === i+1 ? 'active' : ''} onClick={() => setPage(i+1)}>{i+1}</button>
                    ))}
                    <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Siguiente</button>
                    <span style={{marginLeft:8}}>Total: {total}</span>
                    <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} style={{marginLeft:8}}>
                      {[5,10,20,50].map(opt => <option key={opt} value={opt}>{opt} por página</option>)}
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Devices;
export const UserDevicesPage = Devices; 