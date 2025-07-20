import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { MockDataService } from '../services/MockDataService';
import { config } from '../config/environment';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use MockDataService for authentication
      const response = await MockDataService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        return;
      }
      
      // Fallback to localStorage for demo
      const userData = localStorage.getItem('user_data');
      const authToken = localStorage.getItem('auth_token');
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (authToken) {
            setUser(parsedUser);
          } else {
            // Clear invalid session
            localStorage.removeItem('user_data');
            setUser(null);
          }
        } catch {
          localStorage.removeItem('user_data');
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setError('Failed to check authentication status');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Use MockDataService for authentication
      const response = await MockDataService.signIn(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        localStorage.setItem('auth_token', response.data.token);
        return true;
      }
      
      setError(response.error || 'Invalid email or password');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await MockDataService.signOut();
      setUser(null);
      
      // Clear local storage
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};