
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Simulação de login. Em um app real, isso validaria com um backend.
    // Para este exemplo, qualquer usuário/senha é válido, mas vamos usar um fixo para demonstração.
    if (username === 'admin' && password === 'password') {
      const userData = { username, id: '123' };
      localStorage.setItem('authUser', JSON.stringify(userData));
      setUser(userData);
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
  