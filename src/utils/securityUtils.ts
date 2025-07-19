// Security utilities for the application
export class SecurityUtils {
  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .trim();
  }

  // XSS prevention
  static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // SQL injection prevention for search queries
  static sanitizeSearchQuery(query: string): string {
    return query
      .replace(/['"\\;]/g, '') // Remove quotes and semicolons
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove SQL block comments
      .replace(/\*\//g, '')
      .trim();
  }

  // Validate file uploads
  static validateFileUpload(file: File): {
    isValid: boolean;
    error?: string;
  } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not allowed'
      };
    }

    // Check file extension matches MIME type
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeTypeMap: Record<string, string[]> = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/gif': ['gif'],
      'image/webp': ['webp'],
      'application/pdf': ['pdf'],
      'text/plain': ['txt']
    };

    const expectedExtensions = mimeTypeMap[file.type];
    if (expectedExtensions && extension && !expectedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: 'File extension does not match file type'
      };
    }

    return { isValid: true };
  }

  // Rate limiting
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 60000 // 1 minute
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    let record = this.rateLimitMap.get(identifier);
    
    if (!record || record.resetTime < windowStart) {
      record = { count: 0, resetTime: now + windowMs };
      this.rateLimitMap.set(identifier, record);
    }
    
    if (record.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      };
    }
    
    record.count++;
    
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime
    };
  }

  // Password strength validation
  static validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain uppercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain numbers');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain special characters');
    }

    // Check for common patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /letmein/i
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
      score -= 2;
      feedback.push('Password contains common patterns');
    }

    return {
      isStrong: score >= 4,
      score: Math.max(0, score),
      feedback
    };
  }

  // Generate secure random string
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate JWT token format (basic check)
  static isValidJWTFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  // Content Security Policy helpers
  static generateCSPNonce(): string {
    return this.generateSecureToken(16);
  }

  // Secure cookie settings
  static getSecureCookieOptions(): {
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  } {
    return {
      secure: window.location.protocol === 'https:',
      httpOnly: true,
      sameSite: 'strict'
    };
  }

  // Validate URL to prevent open redirects
  static isValidRedirectUrl(url: string, allowedDomains: string[]): boolean {
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTPS in production
      if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
        return false;
      }
      
      // Check if domain is in allowed list
      return allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }

  // Audit log entry
  static createAuditLog(
    action: string,
    userId: string,
    resourceType: string,
    resourceId: string,
    metadata?: Record<string, any>
  ): {
    timestamp: string;
    action: string;
    userId: string;
    resourceType: string;
    resourceId: string;
    metadata?: Record<string, any>;
    userAgent: string;
    ipAddress: string;
  } {
    return {
      timestamp: new Date().toISOString(),
      action,
      userId,
      resourceType,
      resourceId,
      metadata,
      userAgent: navigator.userAgent,
      ipAddress: 'client-side' // In real app, get from server
    };
  }

  // Detect suspicious activity patterns
  static detectSuspiciousActivity(
    userId: string,
    action: string,
    timeWindow: number = 300000 // 5 minutes
  ): boolean {
    const key = `${userId}:${action}`;
    const now = Date.now();
    
    // Get recent activity
    const recentActivity = this.rateLimitMap.get(key);
    
    if (!recentActivity) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + timeWindow });
      return false;
    }
    
    // Check for rapid repeated actions
    if (recentActivity.count > 20 && now < recentActivity.resetTime) {
      return true; // Suspicious activity detected
    }
    
    return false;
  }

  // Clean up rate limit data periodically
  static cleanupRateLimitData(): void {
    const now = Date.now();
    for (const [key, value] of this.rateLimitMap) {
      if (now > value.resetTime) {
        this.rateLimitMap.delete(key);
      }
    }
  }
}

// Auto cleanup rate limit data
setInterval(() => {
  SecurityUtils.cleanupRateLimitData();
}, 300000); // Clean every 5 minutes