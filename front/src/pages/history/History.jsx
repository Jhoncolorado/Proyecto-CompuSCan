import React, { useEffect, useState } from 'react';
import './History.css';

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

  if (loading) {
    return (
      <div className="history-bg" style={{ background: '#f7f9fb', minHeight: '100vh', width: '100vw', margin: 0, padding: 0, overflowX: 'hidden' }}>
        <div className="history-panel" style={{ background: '#fff', borderRadius: 0, boxShadow: '0 8px 32px rgba(44, 62, 80, 0.12)', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="history-table-container" style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0, overflowX: 'auto' }}>
            <div className="history-header-row" style={{ marginTop: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1.2rem', flexWrap: 'wrap', minWidth: 900 }}>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1b5e20', margin: 0, letterSpacing: 1, textAlign: 'left', lineHeight: 1.1, flex: '0 0 auto' }}>
                Historial de Accesos
              </h1>
            </div>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando historial...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-bg" style={{ background: '#f7f9fb', minHeight: '100vh', width: '100vw', margin: 0, padding: 0, overflowX: 'hidden' }}>
      <div className="history-panel" style={{ background: '#fff', borderRadius: 0, boxShadow: '0 8px 32px rgba(44, 62, 80, 0.12)', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div className="history-table-container" style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0, overflowX: 'auto' }}>
          <div className="history-header-row" style={{ marginTop: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1.2rem', flexWrap: 'wrap', minWidth: 900 }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1b5e20', margin: 0, letterSpacing: 1, textAlign: 'left', lineHeight: 1.1, flex: '0 0 auto' }}>
              Historial de Accesos
            </h1>
          </div>
          {error ? (
            <div className="history-error">
              <span>{error}</span>
            </div>
          ) : historial.length === 0 ? (
            <div className="history-info">
              No hay registros en el historial.
            </div>
          ) : (
            <table className="history-table" style={{ fontSize: '0.93rem', width: '100%', minWidth: 900, borderRadius: 12, tableLayout: 'auto' }}>
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
                        <span style={{
                          color: tipo === 'ENTRADA' ? 'green' : tipo === 'SALIDA' ? 'red' : '#333',
                          fontWeight: 'bold',
                          marginRight: 8
                        }}>{tipo}</span>
                        <span> - {resto.join(' - ')}</span>
                      </td>
                      <td>{registro.dispositivo_nombre}</td>
                      <td>{registro.dispositivo_serial}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default History; 