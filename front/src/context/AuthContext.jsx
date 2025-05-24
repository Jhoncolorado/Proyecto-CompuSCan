import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout, getCurrentUser } from '../services/auth';
import axios from 'axios';

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
      // Realizar el login inicial
      const response = await login(credentials);
      
      // Obtener datos completos del usuario después del login
      if (response.usuario && response.usuario.id) {
        try {
          const fullUserResponse = await axios.get(`https://compuscan-backend.vercel.app/api/usuarios/${response.usuario.id}`);
          // Actualizar el usuario con los datos completos
          setUser(fullUserResponse.data);
        } catch (error) {
          console.error('Error al obtener datos completos del usuario:', error);
          // Si falla, usar los datos básicos del login
          setUser(response.usuario);
        }
      } else {
        setUser(response.usuario);
      }
      
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