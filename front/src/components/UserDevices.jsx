import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/UserDevices.css';

const UserDevices = ({ userId: propUserId, isAdminView, onClose }) => {
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
    fotos: [null, null, null], // [frontal, trasera, cerrado]
    mimeTypes: ['', '', '']
  });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleShowForm = () => {
    setShowForm(true);
    setEditId(null);
    setForm({ nombre: '', tipo: '', serial: '', fotos: [null, null, null], mimeTypes: ['', '', ''] });
  };
  const handleHideForm = () => {
    if (onClose) {
      onClose();
    } else {
    setShowForm(false);
    setEditId(null);
    setForm({ nombre: '', tipo: '', serial: '', fotos: [null, null, null], mimeTypes: ['', '', ''] });
    }
  };

  const canRegisterDevice = user && (user.rol === 'aprendiz' || user.rol === 'instructor');
  const canEditDevice = (isAdminView === true) || (user && (user.rol === 'validador' || user.rol === 'admin'));

  useEffect(() => {
    const fetchUserDevices = async () => {
      try {
        const response = await api.get(`/api/dispositivos/usuario/${userId}`);
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
    if (name.startsWith('foto')) {
      const idx = parseInt(name.replace('foto', ''), 10);
      const file = files[0];
      const newFotos = [...form.fotos];
      const newMimeTypes = [...form.mimeTypes];
      newFotos[idx] = file;
      newMimeTypes[idx] = file ? file.type : '';
      setForm({ ...form, fotos: newFotos, mimeTypes: newMimeTypes });
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
      fotos: [null, null, null], // No precargamos las fotos, solo permitimos subir nuevas
      mimeTypes: ['', '', '']
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
      // Usar FormData para enviar imágenes
      const formData = new window.FormData();
      formData.append('nombre', form.nombre);
      formData.append('tipo', form.tipo);
      formData.append('serial', form.serial);
      formData.append('id_usuario', userId);
      form.fotos.forEach((file, idx) => {
        if (file) {
          formData.append('foto', file); // El nombre debe coincidir con el backend
        }
      });
      if (editId) {
        await api.put(`/api/dispositivos/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMessage('¡Dispositivo actualizado exitosamente!');
        setTimeout(() => {
          if (onClose) {
            onClose();
          } else {
            setShowForm(false);
            setEditId(null);
          }
          setSuccessMessage('');
        }, 1500);
      } else {
        await api.post('/api/dispositivos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccessMessage('¡Dispositivo registrado exitosamente!');
        setTimeout(() => {
          if (onClose) {
            onClose();
          } else {
            setShowForm(false);
          }
          setSuccessMessage('');
        }, 1500);
      }
      setForm({ nombre: '', tipo: '', serial: '', fotos: [null, null, null], mimeTypes: ['', '', ''] });
      setFormError('');
      setFormLoading(false);
      // Recargar dispositivos
      const response = await api.get(`/api/dispositivos/usuario/${userId}`);
      setDevices(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setFormError('Error al guardar los cambios');
      setFormLoading(false);
    }
  };

  if (loading && !onClose) return <div className="loading">Cargando dispositivos...</div>;
  if (error && !onClose) return <div className="error">{error}</div>;

  // Si se llama desde la página de dispositivos, solo mostrar el formulario
  if (onClose) {
    return (
      <div className="add-device-form-modal">
        <form className="add-device-form" onSubmit={handleFormSubmit}>
          <h3>Registrar Dispositivo</h3>
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
          <div className="form-group">
            <label>Foto Frontal:</label>
            <input type="file" name="foto0" accept="image/*" onChange={handleFormChange} />
          </div>
          <div className="form-group">
            <label>Foto Trasera:</label>
            <input type="file" name="foto1" accept="image/*" onChange={handleFormChange} />
          </div>
          <div className="form-group">
            <label>Foto Cerrado:</label>
            <input type="file" name="foto2" accept="image/*" onChange={handleFormChange} />
          </div>
          <div className="form-actions inline-buttons">
            <button type="submit" className="add-device-button" disabled={formLoading}>
              {formLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="add-device-button" onClick={handleHideForm} disabled={formLoading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="user-devices">
      <div className="section-header">
        <h2>Mis Dispositivos</h2>
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
            <div className="form-group">
              <label>Foto Frontal:</label>
              <input type="file" name="foto0" accept="image/*" onChange={handleFormChange} />
            </div>
            <div className="form-group">
              <label>Foto Trasera:</label>
              <input type="file" name="foto1" accept="image/*" onChange={handleFormChange} />
            </div>
            <div className="form-group">
              <label>Foto Cerrado:</label>
              <input type="file" name="foto2" accept="image/*" onChange={handleFormChange} />
            </div>
            {editId && devices && devices.length > 0 && (
              <div className="form-group">
                <label>Imágenes actuales:</label>
                {devices.find(d => d.id === editId)?.foto && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(() => {
                      let fotos = [];
                      try {
                        fotos = Array.isArray(devices.find(d => d.id === editId).foto) ? devices.find(d => d.id === editId).foto : JSON.parse(devices.find(d => d.id === editId).foto);
                      } catch {
                        fotos = [devices.find(d => d.id === editId).foto];
                      }
                      return [0,1,2].map(idx => (
                        <div key={idx} style={{ textAlign: 'center' }}>
                          {fotos[idx] ? (
                            <img
                              src={`http://localhost:3000/uploads/${fotos[idx]}`}
                              alt={`Foto ${idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}`}
                              className="device-card-img"
                              style={{ width: 80, height: 60, borderRadius: 8, objectFit: 'cover', border: '2px solid #2196f3', marginBottom: 4 }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzk5OTk5OSI+U2luIGltYWdlbjwvdGV4dD48L3N2Zz4=";
                              }}
                            />
                          ) : (
                            <div style={{ width: 80, height: 60, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #2196f3', marginBottom: 4, color: '#888', fontSize: 13 }}>
                              Sin imagen
                            </div>
                          )}
                          <div style={{ fontSize: 11, color: '#388e3c', fontWeight: 700 }}>
                            {idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            )}
            <div className="form-actions inline-buttons">
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

      {!showForm && devices && devices.length > 0 ? (
        <div className="devices-list">
          {devices.map(device => (
            <div key={device.id} className="device-card">
              <h3>{device.nombre}</h3>
              {device.foto && Array.isArray(device.foto) && device.foto.length > 0 ? (
                <div className="device-image-container" style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                  {device.foto.map((img, idx) => (
                    img ? (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <img
                          src={`http://localhost:3000/uploads/${img}`}
                          alt={`Foto ${idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}`}
                          className="device-card-img"
                          style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', border: '2px solid #2196f3', marginBottom: 4 }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzk5OTk5OSI+U2luIGltYWdlbjwvdGV4dD48L3N2Zz4=";
                          }}
                        />
                        <div style={{ fontSize: 11, color: '#388e3c', fontWeight: 700 }}>
                          {idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              ) : null}
              <div className="device-info-row">
                <span className="device-info-label">Tipo:</span>
                <span className="device-info-value">{device.tipo}</span>
              </div>
              <div className="device-info-row">
                <span className="device-info-label">Serial:</span>
                <span className="device-info-value">{device.serial}</span>
              </div>
              <div className="device-info-row">
                <span className="device-info-label">Estado:</span>
                <span className="device-info-value">{device.estado_validacion || 'Pendiente'}</span>
              </div>
              <div className="device-info-row">
                <span className="device-info-label">RFID:</span>
                <span className="device-info-value">{device.rfid || '—'}</span>
              </div>
              {canEditDevice && (
                <button className="edit-device-button" onClick={() => handleEdit(device)}>
                  Editar
                </button>
              )}
            </div>
          ))}
        </div>
      ) : null}
      {!showForm && (!devices || devices.length === 0) && (
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