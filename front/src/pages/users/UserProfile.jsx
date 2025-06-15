import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function UserProfile() {
  const { documento } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/usuarios/documento/${documento}`)
      .then(res => {
        setUsuario(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se encontró el usuario');
        setLoading(false);
      });
  }, [documento]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!usuario) return null;

  return (
    <div style={{maxWidth: 400, margin: '2rem auto', border: '2px solid #2e7d32', borderRadius: 16, padding: 24, background: '#fff'}}>
      <img src={usuario.foto || '/images/default-avatar.png'} alt="Foto usuario" style={{width: 100, height: 130, objectFit: 'cover', borderRadius: 8, border: '2px solid #2e7d32', marginBottom: 16}} />
      <h2 style={{color:'#2e7d32', marginBottom: 8}}>{usuario.nombre}</h2>
      <div><b>C.C:</b> {usuario.documento}</div>
      <div><b>RH:</b> {usuario.rh || '-'}</div>
      <div><b>Regional:</b> Quindío</div>
      <div><b>Centro:</b> Centro de Comercio y Turismo</div>
      <div><b>Programa:</b> {usuario.nombre_programa || 'Programa de formación no registrado'}</div>
      <div><b>Grupo:</b> {usuario.ficha}</div>
    </div>
  );
} 