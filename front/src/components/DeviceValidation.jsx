import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/DeviceValidation.css';

const DeviceValidation = () => {
  const { user } = useAuth();
  const [pendingDevices, setPendingDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [rfidCode, setRfidCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar dispositivos pendientes
  useEffect(() => {
    const fetchPendingDevices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/dispositivos/pendientes');
        setPendingDevices(response.data);
      } catch (err) {
        setError('Error al cargar dispositivos pendientes');
      }
    };
    fetchPendingDevices();
  }, []);

  // Simular la lectura del RFID (esto se reemplazará con la integración real del lector)
  const handleRfidRead = (e) => {
    setRfidCode(e.target.value);
  };

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    setRfidCode('');
    setMessage('');
    setError('');
  };

  const handleValidate = async () => {
    if (!selectedDevice || !rfidCode) {
      setError('Por favor, selecciona un dispositivo y escanea una tarjeta RFID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:3000/api/dispositivos/${selectedDevice.id}/validar`, {
        rfid: rfidCode,
        validadorId: user.id
      });

      setMessage('Dispositivo validado exitosamente');
      // Actualizar la lista de dispositivos pendientes
      setPendingDevices(prev => prev.filter(d => d.id !== selectedDevice.id));
      setSelectedDevice(null);
      setRfidCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al validar el dispositivo');
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.rol !== 'administrador' && user.rol !== 'validador')) {
    return <div className="validation-error">No tienes permisos para acceder a esta sección</div>;
  }

  return (
    <div className="device-validation">
      <h2>Validación de Dispositivos</h2>
      
      <div className="validation-container">
        <div className="pending-devices">
          <h3>Dispositivos Pendientes</h3>
          {pendingDevices.length > 0 ? (
            <div className="devices-list">
              {pendingDevices.map(device => (
                <div 
                  key={device.id} 
                  className={`device-card ${selectedDevice?.id === device.id ? 'selected' : ''}`}
                  onClick={() => handleDeviceSelect(device)}
                >
                  <h4>{device.nombre}</h4>
                  <p><strong>Tipo:</strong> {device.tipo}</p>
                  <p><strong>Marca:</strong> {device.marca}</p>
                  <p><strong>Modelo:</strong> {device.modelo}</p>
                  <p><strong>Número de Serie:</strong> {device.numeroSerie}</p>
                  <p><strong>Propietario:</strong> {device.usuario?.nombre || 'No disponible'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay dispositivos pendientes de validación</p>
          )}
        </div>

        <div className="validation-form">
          <h3>Asignar RFID</h3>
          {selectedDevice ? (
            <>
              <div className="selected-device">
                <h4>Dispositivo Seleccionado:</h4>
                <p><strong>Nombre:</strong> {selectedDevice.nombre}</p>
                <p><strong>Tipo:</strong> {selectedDevice.tipo}</p>
                <p><strong>Marca:</strong> {selectedDevice.marca}</p>
                <p><strong>Modelo:</strong> {selectedDevice.modelo}</p>
              </div>

              <div className="rfid-input">
                <label htmlFor="rfid">Código RFID:</label>
                <input
                  type="text"
                  id="rfid"
                  value={rfidCode}
                  onChange={handleRfidRead}
                  placeholder="Escanea la tarjeta RFID"
                  autoFocus
                />
              </div>

              <button 
                className="validate-button"
                onClick={handleValidate}
                disabled={loading || !rfidCode}
              >
                {loading ? 'Validando...' : 'Validar Dispositivo'}
              </button>
            </>
          ) : (
            <p className="select-device-message">
              Selecciona un dispositivo de la lista para asignar RFID
            </p>
          )}
        </div>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DeviceValidation; 