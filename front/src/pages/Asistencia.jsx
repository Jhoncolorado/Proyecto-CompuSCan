import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const motivosJustificacion = [
  'Incapacidad',
  'Permiso',
  'Calamidad',
  'Otro',
];

const Asistencia = () => {
  const { user } = useAuth();
  const [aprendices, setAprendices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [asistencias, setAsistencias] = useState({});
  const [feedback, setFeedback] = useState({});
  const [idFicha, setIdFicha] = useState(null);
  const [editando, setEditando] = useState({});
  const [showJustificar, setShowJustificar] = useState(false);
  const [justificandoId, setJustificandoId] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [observacion, setObservacion] = useState('');
  const [verMotivo, setVerMotivo] = useState({ open: false, observacion: '' });

  useEffect(() => {
    const fetchAprendices = async () => {
      try {
        setLoading(true);
        setError('');
        if (!user?.id) throw new Error('No se encontró el usuario instructor');
        const res = await api.get(`/api/asistencia/aprendices/${user.id}`);
        let data = res.data;
        if (Array.isArray(data)) {
          setAprendices(data);
        } else if (Array.isArray(data?.data)) {
          setAprendices(data.data);
        } else {
          setAprendices([]);
        }
        if (data && data.length > 0) {
          setIdFicha(data[0].id_ficha);
        }
      } catch (err) {
        setError('Error al cargar aprendices: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAprendices();
  }, [user]);

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

  const marcarAsistencia = async (aprendiz, nuevoEstado) => {
    const hoy = new Date();
    const fecha = hoy.toISOString().slice(0, 10); // yyyy-mm-dd
    setFeedback(f => ({ ...f, [aprendiz.id]: '' }));
    try {
      await api.post('/api/asistencia', {
        id_usuario: aprendiz.id,
        id_ficha: aprendiz.id_ficha,
        fecha,
        estado: nuevoEstado,
        tipo: 'manual',
      });
      setAsistencias(prev => ({
        ...prev,
        [aprendiz.id]: {
          ...prev[aprendiz.id],
          estado: nuevoEstado,
        },
      }));
      setFeedback(f => ({ ...f, [aprendiz.id]: '¡Asistencia actualizada!' }));
      setEditando(e => ({ ...e, [aprendiz.id]: false }));
    } catch (err) {
      setFeedback(f => ({ ...f, [aprendiz.id]: 'Error al registrar asistencia' }));
    }
  };

  const handleEditar = (id) => {
    setEditando(e => ({ ...e, [id]: true }));
  };

  const handleCancelar = (id) => {
    setEditando(e => ({ ...e, [id]: false }));
    setFeedback(f => ({ ...f, [id]: '' }));
  };

  const justificarAsistencia = async (aprendiz) => {
    setJustificandoId(aprendiz.id);
    setMotivo('');
    setObservacion('');
    setShowJustificar(true);
  };

  const handleGuardarJustificacion = async (e) => {
    e.preventDefault();
    if (!motivo) return;
    const hoy = new Date();
    const fecha = hoy.toISOString().slice(0, 10);
    const textoObservacion = observacion
      ? `Motivo: ${motivo}. Observación: ${observacion}`
      : `Motivo: ${motivo}`;
    try {
      await api.post('/api/asistencia', {
        id_usuario: justificandoId,
        id_ficha: idFicha,
        fecha,
        estado: 'justificado',
        tipo: 'manual',
        observacion: textoObservacion,
      });
      setAsistencias(prev => ({
        ...prev,
        [justificandoId]: {
          ...prev[justificandoId],
          estado: 'justificado',
          observacion: textoObservacion,
        },
      }));
      setShowJustificar(false);
      setJustificandoId(null);
      setMotivo('');
      setObservacion('');
    } catch (err) {
      alert('Error al justificar asistencia');
    }
  };

  const handleVerMotivo = (asistencia) => {
    setVerMotivo({ open: true, observacion: asistencia.observacion });
  };

  const handleCerrarVerMotivo = () => {
    setVerMotivo({ open: false, observacion: '' });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Asistencia</h2>
      {loading ? (
        <p>Cargando aprendices...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nombre</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Documento</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Ficha</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Estado</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {aprendices.map(aprendiz => {
              const asistencia = asistencias[aprendiz.id];
              const enEdicion = editando[aprendiz.id];
              const estado = asistencia?.estado;
              return (
                <tr key={aprendiz.id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{aprendiz.nombre}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{aprendiz.documento}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{aprendiz.id_ficha}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {estado === 'presente' && <span style={{ color: '#43a047', fontWeight: 600 }}>Presente</span>}
                    {estado === 'ausente' && <span style={{ color: '#d32f2f', fontWeight: 600 }}>Ausente</span>}
                    {estado === 'justificado' && <span style={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleVerMotivo(asistencia)}>Justificado</span>}
                    {!estado && <span style={{ color: '#888' }}>Sin marcar</span>}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {(!estado || estado === 'ausente') ? (
                      <>
                        <button
                          style={{
                            background: '#43a047',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            marginRight: 8,
                            cursor: 'pointer',
                          }}
                          onClick={() => marcarAsistencia(aprendiz, 'presente')}
                        >
                          Marcar Presente
                        </button>
                        <button
                          style={{
                            background: '#d32f2f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            marginRight: 8,
                            cursor: 'pointer',
                          }}
                          onClick={() => marcarAsistencia(aprendiz, 'ausente')}
                        >
                          Marcar Ausente
                        </button>
                        <button
                          style={{
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                          }}
                          onClick={() => justificarAsistencia(aprendiz)}
                        >
                          Justificar
                        </button>
                      </>
                    ) : estado === 'justificado' ? (
                      <>
                        <button
                          style={{
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            marginRight: 8,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleVerMotivo(asistencia)}
                        >
                          Ver Motivo
                        </button>
                        <button
                          style={{
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleEditar(aprendiz.id)}
                        >
                          Editar
                        </button>
                      </>
                    ) : (
                      <button
                        style={{
                          background: '#1976d2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleEditar(aprendiz.id)}
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* Modal de justificación */}
      {showJustificar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleGuardarJustificacion} style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 4px 24px #0003' }}>
            <h3>Justificar Asistencia</h3>
            <label>Motivo:</label>
            <select value={motivo} onChange={e => setMotivo(e.target.value)} required style={{ width: '100%', marginBottom: 12 }}>
              <option value="">Selecciona motivo</option>
              {motivosJustificacion.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <label>Observación:</label>
            <textarea value={observacion} onChange={e => setObservacion(e.target.value)} style={{ width: '100%', minHeight: 60, marginBottom: 12 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setShowJustificar(false)} style={{ background: '#ccc', color: '#333', border: 'none', borderRadius: 4, padding: '6px 12px' }}>Cancelar</button>
              <button type="submit" style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px' }}>Guardar</button>
            </div>
          </form>
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
    </div>
  );
};

export default Asistencia; 