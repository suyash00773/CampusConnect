import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/index.js';
import { authService } from '../services/authService.js';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('campusconnect_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('campusconnect_token');
      if (storedToken) {
        try {
          const currentAdmin = await authService.getCurrentAdmin();
          if (currentAdmin) {
            setAdmin(currentAdmin);
            setToken(storedToken);
          } else {
            setAdmin(null);
            setToken(null);
          }
        } catch {
          setAdmin(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setAdmin(res.admin);
    setToken(res.token);
  };

  const logout = () => {
    authService.logout();
    setAdmin(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
