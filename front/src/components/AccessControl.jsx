import React, { useRef, useState } from 'react';
import api from '../services/api';
import QRCode from 'react-qr-code';

const AccessControl = () => {
  const [rfid, setRfid] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Mantener el input enfocado siempre
  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    // Asegura el foco en cualquier click
    const focusInput = () => {
      if (inputRef.current) inputRef.current.focus();
    };
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, [data, error]);

  const handleChange = (e) => {
    setRfid(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rfid) return;
    try {
      const res = await api.post('/api/dispositivos/acceso-rfid', { rfid });
      setData(res.data);
      console.log('Respuesta del backend:', res.data);
      setError('');
    } catch (err) {
      setData(null);
      setError('No se encontró un usuario o equipo con ese RFID');
    } finally {
      setRfid('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="access-bg access-bg-full">
      <h1 className="acceso-titulo">registro de entrada/salida</h1>
      <form className="access-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={rfid}
          onChange={handleChange}
          placeholder="Pase la tarjeta RFID..."
          className="rfid-invisible-input"
          autoFocus
        />
        <button type="submit" style={{ display: 'none' }}>Buscar</button>
      </form>
      {error && <div style={{ color: 'red', margin: 10 }}>{error}</div>}
      {data && data.usuario && data.dispositivo && (
        <div className="carnet-separado-wrapper">
          <div className="carnet-tarjeta carnet-aprendiz">
            <div className="carnet-fisico-header">
              <div className="carnet-fisico-logo-aprendiz">
                <img src="/images.png" alt="Logo SENA" className="carnet-fisico-logo" />
                <div className="carnet-fisico-aprendiz" style={{ color: '#2e7d32' }}>APRENDIZ</div>
              </div>
              <div className="carnet-fisico-foto">
                <img
                  src={data.usuario.foto || '/images/default-avatar.png'}
                  alt="Foto usuario"
                  className="carnet-fisico-foto-img"
                />
              </div>
            </div>
            <div className="carnet-fisico-divider" style={{ background: '#2e7d32' }}></div>
            <div className="carnet-fisico-info">
              <div className="carnet-fisico-nombre" style={{ color: '#2e7d32' }}>{data.usuario.nombre}</div>
              <div className="carnet-fisico-dato"><b>C.C:</b> {data.usuario.documento} &nbsp; <b>RH:</b> {data.usuario.rh || '-'}</div>
              <div className="carnet-fisico-dato">Regional Quindío</div>
              <div className="carnet-fisico-dato" style={{ color: '#2e7d32', fontWeight: 'bold' }}>{data.nombrePrograma || 'Programa de formación no registrado'}</div>
              <div className="carnet-fisico-dato">Grupo No. {data.usuario.ficha}</div>
              <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <QRCode
                  value={`http://localhost:5173/usuario/${data.usuario.documento}`}
                  size={140}
                  bgColor="#fff"
                  fgColor="#2e7d32"
                  level="H"
                  style={{ background: '#fff', padding: 8, borderRadius: 8 }}
                />
              </div>
            </div>
          </div>
          <div className="carnet-tarjeta carnet-equipo">
            <div className="carnet-fisico-header">
              <div className="carnet-tarjeta-fotos-row" style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                {[0, 1, 2].map(idx => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    {Array.isArray(data.dispositivo.foto) && data.dispositivo.foto[idx] ? (
                      <img
                        src={`http://localhost:3000/uploads/${data.dispositivo.foto[idx]}`}
                        alt={['Frontal', 'Trasera', 'Cerrado'][idx]}
                        style={{
                          width: 90,
                          height: 120,
                          borderRadius: 10,
                          objectFit: 'cover',
                          border: '2.5px solid #2196f3',
                          background: '#fff',
                          marginBottom: 2
                        }}
                        onError={e => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MCIgaGVpZ2h0PSI1NCI+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjU0IiBmaWxsPSIjZTBkZWUwIi8+PHRleHQgeD0iMzUiIHk9IjI3IiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5TaW48L3RleHQ+PC9zdmc+"; }}
                      />
                    ) : (
                      <div style={{
                        width: 90,
                        height: 120,
                        background: '#eee',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2.5px solid #2196f3',
                        marginBottom: 2,
                        color: '#888',
                        fontSize: 13
                      }}>
                        Sin imagen
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: '#388e3c', fontWeight: 700, marginTop: 2 }}>
                      {['Frontal', 'Trasera', 'Cerrado'][idx]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="carnet-fisico-divider" style={{ background: '#2e7d32' }}></div>
            <div className="carnet-fisico-info">
              <div><b>Equipo:</b> {data.dispositivo.nombre}</div>
              <div><b>Tipo:</b> {data.dispositivo.tipo}</div>
              <div><b>Serial:</b> {data.dispositivo.serial}</div>
              <div><b>Estado:</b> <span className={`badge-estado ${data.dispositivo.estado_validacion?.toLowerCase()}`}>{data.dispositivo.estado_validacion || 'Pendiente'}</span></div>
              <div><b>RFID:</b> {data.dispositivo.rfid}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl; 