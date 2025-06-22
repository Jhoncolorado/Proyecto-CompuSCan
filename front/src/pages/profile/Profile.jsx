import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import UserDevices from '../../components/UserDevices';
import '../../styles/profile.css';
import { changePassword } from '../../services/auth';

const Profile = () => {
  const { user, updateUserInContext } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '', correo: '', documento: '', tipo_documento: '', telefono1: '', telefono2: '', rh: '', ficha: '', observacion: '', foto: '', rol: '', fecha_registro: '', programa: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [deviceImage, setDeviceImage] = useState('');
  const [userDevices, setUserDevices] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ actual: '', nueva: '', confirmar: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Verificar si el usuario es aprendiz o instructor
  const isNormalUser = user && (user.rol === 'aprendiz' || user.rol === 'instructor');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/usuarios/${user.id}`);
        const fullUser = response.data;
        setFormData({
          nombre: fullUser.nombre || '',
          correo: fullUser.correo || '',
          documento: fullUser.documento || '',
          tipo_documento: fullUser.tipo_documento || '',
          telefono1: fullUser.telefono1 || '',
          telefono2: fullUser.telefono2 || '',
          rh: fullUser.rh || '',
          ficha: fullUser.ficha || fullUser.id_ficha || '',
          observacion: fullUser.observacion || '',
          foto: fullUser.foto || '',
          rol: fullUser.rol || '',
          fecha_registro: fullUser.fecha_registro || '',
          programa: fullUser.nombre_programa || fullUser.programa || fullUser.id_programa || '',
        });
        setAvatarPreview(fullUser.foto || '');
        // Obtener el primer dispositivo y su foto
        const devRes = await api.get(`/api/dispositivos/usuario/${user.id}`);
        if (Array.isArray(devRes.data) && devRes.data.length > 0) {
          setUserDevices(devRes.data);
          if (devRes.data[0].foto) {
            setDeviceImage(devRes.data[0].foto);
          } else {
            setDeviceImage('');
          }
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
          await api.put(`/api/usuarios/${user.id}`, { ...formData, foto: base64 }, { headers: { 'Content-Type': 'application/json' } });
          const refreshed = await api.get(`/api/usuarios/${user.id}`);
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
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await api.put(`/api/usuarios/${user.id}`, formData);
      setMessage('Datos actualizados correctamente');
      setEditMode(false);
      // Actualizar usuario en contexto
      if (typeof updateUserInContext === 'function') {
        const refreshed = await api.get(`/api/usuarios/${user.id}`);
        updateUserInContext(refreshed.data);
      }
    } catch (err) {
      setError('Error al actualizar datos');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!passwordForm.actual || !passwordForm.nueva || !passwordForm.confirmar) {
      setPasswordError('Todos los campos son obligatorios.');
      return;
    }
    if (passwordForm.nueva.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwordForm.nueva !== passwordForm.confirmar) {
      setPasswordError('Las contraseñas nuevas no coinciden.');
      return;
    }
    try {
      await changePassword(user.id, { actual: passwordForm.actual, nueva: passwordForm.nueva });
      setPasswordSuccess('Contraseña actualizada exitosamente.');
      setPasswordForm({ actual: '', nueva: '', confirmar: '' });
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setPasswordError(err.message || 'Error al cambiar la contraseña.');
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title" style={{marginTop: '2.5rem', marginBottom: '2.5rem'}}>Mi Perfil</h2>
      {error && <div className="profile-error">{error}</div>}
      {message && <div className="profile-success">{message}</div>}
      <div className="profile-card">
        <div className="profile-avatar-container">
          <img className="profile-avatar-rect" src={avatarPreview || '/default-avatar.png'} alt="avatar" />
          {canChangeAvatar && (
            <label className="btn-avatar-upload" style={{ marginTop: '1rem', cursor: 'pointer', display: 'block', textAlign: 'center' }}>
              <span style={{ color: '#388e3c', fontWeight: 500, fontSize: '1rem', background: '#e8f5e9', borderRadius: '6px', padding: '4px 12px', border: '1px solid #c8e6c9', display: 'inline-block' }}>Cambiar foto</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} disabled={loading} />
            </label>
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
            <span className="profile-role-badge">{formData.rol || '-'}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Fecha de registro:</span>
            <span className="profile-value">{formData.fecha_registro ? new Date(formData.fecha_registro).toLocaleDateString() : '-'}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Programa:</span>
            <span className="profile-value">{formData.programa || '-'}</span>
          </div>
        <div className="profile-actions">
            <button className="btn btn-success" type="button" onClick={() => setShowPasswordModal(true)}>Cambiar Contraseña</button>
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
      
      {/* Historial de accesos - ELIMINADO PARA EVITAR REDUNDANCIA CON LA PÁGINA DE INICIO */}
      {/* Esta información ya se muestra en la página de inicio en la sección "Actividad Reciente" */}

      {/* Modal para cambiar contraseña */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal modal-narrow">
            <button className="close-modal" onClick={() => setShowPasswordModal(false)} title="Cerrar">✖</button>
            <h2 className="modal-title">Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordSubmit} className="form-user-profile-singlecol">
              <div className="form-control">
                <label className="label">Contraseña actual</label>
                <input type="password" name="actual" value={passwordForm.actual} onChange={handlePasswordChange} required className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">Nueva contraseña</label>
                <input type="password" name="nueva" value={passwordForm.nueva} onChange={handlePasswordChange} required className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">Confirmar nueva contraseña</label>
                <input type="password" name="confirmar" value={passwordForm.confirmar} onChange={handlePasswordChange} required className="input input-bordered" />
              </div>
              {passwordError && <div className="alert alert-error shadow-lg form-control-full">{passwordError}</div>}
              {passwordSuccess && <div className="alert alert-success shadow-lg form-control-full">{passwordSuccess}</div>}
              <div className="modal-actions form-control-full inline-buttons">
                <button type="submit" className="btn btn-primary">Cambiar Contraseña</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;   