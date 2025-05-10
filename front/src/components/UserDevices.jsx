import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/UserDevices.css';

const UserDevices = ({ userId: propUserId, isAdminView }) => {
  const { user } = useAuth();
  const userId = propUserId || (user && user.id);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    serial: '',
    foto: null
  });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleShowForm = () => {
    setShowForm(true);
    setEditId(null);
    setForm({ nombre: '', tipo: '', serial: '', foto: null });
  };
  const handleHideForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ nombre: '', tipo: '', serial: '', foto: null });
  };

  const canRegisterDevice = user && (user.rol === 'aprendiz' || user.rol === 'instructor');
  const canEditDevice = (isAdminView === true) || (user && (user.rol === 'validador' || user.rol === 'admin'));

  useEffect(() => {
    const fetchUserDevices = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/dispositivos/usuario/${userId}`);
        setDevices(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error al cargar dispositivos:', err);
        setError('Error al cargar los dispositivos');
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDevices();
    }
  }, [userId]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setForm({ ...form, foto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (device) => {
    setEditId(device.id);
    setShowForm(true);
    setForm({
      nombre: device.nombre || '',
      tipo: device.tipo || '',
      serial: device.serial || '',
      foto: null // No precargamos la foto, solo permitimos subir una nueva
    });
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
      let fotoBase64 = null;
      if (form.foto) {
        fotoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(form.foto);
        });
      }
      if (editId) {
        // Edición
        await axios.put(`http://localhost:3000/api/dispositivos/${editId}`, {
          nombre: form.nombre,
          tipo: form.tipo,
          serial: form.serial,
          foto: fotoBase64
        });
        setSuccessMessage('¡Dispositivo actualizado exitosamente!');
        setTimeout(() => {
          setShowForm(false);
          setEditId(null);
          setSuccessMessage('');
        }, 1500);
      } else {
        // Registro (lógica existente, no tocada)
        setFormError('Solo edición implementada aquí. Usa el registro normal para nuevos.');
        setFormLoading(false);
        return;
      }
      setForm({ nombre: '', tipo: '', serial: '', foto: null });
      setFormError('');
      setFormLoading(false);
      // Recargar dispositivos
      const response = await axios.get(`http://localhost:3000/api/dispositivos/usuario/${userId}`);
      setDevices(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setFormError('Error al guardar los cambios');
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
            <h3>{editId ? 'Editar Dispositivo' : 'Registrar Dispositivo'}</h3>
            {formError && <div className="error">{formError}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
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
            {editId && devices && devices.length > 0 && (
              <div className="form-group">
                <label>Imagen actual:</label>
                {devices.find(d => d.id === editId)?.foto ? (
                  <img
                    src={devices.find(d => d.id === editId).foto}
                    alt="Foto actual del equipo"
                    style={{ width: 120, height: 90, borderRadius: 10, objectFit: 'cover', border: '2px solid #2196f3', marginBottom: 10 }}
                  />
                ) : (
                  <span style={{ color: '#888' }}>(Sin imagen)</span>
                )}
              </div>
            )}
            <div className="form-group">
              <label>Foto (opcional, reemplaza la actual):</label>
              <input type="file" name="foto" accept="image/*" onChange={handleFormChange} />
            </div>
            <div className="form-actions">
              <button type="submit" className="add-device-button" disabled={formLoading}>
                {formLoading ? 'Guardando...' : 'Guardar'}
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
              {canEditDevice && (
                <button className="edit-device-button" onClick={() => handleEdit(device)}>
                  Editar
                </button>
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