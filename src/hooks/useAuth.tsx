import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { SupabaseService } from '../services/SupabaseService';
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
      
      const response = await SupabaseService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setError('Failed to check authentication status');
      setUser(null);
      
      // Fallback to localStorage for demo
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          localStorage.removeItem('user_data');
        }
      }
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
      
      // Try Supabase first if configured
      if (config.database.useSupabase) {
        try {
          const response = await SupabaseService.signIn(email, password);
          
          if (response.success && response.data) {
            setUser(response.data.user);
            localStorage.setItem('user_data', JSON.stringify(response.data.user));
            localStorage.setItem('auth_token', response.data.token);
            return true;
          }
        } catch (supabaseError) {
          console.warn('Supabase login failed, trying demo credentials:', supabaseError);
        }
      }
      
      // Fallback to demo credentials
      const demoCredentials = {
        'agent_demo@example.com': { 
          password: 'demo123', 
          user: { 
            id: '550e8400-e29b-41d4-a716-446655440001', 
            email: 'agent_demo@example.com', 
            name: 'John Smith', 
            role: 'Travel Agent', 
            status: 'Active', 
            region: 'Mumbai',
            phone: '+91 9876543210'
          } 
        },
        'admin_demo@example.com': { 
          password: 'admin123', 
          user: { 
            id: '550e8400-e29b-41d4-a716-446655440002', 
            email: 'admin_demo@example.com', 
            name: 'Sarah Johnson', 
            role: 'Basic Admin', 
            status: 'Active', 
            region: 'Delhi',
            phone: '+91 9876543211'
          } 
        },
        'superadmin_demo@example.com': { 
          password: 'super123', 
          user: { 
            id: '550e8400-e29b-41d4-a716-446655440003', 
            email: 'superadmin_demo@example.com', 
            name: 'Michael Chen', 
            role: 'Super Admin', 
            status: 'Active', 
            region: 'Mumbai',
            phone: '+91 9876543212'
          } 
        }
      };

      const credential = demoCredentials[email as keyof typeof demoCredentials];
      if (credential && credential.password === password) {
        setUser(credential.user as User);
        localStorage.setItem('user_data', JSON.stringify(credential.user));
        localStorage.setItem('auth_token', `demo_token_${Date.now()}`);
        return true;
      }
      
      setError('Invalid email or password');
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
      
      await SupabaseService.signOut();
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