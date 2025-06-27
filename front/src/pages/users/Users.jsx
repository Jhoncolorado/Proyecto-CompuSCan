import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaExclamationTriangle, FaUser, FaPhoneAlt, FaRegIdCard, FaCheckCircle, FaTimes, FaChevronDown, FaChevronUp, FaLaptop, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './users.css';
import UserDevices from '../../components/UserDevices';
import { useState as useAccordionState } from 'react';

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
  const [fichas, setFichas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    rol: '',
    telefono1: '',
    telefono2: '',
    rh: '',
    id_ficha: '',
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
  const [showDisabled, setShowDisabled] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 600 : false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page, limit, showDisabled]);

  useEffect(() => {
    if (showModal && editingUser && editingUser.id) {
      (async () => {
        try {
          const devRes = await api.get(`/api/dispositivos/usuario/${editingUser.id}`);
          if (Array.isArray(devRes.data) && devRes.data.length > 0 && devRes.data[0].foto) {
            setDeviceImage(devRes.data[0].foto);
          } else {
            setDeviceImage('');
          }
        } catch (err) {
          if (err.response && err.response.status === 403) {
            setDeviceImage('');
          } else {
            setDeviceImage('');
          }
        }
      })();
    }
  }, [showModal, editingUser]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.documentElement.style.height = '100%';
      const style = document.createElement('style');
      style.id = 'modal-global-block-scroll';
      style.innerHTML = 'html, body { overflow: hidden !important; height: 100% !important; }';
      document.head.appendChild(style);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
      const style = document.getElementById('modal-global-block-scroll');
      if (style) style.remove();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
      const style = document.getElementById('modal-global-block-scroll');
      if (style) style.remove();
    };
  }, [showModal]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize(); // Asegura el valor correcto al cargar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    api.get('/api/fichas')
      .then(res => setFichas(Array.isArray(res.data) ? res.data : []))
      .catch(() => setFichas([]));
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `/api/usuarios?page=${page}&limit=${limit}`;
      if (showDisabled) {
        url = `/api/usuarios?estado=deshabilitado&page=${page}&limit=${limit}`;
      } else {
        url = `/api/usuarios?estado=activo&page=${page}&limit=${limit}`;
      }
      const response = await api.get(url);
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      } else {
        setError('Error al cargar usuarios: Formato de datos incorrecto');
        setUsers([]);
        setTotalPages(1);
        setTotal(0);
      }
    } catch (err) {
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

  const filteredUsers = users
    .filter(user => showDisabled ? user.estado === 'deshabilitado' : user.estado !== 'deshabilitado')
    .filter(user => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (user.nombre || '').toLowerCase().includes(searchTermLower) ||
        (user.documento || '').toString().toLowerCase().includes(searchTermLower) ||
        (user.correo || '').toLowerCase().includes(searchTermLower)
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
      id_ficha: user.id_ficha ? String(user.id_ficha) : (user.ficha ? String(user.ficha) : ''),
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
      await api.put(`/api/usuarios/${userToDelete}`, { estado: 'deshabilitado' });
      setSuccess('Usuario deshabilitado correctamente');
      fetchUsers();
    } catch (err) {
      setError(`Error al deshabilitar usuario: ${err.response?.data?.message || err.message}`);
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

  const handleEnable = async (userId) => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.put(`/api/usuarios/${userId}/habilitar`);
      setSuccess('Usuario habilitado correctamente');
      fetchUsers();
    } catch (err) {
      setError(`Error al habilitar usuario: ${err.response?.data?.message || err.message}`);
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
      const url = editingUser.id ? `/api/usuarios/${editingUser.id}` : '/api/usuarios';
      
      const method = isUpdate ? 'put' : 'post';
      
      const userData = {
        nombre: formData.nombre,
        correo: formData.correo,
        rol: formData.rol,
        telefono1: formData.telefono1,
        telefono2: formData.telefono2,
        rh: formData.rh,
        id_ficha: formData.id_ficha ? Number(formData.id_ficha) : null,
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
        id_ficha: '',
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
      id_ficha: '',
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
          <div className="header-actions-group">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <label className="controls-wrapper">
              <input type="checkbox" checked={showDisabled} onChange={e => setShowDisabled(e.target.checked)} />
              Mostrar usuarios deshabilitados
            </label>
            <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditingUser(null); }} title="Agregar nuevo usuario">
              <FaPlus style={{fontSize:'1.3em',marginRight:8}}/>
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
          {isMobile ? (
            <div className="user-card-list">
              {filteredUsers.length === 0 ? (
                <div className="users-info-message">
                  <FaExclamationTriangle style={{marginRight:8}}/>
                  No hay usuarios registrados.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div className="user-card" key={user.id}>
                    <div className="user-card-header">
                      {user.foto ? (
                        <img src={user.foto} alt="Avatar" className="user-card-avatar" />
                      ) : (
                        <FaUser style={{color:'#374151',fontSize:32}} className="user-card-avatar" />
                      )}
                      <div className="user-card-main">
                        <div className="user-card-name">{user.nombre}</div>
                        <div className="user-card-email">{user.correo}</div>
                      </div>
                    </div>
                    <div className="user-card-info">
                      <div className="user-card-info-row"><FaRegIdCard /> {user.documento}</div>
                      <div className="user-card-info-row"><FaPhoneAlt /> {user.telefono1 || '—'}{user.telefono2 ? ` / ${user.telefono2}` : ''}</div>
                      <div className="user-card-info-row"><FaShieldAlt /> {capitalize(user.rol)}</div>
                      <div className="user-card-info-row"><FaCheckCircle style={{color:user.estado==='deshabilitado'?'#b0b0b0':'#43a047'}}/> {user.estado==='deshabilitado' ? 'Deshabilitado' : capitalize(user.estado)}</div>
                    </div>
                    <div className="user-card-actions">
                      <button className="btn-icon edit" title="Editar" onClick={() => handleEdit(user)}><FaEdit /></button>
                      {showDisabled ? (
                        <button className="btn btn-success" style={{padding:'0.4rem 1.1rem', fontWeight:700, borderRadius:8, display:'inline-flex', alignItems:'center', gap:6}} title="Habilitar" onClick={() => handleEnable(user.id)} disabled={submitting}>
                          <FaCheckCircle style={{marginRight:4}} /> Habilitar
                        </button>
                      ) : (
                        <button className="btn-icon delete" title="Deshabilitar" aria-label="Deshabilitar" onClick={() => handleDelete(user.id)}><FaTrash /></button>
                      )}
                      <button className="btn-icon device" title="Dispositivos" onClick={() => { setSelectedUserId(user.id); setShowDevicesModal(true); }}>
                        <FaLaptop />
                      </button>
                    </div>
                  </div>
                ))
              )}
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
                    <td>{user.foto ? <img src={user.foto} alt="Avatar" className="user-avatar" /> : <FaUser style={{color:'#374151',fontSize:22}} />}</td>
                    <td>{user.nombre}</td>
                    <td>{user.correo}</td>
                    <td><span className={`role-badge ${user.rol}`}>{capitalize(user.rol)}</span></td>
                    <td><span className={`status-badge ${user.estado}`}>{user.estado === 'deshabilitado' ? <span style={{color:'#b0b0b0', fontWeight:700}}>Deshabilitado</span> : capitalize(user.estado)}</span></td>
                    <td>{user.documento}</td>
                    <td>{user.telefono1 || '—'}</td>
                    <td className="actions">
                      <button className="btn-icon edit" title="Editar" onClick={() => handleEdit(user)}><FaEdit /></button>
                      {showDisabled ? (
                        <button className="btn btn-success" style={{marginLeft:4, padding:'0.4rem 1.1rem', fontWeight:700, borderRadius:8, display:'inline-flex', alignItems:'center', gap:6}} title="Habilitar" onClick={() => handleEnable(user.id)} disabled={submitting}>
                          <FaCheckCircle style={{marginRight:4}} /> Habilitar
                        </button>
                      ) : (
                        <button className="btn-icon delete" title="Deshabilitar" aria-label="Deshabilitar" onClick={() => handleDelete(user.id)}><FaTrash /></button>
                      )}
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
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(44,62,80,0.18)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minHeight: '100vh',
            minWidth: '100vw',
            padding: 0,
            paddingTop: 32,
            maxHeight: '85vh',
          }}>
            <div style={{
              position: 'relative',
              background: '#fff',
              borderRadius: 24,
              boxShadow: '0 12px 40px rgba(44,62,80,0.18)',
              width: '100%',
              maxWidth: 700,
              minWidth: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              animation: 'modalIn 0.22s cubic-bezier(.4,1.3,.6,1)',
              overflow: 'hidden',
              maxHeight: '85vh',
            }}>
              <button className="close-modal" style={{
                position: 'absolute',
                top: 18,
                right: 18,
                zIndex: 3000,
                fontSize: '2rem',
                width: 40,
                height: 40,
                background: 'none',
                border: 'none',
                color: '#256029',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.18s, background 0.18s',
                cursor: 'pointer',
              }} onClick={handleCloseModal} title="Cerrar">
                <FaTimes />
              </button>
              <form id="user-accordion-form" autoComplete="off" style={{ width: '100%', maxWidth: 600, minWidth: 380, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', boxShadow: 'none', padding: 0 }} onSubmit={handleSubmit}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
                  {formData.foto ? (
                    <img src={formData.foto} alt="Avatar" className="user-avatar-large" style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid #43a047', objectFit: 'cover', background: '#fff', marginBottom: 8 }} />
                  ) : (
                    <div className="user-avatar-placeholder-large" style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid #43a047', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bdbdbd', fontSize: '2.7rem', marginBottom: 8 }}>
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#256029', marginTop: 2, textAlign: 'center' }}>{editingUser?.nombre || 'Nuevo Usuario'}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.18rem', color: '#256029', marginTop: 2, marginBottom: 0, textAlign: 'center' }}>Editar Usuario</div>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 32, minHeight: 260, maxHeight: 280 }}>
                  <AccordionUserForm
                    formData={formData}
                    handleChange={handleChange}
                    formError={formError}
                    submitting={submitting}
                    handleCloseModal={handleCloseModal}
                    editingUser={editingUser}
                    fichas={fichas}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                  />
                </div>
                <div className="modal-actions form-control-full" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '1.2rem 0 0.5rem 0', width: '100%' }}>
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={submitting} style={{padding:'0.9rem 2.2rem',fontSize:'1.13rem',borderRadius:12, minWidth:200, height:56, margin:0}}>Cancelar</button>
                  <button type="submit" form="user-accordion-form" className="btn btn-primary" disabled={submitting} style={{padding:'0.9rem 2.2rem',fontSize:'1.13rem',borderRadius:12, minWidth:200, height:56, margin:0}}>
                    {submitting ? 'Procesando...' : editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showDevicesModal && (
          <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'rgba(44,62,80,0.13)' }}>
            <div className="modal" style={{ maxWidth: 700, minWidth: 320, margin: '0 auto', position: 'relative', overflowY: 'auto', maxHeight: '85vh', padding: '2rem 2.2rem 1.2rem 2.2rem', borderRadius: 14, background: '#fff', boxShadow: '0 8px 32px rgba(44,62,80,0.18)' }}>
              <button className="close-modal" onClick={() => setShowDevicesModal(false)} title="Cerrar" style={{ position: 'absolute', top: 18, right: 18, fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}>✖</button>
              <h2 style={{ textAlign: 'center', margin: '0 0 1.5rem 0', fontSize: '2rem', fontWeight: 800, letterSpacing: 0.2 }}>Dispositivos del usuario</h2>
              <div style={{ padding: 0 }}>
              <UserDevices userId={selectedUserId} isAdminView />
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(44,62,80,0.18)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minHeight: '100vh',
            minWidth: '100vw',
            paddingTop: 60,
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
              maxWidth: 400,
              width: '100%',
              padding: '2.2rem 2rem 1.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <div style={{ marginBottom: 16 }}><FaExclamationTriangle size={38} color="#43a047" /></div>
              <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#43a047', marginBottom: '1.1rem', lineHeight: 1.25 }}>
                ¿Está seguro de deshabilitar este usuario?
              </h3>
              <div style={{ display: 'flex', gap: 22, justifyContent: 'center', margin: '1.1rem 0 0.7rem 0', width: '100%' }}>
                <button className="btn btn-secondary" style={{ minWidth: 120, height: 44, fontSize: '1.08rem', fontWeight: 700 }} onClick={cancelDelete} disabled={submitting}>Cancelar</button>
                <button className="btn" style={{ background: '#43a047', color: '#fff', border: '2.5px solid #43a047', borderRadius: 8, padding: '10px 28px', fontWeight: 700, minWidth: 140, height: 44, fontSize: '1.08rem' }} onClick={confirmDelete} disabled={submitting}>Deshabilitar</button>
              </div>
              <div style={{ color: '#43a047', fontSize: '0.98rem', fontWeight: 500, opacity: 0.85, letterSpacing: '0.01em', textAlign: 'center', marginTop: '1.1rem' }}>
                El usuario no podrá iniciar sesión hasta que sea habilitado nuevamente.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function AccordionSection({ title, icon, open, onClick, children }) {
  return (
    <div className="accordion-section" style={{
      border: '1.5px solid #43a047',
      borderRadius: 12,
      marginBottom: 18,
      background: '#f8fafc',
      boxShadow: open ? '0 2px 12px 0 rgba(44,62,80,0.08)' : 'none',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}>
      <button type="button" className="accordion-header" onClick={onClick} style={{
        width: '100%',
        background: 'none',
        border: 'none',
        outline: 'none',
        padding: '1.1rem 1.2rem',
        fontWeight: 800,
        fontSize: '1.13rem',
        color: '#256029',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        letterSpacing: 0.2,
        borderBottom: open ? '1.5px solid #43a047' : 'none',
        transition: 'border 0.2s',
      }}>
        <span style={{display:'flex',alignItems:'center',gap:10}}>{icon}{title}</span>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <div style={{
        maxHeight: open ? 260 : 0,
        overflowY: open ? 'auto' : 'hidden',
        overflowX: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(.4,1.3,.6,1)',
        background: '#fff',
        padding: open ? '1.2rem 1.2rem 0.7rem 1.2rem' : '0 1.2rem',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
      }}>
        {open && children}
      </div>
    </div>
  );
}

function AccordionUserForm({ formData, handleChange, formError, submitting, handleCloseModal, editingUser, fichas, activeSection, setActiveSection }) {
  const sections = [
    {
      title: 'Datos personales',
      icon: <FaUser style={{color:'#1976d2',fontSize:22}}/>,
      content: (
        <div className="form-user-profile-singlecol">
          <div className="form-control">
            <label className="label">Nombre completo</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required autoFocus disabled={submitting} className="input input-bordered" autoComplete="off" />
          </div>
          <div className="form-control">
            <label className="label">Correo electrónico</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} required disabled={submitting} className="input input-bordered" autoComplete="off" />
          </div>
          <div className="form-control">
            <label className="label">Rol</label>
            <select name="rol" value={formData.rol} onChange={handleChange} required disabled={submitting} className="select select-bordered">
              <option value="">Seleccionar rol</option>
              <option value="instructor">Instructor</option>
              <option value="aprendiz">Aprendiz</option>
              <option value="admin">Administrador</option>
              <option value="validador">Validador</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">Tipo de documento</label>
            <input type="text" name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} disabled={submitting} className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">Número de documento</label>
            <input type="text" name="documento" value={formData.documento} onChange={handleChange} disabled={submitting} className="input input-bordered" autoComplete="off" />
          </div>
          <div className="form-control">
            <label className="label">Foto de perfil</label>
            {formData.foto && (
              <img src={formData.foto} alt="Foto usuario" style={{width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', border: '2px solid #43a047', marginBottom: 8}} />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={submitting}
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleChange({ target: { name: 'foto', value: reader.result } });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{marginTop: 8}}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Contacto',
      icon: <FaPhoneAlt style={{color:'#43a047',fontSize:20}}/>,
      content: (
        <div className="form-user-profile-singlecol">
          <div className="form-control">
            <label className="label">Teléfono</label>
            <input type="tel" name="telefono1" value={formData.telefono1} onChange={handleChange} disabled={submitting} className="input input-bordered" autoComplete="off" />
          </div>
          <div className="form-control">
            <label className="label">Teléfono alternativo</label>
            <input type="tel" name="telefono2" value={formData.telefono2} onChange={handleChange} disabled={submitting} className="input input-bordered" autoComplete="off" />
          </div>
        </div>
      )
    },
    {
      title: 'Información adicional',
      icon: <FaRegIdCard style={{color:'#fbc02d',fontSize:20}}/>,
      content: (
        <div className="form-user-profile-singlecol">
          <div className="form-control">
            <label className="label">RH</label>
            <input type="text" name="rh" value={formData.rh} onChange={handleChange} disabled={submitting} maxLength="3" placeholder="Ej: O+, A-, B+, AB+" className="input input-bordered" autoComplete="off" />
          </div>
          <div className="form-control">
            <label className="label">Ficha</label>
            <select name="id_ficha" value={String(formData.id_ficha || '')} onChange={handleChange} disabled={submitting} className="select select-bordered">
              <option value="">Seleccionar ficha</option>
              {Array.isArray(fichas) && fichas.map(f => (
                <option key={f.id_ficha} value={String(f.id_ficha)}>
                  {f.nombre || f.codigo || `Ficha ${f.id_ficha}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">Observación</label>
            <textarea name="observacion" value={formData.observacion} onChange={handleChange} disabled={submitting} placeholder="Observaciones adicionales" className="textarea textarea-bordered"></textarea>
          </div>
          <div className="form-control">
            <label className="label">Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange} required disabled={submitting} className="select select-bordered">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 32, minHeight: 260, maxHeight: 280 }}>
      <div style={{ minWidth: 200, maxWidth: 240, width: 240, height: 220, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 16, justifyContent: 'center', position: 'relative', marginLeft: '0', marginTop: 10 }}>
        {sections.map((section, idx) => (
          <button key={section.title} type="button" onClick={() => setActiveSection(idx)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '1.1rem 1.2rem', borderRadius: 18, border: activeSection === idx ? '2.5px solid #43a047' : '1.5px solid #e5e7eb', background: '#fff', color: '#388e3c', fontWeight: 900, fontSize: '1.18rem', cursor: 'pointer', boxShadow: activeSection === idx ? '0 2px 12px 0 rgba(67,160,71,0.08)' : 'none', transition: 'all 0.18s', marginBottom: 2, outline: 'none', borderLeft: activeSection === idx ? '4px solid #43a047' : '1.5px solid #e5e7eb', minHeight: 64, maxHeight: 64, width: '100%', maxWidth: 240, flex: 1, position: 'relative', zIndex: 1, fontFamily: 'Montserrat Alternates, Montserrat, Arial, sans-serif', letterSpacing: 0.2
          }}>
            {section.icon} {section.title}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 420, maxWidth: 620, background: '#fff', borderRadius: 18, border: '2.5px solid #43a047', boxShadow: '0 2px 12px 0 rgba(44,62,80,0.08)', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch', transition: 'all 0.25s cubic-bezier(.4,1.3,.6,1)', boxSizing: 'border-box', height: '100%', minHeight: 120, maxHeight: 260, overflow: 'hidden', position: 'relative' }}>
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`accordion-section-content-anim${activeSection === idx ? ' active' : ''}`}
            style={{ 
              display: activeSection === idx ? 'block' : 'none',
              overflowY: 'auto',
              maxHeight: 220,
              paddingRight: 8
            }}
          >
            {section.content}
            {formError && (
              <div className="alert alert-error shadow-lg form-control-full" style={{ marginTop: 10 }}>{formError}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users; 