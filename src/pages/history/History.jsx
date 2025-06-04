import React, { useEffect, useState } from 'react';
import './History.css';
import { FaHistory, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const History = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/historiales?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Error al cargar el historial');
        const data = await response.json();
        setHistorial(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } catch (error) {
        setError(error.message);
        setHistorial([]);
        setTotalPages(1);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [page, limit]);

  // Función para generar el badge según el tipo de acceso
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

  return (
    <div className="history-bg">
      <div className="history-panel">
        <div className="history-header-row">
          <h1>Historial de Accesos</h1>
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
            <p>Los accesos de los dispositivos aparecerán aquí cuando se registren.</p>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
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
                      <td>{new Date(registro.fecha_hora).toLocaleString()}</td>
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

export default History;

// Historial personal del usuario
export const UserHistory = () => {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch('/api/historiales');
        if (!response.ok) {
          throw new Error('Error al cargar el historial');
        }
        const data = await response.json();
        // Filtrar solo los accesos del usuario logueado
        const userEvents = data.filter(ev => ev.descripcion && user && user.nombre && ev.descripcion.includes(user.nombre));
        setHistorial(userEvents);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [user]);

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
                  <th>Fecha y Hora</th>
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
                      <td>{new Date(registro.fecha_hora).toLocaleString()}</td>
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