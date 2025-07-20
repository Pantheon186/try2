import { useState, useEffect, useCallback } from 'react';
import { SecurityEvent, RateLimitInfo } from '../types/enhanced';
import { AppErrorHandler } from '../utils/errorHandler';

interface SecurityMonitorReturn {
  checkRateLimit: (action: string, maxRequests?: number) => boolean;
  detectSuspiciousActivity: (action: string) => boolean;
  validateInput: (input: string, fieldName: string) => string;
  validateFileUpload: (file: File) => { isValid: boolean; error?: string };
  isBlocked: boolean;
  securityEvents: SecurityEvent[];
}

export const useSecurityMonitor = (userId?: string): SecurityMonitorReturn => {
  const [rateLimits, setRateLimits] = useState<Map<string, RateLimitInfo>>(new Map());
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [suspiciousActivityCount, setSuspiciousActivityCount] = useState(0);

  // Rate limiting configuration
  const rateLimitConfig = {
    login: { limit: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
    booking: { limit: 10, window: 60 * 1000 }, // 10 bookings per minute
    search: { limit: 100, window: 60 * 1000 }, // 100 searches per minute
    api: { limit: 1000, window: 60 * 60 * 1000 }, // 1000 API calls per hour
  };

  const checkRateLimit = useCallback((action: string, maxRequests?: number): boolean => {
    const config = rateLimitConfig[action as keyof typeof rateLimitConfig];
    if (!config) return true; // No limit configured

    const key = `${userId || 'anonymous'}_${action}`;
    const now = Date.now();
    const currentLimit = rateLimits.get(key);

    if (!currentLimit) {
      // First request
      setRateLimits(prev => new Map(prev.set(key, {
        limit: maxRequests || config.limit,
        remaining: (maxRequests || config.limit) - 1,
        resetTime: now + config.window
      })));
      return true;
    }

    if (now > currentLimit.resetTime) {
      // Reset window
      setRateLimits(prev => new Map(prev.set(key, {
        limit: maxRequests || config.limit,
        remaining: (maxRequests || config.limit) - 1,
        resetTime: now + config.window
      })));
      return true;
    }

    if (currentLimit.remaining <= 0) {
      // Rate limit exceeded
      logSecurityEvent({
        type: 'rate_limit',
        userId,
        ipAddress: 'unknown',
        userAgent: navigator.userAgent,
        details: { action, limit: currentLimit.limit },
        severity: 'medium'
      });
      return false;
    }

    // Update remaining count
    setRateLimits(prev => new Map(prev.set(key, {
      ...currentLimit,
      remaining: currentLimit.remaining - 1
    })));

    return true;
  }, [userId, rateLimits]);

  const detectSuspiciousActivity = useCallback((action: string): boolean => {
    const suspiciousPatterns = [
      'rapid_requests',
      'unusual_hours',
      'multiple_failures',
      'data_scraping',
      'injection_attempt'
    ];

    // Simple heuristics for suspicious activity detection
    const now = new Date();
    const hour = now.getHours();
    
    // Check for unusual hours (2 AM - 5 AM)
    if (hour >= 2 && hour <= 5) {
      setSuspiciousActivityCount(prev => prev + 1);
    }

    // Check for rapid successive actions
    const recentEvents = securityEvents.filter(
      event => Date.now() - new Date(event.timestamp).getTime() < 60000 // Last minute
    );

    if (recentEvents.length > 20) {
      logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        ipAddress: 'unknown',
        userAgent: navigator.userAgent,
        details: { action, pattern: 'rapid_requests', count: recentEvents.length },
        severity: 'high'
      });
      return true;
    }

    // Block user if too many suspicious activities
    if (suspiciousActivityCount > 10) {
      setIsBlocked(true);
      logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        ipAddress: 'unknown',
        userAgent: navigator.userAgent,
        details: { action: 'user_blocked', reason: 'excessive_suspicious_activity' },
        severity: 'critical'
      });
      return true;
    }

    return false;
  }, [userId, securityEvents, suspiciousActivityCount]);

  const validateInput = useCallback((input: string, fieldName: string): string => {
    // XSS Prevention
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    // SQL Injection Prevention
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(--|\/\*|\*\/|;)/g,
      /(\b(OR|AND)\b.*=.*)/gi
    ];

    sqlPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        logSecurityEvent({
          type: 'suspicious_activity',
          userId,
          ipAddress: 'unknown',
          userAgent: navigator.userAgent,
          details: { 
            field: fieldName, 
            input: input.substring(0, 100),
            pattern: 'sql_injection_attempt'
          },
          severity: 'high'
        });
        
        // Remove suspicious content
        sanitized = sanitized.replace(pattern, '');
      }
    });

    // Length validation
    if (sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 1000);
    }

    return sanitized.trim();
  }, [userId]);

  const validateFileUpload = useCallback((file: File): { isValid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ];

    const dangerousExtensions = [
      '.exe', '.bat', '.cmd', '.scr', '.pif', '.com',
      '.js', '.jar', '.vbs', '.ps1', '.sh'
    ];

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        ipAddress: 'unknown',
        userAgent: navigator.userAgent,
        details: { 
          fileName: file.name,
          fileType: file.type,
          pattern: 'disallowed_file_type'
        },
        severity: 'medium'
      });

      return {
        isValid: false,
        error: 'File type not allowed'
      };
    }

    // Check for dangerous extensions
    const fileName = file.name.toLowerCase();
    const hasDangerousExtension = dangerousExtensions.some(ext => 
      fileName.endsWith(ext)
    );

    if (hasDangerousExtension) {
      logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        ipAddress: 'unknown',
        userAgent: navigator.userAgent,
        details: { 
          fileName: file.name,
          pattern: 'dangerous_file_extension'
        },
        severity: 'high'
      });

      return {
        isValid: false,
        error: 'File extension not allowed'
      };
    }

    return { isValid: true };
  }, [userId]);

  const logSecurityEvent = useCallback((event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const securityEvent: SecurityEvent = {
      ...event,
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    setSecurityEvents(prev => [securityEvent, ...prev.slice(0, 99)]); // Keep last 100 events

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn('Security Event:', securityEvent);
    }

    // In production, send to security monitoring service
    if (import.meta.env.PROD && event.severity === 'critical') {
      // TODO: Send to security monitoring service
      AppErrorHandler.logError(
        AppErrorHandler.createError('SECURITY_EVENT', event.details?.pattern || 'Unknown security event'),
        'SecurityMonitor'
      );
    }
  }, []);

  // Cleanup old rate limit entries
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setRateLimits(prev => {
        const updated = new Map(prev);
        for (const [key, limit] of updated.entries()) {
          if (now > limit.resetTime) {
            updated.delete(key);
          }
        }
        return updated;
      });
    }, 60000); // Cleanup every minute

    return () => clearInterval(cleanup);
  }, []);

  // Reset suspicious activity count periodically
  useEffect(() => {
    const reset = setInterval(() => {
      setSuspiciousActivityCount(0);
      setIsBlocked(false);
    }, 24 * 60 * 60 * 1000); // Reset every 24 hours

    return () => clearInterval(reset);
  }, []);

  return {
    checkRateLimit,
    detectSuspiciousActivity,
    validateInput,
    validateFileUpload,
    isBlocked,
    securityEvents
  };
};