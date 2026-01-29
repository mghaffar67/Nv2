
import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  phone: string;
  balance: number;
  referralCode: string;
  currentPlan: string | null;
  avatar?: string;
  lastCheckIn?: string;
  streak?: number;
  isBanned?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, referralCode?: string) => Promise<void>;
  demoLogin: (role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // SECURE SESSION RECOVERY PROTOCOL (For Vercel Deployment)
  useLayoutEffect(() => {
    const recoverSession = async () => {
      const token = localStorage.getItem('noor_token');
      const cachedUserStr = localStorage.getItem('noor_user');
      
      if (token && cachedUserStr) {
        try {
          const parsedUser = JSON.parse(cachedUserStr);
          // Redundancy check: Sync user state with master database to ensure up-to-date data
          const masterDb = JSON.parse(localStorage.getItem('noor_v3_master_registry') || '[]');
          const liveUser = masterDb.find((u: any) => u.id === parsedUser.id);
          
          if (liveUser) {
            const { password: _, ...safeUser } = liveUser;
            setUser(safeUser);
            localStorage.setItem('noor_user', JSON.stringify(safeUser));
          } else {
            setUser(parsedUser);
          }
        } catch (e) {
          console.error("Session recovery failed.");
          localStorage.removeItem('noor_token');
          localStorage.removeItem('noor_user');
        }
      }
      setLoading(false);
    };
    recoverSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email: email.trim(), password });
      
      if (data && data.token && data.user) {
        localStorage.setItem('noor_token', data.token);
        localStorage.setItem('noor_user', JSON.stringify(data.user));
        setUser(data.user);
        
        const target = data.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
        setLoading(false);
        navigate(target, { replace: true });
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Identity verification failed.');
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, referralCode?: string) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, phone, password, referralCode });
      if (data && data.token && data.user) {
        localStorage.setItem('noor_token', data.token);
        localStorage.setItem('noor_user', JSON.stringify(data.user));
        setUser(data.user);
        setLoading(false);
        navigate('/user/dashboard', { replace: true });
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Account creation failed.');
    }
  };

  const demoLogin = async (role: 'user' | 'admin') => {
    const email = role === 'admin' ? 'admin@noor.com' : 'ghaffar@mail.com';
    const password = role === 'admin' ? 'admin123' : 'user123';
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('noor_token');
    localStorage.removeItem('noor_user');
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
