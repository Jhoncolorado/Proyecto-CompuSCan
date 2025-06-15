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
    <div className="user-devices" style={isAdminView || !onClose ? { background: 'none', boxShadow: 'none', borderRadius: 0, padding: 0 } : {}}>
      {showForm && (
        <form className="add-device-form" onSubmit={handleFormSubmit} style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: window.innerWidth >= 700 ? '1fr 1fr' : '1fr',
          gap: 18,
          maxWidth: 640,
          margin: '0 auto',
          overflow: 'visible',
          maxHeight: 'none',
          height: 'auto',
        }}>
          <h3 style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 800, marginBottom: 18, gridColumn: '1 / -1' }}>{editId ? 'Editar Dispositivo' : 'Registrar Dispositivo'}</h3>
          {formError && <div className="error" style={{ gridColumn: '1 / -1' }}>{formError}</div>}
          {successMessage && <div className="success" style={{ gridColumn: '1 / -1' }}>{successMessage}</div>}
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
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Imágenes actuales:</label>
              {devices.find(d => d.id === editId)?.foto && (
                <div style={{ display: 'flex', flexDirection: 'row', gap: 24, justifyContent: 'center', alignItems: 'flex-start', marginTop: 8 }}>
                  {(() => {
                    let fotos = [];
                    try {
                      fotos = Array.isArray(devices.find(d => d.id === editId).foto) ? devices.find(d => d.id === editId).foto : JSON.parse(devices.find(d => d.id === editId).foto);
                    } catch {
                      fotos = [devices.find(d => d.id === editId).foto];
                    }
                    while (fotos.length < 3) fotos.push(null);
                    return [0,1,2].map(idx => (
                      <div key={idx} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 90 }}>
                        {fotos[idx] ? (
                          <img
                            src={`http://localhost:3000/uploads/${fotos[idx]}`}
                            alt={`Foto ${idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}`}
                            style={{ width: 80, height: 60, borderRadius: 8, objectFit: 'cover', border: '2px solid #2196f3', marginBottom: 4 }}
                          />
                        ) : (
                          <div style={{ width: 80, height: 60, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #2196f3', marginBottom: 4, color: '#888', fontSize: 13 }}>
                            Sin imagen
                          </div>
                        )}
                        <div style={{ fontSize: 13, color: '#388e3c', fontWeight: 700, marginTop: 2 }}>
                          {idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          )}
          <div className="form-actions inline-buttons" style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 18, gridColumn: '1 / -1' }}>
            <button type="submit" className="add-device-button" disabled={formLoading}>
              {formLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="add-device-button" onClick={handleHideForm} disabled={formLoading}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {!showForm && devices && devices.length > 0 ? (
        <div className="devices-list" style={{ overflow: 'visible', maxHeight: 'none', height: 'auto' }}>
          {devices.map(device => (
            <div key={device.id} className="device-card" style={{ overflow: 'visible', maxWidth: 520, padding: '18px 18px 16px 18px', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 24, marginTop: 0 }}>
              {/* Columna de imágenes */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                {device.foto && Array.isArray(device.foto) && device.foto.length > 0 ? (
                  device.foto.map((img, idx) => (
                    img ? (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <img
                          src={`http://localhost:3000/uploads/${img}`}
                          alt={`Foto ${idx === 0 ? 'Frontal' : idx === 1 ? 'Trasera' : 'Cerrado'}`}
                          className="device-card-img"
                          style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', border: '2px solid #2196f3', marginBottom: 2 }}
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
                  ))
                ) : null}
              </div>
              {/* Columna de datos */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 6 }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 8, marginTop: 0 }}>{device.nombre}</h3>
                <div className="device-info-row"><span className="device-info-label">Tipo:</span> <span className="device-info-value">{device.tipo}</span></div>
                <div className="device-info-row"><span className="device-info-label">Serial:</span> <span className="device-info-value">{device.serial}</span></div>
                <div className="device-info-row"><span className="device-info-label">Estado:</span> <span className="device-info-value">{device.estado_validacion || 'Pendiente'}</span></div>
                <div className="device-info-row"><span className="device-info-label">RFID:</span> <span className="device-info-value">{device.rfid || '—'}</span></div>
                {canEditDevice && (
                  <button className="edit-device-button" onClick={() => handleEdit(device)}>
                    Editar
                  </button>
                )}
              </div>
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