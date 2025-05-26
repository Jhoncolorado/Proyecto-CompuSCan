import React, { useState } from 'react';
import FormError from '../../components/FormError';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/usuarios/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar el correo');
      setSuccess('Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg-gradient">
      <div className="auth-container auth-compact">
        <h1 className="auth-title">Recuperar Contraseña</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          {error && <FormError message={error} visible={true} />}
          {success && <div className="auth-success">{success}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 