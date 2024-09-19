import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserProfile } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const isValid = await validateToken(token);
        if (isValid) {
          await fetchUserData(token);
        } else {
          logout();
        }
      }
    };

    initializeAuth();
  }, []);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const userData = await getUserProfile(token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    await fetchUserData(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}