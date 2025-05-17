import React, { useEffect, useState } from 'react';
import './History.css';
import { FaHistory } from 'react-icons/fa';

const History = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/historiales');
        if (!response.ok) {
          throw new Error('Error al cargar el historial');
        }
        const data = await response.json();
        setHistorial(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  return (
    <div className="history-bg">
      <div className="history-header-row">
        <h1 style={{ paddingTop: '10px' }}>Historial de Accesos</h1>
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
                      <span className={`history-badge ${tipo === 'ENTRADA' ? 'badge-success' : tipo === 'SALIDA' ? 'badge-danger' : 'badge-default'}`}>
                        {tipo}
                      </span>
                      <span>{resto.length > 0 ? ` - ${resto.join(' - ')}` : ''}</span>
                    </td>
                    <td>{registro.dispositivo_nombre}</td>
                    <td>{registro.dispositivo_serial}</td>
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