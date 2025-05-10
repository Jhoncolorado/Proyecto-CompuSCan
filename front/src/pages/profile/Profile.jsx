import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import UserDevices from '../../components/UserDevices';
import '../../styles/profile.css';

const Profile = () => {
  const { user, updateUserInContext } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '', correo: '', documento: '', tipo_documento: '', telefono1: '', telefono2: '', rh: '', ficha: '', observacion: '', foto: '', rol: '', fecha_registro: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [deviceImage, setDeviceImage] = useState('');

  // Verificar si el usuario es aprendiz o instructor
  const isNormalUser = user && (user.rol === 'aprendiz' || user.rol === 'instructor');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/usuarios/${user.id}`);
        const fullUser = response.data;
        setFormData({
          nombre: fullUser.nombre || '',
          correo: fullUser.correo || '',
          documento: fullUser.documento || '',
          tipo_documento: fullUser.tipo_documento || '',
          telefono1: fullUser.telefono1 || '',
          telefono2: fullUser.telefono2 || '',
          rh: fullUser.rh || '',
          ficha: fullUser.ficha || '',
          observacion: fullUser.observacion || '',
          foto: fullUser.foto || '',
          rol: fullUser.rol || '',
          fecha_registro: fullUser.fecha_registro || ''
        });
        setAvatarPreview(fullUser.foto || '');
        // Obtener el primer dispositivo y su foto
        const devRes = await axios.get(`http://localhost:3000/api/dispositivos/usuario/${user.id}`);
        if (Array.isArray(devRes.data) && devRes.data.length > 0 && devRes.data[0].foto) {
          setDeviceImage(devRes.data[0].foto);
        } else {
          setDeviceImage('');
        }
      } catch (err) {
        setError('Error al cargar datos del perfil');
      }
    };
    if (user && user.id) fetchUser();
  }, [user]);

  // Permitir editar si es admin o validador (cualquier variante, sin tildes ni mayúsculas)
  const normalizeRol = (rol) =>
    (rol || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const canEdit = user && ['admin', 'administrador', 'validador'].includes(normalizeRol(user.rol));
  // Solo el usuario puede cambiar su foto
  const canChangeAvatar = user && (user.rol === 'aprendiz' || user.rol === 'instructor');

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setAvatarPreview(base64);
        setLoading(true);
        try {
          await axios.put(`http://localhost:3000/api/usuarios/${user.id}`, { ...formData, foto: base64 }, { headers: { 'Content-Type': 'application/json' } });
          const refreshed = await axios.get(`http://localhost:3000/api/usuarios/${user.id}`);
          if (typeof updateUserInContext === 'function') updateUserInContext(refreshed.data);
          setMessage('Avatar actualizado');
        } catch (err) {
          setError('Error al actualizar avatar');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => { setEditMode(false); setMessage(''); setError(''); };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(''); setError(''); setLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/usuarios/${user.id}`, formData, { headers: { 'Content-Type': 'application/json' } });
      setEditMode(false);
      setMessage('Perfil actualizado');
      const refreshed = await axios.get(`http://localhost:3000/api/usuarios/${user.id}`);
      if (typeof updateUserInContext === 'function') updateUserInContext(refreshed.data);
    } catch (err) {
      setError('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      {error && <div className="profile-error">{error}</div>}
      {message && <div className="profile-success">{message}</div>}
      <div className="profile-card">
        <div className="profile-avatar-container">
          <img className="profile-avatar" src={avatarPreview || '/default-avatar.png'} alt="avatar" />
          {canChangeAvatar && (
            <label className="btn-avatar-upload" style={{ marginTop: '1rem', cursor: 'pointer' }}>
              <span>Subir imagen</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} disabled={loading} />
            </label>
          )}
          {deviceImage && (
            <div style={{ marginTop: 20 }}>
              <span style={{ display: 'block', fontWeight: 500, color: '#1976d2', marginBottom: 6 }}>Equipo principal:</span>
              <img src={deviceImage} alt="Equipo principal" style={{ width: 120, height: 90, borderRadius: 10, objectFit: 'cover', border: '2px solid #2196f3' }} />
            </div>
          )}
        </div>
        <form onSubmit={handleSave} className="profile-info">
          <div className="profile-field">
            <span className="profile-label">Nombre:</span>
            {canEdit && editMode ? (
              <input className="profile-input" type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
            ) : (
              <span className="profile-value">{formData.nombre || '-'}</span>
            )}
          </div>
          <div className="profile-field">
            <span className="profile-label">Correo:</span>
            {canEdit && editMode ? (
              <input className="profile-input" type="email" name="correo" value={formData.correo} onChange={handleChange} />
            ) : (
              <span className="profile-value">{formData.correo || '-'}</span>
            )}
          </div>
          <div className="profile-field">
            <span className="profile-label">Documento:</span>
            <span className="profile-value">{formData.documento || '-'}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Tipo de documento:</span>
            <span className="profile-value">{formData.tipo_documento || '-'}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Teléfono principal:</span>
            {canEdit && editMode ? (
              <input className="profile-input" type="text" name="telefono1" value={formData.telefono1} onChange={handleChange} />
            ) : (
              <span className="profile-value">{formData.telefono1 || '-'}</span>
            )}
          </div>
          <div className="profile-field">
            <span className="profile-label">Teléfono secundario:</span>
            {canEdit && editMode ? (
              <input className="profile-input" type="text" name="telefono2" value={formData.telefono2} onChange={handleChange} />
            ) : (
              <span className="profile-value">{formData.telefono2 || '-'}</span>
            )}
          </div>
          <div className="profile-field">
            <span className="profile-label">RH:</span>
            {canEdit && editMode ? (
              <input className="profile-input" type="text" name="rh" value={formData.rh} onChange={handleChange} />
            ) : (
              <span className="profile-value">{formData.rh || '-'}</span>
            )}
          </div>
          <div className="profile-field">
            <span className="profile-label">Ficha:</span>
            {canEdit && editMode ? (
              <input className="profile-input" type="text" name="ficha" value={formData.ficha} onChange={handleChange} />
            ) : (
              <span className="profile-value">{formData.ficha || '-'}</span>
            )}
          </div>
          <div className="profile-field">
            <span className="profile-label">Observación:</span>
            {canEdit && editMode ? (
              <textarea className="profile-input" name="observacion" value={formData.observacion} onChange={handleChange} />
            ) : (
              <span className="profile-value">{formData.observacion || '-'}</span>
            )}
          </div>
          <div className="profile-field">
            <span className="profile-label">Rol:</span>
            <span className="profile-value profile-role">{formData.rol || '-'}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Fecha de registro:</span>
            <span className="profile-value">{formData.fecha_registro ? new Date(formData.fecha_registro).toLocaleDateString() : '-'}</span>
          </div>
          <div className="profile-actions">
            <button className="btn btn-success" type="button">Cambiar Contraseña</button>
            {canEdit && !editMode && (
              <button className="btn btn-primary" type="button" onClick={handleEdit}>Editar</button>
            )}
            {canEdit && editMode && (
              <>
                <button className="btn btn-primary" type="submit" disabled={loading}>Guardar</button>
                <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancelar</button>
              </>
            )}
          </div>
        </form>
      </div>
      
      {/* Solo mostrar UserDevices si es un usuario normal */}
      {isNormalUser && <UserDevices />}
    </div>
  );
};

export default Profile; 