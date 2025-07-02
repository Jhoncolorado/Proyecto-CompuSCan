import React, { useEffect, useState } from 'react';
import './History.css';
import { FaHistory, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, parseISO } from 'date-fns';

const History = () => {
  const [fichas, setFichas] = useState([]);
  const [idFicha, setIdFicha] = useState('');
  const [historial, setHistorial] = useState([]);
  const [aprendices, setAprendices] = useState([]);
  const [rangoFechas, setRangoFechas] = useState(() => {
    const hoy = new Date();
    return {
      inicio: format(startOfMonth(hoy), 'yyyy-MM-dd'),
      fin: format(endOfMonth(hoy), 'yyyy-MM-dd'),
    };
  });

  // Obtener fichas asignadas al instructor (puedes ajustar según tu modelo de usuario)
  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const res = await api.get('/api/fichas/asignadas'); // Ajusta endpoint según tu backend
        const data = Array.isArray(res.data) ? res.data : [];
        setFichas(data);
        if (data.length > 0) setIdFicha(data[0].id);
      } catch {
        setFichas([]);
      }
    };
    fetchFichas();
  }, []);

  // Obtener aprendices de la ficha seleccionada
  useEffect(() => {
    if (!idFicha) return;
    const fetchAprendices = async () => {
      try {
        const res = await api.get(`/api/asistencia/aprendices/ficha/${idFicha}`); // endpoint correcto por ficha
        // Asegura que cada aprendiz tenga id_usuario para el cruce con historial
        const data = Array.isArray(res.data) ? res.data : [];
        setAprendices(data.map(a => ({ ...a, id_usuario: a.id_usuario || a.id })));
      } catch {
        setAprendices([]);
      }
    };
    fetchAprendices();
  }, [idFicha]);

  // Utilidad para asegurar formato de fecha correcto
  const toISODate = (dateStr) => {
    if (!dateStr) return '';
    // Si ya es YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // Si es DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split('/');
      return `${y}-${m}-${d}`;
    }
    // Si es otro formato, intenta parsear
    return new Date(dateStr).toISOString().slice(0, 10);
  };

  // Obtener historial de asistencia
  useEffect(() => {
    if (!idFicha) return;
    const fetchHistorial = async () => {
      try {
        const res = await api.get(`/api/asistencia/historial?id_ficha=${idFicha}&fecha_inicio=${toISODate(rangoFechas.inicio)}&fecha_fin=${toISODate(rangoFechas.fin)}`);
        setHistorial(Array.isArray(res.data) ? res.data : []);
      } catch {
        setHistorial([]);
      }
    };
    fetchHistorial();
  }, [idFicha, rangoFechas]);

  // Construir matriz de historial
  const dias = aprendices.length > 0
    ? eachDayOfInterval({
        start: parseISO(rangoFechas.inicio),
        end: parseISO(rangoFechas.fin)
      }).map(d => format(d, 'yyyy-MM-dd'))
    : [];
  const asistenciaMap = {};
  historial.forEach(reg => {
    // Normaliza la fecha a YYYY-MM-DD (independiente de zona horaria)
    let fechaKey = '';
    if (reg.fecha) {
      // Si reg.fecha es string tipo '2025-06-26T00:00:00.000Z' o Date, siempre extrae YYYY-MM-DD
      if (typeof reg.fecha === 'string' && reg.fecha.length >= 10) {
        fechaKey = reg.fecha.slice(0, 10);
    } else {
        fechaKey = new Date(reg.fecha).toISOString().slice(0, 10);
    }
    }
    asistenciaMap[`${reg.id_usuario}_${fechaKey}`] = reg;
  });

  // Utilidad para formatear horas en 'Xh Ymin'
  function formatHoras(horas) {
    if (!horas || isNaN(horas) || horas <= 0) return '0h 0min';
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return `${h}h ${m}min`;
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: '#256029', marginBottom: 24 }}>Historial de asistencia</h2>
      <div style={{
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: '#f6fbf2',
        borderRadius: 14,
        boxShadow: '0 2px 8px #0001',
        padding: '18px 28px',
        width: 'fit-content',
        minWidth: 420,
      }}>
        <label style={{ fontWeight: 600, color: '#256029', fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
          Ficha:
          <select value={idFicha} onChange={e => setIdFicha(e.target.value)}
            style={{
              border: '1.5px solid #c8e6c9',
              borderRadius: 8,
              padding: '7px 16px',
              fontSize: 16,
              background: '#fff',
              color: '#256029',
              fontWeight: 600,
              minWidth: 120,
              outline: 'none',
              boxShadow: '0 1px 4px #0001',
              marginLeft: 4
            }}>
            {(Array.isArray(fichas) ? fichas : []).map(f => <option key={f.id} value={f.id}>{f.codigo || f.id}</option>)}
          </select>
        </label>
        <label style={{ fontWeight: 500, color: '#333', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          Desde:
          <input type="date" value={rangoFechas.inicio} onChange={e => setRangoFechas(r => ({ ...r, inicio: e.target.value }))}
            style={{
              border: '1.5px solid #bdbdbd',
              borderRadius: 8,
              padding: '7px 12px',
              fontSize: 16,
              background: '#fff',
              color: '#256029',
              outline: 'none',
              boxShadow: '0 1px 4px #0001',
              marginLeft: 4
            }}
          />
        </label>
        <label style={{ fontWeight: 500, color: '#333', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          Hasta:
          <input type="date" value={rangoFechas.fin} onChange={e => setRangoFechas(r => ({ ...r, fin: e.target.value }))}
            style={{
              border: '1.5px solid #bdbdbd',
              borderRadius: 8,
              padding: '7px 12px',
              fontSize: 16,
              background: '#fff',
              color: '#256029',
              outline: 'none',
              boxShadow: '0 1px 4px #0001',
              marginLeft: 4
            }}
          />
        </label>
          </div>
      {/* Leyenda de íconos */}
      <div style={{ margin: '12px 0 18px 0', display: 'flex', gap: 24, alignItems: 'center' }}>
        <span><span style={{color:'#43a047', fontWeight:700, fontSize:18}}>✔️</span> Presente</span>
        <span><span style={{color:'#d32f2f', fontWeight:700, fontSize:18}}>❌</span> Ausente</span>
        <span><span style={{color:'#f9a825', fontWeight:700, fontSize:18}}>🟡</span> Justificado</span>
        <span><span style={{color:'#888', fontWeight:700, fontSize:18}}>–</span> Sin registro</span>
      </div>
      {aprendices.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#f6fbf2', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: '48px 0', marginTop: 32
        }}>
          <div style={{ fontSize: 48, color: '#bdbdbd', marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 22, color: '#256029', fontWeight: 600, marginBottom: 6 }}>No hay aprendices en la ficha seleccionada</div>
          <div style={{ fontSize: 16, color: '#888', maxWidth: 400, textAlign: 'center' }}>Selecciona otra ficha o ajusta el rango de fechas para ver el historial de asistencia.</div>
          </div>
        ) : (
        <div style={{ overflowX: 'auto', marginTop: 24 }}>
          <table className="tabla-historial" style={{ minWidth: 900, borderCollapse: 'separate', borderSpacing: '0 2px' }}>
              <thead>
                <tr>
                <th style={{ position: 'sticky', left: 0, background: '#e8f5e9', zIndex: 2, minWidth: 180, maxWidth: 220, padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Nombre</th>
                <th style={{ position: 'sticky', left: 180, background: '#f3e5f5', zIndex: 2, minWidth: 120, maxWidth: 160, padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Documento</th>
                {dias.map(dia => (
                  <th key={dia} style={{ minWidth: 54, fontWeight: 500, padding: '8px 0', background: '#f6fbf2', textAlign: 'center', borderLeft: '2px solid #fff' }}>{format(parseISO(dia), 'dd/MM')}</th>
                ))}
                <th style={{ minWidth: 80, fontWeight: 700, background: '#e8f5e9', textAlign: 'center' }}>Total horas</th>
                <th style={{ minWidth: 80, fontWeight: 700, background: '#ffe0b2', textAlign: 'center' }}>Horas faltadas</th>
                </tr>
              </thead>
              <tbody>
              {aprendices.map(aprendiz => {
                let totalHoras = 0;
                let horasClase = 0;
                dias.forEach(dia => {
                  const reg = asistenciaMap[`${(aprendiz.id_usuario || aprendiz.id)}_${dia}`];
                  if (reg && typeof reg.total_horas === 'number') {
                    totalHoras += reg.total_horas;
                    if (typeof reg.horas_clase === 'number') horasClase = reg.horas_clase;
                  } else if (reg && typeof reg.horas_clase === 'number') {
                    horasClase = reg.horas_clase;
                  }
                });
                const horasFaltadas = horasClase > 0 ? Math.max(0, horasClase - totalHoras) : 0;
                return (
                  <tr key={aprendiz.id_usuario || aprendiz.id || aprendiz.documento || aprendiz.nombre}>
                    <td style={{ position: 'sticky', left: 0, background: '#fff', minWidth: 180, maxWidth: 220, padding: '8px 12px', fontWeight: 500, borderRight: '2px solid #e0e0e0' }}>{aprendiz.nombre}</td>
                    <td style={{ position: 'sticky', left: 180, background: '#fff', minWidth: 120, maxWidth: 160, padding: '8px 12px', borderRight: '2px solid #e0e0e0' }}>{aprendiz.documento}</td>
                    {dias.map(dia => {
                      const reg = asistenciaMap[`${(aprendiz.id_usuario || aprendiz.id)}_${dia}`];
                      let cell = '–';
                      let color = '#888';
                      if (reg) {
                        if (reg.estado === 'presente') { cell = '✔️'; color = '#2e7d32'; }
                        else if (reg.estado === 'ausente') { cell = '❌'; color = '#c62828'; }
                        else if (reg.estado === 'justificado') { cell = '🟡'; color = '#f9a825'; }
                      }
                      return <td key={`${(aprendiz.id_usuario || aprendiz.id || aprendiz.documento || aprendiz.nombre)}_${dia}`} style={{ color, fontWeight: 600, textAlign: 'center', minWidth: 44, padding: '8px 0', background: '#fff', borderLeft: '2px solid #f6fbf2' }}>{cell}</td>;
                    })}
                    <td style={{ fontWeight: 700, color: '#256029', textAlign: 'center', background: '#fff' }}>{formatHoras(totalHoras)}</td>
                    <td style={{ fontWeight: 700, color: '#c62828', textAlign: 'center', background: '#fff' }}>{formatHoras(horasFaltadas)}</td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default History;

// Historial personal del usuario
export const UserHistory = () => {
  const { user, loading: userLoading } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return; // Esperar a que el usuario esté cargado
    setLoading(true);
    const fetchHistorial = async () => {
      try {
        const response = await fetch(`/api/historiales?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Error al cargar el historial');
        }
        const data = await response.json();
        let eventos = [];
        if (Array.isArray(data.data)) {
          eventos = data.data;
        } else if (Array.isArray(data)) {
          eventos = data;
        }
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || eventos.length);
        // Solo el admin ve todos los registros
        if (user.rol && user.rol.trim().toLowerCase() === 'admin') {
          setHistorial(eventos);
        } else {
          const userEvents = eventos.filter(ev => ev.descripcion && user.nombre && ev.descripcion.includes(user.nombre));
        setHistorial(userEvents);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [user, page, limit]);

  const getAccessBadge = (descripcion) => {
    if (descripcion.includes("ENTRADA")) {
      return (
        <span className="history-badge badge-success">
          <FaSignInAlt style={{marginRight: 6}} />
          ENTRADA
        </span>
      );
    } else if (descripcion.includes("SALIDA")) {
      return (
        <span className="history-badge badge-danger">
          <FaSignOutAlt style={{marginRight: 6}} />
          SALIDA
        </span>
      );
    } else {
      return (
        <span className="history-badge badge-default">
          {descripcion.split(" - ")[0] || "OTRO"}
        </span>
      );
    }
  };

  if (userLoading || !user) {
    return (
      <div className="history-bg">
        <div className="history-panel">
          <div className="history-header-row">
            <h1>Mi Historial de Accesos</h1>
          </div>
          <div className="history-loading">
            <span className="spinner"></span>
            <span>Cargando historial...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-bg">
      <div className="history-panel">
        <div className="history-header-row">
          <h1>Mi Historial de Accesos</h1>
        </div>
        {loading ? (
          <div className="history-loading">
            <span className="spinner"></span>
            <span>Cargando historial...</span>
          </div>
        ) : error ? (
          <div className="history-error">
            <span>{error}</span>
          </div>
        ) : historial.length === 0 ? (
          <div className="history-empty">
            <div className="history-empty-icon">
              <FaHistory />
            </div>
            <h3>No hay registros en el historial</h3>
            <p>Tus accesos aparecerán aquí cuando se registren.</p>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Dispositivo</th>
                  <th>Serial</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((registro) => {
                  const [tipo, ...resto] = registro.descripcion.split(' - ');
                  return (
                    <tr key={registro.id_historial}>
                      <td>{registro.fecha_hora_entrada ? new Date(registro.fecha_hora_entrada).toLocaleString() : ''}</td>
                      <td>{registro.fecha_hora_salida ? new Date(registro.fecha_hora_salida).toLocaleString() : <span style={{color:'green'}}>Adentro</span>}</td>
                      <td>
                        {registro.fecha_hora_salida
                          ? <span style={{color:'red', fontWeight:600}}>Salida</span>
                          : <span style={{color:'green', fontWeight:600}}>Adentro</span>
                        }
                      </td>
                      <td>
                        {getAccessBadge(registro.descripcion)}
                        <span>{resto.length > 0 ? ` - ${resto.join(' - ')}` : ''}</span>
                      </td>
                      <td>{registro.dispositivo_nombre}</td>
                      <td>{registro.dispositivo_serial}</td>
                    </tr>
                  );
                })}
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
          </div>
        )}
      </div>
    </div>
  );
}; 