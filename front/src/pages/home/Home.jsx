import React, { useEffect, useState } from 'react';
import { FaUsers, FaDesktop } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const now = new Date();
  const formatDate = (date) =>
    new Intl.DateTimeFormat('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('http://localhost:3000/api/dashboard/stats');
        if (!res.ok) throw new Error('Error al cargar estadísticas');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError('No se pudieron cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="py-4 px-1 px-md-3">
      {user && (
        <div className="mb-5">
          <h2 className="h3 text-primary mb-2">¡Hola, <span>{user.nombre}</span>!</h2>
          <div className="text-muted mb-2" style={{ fontSize: 18 }}>Último acceso: <b>{formatDate(now)}</b> | Rol: <b>{user.rol}</b></div>
        </div>
      )}
      <h1 className="display-3 mb-5 text-secondary fw-light" style={{ letterSpacing: 1 }}>Dashboard</h1>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 120 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="ms-3 text-primary">Cargando estadísticas...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-5 justify-content-center">
          <div className="col-12 col-md-6 col-lg-5 d-flex justify-content-center">
            <div className="card shadow-lg border-0 p-4" style={{ background: 'linear-gradient(135deg, #2563eb 60%, #60a5fa 100%)', color: 'white', minWidth: 320, minHeight: 260, borderRadius: 24 }}>
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="card-title mb-0 fs-4">Usuarios Activos</h5>
                  <FaUsers size={40} className="opacity-75" />
                </div>
                <div className="display-1 fw-bold my-3">{stats.usuarios}</div>
                <p className="card-text mb-3">Total de usuarios registrados en el sistema</p>
                <a href="/users" className="btn btn-light btn-lg mt-auto">Ver detalles</a>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-5 d-flex justify-content-center">
            <div className="card shadow-lg border-0 p-4" style={{ background: 'linear-gradient(135deg, #475569 60%, #94a3b8 100%)', color: 'white', minWidth: 320, minHeight: 260, borderRadius: 24 }}>
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="card-title mb-0 fs-4">Dispositivos</h5>
                  <FaDesktop size={40} className="opacity-75" />
                </div>
                <div className="display-1 fw-bold my-3">{stats.dispositivos}</div>
                <p className="card-text mb-3">Dispositivos monitoreados actualmente</p>
                <a href="/devices" className="btn btn-light btn-lg mt-auto">Ver detalles</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 