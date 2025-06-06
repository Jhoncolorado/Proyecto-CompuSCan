import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaExclamationTriangle, FaUserCircle, FaLaptop } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './users.css';
import UserDevices from '../../components/UserDevices';

const formatDate = (dateString) => {
  if (!dateString || isNaN(Date.parse(dateString))) return '—';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch (e) {
    return '—';
  }
};

const capitalize = (str) => {
  if (!str) return '—';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    rol: '',
    telefono1: '',
    telefono2: '',
    rh: '',
    ficha: '',
    observacion: '',
    estado: 'activo',
    documento: '',
    tipo_documento: '',
    foto: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deviceImage, setDeviceImage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  useEffect(() => {
    if (showModal && editingUser && editingUser.id) {
      api.get(`/api/dispositivos/usuario/${editingUser.id}`)
        .then(devRes => {
          if (Array.isArray(devRes.data) && devRes.data.length > 0 && devRes.data[0].foto) {
            setDeviceImage(devRes.data[0].foto);
          } else {
            setDeviceImage('');
          }
        });
    }
  }, [showModal, editingUser]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/api/usuarios?page=${page}&limit=${limit}`);
      
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      } else {
        console.error('Respuesta del servidor no es un array:', response.data);
        setError('Error al cargar usuarios: Formato de datos incorrecto');
        setUsers([]);
        setTotalPages(1);
        setTotal(0);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(`Error al cargar usuarios: ${err.response?.data?.message || err.message}`);
      setUsers([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.nombre || '').toLowerCase().includes(searchTermLower) ||
      (user.correo || '').toLowerCase().includes(searchTermLower) ||
      (user.rol || '').toLowerCase().includes(searchTermLower)
    );
  });

  const handleEdit = (user) => {
    console.log('EDITAR USUARIO:', user);
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || '',
      correo: user.correo || '',
      rol: user.rol || '',
      telefono1: user.telefono1 || '',
      telefono2: user.telefono2 || '',
      rh: user.rh || '',
      ficha: user.ficha || '',
      observacion: user.observacion || '',
      estado: user.estado || 'activo',
      documento: user.documento || '',
      tipo_documento: user.tipo_documento || '',
      foto: user.foto || ''
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const response = await api.delete(`/api/usuarios/${userToDelete}`);
      setSuccess('Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      setError(`Error al eliminar usuario: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitting(false);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    if (!formData.nombre || !formData.correo || !formData.rol) {
      setFormError('Los campos nombre, correo y rol son obligatorios');
      setSubmitting(false);
      return;
    }

    try {
      const isUpdate = !!editingUser;
      const url = editingUser.id ? `/api/usuarios/${editingUser.id}` : '/api/usuarios';
      
      const method = isUpdate ? 'put' : 'post';
      
      const userData = {
        nombre: formData.nombre,
        correo: formData.correo,
        rol: formData.rol,
        telefono1: formData.telefono1,
        telefono2: formData.telefono2,
        rh: formData.rh,
        ficha: formData.ficha,
        observacion: formData.observacion,
        estado: formData.estado,
        documento: formData.documento,
        tipo_documento: formData.tipo_documento,
        foto: formData.foto
      };
      
      console.log(`${isUpdate ? 'Actualizando' : 'Creando'} usuario con datos:`, userData);
      
      const response = await api[method](url, userData);
      
      console.log('Respuesta del servidor:', response.data);
      
      setShowModal(false);
      setEditingUser(null);
      setFormData({ 
        nombre: '', 
        correo: '', 
        rol: '',
        telefono1: '',
        telefono2: '',
        rh: '',
        ficha: '',
        observacion: '',
        estado: 'activo',
        documento: '',
        tipo_documento: '',
        foto: ''
      });
      setSuccess(isUpdate ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
      
      fetchUsers();
    } catch (err) {
      console.error('Error en operación:', err);
      setFormError(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setShowModal(false);
    setEditingUser(null);
    setFormData({ 
      nombre: '', 
      correo: '', 
      rol: '',
      telefono1: '',
      telefono2: '',
      rh: '',
      ficha: '',
      observacion: '',
      estado: 'activo',
      documento: '',
      tipo_documento: '',
      foto: ''
    });
    setFormError('');
  };

  if (loading) return (
    <div className="users-bg">
      <div className="users-panel">
        <div className="users-header-row">
        <h1>Gestión de Usuarios</h1>
      </div>
      <div className="users-table-container">
        <div className="users-loading">
          <span className="spinner"></span>
          <span>Cargando usuarios...</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="users-bg">
      <div className="users-panel">
        <div className="users-header-row">
          <h1>Gestión de Usuarios</h1>
          <div className="controls-wrapper">
            <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
            <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditingUser(null); }} title="Agregar nuevo usuario">
              <FaPlus />
              Nuevo Usuario
          </button>
            </div>
        </div>
        
        {error && (
          <div className="users-error-message">
            <FaExclamationTriangle style={{marginRight:8}}/>{error}
          </div>
        )}
        {success && (
          <div className="users-success-message">
            {success}
          </div>
        )}
        
        <div className="users-table-container">
          {filteredUsers.length === 0 ? (
            <div className="users-info-message">
              <FaExclamationTriangle style={{marginRight:8}}/>
              No hay usuarios registrados.
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.foto ? <img src={user.foto} alt="Avatar" className="user-avatar" /> : <FaUserCircle className="user-avatar-placeholder" />}</td>
                    <td>{user.nombre}</td>
                    <td>{user.correo}</td>
                    <td><span className={`role-badge ${user.rol}`}>{capitalize(user.rol)}</span></td>
                    <td><span className={`status-badge ${user.estado}`}>{capitalize(user.estado)}</span></td>
                    <td>{user.documento}</td>
                    <td>{user.telefono1 || '—'}</td>
                    <td className="actions">
                      <button className="btn-icon edit" title="Editar" onClick={() => handleEdit(user)}><FaEdit /></button>
                      <button className="btn-icon delete" title="Eliminar" onClick={() => handleDelete(user.id)}><FaTrash /></button>
                      <button className="btn-icon device" title="Dispositivos" onClick={() => { setSelectedUserId(user.id); setShowDevicesModal(true); }}>
                        <FaLaptop />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>Anterior</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i+1} className={page === i+1 ? 'active' : ''} onClick={() => setPage(i+1)}>{i+1}</button>
              ))}
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Siguiente</button>
              <span style={{marginLeft:8}}>Total: {total}</span>
              <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} style={{marginLeft:8}}>
                {[5,10,20,50].map(opt => <option key={opt} value={opt}>{opt} por página</option>)}
              </select>
            </div>
          )}
        </div>
        
        {showModal && (
          <div className="modal-overlay">
            <div className="modal modal-narrow">
              <button className="close-modal" onClick={handleCloseModal} title="Cerrar">✖</button>
              <div className="modal-content-scroll">
                <h2 className="modal-title">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <div className="form-avatar-preview">
                {editingUser && editingUser.foto ? (
                  <img src={editingUser.foto} alt="Avatar" className="user-avatar-large" />
                ) : (
                  <FaUserCircle className="user-avatar-placeholder-large" />
                )}
              </div>
                <div className="form-card">
                  <form onSubmit={handleSubmit} autoComplete="off" className="form-user-profile-singlecol">
                    <div className="form-control"><label className="label">Nombre</label><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required autoFocus disabled={submitting} className="input input-bordered" autoComplete="off" /></div>
                    <div className="form-control"><label className="label">Correo</label><input type="email" name="correo" value={formData.correo} onChange={handleChange} required disabled={submitting} className="input input-bordered" autoComplete="off" /></div>
                    <div className="form-control"><label className="label">Rol</label><select name="rol" value={formData.rol} onChange={handleChange} required disabled={submitting} className="select select-bordered">
                      <option value="">Seleccionar rol</option>
                      <option value="instructor">Instructor</option>
                      <option value="aprendiz">Aprendiz</option>
                    </select></div>
                    <div className="form-control"><label className="label">Teléfono Principal</label><input type="tel" name="telefono1" value={formData.telefono1} onChange={handleChange} disabled={submitting} className="input input-bordered" autoComplete="off" /></div>
                    <div className="form-control"><label className="label">Documento</label><input type="text" name="documento" value={formData.documento} onChange={handleChange} disabled={submitting} className="input input-bordered" autoComplete="off" /></div>
                    <div className="form-control"><label className="label">Tipo de Documento</label><input type="text" name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} disabled={submitting} className="input input-bordered" /></div>
                    <div className="form-control"><label className="label">RH</label><input type="text" name="rh" value={formData.rh} onChange={handleChange} disabled={submitting} maxLength="3" placeholder="Ej: O+, A-, B+, AB+" className="input input-bordered" autoComplete="off" /></div>
                    <div className="form-control"><label className="label">Foto</label>
                    </div>
                    <div className="form-control"><label className="label">Estado</label><select name="estado" value={formData.estado} onChange={handleChange} required disabled={submitting} className="select select-bordered"><option value="activo">Activo</option><option value="inactivo">Inactivo</option><option value="pendiente">Pendiente</option></select></div>
                    <div className="form-control form-control-full"><label className="label">Observación</label><textarea name="observacion" value={formData.observacion} onChange={handleChange} disabled={submitting} placeholder="Observaciones adicionales" className="textarea textarea-bordered"></textarea></div>
                    {formError && (<div className="alert alert-error shadow-lg form-control-full">{formError}</div>)}
                    <div className="modal-actions form-control-full inline-buttons">
                      <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Procesando...' : editingUser ? 'Guardar Cambios' : 'Crear Usuario'}</button>
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={submitting}>Cancelar</button>
                </div>
                  </form>
                </div>
                </div>
            </div>
          </div>
        )}
        {showDevicesModal && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 700, minHeight: 400 }}>
              <button className="close-modal" onClick={() => setShowDevicesModal(false)} title="Cerrar">✖</button>
              <h2>Dispositivos del usuario</h2>
              <UserDevices userId={selectedUserId} isAdminView />
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal modal-confirm">
              <div className="modal-icon-warning"><FaExclamationTriangle size={32} color="#c62828" /></div>
              <h3 className="modal-title">¿Está seguro de eliminar este usuario?</h3>
              <div className="modal-actions inline-buttons">
                <button className="btn btn-secondary" onClick={cancelDelete} disabled={submitting}>Cancelar</button>
                <button className="btn btn-danger" onClick={confirmDelete} disabled={submitting}>Eliminar</button>
              </div>
              <div className="modal-warning-text">Esta acción no se puede deshacer.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users; 