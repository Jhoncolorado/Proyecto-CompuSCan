import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout, getCurrentUser } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials);
      setUser(response.usuario);
      navigate('/');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  // Función para actualizar los datos del usuario en el contexto
  const updateUserInContext = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
  };

  const value = {
    user,
    loading,
    login: loginUser,
    logout: logoutUser,
    updateUserInContext,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 