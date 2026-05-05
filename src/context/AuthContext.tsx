import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getUserInfo } from '../api/auth';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('authToken');
      if (stored) {
        try {
          const userInfo = await getUserInfo();
          setToken(stored);
          setUser(userInfo);
        } catch {
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const signIn = async (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    const userInfo = await getUserInfo();
    setToken(newToken);
    setUser(userInfo);
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const userInfo = await getUserInfo();
    setUser(userInfo);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
