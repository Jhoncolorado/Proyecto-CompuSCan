import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
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
        if (typeof updateUserInContext === 'function') {
          updateUserInContext(fullUser);
        }
      } catch (err) {
        setError('Error al cargar datos del perfil');
      }
    };
    if (user && user.id) fetchUser();
  }, [user]);

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
        </div>
        <div className="profile-info">
          <div className="profile-field"><span className="profile-label">Nombre:</span> <span className="profile-value">{formData.nombre || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">Correo:</span> <span className="profile-value">{formData.correo || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">Documento:</span> <span className="profile-value">{formData.documento || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">Tipo de documento:</span> <span className="profile-value">{formData.tipo_documento || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">Teléfono principal:</span> <span className="profile-value">{formData.telefono1 || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">Teléfono secundario:</span> <span className="profile-value">{formData.telefono2 || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">RH:</span> <span className="profile-value">{formData.rh || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">Ficha:</span> <span className="profile-value">{formData.ficha || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">Observación:</span> <span className="profile-value">{formData.observacion || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">Rol:</span> <span className="profile-value profile-role">{formData.rol || '-'}</span></div>
          <div className="profile-field"><span className="profile-label">Fecha de registro:</span> <span className="profile-value">{formData.fecha_registro ? new Date(formData.fecha_registro).toLocaleDateString() : '-'}</span></div>
        </div>
        <div className="profile-actions">
          <button className="btn btn-success" type="button">Cambiar Contraseña</button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 