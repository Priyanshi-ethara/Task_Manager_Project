import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authService from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('tt_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const persist = (u, t) => {
    if (u) localStorage.setItem('tt_user', JSON.stringify(u));
    if (t) localStorage.setItem('tt_token', t);
    setUser(u);
  };

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('tt_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await authService.me();
      setUser(data.user);
      localStorage.setItem('tt_user', JSON.stringify(data.user));
    } catch {
      localStorage.removeItem('tt_token');
      localStorage.removeItem('tt_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    persist(data.user, data.token);
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    persist(data.user, data.token);
    toast.success('Account created — welcome aboard!');
    return data.user;
  };

  const updateProfile = async (data) => {
    const res = await authService.updateMe(data);
    persist(res.user, null);
    toast.success('Profile updated');
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('tt_token');
    localStorage.removeItem('tt_user');
    setUser(null);
    toast.info('Signed out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
