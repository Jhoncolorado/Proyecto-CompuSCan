import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { FaUser, FaHistory, FaMicrochip, FaFileExcel } from 'react-icons/fa';

const tabs = [
  { key: 'users', label: 'Usuarios', icon: <FaUser /> },
  { key: 'history', label: 'Historial', icon: <FaHistory /> },
  { key: 'devices', label: 'Dispositivos', icon: <FaMicrochip /> },
];

const DEFAULT_LIMIT = 5;

const Reports = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit, setUsersLimit] = useState(DEFAULT_LIMIT);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);

  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit, setHistoryLimit] = useState(DEFAULT_LIMIT);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);

  const [devices, setDevices] = useState([]);
  const [devicesPage, setDevicesPage] = useState(1);
  const [devicesLimit, setDevicesLimit] = useState(DEFAULT_LIMIT);
  const [devicesTotalPages, setDevicesTotalPages] = useState(1);
  const [devicesTotal, setDevicesTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    if (activeTab === 'users') {
      fetch(`/api/usuarios?page=${usersPage}&limit=${usersLimit}`)
        .then(res => res.json())
        .then(data => {
          setUsers(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
          setUsersTotalPages(data.totalPages || 1);
          setUsersTotal(data.total || 0);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar usuarios');
          setLoading(false);
        });
    } else if (activeTab === 'history') {
      fetch(`/api/historiales?page=${historyPage}&limit=${historyLimit}`)
        .then(res => res.json())
        .then(data => {
          setHistory(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
          setHistoryTotalPages(data.totalPages || 1);
          setHistoryTotal(data.total || 0);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar historial');
          setLoading(false);
        });
    } else if (activeTab === 'devices') {
      fetch(`/api/dispositivos?page=${devicesPage}&limit=${devicesLimit}`)
        .then(res => res.json())
        .then(data => {
          setDevices(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
          setDevicesTotalPages(data.totalPages || 1);
          setDevicesTotal(data.total || 0);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar dispositivos');
          setLoading(false);
        });
    }
  }, [activeTab, usersPage, usersLimit, historyPage, historyLimit, devicesPage, devicesLimit]);

  const handleExport = async () => {
    setLoading(true);
    let url = '';
    let filename = '';
    let fields = [];
    if (activeTab === 'users') {
      url = `/api/usuarios?page=1&limit=1000000`;
      filename = 'usuarios.xlsx';
      fields = [
        { label: 'Nombre', key: 'nombre' },
        { label: 'Correo', key: 'correo' },
        { label: 'Rol', key: 'rol' },
        { label: 'Estado', key: 'estado' },
        { label: 'Fecha de registro', key: 'fecha_registro' }
      ];
    } else if (activeTab === 'history') {
      url = `/api/historiales?page=1&limit=1000000`;
      filename = 'historial.xlsx';
      fields = [
        { label: 'ID', key: 'id_historial' },
        { label: 'Descripción', key: 'descripcion' },
        { label: 'Fecha', key: 'fecha_hora' },
        { label: 'ID Dispositivo', key: 'id_dispositivo' },
        { label: 'ID Usuario', key: 'id_usuario' }
      ];
    } else if (activeTab === 'devices') {
      url = `/api/dispositivos?page=1&limit=1000000`;
      filename = 'dispositivos.xlsx';
      fields = [
        { label: 'ID', key: 'id' },
        { label: 'Nombre', key: 'nombre' },
        { label: 'Tipo', key: 'tipo' },
        { label: 'Serial', key: 'serial' },
        { label: 'Usuario', key: 'nombre_usuario' },
        { label: 'Estado', key: 'estado_validacion' },
        { label: 'Fecha Registro', key: 'fecha_registro' }
      ];
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      let rows = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      if (!rows.length) throw new Error('No hay datos para exportar');
      // Filtrar solo los campos esenciales
      const filtered = rows.map(row => {
        const obj = {};
        fields.forEach(f => {
          let value = row[f.key];
          if (f.key === 'fecha_registro' || f.key === 'fecha_hora') {
            value = value ? new Date(value).toLocaleString() : '';
          }
          obj[f.label] = value ?? '';
        });
        return obj;
      });
      const ws = XLSX.utils.json_to_sheet(filtered);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, activeTab);
      XLSX.writeFile(wb, filename);
    } catch (e) {
      alert('Error al exportar: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="reports-bg">
      <div className="reports-container">
        <h1 className="reports-title">Reportes</h1>
        <div className="reports-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'reports-tab active' : 'reports-tab'}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="reports-content">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
            <button onClick={handleExport} className="export-btn" disabled={loading}>
              <FaFileExcel style={{ marginRight: 8, fontSize: 18, verticalAlign: 'middle' }} />
              Exportar a Excel
            </button>
          </div>
          <div className="reports-panel">
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
                    {usersTotalPages > 1 && (
                      <div className="pagination">
                        <button onClick={() => setUsersPage(usersPage - 1)} disabled={usersPage === 1}>Anterior</button>
                        {Array.from({ length: usersTotalPages }, (_, i) => (
                          <button key={i+1} className={usersPage === i+1 ? 'active' : ''} onClick={() => setUsersPage(i+1)}>{i+1}</button>
                        ))}
                        <button onClick={() => setUsersPage(usersPage + 1)} disabled={usersPage === usersTotalPages}>Siguiente</button>
                        <span style={{marginLeft:8}}>Total: {usersTotal}</span>
                        <select value={usersLimit} onChange={e => { setUsersLimit(Number(e.target.value)); setUsersPage(1); }} style={{marginLeft:8}}>
                          {[5,10,20,50].map(opt => <option key={opt} value={opt}>{opt} por página</option>)}
                        </select>
                      </div>
                    )}
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
                    {historyTotalPages > 1 && (
                      <div className="pagination">
                        <button onClick={() => setHistoryPage(historyPage - 1)} disabled={historyPage === 1}>Anterior</button>
                        {Array.from({ length: historyTotalPages }, (_, i) => (
                          <button key={i+1} className={historyPage === i+1 ? 'active' : ''} onClick={() => setHistoryPage(i+1)}>{i+1}</button>
                        ))}
                        <button onClick={() => setHistoryPage(historyPage + 1)} disabled={historyPage === historyTotalPages}>Siguiente</button>
                        <span style={{marginLeft:8}}>Total: {historyTotal}</span>
                        <select value={historyLimit} onChange={e => { setHistoryLimit(Number(e.target.value)); setHistoryPage(1); }} style={{marginLeft:8}}>
                          {[5,10,20,50].map(opt => <option key={opt} value={opt}>{opt} por página</option>)}
                        </select>
                      </div>
                    )}
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
                    {devicesTotalPages > 1 && (
                      <div className="pagination">
                        <button onClick={() => setDevicesPage(devicesPage - 1)} disabled={devicesPage === 1}>Anterior</button>
                        {Array.from({ length: devicesTotalPages }, (_, i) => (
                          <button key={i+1} className={devicesPage === i+1 ? 'active' : ''} onClick={() => setDevicesPage(i+1)}>{i+1}</button>
                        ))}
                        <button onClick={() => setDevicesPage(devicesPage + 1)} disabled={devicesPage === devicesTotalPages}>Siguiente</button>
                        <span style={{marginLeft:8}}>Total: {devicesTotal}</span>
                        <select value={devicesLimit} onChange={e => { setDevicesLimit(Number(e.target.value)); setDevicesPage(1); }} style={{marginLeft:8}}>
                          {[5,10,20,50].map(opt => <option key={opt} value={opt}>{opt} por página</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <style>{`
          .reports-bg {
            min-height: 100vh;
            background: #f4f7f6;
            padding: 24px 0 0 0;
          }
          .reports-container {
            width: 96vw;
            max-width: 1800px;
            margin: 0 auto;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 6px 32px rgba(44, 120, 60, 0.10);
            padding: 36px 32px 44px 32px;
            position: relative;
          }
          .reports-title {
            font-size: 2.4rem;
            font-weight: 800;
            margin-bottom: 28px;
            color: #1b5e20;
            letter-spacing: 1.2px;
            text-shadow: 0 2px 8px #e8f5e9;
          }
          .reports-tabs {
            display: flex;
            gap: 18px;
            margin-bottom: 28px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 2px;
          }
          .reports-tab {
            background: #e8f5e9;
            border: none;
            border-radius: 10px 10px 0 0;
            padding: 13px 38px 13px 28px;
            font-size: 1.13rem;
            font-weight: 700;
            color: #388e3c;
            cursor: pointer;
            transition: background 0.2s, color 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 8px rgba(56, 142, 60, 0.04);
            position: relative;
          }
          .reports-tab.active {
            background: #388e3c;
            color: #fff;
            box-shadow: 0 4px 16px rgba(56, 142, 60, 0.10);
            z-index: 2;
          }
          .tab-icon {
            font-size: 1.3em;
            display: flex;
            align-items: center;
          }
          .reports-content {
            background: #f9fbe7;
            border-radius: 0 0 14px 14px;
            padding: 28px 16px 16px 16px;
            min-height: 400px;
          }
          .reports-panel {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 2px 12px rgba(44, 120, 60, 0.07);
            padding: 28px 18px 18px 18px;
            margin-top: 0;
            min-height: 320px;
          }
          .reports-section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1b5e20;
            margin-bottom: 18px;
            letter-spacing: 0.5px;
          }
          .reports-table-wrapper {
            overflow-x: auto;
          }
          .reports-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: #fff;
            min-width: 900px;
            margin: 0;
            table-layout: fixed;
            border-radius: 8px;
            box-shadow: 0 1px 4px #e0e0e0;
          }
          .reports-table thead {
            position: sticky;
            top: 0;
            z-index: 10;
            background: #e8f5e9;
          }
          .reports-table th, .reports-table td {
            padding: 12px 18px;
            border-bottom: 1px solid #e0e0e0;
            text-align: left;
            font-size: 1.04rem;
          }
          .reports-table th {
            background: #e8f5e9;
            color: #388e3c;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .reports-table tr:hover {
            background: #f1f8e9;
            transition: background 0.15s;
          }
          .reports-loading, .reports-error {
            color: #c62828;
            font-weight: 600;
            font-size: 1.1rem;
          }
          .export-btn {
            background: linear-gradient(90deg, #43a047 0%, #388e3c 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 10px 28px;
            font-size: 1.08rem;
            font-weight: 700;
            cursor: pointer;
            margin-bottom: 8px;
            transition: background 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px #e8f5e9;
            display: flex;
            align-items: center;
          }
          .export-btn:disabled {
            background: #bdbdbd;
            cursor: not-allowed;
          }
          .pagination {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 16px;
          }
          .pagination button {
            background: #e8f5e9;
            border: none;
            border-radius: 5px;
            padding: 6px 14px;
            font-size: 1.05rem;
            color: #388e3c;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            font-weight: 600;
          }
          .pagination button.active {
            background: #388e3c;
            color: #fff;
          }
          .pagination button:disabled {
            background: #bdbdbd;
            color: #fff;
            cursor: not-allowed;
          }
          .pagination select {
            border-radius: 5px;
            border: 1px solid #bdbdbd;
            padding: 3px 10px;
            font-size: 1.05rem;
          }
          @media (max-width: 900px) {
            .reports-container {
              width: 100vw;
              max-width: 100vw;
              padding: 8px 0 10px 0;
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
            .reports-panel {
              padding: 10px 2px 2px 2px;
            }
            .reports-table th, .reports-table td {
              padding: 7px 6px;
              font-size: 0.95rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Reports; 