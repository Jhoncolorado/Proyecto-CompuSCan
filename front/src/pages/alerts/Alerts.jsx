import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { FaUser, FaHistory, FaMicrochip, FaFileExcel } from 'react-icons/fa';
import api from '../../services/api';

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
      api.get(`/api/usuarios?page=${usersPage}&limit=${usersLimit}`)
        .then(res => {
          const data = res.data;
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
      api.get(`/api/historiales?page=${historyPage}&limit=${historyLimit}`)
        .then(res => {
          const data = res.data;
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
      api.get(`/api/dispositivos?page=${devicesPage}&limit=${devicesLimit}`)
        .then(res => {
          const data = res.data;
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
      url = `/api/usuarios?todos=true`;
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
      const res = await api.get(url);
      const data = res.data;
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
    <div className="reports-bg" style={{ background: '#fff', boxShadow: 'none' }}>
      <div
        className="reports-container"
        style={{
          marginTop: '0',
          marginLeft: '0',
          background: '#fff',
          boxShadow: 'none',
          borderRadius: 0,
          width: '100%',
          maxWidth: '100%',
          padding: '20px 40px 40px 40px',
        }}
      >
        <h1 className="reports-title">Reportes</h1>
        <div
          className="reports-tabs-row"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            marginBottom: 28,
          }}
        >
          <div className="reports-tabs" style={{ height: 48, display: 'flex', alignItems: 'center' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'reports-tab active' : 'reports-tab'}
              onClick={() => setActiveTab(tab.key)}
                style={{ height: 48, display: 'flex', alignItems: 'center' }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
          <button
            onClick={handleExport}
            className="export-btn"
            disabled={loading}
            style={{
              height: 48,
              paddingTop: 0,
              paddingBottom: 0,
              display: 'flex',
              alignItems: 'center',
              marginBottom: 0,
            }}
          >
              <FaFileExcel style={{ marginRight: 8, fontSize: 18, verticalAlign: 'middle' }} />
              Exportar a Excel
            </button>
          </div>
        <div className="reports-content" style={{ paddingLeft: 0, paddingTop: '0.2rem' }}>
          <div className="reports-panel" style={{ paddingLeft: 0, paddingTop: '0.2rem', background: '#fff', boxShadow: 'none', borderRadius: 0 }}>
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
                            <td><span className="badge-estado">{user.estado || 'Activo'}</span></td>
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
                          <th>Fecha Entrada</th>
                          <th>Fecha Salida</th>
                          <th>Tipo</th>
                          <th>Usuario</th>
                          <th>Dispositivo</th>
                          <th>Serial</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map(h => {
                          // Parsear tipo y usuario desde la descripción
                          let tipo = '';
                          let usuario = '';
                          if (h.descripcion) {
                            if (h.descripcion.toLowerCase().includes('entrada')) tipo = 'ENTRADA';
                            else if (h.descripcion.toLowerCase().includes('salida')) tipo = 'SALIDA';
                            const match = h.descripcion.match(/Usuario: ([^\-]+)/);
                            usuario = match ? match[1].trim() : '';
                          }
                          return (
                          <tr key={h.id_historial || h.id}>
                              <td>{h.fecha_hora_entrada ? new Date(h.fecha_hora_entrada).toLocaleString() : ''}</td>
                              <td>{h.fecha_hora_salida ? new Date(h.fecha_hora_salida).toLocaleString() : ''}</td>
                              <td>{tipo}</td>
                              <td>{usuario}</td>
                              <td>{h.dispositivo_nombre || ''}</td>
                              <td>{h.dispositivo_serial || ''}</td>
                            <td>{h.descripcion}</td>
                          </tr>
                          );
                        })}
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
          .reports-bg, .reports-container, .reports-panel, .reports-table-wrapper, .reports-table {
            background: #fff !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .reports-container {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0 0 32px 0;
          }
          .reports-title {
            font-size: 2rem;
            font-weight: 800;
            color: #183c1c;
            margin: 0 0 24px 0;
            letter-spacing: 1px;
          }
          .reports-tabs-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 28px;
          }
          .reports-tabs {
            display: flex;
            gap: 16px;
          }
          .reports-tab {
            background: #f3f7f5;
            border: none;
            border-radius: 8px;
            padding: 13px 38px 13px 28px;
            font-size: 1.13rem;
            font-weight: 700;
            color: #183c1c;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .reports-tab.active {
            background: #218838;
            color: #fff;
          }
          .export-btn {
            background: #218838;
            color: #fff;
            border: none;
            border-radius: 10px;
            padding: 13px 38px;
            font-size: 1.13rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            box-shadow: none;
            margin-bottom: 0;
          }
          .reports-content {
            padding: 0;
          }
          .reports-panel {
            background: #fff;
            border-radius: 0;
            box-shadow: none;
            padding: 0;
            margin-top: 0;
          }
          .reports-section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #183c1c;
            margin-bottom: 18px;
            letter-spacing: 0.5px;
          }
          .reports-table-wrapper {
            overflow-x: auto;
            background: #fff;
            box-shadow: none;
            border-radius: 0;
            margin: 0;
            padding: 0;
          }
          .reports-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: #fff;
            margin: 0;
            table-layout: auto;
            border-radius: 12px;
            box-shadow: none;
            font-size: 1.08rem;
            border: 1.5px solid #e0e0e0;
            overflow: hidden;
          }
          .reports-table th, .reports-table td {
            padding: 16px 18px;
            border-bottom: 1px solid #e0e0e0;
            text-align: left;
            font-size: 1.08rem;
          }
          .reports-table th {
            background: #f3f7f5;
            color: #218838;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .reports-table tr:last-child td {
            border-bottom: none;
          }
          .reports-table tr:hover {
            background: #f7faf9;
            transition: background 0.15s;
          }
          .badge-estado {
            display: inline-block;
            background: #218838;
            color: #fff;
            font-weight: 700;
            font-size: 1.02rem;
            padding: 4px 18px;
            border-radius: 16px;
            margin-left: 0;
            margin-bottom: 2px;
            letter-spacing: 0.5px;
            vertical-align: middle;
          }
          .reports-loading, .reports-error {
            color: #c62828;
            font-weight: 600;
            font-size: 1.1rem;
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
            .reports-title { font-size: 1.5rem; }
            .reports-tab, .export-btn { padding: 8px 10px; font-size: 0.95rem; }
            .reports-table th, .reports-table td { padding: 7px 6px; font-size: 0.95rem; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Reports; 