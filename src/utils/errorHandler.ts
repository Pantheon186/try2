export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export class AppErrorHandler {
  private static errorCounts = new Map<string, number>();
  private static lastErrors = new Map<string, number>();

  static createError(code: string, message: string, details?: any): AppError {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString()
    };
  }

  static handleDatabaseError(error: any): AppError {
    if (error.code) {
      switch (error.code) {
        case '23505':
          return this.createError('DUPLICATE_ENTRY', 'This record already exists');
        case '23503':
          return this.createError('FOREIGN_KEY_VIOLATION', 'Referenced record does not exist');
        case '42P01':
          return this.createError('TABLE_NOT_FOUND', 'Database table not found');
        case 'PGRST116':
          return this.createError('NOT_FOUND', 'Record not found');
        default:
          return this.createError('DATABASE_ERROR', error.message || 'Database operation failed');
      }
    }
    return this.createError('DATABASE_ERROR', 'Database operation failed');
  }

  static handleApiError(error: any): AppError {
    // Rate limiting for repeated errors
    const errorKey = error.message || 'unknown';
    const now = Date.now();
    const lastError = this.lastErrors.get(errorKey) || 0;
    
    if (now - lastError < 1000) { // Same error within 1 second
      const count = this.errorCounts.get(errorKey) || 0;
      this.errorCounts.set(errorKey, count + 1);
      
      if (count > 5) {
        return this.createError(
          'RATE_LIMITED_ERROR',
          'Too many similar errors. Please wait before retrying.',
          { originalError: error }
        );
      }
    } else {
      this.errorCounts.set(errorKey, 1);
    }
    
    this.lastErrors.set(errorKey, now);

    if (error.response) {
      return this.createError(
        `API_ERROR_${error.response.status}`,
        error.response.data?.message || 'An API error occurred',
        error.response.data
      );
    } else if (error.request) {
      return this.createError(
        'NETWORK_ERROR',
        'Unable to connect to the server. Please check your internet connection.',
        error.request
      );
    } else if (error.name === 'ValidationError') {
      return this.createError(
        'VALIDATION_ERROR',
        error.message,
        { field: error.field }
      );
    } else {
      return this.createError(
        'UNKNOWN_ERROR',
        error.message || 'An unexpected error occurred',
        error
      );
    }
  }

  static logError(error: AppError, context?: string): void {
    const logLevel = this.getLogLevel(error.code);
    const logData = {
      timestamp: error.timestamp,
      context: context || 'Unknown',
      code: error.code,
      message: error.message,
      details: error.details
    };

    switch (logLevel) {
      case 'error':
        console.error(`[ERROR] ${context}:`, logData);
        break;
      case 'warn':
        console.warn(`[WARN] ${context}:`, logData);
        break;
      case 'info':
        console.info(`[INFO] ${context}:`, logData);
        break;
      default:
        console.log(`[LOG] ${context}:`, logData);
    }

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      this.sendToErrorTracking(error, context);
    }
  }

  private static getLogLevel(errorCode: string): 'error' | 'warn' | 'info' | 'log' {
    if (errorCode.includes('CRITICAL') || errorCode.includes('SECURITY')) {
      return 'error';
    }
    if (errorCode.includes('VALIDATION') || errorCode.includes('NOT_FOUND')) {
      return 'warn';
    }
    if (errorCode.includes('RATE_LIMITED')) {
      return 'info';
    }
    return 'error';
  }

  private static sendToErrorTracking(error: AppError, context?: string): void {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(new Error(error.message), {
    //   tags: { code: error.code, context },
    //   extra: error.details
    // });
  }

  static clearErrorCounts(): void {
    this.errorCounts.clear();
    this.lastErrors.clear();
  }
}

export class RetryHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: any;
    let currentDelay = delay;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }

        // Don't retry certain types of errors
        if (this.shouldNotRetry(error)) {
          throw error;
        }

        // Exponential backoff with jitter
        const jitter = Math.random() * 0.1 * currentDelay;
        await new Promise(resolve => setTimeout(resolve, currentDelay + jitter));
        currentDelay *= backoffMultiplier;
      }
    }

    throw lastError;
  }

  private static shouldNotRetry(error: any): boolean {
    // Don't retry validation errors, authentication errors, etc.
    const nonRetryableCodes = [
      'VALIDATION_ERROR',
      'AUTHENTICATION_ERROR',
      'AUTHORIZATION_ERROR',
      'NOT_FOUND',
      'DUPLICATE_ENTRY'
    ];

    if (error.code && nonRetryableCodes.includes(error.code)) {
      return true;
    }

    // Don't retry 4xx errors (except 429 - rate limited)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return error.response.status !== 429;
    }

    return false;
  }
}