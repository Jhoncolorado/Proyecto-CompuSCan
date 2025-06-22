import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';

export default function UserProfile() {
  const { documento } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editPhoto, setEditPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setEditPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = async () => {
    if (!photoPreview) return;
    setSubmitting(true);
    try {
      await api.put(`/api/usuarios/${usuario.id}`, { foto: photoPreview });
      setUsuario({ ...usuario, foto: photoPreview });
      setEditPhoto(false);
      setPhotoPreview('');
    } catch (err) {
      setError('Error al actualizar la foto');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!usuario) return null;

  return (
    <div style={{maxWidth: 400, margin: '2rem auto', border: '2px solid #2e7d32', borderRadius: 16, padding: 24, background: '#fff'}}>
      <div style={{textAlign:'center'}}>
        <img src={photoPreview || usuario.foto || '/images/default-avatar.png'} alt="Foto usuario" style={{width: 100, height: 130, objectFit: 'cover', borderRadius: 8, border: '2px solid #2e7d32', marginBottom: 16}} />
        <div>
          <input type="file" accept="image/*" ref={fileInputRef} style={{display:'none'}} onChange={handlePhotoChange} />
          <button onClick={() => fileInputRef.current.click()} disabled={submitting} style={{margin:'8px 0',padding:'6px 18px',borderRadius:6,border:'1.5px solid #388e3c',background:'#fff',color:'#388e3c',fontWeight:700,cursor:'pointer'}}>Cambiar foto</button>
          {editPhoto && (
            <button onClick={handleSavePhoto} disabled={submitting} style={{marginLeft:8,padding:'6px 18px',borderRadius:6,border:'1.5px solid #388e3c',background:'#388e3c',color:'#fff',fontWeight:700,cursor:'pointer'}}>Guardar</button>
          )}
        </div>
      </div>
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