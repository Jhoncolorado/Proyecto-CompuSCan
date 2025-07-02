import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

const motivosJustificacion = [
  'Incapacidad',
  'Permiso',
  'Calamidad',
  'Otro',
];

const estadosAsistencia = [
  'presente',
  'ausente',
  'justificado',
];

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Asistencia = () => {
  const { user } = useAuth();
  const [fichas, setFichas] = useState([]);
  const [idFicha, setIdFicha] = useState(null);
  const [aprendices, setAprendices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [asistencias, setAsistencias] = useState({});
  const [feedback, setFeedback] = useState({});
  const [editando, setEditando] = useState(null); // id de la asistencia en edición
  const [showJustificar, setShowJustificar] = useState(false);
  const [justificandoId, setJustificandoId] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [observacion, setObservacion] = useState('');
  const [verMotivo, setVerMotivo] = useState({ open: false, observacion: '' });
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [showFullImg, setShowFullImg] = useState(null); // url de imagen ampliada
  const [hoverImg, setHoverImg] = useState(false); // para mostrar el ícono fullscreen solo en hover
  const [estadisticas, setEstadisticas] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [rangoFechas, setRangoFechas] = useState(() => {
    const hoy = new Date();
    return {
      inicio: format(startOfMonth(hoy), 'yyyy-MM-dd'),
      fin: format(endOfMonth(hoy), 'yyyy-MM-dd'),
    };
  });
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(true);
  // Animación para los totales
  const [animados, setAnimados] = useState({});
  const prevEstadisticas = useRef({});

  // Estilo base para la imagen de evidencia (horizontal, ancha)
  const evidenciaImgStyle = {
    width: '100%',
    maxWidth: 320,
    height: 140,
    borderRadius: 10,
    boxShadow: '0 2px 8px #0001',
    objectFit: 'cover',
    display: 'block',
    margin: 'auto',
    cursor: 'pointer',
  };

  useEffect(() => {
    const fetchFichasYAprendices = async () => {
      try {
        setLoading(true);
        setError('');
        if (!user?.id) throw new Error('No se encontró el usuario instructor');
        // Obtener fichas asignadas
        const fichasRes = await api.get('/api/fichas/asignadas');
        const fichasArr = Array.isArray(fichasRes.data) ? fichasRes.data : [];
        setFichas(fichasArr);
        if (fichasArr.length === 0) throw new Error('No tienes fichas asignadas');
        // Si no hay ficha seleccionada, usar la primera
        setIdFicha(f => f || fichasArr[0].id);
      } catch (err) {
        setError('Error al cargar fichas: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFichasYAprendices();
  }, [user]);

  useEffect(() => {
    const fetchAprendices = async () => {
      if (!idFicha) return;
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/api/asistencia/aprendices/ficha/${idFicha}`);
        let data = res.data;
        if (Array.isArray(data)) {
          setAprendices(data);
        } else if (Array.isArray(data?.data)) {
          setAprendices(data.data);
        } else {
          setAprendices([]);
        }
      } catch (err) {
        setError('Error al cargar aprendices: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAprendices();
  }, [idFicha]);

  useEffect(() => {
    const fetchAsistencias = async () => {
      if (!idFicha) return;
      const hoy = new Date();
      const fecha = hoy.toISOString().slice(0, 10); // yyyy-mm-dd
      try {
        const res = await api.get(`/api/asistencia/por-ficha-fecha?id_ficha=${idFicha}&fecha=${fecha}`);
        const map = {};
        res.data.forEach(a => {
          map[a.id_usuario] = a;
        });
        setAsistencias(map);
      } catch (err) {
        // No hacer nada
      }
    };
    fetchAsistencias();
  }, [idFicha]);

  // --- ESTADÍSTICAS EN TIEMPO REAL ---
  const fetchEstadisticas = async () => {
    setLoadingEstadisticas(true);
    if (!idFicha) return;
    const hoy = new Date();
    const fecha = hoy.toISOString().slice(0, 10);
    try {
      const res = await api.get(`/api/asistencia/estadisticas?id_ficha=${idFicha}&fecha_inicio=${fecha}`);
      setEstadisticas(res.data);
    } catch (err) {
      setEstadisticas(null);
    } finally {
      setLoadingEstadisticas(false);
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, [idFicha]);

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!idFicha) return;
      try {
        const res = await api.get(`/api/asistencia/historial?id_ficha=${idFicha}&fecha_inicio=${rangoFechas.inicio}&fecha_fin=${rangoFechas.fin}`);
        setHistorial(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setHistorial([]);
      }
    };
    fetchHistorial();
  }, [idFicha, rangoFechas]);

  useEffect(() => {
    if (editModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100vw';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [editModal]);

  const marcarAsistencia = async (aprendiz, nuevoEstado) => {
    setFeedback(f => ({ ...f, [aprendiz.id]: '' }));
    try {
      await api.post('/api/asistencia', {
        id_usuario: aprendiz.id,
        id_ficha: aprendiz.id_ficha,
        estado: nuevoEstado,
        tipo: 'manual',
      });
      // Refresca la lista de asistencias para obtener el ID correcto
      const hoy = new Date();
      const fecha = hoy.toISOString().slice(0, 10);
      const res = await api.get(`/api/asistencia/por-ficha-fecha?id_ficha=${idFicha}&fecha=${fecha}`);
      const map = {};
      res.data.forEach(a => {
        map[a.id_usuario] = a;
      });
      setAsistencias(map);
      setFeedback(f => ({ ...f, [aprendiz.id]: '¡Asistencia actualizada!' }));
      setEditando(null);
      await fetchEstadisticas(); // Actualiza porcentajes en tiempo real
    } catch (err) {
      setFeedback(f => ({ ...f, [aprendiz.id]: 'Error al registrar asistencia' }));
    }
  };

  const justificarAsistencia = (aprendiz) => {
    const asistencia = asistencias[aprendiz.id];
    // Si no existe asistencia, crear un objeto base para editar
    let motivoEdit = '';
    let observacionEdit = '';
    if (asistencia && asistencia.observacion) {
      const match = asistencia.observacion.match(/^Motivo: ([^.]+)\. Observación: (.+)$/);
      if (match) {
        motivoEdit = match[1];
        observacionEdit = match[2];
      } else if (asistencia.observacion.startsWith('Motivo: ')) {
        motivoEdit = asistencia.observacion.replace('Motivo: ', '');
      } else {
        observacionEdit = asistencia.observacion;
      }
    }
    setEditForm({
      id: asistencia?.id,
      estado: 'justificado',
      motivo: motivoEdit,
      observacion: observacionEdit,
      evidencia: asistencia?.evidencia || '',
    });
    setEditPreview(asistencia?.evidencia ? `/uploads/${asistencia.evidencia}` : null);
    setEditFile(null);
    setEditando(aprendiz.id);
    setEditModal(true);
  };

  const handleVerMotivo = (asistencia) => {
    setVerMotivo({ open: true, observacion: asistencia.observacion });
  };

  const handleCerrarVerMotivo = () => {
    setVerMotivo({ open: false, observacion: '' });
  };

  // --- EDICIÓN DE ASISTENCIA ---
  const handleEdit = (aprendiz) => {
    const asistencia = asistencias[aprendiz.id];
    if (!asistencia || !asistencia.id) {
      alert('No se puede editar: asistencia sin ID.');
      return;
    }
    // Parsear motivo y observación si existen
    let motivoEdit = '';
    let observacionEdit = '';
    if (asistencia.observacion) {
      const match = asistencia.observacion.match(/^Motivo: ([^.]+)\. Observación: (.+)$/);
      if (match) {
        motivoEdit = match[1];
        observacionEdit = match[2];
      } else if (asistencia.observacion.startsWith('Motivo: ')) {
        motivoEdit = asistencia.observacion.replace('Motivo: ', '');
      } else {
        observacionEdit = asistencia.observacion;
      }
    }
    setEditForm({
      id: asistencia.id,
      estado: asistencia.estado || '',
      motivo: motivoEdit,
      observacion: observacionEdit,
      evidencia: asistencia.evidencia || '',
    });
    setEditPreview(asistencia.evidencia ? `/uploads/${asistencia.evidencia}` : null);
    setEditFile(null);
    setEditando(aprendiz.id);
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleEditFile = (e) => {
    const file = e.target.files[0];
    setEditFile(file);
    if (file) {
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('estado', editForm.estado);
    const textoObservacion = editForm.motivo
      ? `Motivo: ${editForm.motivo}. Observación: ${editForm.observacion}`
      : editForm.observacion;
    formData.append('observacion', textoObservacion);
    if (editFile) {
      formData.append('evidencia', editFile);
    }
    try {
      const res = await api.put(`/api/asistencia/${editForm.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Actualizar la asistencia en el estado local
      setAsistencias(prev => ({
        ...prev,
        [editando]: res.data,
      }));
      setEditModal(false);
      setEditando(null);
      setEditFile(null);
      setEditPreview(null);
      await fetchEstadisticas(); // Actualiza porcentajes en tiempo real
    } catch (err) {
      alert('Error al editar asistencia');
    }
  };

  const handleCancelEdit = () => {
    setEditModal(false);
    setEditando(null);
    setEditFile(null);
    setEditPreview(null);
  };

  // --- HISTORIAL: construir matriz ---
  // Asegura que la comparación de fechas ignore la hora
  const historialArray = Array.isArray(historial) ? historial : [];
  const dias = eachDayOfInterval({ start: new Date(rangoFechas.inicio), end: new Date(rangoFechas.fin) })
    .map(d => format(d, 'yyyy-MM-dd'));

  // Agrupa asistencias por usuario y fecha (clave: id_usuario + fecha)
  const asistenciaMap = {};
  historialArray.forEach(reg => {
    const fechaKey = reg.fecha ? new Date(reg.fecha).toISOString().slice(0, 10) : '';
    asistenciaMap[`${reg.id_usuario}_${fechaKey}`] = reg;
  });

  useEffect(() => {
    if (!estadisticas) return;
    const nuevosAnimados = {};
    ['presentes', 'ausentes', 'justificados', 'total', 'porcentaje', 'rfid', 'manual'].forEach(key => {
      if (estadisticas[key] !== prevEstadisticas.current[key]) {
        nuevosAnimados[key] = true;
        setTimeout(() => setAnimados(a => ({ ...a, [key]: false })), 400);
      }
    });
    setAnimados(a => ({ ...a, ...nuevosAnimados }));
    prevEstadisticas.current = estadisticas;
  }, [estadisticas]);

  // Inyectar CSS de animación bump
  useEffect(() => {
    if (document.getElementById('bump-anim-css')) return;
    const style = document.createElement('style');
    style.id = 'bump-anim-css';
    style.innerHTML = `
      @keyframes bump {
        0% { transform: scale(1); }
        30% { transform: scale(1.15); }
        60% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
      .totales-animado {
        animation: bump 0.4s;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '2.5rem 1rem',
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 2px 16px #0001'
    }}>
      <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, letterSpacing: 0.5, marginBottom: 8, color: '#256029' }}>Asistencia</h2>
      <div style={{ textAlign: 'center', color: '#555', fontSize: 18, marginBottom: 32 }}>Marca la asistencia de tus aprendices por ficha</div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 18,
        marginBottom: 36
      }}>
        <label style={{ fontWeight: 600, marginRight: 10, fontSize: 18 }}>Ficha:</label>
        <select
          value={idFicha || ''}
          onChange={e => setIdFicha(e.target.value)}
          style={{ padding: '10px 22px', borderRadius: 10, fontSize: 18, minWidth: 140, border: '1.5px solid #c8e6c9', background: '#f6fbf2', color: '#256029', fontWeight: 600 }}
        >
          {fichas.map(f => (
            <option key={f.id} value={f.id}>{f.codigo || f.id}</option>
          ))}
        </select>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 28,
        marginBottom: 38,
        flexWrap: 'wrap'
      }}>
        <div style={{ background: '#e8f5e9', borderRadius: 16, padding: '20px 32px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 16, color: '#256029', fontWeight: 700, marginBottom: 2 }}>Presentes</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#256029' }} className={animados.presentes ? 'totales-animado' : ''}>{estadisticas?.presentes ?? 0}</div>
        </div>
        <div style={{ background: '#ffebee', borderRadius: 16, padding: '20px 32px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 16, color: '#c62828', fontWeight: 700, marginBottom: 2 }}>Ausentes</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#c62828' }} className={animados.ausentes ? 'totales-animado' : ''}>{estadisticas?.ausentes ?? 0}</div>
        </div>
        <div style={{ background: '#fffde7', borderRadius: 16, padding: '20px 32px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 16, color: '#f9a825', fontWeight: 700, marginBottom: 2 }}>Justificados</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#f9a825' }} className={animados.justificados ? 'totales-animado' : ''}>{estadisticas?.justificados ?? 0}</div>
        </div>
        <div style={{ background: '#e3f2fd', borderRadius: 16, padding: '20px 32px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 16, color: '#1976d2', fontWeight: 700, marginBottom: 2 }}>Total</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1976d2' }} className={animados.total ? 'totales-animado' : ''}>{estadisticas?.total ?? 0}</div>
        </div>
        <div style={{ background: '#f3e5f5', borderRadius: 16, padding: '20px 32px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 16, color: '#8e24aa', fontWeight: 700, marginBottom: 2 }}>% Asistencia</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#8e24aa' }} className={animados.porcentaje ? 'totales-animado' : ''}>{estadisticas?.porcentaje ?? 0}%</div>
        </div>
        <div style={{ background: '#f3e5f5', borderRadius: 16, padding: '20px 32px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 16, color: '#8e24aa', fontWeight: 700, marginBottom: 2 }}>RFID</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#8e24aa' }} className={animados.rfid ? 'totales-animado' : ''}>{estadisticas?.rfid ?? 0}</div>
        </div>
        <div style={{ background: '#fff3e0', borderRadius: 16, padding: '20px 32px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 16, color: '#f57c00', fontWeight: 700, marginBottom: 2 }}>Manual</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#f57c00' }} className={animados.manual ? 'totales-animado' : ''}>{estadisticas?.manual ?? 0}</div>
        </div>
      </div>
      <div style={{ overflowX: 'auto', background: '#fafbfc', borderRadius: 12, boxShadow: '0 1px 4px #0001', padding: '0 0 18px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 17 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr style={{ background: '#f6fbf2' }}>
              <th style={{ border: '1px solid #e0e0e0', padding: '12px 8px', fontWeight: 700 }}>Nombre</th>
              <th style={{ border: '1px solid #e0e0e0', padding: '12px 8px', fontWeight: 700 }}>Documento</th>
              <th style={{ border: '1px solid #e0e0e0', padding: '12px 8px', fontWeight: 700 }}>Estado</th>
              <th style={{ border: '1px solid #e0e0e0', padding: '12px 8px', fontWeight: 700 }}>Evidencia</th>
              <th style={{ border: '1px solid #e0e0e0', padding: '12px 8px', fontWeight: 700 }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {aprendices.map(aprendiz => {
              const asistencia = asistencias[aprendiz.id];
              const estado = asistencia?.estado;
              return (
                <tr key={aprendiz.id} style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ border: '1px solid #e0e0e0', padding: '10px 8px' }}>{aprendiz.nombre}</td>
                  <td style={{ border: '1px solid #e0e0e0', padding: '10px 8px' }}>{aprendiz.documento}</td>
                  <td style={{ border: '1px solid #e0e0e0', padding: '10px 8px', fontWeight: 700 }}>
                    {estado === 'presente' && <span style={{ color: '#43a047' }}>✔️ Presente</span>}
                    {estado === 'ausente' && <span style={{ color: '#d32f2f' }}>❌ Ausente</span>}
                    {estado === 'justificado' && <span style={{ color: '#f9a825' }}>🟡 Justificado</span>}
                    {!estado && <span style={{ color: '#888' }}>– Sin marcar</span>}
                  </td>
                  <td style={{ border: '1px solid #e0e0e0', padding: '10px 8px', textAlign: 'center' }}>
                    {asistencia?.evidencia ? (
                      (() => {
                        if (asistencia.evidencia.startsWith('data:image/')) {
                          return (
                            <a href={asistencia.evidencia} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}>
                              Evidencia
                            </a>
                          );
                        }
                        const ext = asistencia.evidencia.split('.').pop().toLowerCase();
                        const url = `${BACKEND_URL}/uploads/${asistencia.evidencia}`;
                        return (
                          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}>
                            Evidencia
                          </a>
                        );
                      })()
                    ) : (
                      <span style={{ color: '#888' }}>Sin evidencia</span>
                    )}
                  </td>
                  <td style={{ border: '1px solid #e0e0e0', padding: '10px 8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'flex-start' }}>
                      {!estado && (
                        <>
                          <button
                            style={{
                              background: '#43a047',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '10px 18px',
                              minWidth: 110,
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: 15
                            }}
                            onClick={() => marcarAsistencia(aprendiz, 'presente')}
                          >
                            Marcar Presente
                          </button>
                          <button
                            style={{
                              background: '#1976d2',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '10px 18px',
                              minWidth: 110,
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: 15
                            }}
                            onClick={() => marcarAsistencia(aprendiz, 'ausente')}
                          >
                            Marcar Ausente
                          </button>
                        </>
                      )}
                      {estado === 'ausente' && (
                        <button
                          style={{
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 14px',
                            minWidth: 110,
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 15,
                            display: 'inline-block',
                            boxSizing: 'border-box'
                          }}
                          onClick={() => justificarAsistencia(aprendiz)}
                        >
                          Justificar
                        </button>
                      )}
                      {estado && (
                        <button
                          style={{
                            background: '#d32f2f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 14px',
                            minWidth: 110,
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 15,
                            display: 'inline-block',
                            boxSizing: 'border-box'
                          }}
                          onClick={() => handleEdit(aprendiz)}
                        >
                          Editar
                        </button>
                      )}
                      {estado === 'justificado' && (
                        <button
                          style={{
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 14px',
                            minWidth: 110,
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 15,
                            display: 'inline-block',
                            boxSizing: 'border-box'
                          }}
                          onClick={() => handleVerMotivo(asistencia)}
                        >
                          Ver Motivo
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Modal de edición de asistencia */}
      {editModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 0,
          margin: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            background: '#fff',
            padding: 'clamp(18px, 4vw, 32px)',
            borderRadius: 20,
            width: '95vw',
            maxWidth: 420,
            minWidth: 0,
            boxShadow: '0 8px 32px #0002',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minHeight: '100px',
            marginTop: '-2vh',
            marginBottom: '3vh',
            overflow: 'hidden',
          }}>
            <form onSubmit={handleEditSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              overflowY: 'auto',
              maxHeight: '70vh',
              width: '100%',
              height: '100%',
              paddingRight: 8,
            }}>
              <h3 style={{marginBottom: 8, fontSize: '1.45rem', fontWeight: 700, color: '#1976d2', letterSpacing: 0.5}}>Editar Asistencia</h3>
              <label style={{fontWeight: 500, marginBottom: 2}}>Estado:</label>
              <select name="estado" value={editForm.estado} onChange={handleEditChange} required style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #bbb' }}>
                <option value="">Selecciona estado</option>
                {estadosAsistencia.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
              </select>
              <label style={{fontWeight: 500, marginBottom: 2}}>Motivo:</label>
              <select name="motivo" value={editForm.motivo} onChange={handleEditChange} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #bbb' }}>
                <option value="">Selecciona motivo</option>
                {motivosJustificacion.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <label style={{fontWeight: 500, marginBottom: 2}}>Observación:</label>
              <textarea name="observacion" value={editForm.observacion} onChange={handleEditChange} style={{ width: '100%', minHeight: 60, marginBottom: 8, resize: 'vertical', padding: 8, borderRadius: 6, border: '1px solid #bbb' }} />
              <label style={{fontWeight: 500, marginBottom: 2}}>Evidencia (imagen o PDF):</label>
              <input type="file" accept="image/*,application/pdf" onChange={handleEditFile} style={{ marginBottom: 8 }} />
              {/* Preview de evidencia: solo uno, según prioridad */}
              {editFile ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: 320, height: 140, margin: 'auto' }}
                  onMouseEnter={() => setHoverImg(true)}
                  onMouseLeave={() => setHoverImg(false)}
                >
                  <img
                    src={editPreview}
                    alt="Evidencia"
                    style={{ width: '100%', height: 140, borderRadius: 10, boxShadow: '0 2px 8px #0001', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/320x140?text=Sin+imagen'; }}
                  />
                  {hoverImg && (
                    <button type="button" onClick={() => setShowFullImg(editPreview)} style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      background: 'rgba(0,0,0,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 10, transition: 'background 0.2s',
                      outline: 'none',
                    }}>
                      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3m0-8V5a2 2 0 0 0-2-2h-3"/></svg>
                    </button>
                  )}
                </div>
              ) : editForm.evidencia ? (
                editForm.evidencia.endsWith('.pdf') ? (
                  <a href={`${BACKEND_URL}/uploads/${editForm.evidencia}`} target="_blank" rel="noopener noreferrer">Ver PDF actual</a>
                ) : (
                  <div style={{ position: 'relative', width: '100%', maxWidth: 320, height: 140, margin: 'auto' }}
                    onMouseEnter={() => setHoverImg(true)}
                    onMouseLeave={() => setHoverImg(false)}
                  >
                    <img
                      src={`${BACKEND_URL}/uploads/${editForm.evidencia}`}
                      alt="Evidencia"
                      style={{ width: '100%', height: 140, borderRadius: 10, boxShadow: '0 2px 8px #0001', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/320x140?text=Sin+imagen'; }}
                    />
                    {hoverImg && (
                      <button type="button" onClick={() => setShowFullImg(`${BACKEND_URL}/uploads/${editForm.evidencia}`)} style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 10, transition: 'background 0.2s',
                        outline: 'none',
                      }}>
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3m0-8V5a2 2 0 0 0-2-2h-3"/></svg>
                      </button>
                    )}
                  </div>
                )
              ) : null}
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 'auto', marginBottom: 0, paddingBottom: 0 }}>
                <button type="button" onClick={handleCancelEdit} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '10px 32px', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}>Cancelar</button>
                <button type="submit" style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '10px 32px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #1976d222', transition: 'background 0.2s' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal ver motivo */}
      {verMotivo.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 4px 24px #0003' }}>
            <h3>Motivo de Justificación</h3>
            <p>{verMotivo.observacion}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={handleCerrarVerMotivo} style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de imagen ampliada */}
      {showFullImg && (
        <div onClick={() => setShowFullImg(null)} style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: '#111',
          zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'zoom-out',
          overflow: 'hidden',
          transition: 'opacity 0.18s',
          opacity: 1,
        }}>
          <button onClick={() => setShowFullImg(null)} style={{
            position: 'fixed', top: 24, right: 32, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100000
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={showFullImg} alt="Evidencia ampliada" style={{
            maxWidth: '98vw', maxHeight: '98vh', borderRadius: 16, boxShadow: '0 4px 32px #0008',
            display: 'block',
            margin: 'auto',
            background: 'transparent',
          }} onClick={e => e.stopPropagation()} />
        </div>
      )}
      <style>{`
        .asistencia-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        @media (max-width: 600px) {
          .asistencia-action-buttons button {
            width: 100%;
            font-size: 15px;
            padding: 12px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Asistencia;
