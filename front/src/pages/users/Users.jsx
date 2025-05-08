import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './users.css';

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('http://localhost:3000/api/usuarios');
      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Respuesta del servidor no es un array:', response.data);
        setError('Error al cargar usuarios: Formato de datos incorrecto');
        setUsers([]);
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError(`Error al cargar usuarios: ${err.response?.data?.message || err.message}`);
      setUsers([]);
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

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
    
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      const response = await axios.delete(`http://localhost:3000/api/usuarios/${userId}`);
      setSuccess('Usuario eliminado correctamente');
      fetchUsers();
    } catch (err) {
      setError(`Error al eliminar usuario: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitting(false);
    }
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
      const url = isUpdate 
        ? `${import.meta.env.DEV ? '' : 'http://localhost:3000'}/api/usuarios/${editingUser.id}`
        : `${import.meta.env.DEV ? '' : 'http://localhost:3000'}/api/usuarios`;
      
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
      
      const response = await axios[method](url, userData);
      
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
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>Cargando usuarios...</p>
    </div>
  );

  return (
    <div className="users-container">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        background: '#fff',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(44, 62, 80, 0.1)',
        borderBottom: '2px solid #2e7d32'
      }}>
        <h1 style={{
          color: '#1b5e20',
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: 0
        }}>Gestión de Usuarios</h1>
        <button
          style={{
            background: '#2e7d32',
            color: 'white',
            border: '2px solid #1b5e20',
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onClick={() => {
            setShowModal(true);
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
          }}
          disabled={submitting}
        >
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="no-results">
            {searchTerm 
              ? `No se encontraron usuarios que coincidan con "${searchTerm}"`
              : "No hay usuarios registrados en el sistema"}
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha de registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.nombre || '—'}</td>
                  <td>{user.correo || '—'}</td>
                  <td>
                    <span className={`role-badge ${user.rol || 'unknown'}`}>
                      {capitalize(user.rol)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.estado || 'unknown'}`}>
                      {capitalize(user.estado)}
                    </span>
                  </td>
                  <td>{formatDate(user.fecha_registro)}</td>
                  <td className="actions">
                    <button 
                      className="btn-icon" 
                      title="Editar" 
                      onClick={() => handleEdit(user)}
                      disabled={submitting}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-icon delete" 
                      title="Eliminar" 
                      onClick={() => handleDelete(user.id)}
                      disabled={submitting}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  autoFocus
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select 
                  name="rol" 
                  value={formData.rol} 
                  onChange={handleChange} 
                  required
                  disabled={submitting}
                >
                  <option value="">Seleccionar rol</option>
                  <option value="administrador">Administrador/Validador</option>
                  <option value="instructor">Instructor</option>
                  <option value="aprendiz">Aprendiz</option>
                </select>
              </div>
              <div className="form-group">
                <label>Teléfono Principal</label>
                <input
                  type="tel"
                  name="telefono1"
                  value={formData.telefono1}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label>Teléfono Secundario</label>
                <input
                  type="tel"
                  name="telefono2"
                  value={formData.telefono2}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label>RH</label>
                <input
                  type="text"
                  name="rh"
                  value={formData.rh}
                  onChange={handleChange}
                  disabled={submitting}
                  maxLength="3"
                  placeholder="Ej: O+, A-, B+, AB+"
                />
              </div>
              <div className="form-group">
                <label>Ficha</label>
                <input
                  type="text"
                  name="ficha"
                  value={formData.ficha}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Número de ficha (solo para aprendices)"
                />
              </div>
              <div className="form-group">
                <label>Observación</label>
                <textarea
                  name="observacion"
                  value={formData.observacion}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Observaciones adicionales"
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select 
                  name="estado" 
                  value={formData.estado} 
                  onChange={handleChange} 
                  required
                  disabled={submitting}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
              
              {formError && (
                <div className="form-error">
                  <FaExclamationTriangle /> {formError}
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Procesando...'
                    : editingUser 
                      ? 'Guardar Cambios' 
                      : 'Crear Usuario'
                  }
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 