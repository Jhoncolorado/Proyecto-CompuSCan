import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import UserDevices from '../../components/UserDevices';
import '../../styles/profile.css';
import { FaClock, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

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
  const [userHistorial, setUserHistorial] = useState([]);
  const [userDevices, setUserDevices] = useState([]);

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

  // Obtener historial de accesos del usuario
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        if (user && user.id) {
          const res = await axios.get(`http://localhost:3000/api/historiales`);
          // Filtrar solo los eventos de dispositivos del usuario
          const userEvents = res.data.filter(ev => ev.descripcion && ev.descripcion.includes(user.nombre));
          setUserHistorial(userEvents.slice(0, 5)); // Solo los últimos 5
        }
      } catch (err) {
        // No mostrar error aquí para no molestar el perfil
      }
    };
    fetchHistorial();
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

  // Función para obtener el nombre del dispositivo
  const getDeviceName = () => {
    if (userDevices && userDevices.length > 0) {
      // Si el usuario tiene dispositivos registrados, mostrar el nombre del primero
      return userDevices[0].nombre || `${userDevices[0].marca} ${userDevices[0].modelo}` || `PC-${userDevices[0].id_dispositivo}`;
    }
    return "PC de Control de Acceso";
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title" style={{marginTop: '2.5rem', marginBottom: '2.5rem'}}>Mi Perfil</h2>
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
            <span className="profile-label">Último acceso:</span>
            <span className="profile-value">{user?.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString('es-CO') : '-'}</span>
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
      
      {/* Historial de accesos */}
      <div style={{ 
        marginTop: 32, 
        background: '#fff', 
        borderRadius: 12, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
        padding: 24, 
        maxWidth: 800, 
        marginLeft: 'auto', 
        marginRight: 'auto' 
      }}>
        <h3 style={{ 
          color: '#388e3c', 
          marginBottom: 16,
          fontSize: '1.3rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FaClock style={{ fontSize: '1.2rem' }} /> Últimos accesos
        </h3>
        {userHistorial.length === 0 ? (
          <div style={{ 
            color: '#888', 
            textAlign: 'center',
            padding: '2rem',
            background: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <FaClock style={{ fontSize: '2.5rem', color: '#ccc', marginBottom: '1rem' }} />
            <p style={{ margin: 0, fontWeight: '500' }}>No hay registros recientes de acceso.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            {userHistorial.map((ev) => (
              <div key={ev.id_historial} style={{ 
                padding: '1rem',
                borderRadius: '8px',
                background: '#f9f9f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #eee'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: ev.descripcion?.includes('entrada') ? '#e8f5e9' : '#fbe9e7',
                    padding: '0.5rem',
                    borderRadius: '8px'
                  }}>
                    {ev.descripcion?.includes('entrada') ? (
                      <FaSignInAlt style={{ color: '#43a047', fontSize: '1.2rem' }} />
                    ) : (
                      <FaSignOutAlt style={{ color: '#e53935', fontSize: '1.2rem' }} />
                    )}
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', display: 'block', marginBottom: '0.2rem' }}>{ev.descripcion}</span>
                    {ev.descripcion?.includes('RFID:') && (
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>
                        Dispositivo: {getDeviceName()}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>
                  {new Date(ev.fecha_hora).toLocaleString('es-CO')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;   