import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    const { data } = await API.post('auth/token/', { username, password });
    localStorage.setItem('tokens', JSON.stringify(data));
    localStorage.setItem('user', JSON.stringify({ username }));
    setUser({ username });
  };

  const register = async (username, email, password, password2) => {
    await API.post('auth/register/', { username, email, password, password2 });
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
