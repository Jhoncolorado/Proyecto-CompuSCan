import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormError from '../../components/FormError';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!nueva || !confirmar) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (nueva !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/usuarios/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nueva })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al restablecer la contraseña');
      setSuccess('Contraseña restablecida exitosamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg-gradient">
      <div className="auth-container auth-compact">
        <h1 className="auth-title">Restablecer Contraseña</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nueva">Nueva contraseña</label>
            <input
              type="password"
              id="nueva"
              name="nueva"
              value={nueva}
              onChange={e => setNueva(e.target.value)}
              placeholder="Nueva contraseña"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmar">Confirmar nueva contraseña</label>
            <input
              type="password"
              id="confirmar"
              name="confirmar"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              placeholder="Confirmar contraseña"
              required
            />
          </div>
          {error && <FormError message={error} visible={true} />}
          {success && <div className="auth-success">{success}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 