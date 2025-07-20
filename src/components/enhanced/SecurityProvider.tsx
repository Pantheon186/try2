import React, { createContext, useContext, ReactNode } from 'react';
import { useSecurityMonitor } from '../../hooks/useSecurityMonitor';
import { useAuth } from '../../hooks/useAuth';

interface SecurityContextType {
  checkRateLimit: (action: string, maxRequests?: number) => boolean;
  detectSuspiciousActivity: (action: string) => boolean;
  validateInput: (input: string, fieldName: string) => string;
  validateFileUpload: (file: File) => { isValid: boolean; error?: string };
  isBlocked: boolean;
  securityEvents: any[];
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const security = useSecurityMonitor(user?.id);

  return (
    <SecurityContext.Provider value={security}>
      {children}
    </SecurityContext.Provider>
  );
};