import React, { useState, useEffect } from 'react';

const tabs = [
  { key: 'users', label: 'Usuarios' },
  { key: 'history', label: 'Historial' },
  { key: 'devices', label: 'Dispositivos' },
  { key: 'activity', label: 'Actividad' },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [devices, setDevices] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    if (activeTab === 'users') {
      fetch('/api/usuarios')
        .then(res => res.json())
        .then(data => {
          setUsers(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar usuarios');
          setLoading(false);
        });
    } else if (activeTab === 'history') {
      fetch('/api/historiales')
        .then(res => res.json())
        .then(data => {
          setHistory(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar historial');
          setLoading(false);
        });
    } else if (activeTab === 'devices') {
      fetch('/api/dispositivos')
        .then(res => res.json())
        .then(data => {
          setDevices(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar dispositivos');
          setLoading(false);
        });
    } else if (activeTab === 'activity') {
      fetch('/api/historiales')
        .then(res => res.json())
        .then(data => {
          setActivity(Array.isArray(data) ? data.slice(0, 20) : []);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar actividad');
          setLoading(false);
        });
    }
  }, [activeTab]);

  return (
    <div className="reports-container">
      <h1 className="reports-title">Reportes</h1>
      <div className="reports-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'reports-tab active' : 'reports-tab'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="reports-content">
        {activeTab === 'users' && (
          <div>
            <h2 className="reports-section-title">Usuarios</h2>
            {loading ? <p className="reports-loading">Cargando usuarios...</p> : error ? <p className="reports-error">{error}</p> : (
              <div className="reports-table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Fecha de registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.nombre}</td>
                        <td>{user.correo}</td>
                        <td>{user.rol}</td>
                        <td>{user.estado || 'Activo'}</td>
                        <td>{user.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'history' && (
          <div>
            <h2 className="reports-section-title">Historial</h2>
            {loading ? <p className="reports-loading">Cargando historial...</p> : error ? <p className="reports-error">{error}</p> : (
              <div className="reports-table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descripción</th>
                      <th>Fecha</th>
                      <th>ID Dispositivo</th>
                      <th>ID Usuario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(h => (
                      <tr key={h.id_historial || h.id}>
                        <td>{h.id_historial || h.id}</td>
                        <td>{h.descripcion}</td>
                        <td>{h.fecha_hora ? new Date(h.fecha_hora).toLocaleDateString() : ''}</td>
                        <td>{h.id_dispositivo}</td>
                        <td>{h.id_usuario || h.usuario_id || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'devices' && (
          <div>
            <h2 className="reports-section-title">Dispositivos</h2>
            {loading ? <p className="reports-loading">Cargando dispositivos...</p> : error ? <p className="reports-error">{error}</p> : (
              <div className="reports-table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Serial</th>
                      <th>Usuario</th>
                      <th>Estado</th>
                      <th>Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map(d => (
                      <tr key={d.id}>
                        <td>{d.id}</td>
                        <td>{d.nombre}</td>
                        <td>{d.tipo}</td>
                        <td>{d.serial}</td>
                        <td>{d.nombre_usuario || d.id_usuario}</td>
                        <td>{d.estado_validacion || 'Pendiente'}</td>
                        <td>{d.fecha_registro ? new Date(d.fecha_registro).toLocaleDateString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'activity' && (
          <div>
            <h2 className="reports-section-title">Actividad Reciente</h2>
            {loading ? <p className="reports-loading">Cargando actividad...</p> : error ? <p className="reports-error">{error}</p> : (
              <div className="reports-table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descripción</th>
                      <th>Fecha</th>
                      <th>ID Dispositivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map(a => (
                      <tr key={a.id_historial || a.id}>
                        <td>{a.id_historial || a.id}</td>
                        <td>{a.descripcion}</td>
                        <td>{a.fecha_hora ? new Date(a.fecha_hora).toLocaleDateString() : ''}</td>
                        <td>{a.id_dispositivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Estilos modernos para la sección de reportes */}
      <style>{`
        .reports-container {
          max-width: 1200px;
          margin: 0 auto;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 32px 24px 40px 24px;
        }
        .reports-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: #2e7d32;
          letter-spacing: 1px;
        }
        .reports-tabs {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        .reports-tab {
          background: #e8f5e9;
          border: none;
          border-radius: 8px 8px 0 0;
          padding: 12px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #388e3c;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .reports-tab.active {
          background: #388e3c;
          color: #fff;
        }
        .reports-content {
          background: #f9fbe7;
          border-radius: 0 0 12px 12px;
          padding: 24px 12px 12px 12px;
        }
        .reports-section-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #2e7d32;
          margin-bottom: 16px;
        }
        .reports-table-wrapper {
          overflow-x: auto;
        }
        .reports-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
        }
        .reports-table th, .reports-table td {
          padding: 10px 16px;
          border-bottom: 1px solid #e0e0e0;
          text-align: left;
        }
        .reports-table th {
          background: #e8f5e9;
          color: #388e3c;
          font-weight: 700;
        }
        .reports-table tr:hover {
          background: #f1f8e9;
        }
        .reports-loading, .reports-error {
          color: #c62828;
          font-weight: 500;
        }
        @media (max-width: 700px) {
          .reports-container {
            padding: 12px 2px 20px 2px;
          }
          .reports-title {
            font-size: 1.3rem;
          }
          .reports-section-title {
            font-size: 1.1rem;
          }
          .reports-tab {
            padding: 8px 10px;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports; 