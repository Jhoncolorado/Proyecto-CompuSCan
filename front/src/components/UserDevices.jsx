import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/UserDevices.css';

const UserDevices = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    serial: '',
    fotos: [null, null, null]
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleShowForm = () => setShowForm(true);
  const handleHideForm = () => setShowForm(false);

  const canRegisterDevice = user && (user.rol === 'aprendiz' || user.rol === 'instructor');

  useEffect(() => {
    const fetchUserDevices = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/dispositivos/usuario/${user.id}`);
        setDevices(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error al cargar dispositivos:', err);
        setError('Error al cargar los dispositivos');
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchUserDevices();
    }
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value, files, dataset } = e.target;
    if (name === 'foto') {
      const idx = parseInt(dataset.idx, 10);
      const newFotos = [...form.fotos];
      newFotos[idx] = files[0];
      setForm({ ...form, fotos: newFotos });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      if (!form.nombre || !form.tipo || !form.serial) {
        setFormError('Todos los campos obligatorios deben estar completos');
        setFormLoading(false);
        return;
      }
      if (form.fotos.filter(f => !!f).length !== 3) {
        setFormError('Debes subir exactamente 3 fotos');
        setFormLoading(false);
        return;
      }
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const fotosBase64 = await Promise.all(form.fotos.map(f => toBase64(f)));
      await submitDevice(fotosBase64);
    } catch (err) {
      setFormError('Error al registrar el dispositivo');
      setFormLoading(false);
    }
  };

  const submitDevice = async (fotosBase64) => {
    try {
      await axios.post('http://localhost:3000/api/dispositivos', {
        nombre: form.nombre,
        tipo: form.tipo,
        serial: form.serial,
        fotos: fotosBase64,
        id_usuario: user.id
      });
      setShowForm(false);
      setForm({ nombre: '', tipo: '', serial: '', fotos: [null, null, null] });
      setFormError('');
      setFormLoading(false);
      const response = await axios.get(`http://localhost:3000/api/dispositivos/usuario/${user.id}`);
      setDevices(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setFormError('Error al registrar el dispositivo');
      setFormLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando dispositivos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-devices">
      <div className="section-header">
        <h2>Mis Dispositivos</h2>
        {canRegisterDevice && devices.length === 0 && (
          <button className="add-device-button" onClick={handleShowForm}>
            Registrar Dispositivo
          </button>
        )}
      </div>

      {showForm && (
        <div className="add-device-form-modal">
          <form className="add-device-form" onSubmit={handleFormSubmit}>
            <h3>Registrar Dispositivo</h3>
            {formError && <div className="error">{formError}</div>}
            <div className="form-group">
              <label>Nombre del dispositivo:</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label>Tipo:</label>
              <select name="tipo" value={form.tipo} onChange={handleFormChange} required>
                <option value="">Seleccione tipo</option>
                <option value="laptop">Laptop</option>
                <option value="tablet">Tablet</option>
                <option value="camera">Cámara</option>
                <option value="monitor">Monitor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Serial:</label>
              <input type="text" name="serial" value={form.serial} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label>Fotos (3 obligatorias):</label>
              {[0, 1, 2].map(idx => (
                <input
                  key={idx}
                  type="file"
                  name="foto"
                  data-idx={idx}
                  accept="image/*"
                  onChange={handleFormChange}
                  required
                />
              ))}
            </div>
            <div className="form-actions">
              <button type="submit" className="add-device-button" disabled={formLoading}>
                {formLoading ? 'Registrando...' : 'Guardar'}
              </button>
              <button type="button" className="add-device-button" onClick={handleHideForm} disabled={formLoading}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {devices && devices.length > 0 ? (
        <div className="devices-list">
          {devices.map(device => (
            <div key={device.id} className="device-card">
              <h3>{device.nombre}</h3>
              <p><strong>Tipo:</strong> {device.tipo}</p>
              <p><strong>Serial:</strong> {device.serial}</p>
              <p><strong>Estado:</strong> {device.estado_validacion || 'Pendiente'}</p>
              {device.rfid ? (
                <p><strong>RFID:</strong> {device.rfid}</p>
              ) : device.estado_validacion === 'aprobado' && (
                <p className="pending-rfid">Esperando asignación de RFID</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-devices">
          <p>No tienes dispositivos registrados</p>
          {canRegisterDevice && (
            <button className="add-device-button" onClick={handleShowForm}>
              Registrar Dispositivo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDevices; 