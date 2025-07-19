import { useState, useEffect, useCallback } from 'react';
import { SecurityUtils } from '../utils/securityUtils';
import { useNotifications } from './useNotifications';

interface SecurityEvent {
  type: 'suspicious_activity' | 'rate_limit_exceeded' | 'invalid_access' | 'security_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const useSecurityMonitor = (userId?: string) => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const { showWarning, showError } = useNotifications();

  const logSecurityEvent = useCallback((event: Omit<SecurityEvent, 'timestamp'>) => {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    setSecurityEvents(prev => [securityEvent, ...prev.slice(0, 99)]); // Keep last 100 events

    // Show notification for high/critical events
    if (event.severity === 'high' || event.severity === 'critical') {
      if (event.severity === 'critical') {
        showError('Security Alert', event.message);
      } else {
        showWarning('Security Warning', event.message);
      }
    }

    // Auto-block for critical events
    if (event.severity === 'critical') {
      setIsBlocked(true);
      setTimeout(() => setIsBlocked(false), 300000); // Block for 5 minutes
    }

    console.warn('Security Event:', securityEvent);
  }, [showWarning, showError]);

  const checkRateLimit = useCallback((action: string, maxRequests: number = 100) => {
    if (!userId) return true;

    const identifier = `${userId}:${action}`;
    const result = SecurityUtils.checkRateLimit(identifier, maxRequests);

    if (!result.allowed) {
      logSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        message: `Rate limit exceeded for action: ${action}`,
        metadata: { action, remaining: result.remaining }
      });
      return false;
    }

    return true;
  }, [userId, logSecurityEvent]);

  const detectSuspiciousActivity = useCallback((action: string) => {
    if (!userId) return false;

    const isSuspicious = SecurityUtils.detectSuspiciousActivity(userId, action);

    if (isSuspicious) {
      logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        message: `Suspicious activity detected: rapid ${action} actions`,
        metadata: { action, userId }
      });
      return true;
    }

    return false;
  }, [userId, logSecurityEvent]);

  const validateInput = useCallback((input: string, fieldName: string): string => {
    const sanitized = SecurityUtils.sanitizeInput(input);
    
    if (sanitized !== input) {
      logSecurityEvent({
        type: 'security_violation',
        severity: 'medium',
        message: `Potentially malicious input detected in ${fieldName}`,
        metadata: { fieldName, originalLength: input.length, sanitizedLength: sanitized.length }
      });
    }

    return sanitized;
  }, [logSecurityEvent]);

  const validateFileUpload = useCallback((file: File) => {
    const validation = SecurityUtils.validateFileUpload(file);
    
    if (!validation.isValid) {
      logSecurityEvent({
        type: 'security_violation',
        severity: 'medium',
        message: `Invalid file upload attempt: ${validation.error}`,
        metadata: { 
          fileName: file.name, 
          fileSize: file.size, 
          fileType: file.type,
          error: validation.error
        }
      });
    }

    return validation;
  }, [logSecurityEvent]);

  // Monitor for client-side security issues
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Check for potential XSS attempts
      if (event.message.includes('script') || event.message.includes('eval')) {
        logSecurityEvent({
          type: 'security_violation',
          severity: 'critical',
          message: 'Potential XSS attempt detected',
          metadata: { 
            message: event.message,
            filename: event.filename,
            lineno: event.lineno
          }
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Log unhandled promise rejections that might indicate security issues
      if (event.reason?.message?.includes('network') || 
          event.reason?.message?.includes('fetch')) {
        logSecurityEvent({
          type: 'security_violation',
          severity: 'low',
          message: 'Network request failed - possible tampering',
          metadata: { reason: event.reason?.message }
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [logSecurityEvent]);

  // Monitor for suspicious navigation patterns
  useEffect(() => {
    let navigationCount = 0;
    const startTime = Date.now();

    const handleNavigation = () => {
      navigationCount++;
      
      // If more than 50 navigations in 1 minute, flag as suspicious
      if (navigationCount > 50 && Date.now() - startTime < 60000) {
        logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          message: 'Excessive navigation detected - possible bot activity',
          metadata: { navigationCount, timeWindow: Date.now() - startTime }
        });
      }
    };

    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [logSecurityEvent]);

  return {
    securityEvents,
    isBlocked,
    logSecurityEvent,
    checkRateLimit,
    detectSuspiciousActivity,
    validateInput,
    validateFileUpload
  };
};