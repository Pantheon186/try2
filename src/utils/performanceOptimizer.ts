// Performance Optimization Utilities
export class PerformanceOptimizer {
  private static imageCache = new Map<string, string>();
  private static componentCache = new Map<string, any>();

  // Debounce function for search inputs
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle function for scroll events
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Memoization for expensive calculations
  static memoize<T extends (...args: any[]) => any>(
    func: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map<string, ReturnType<T>>();
    
    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      
      const result = func(...args);
      cache.set(key, result);
      
      // Limit cache size
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      return result;
    }) as T;
  }

  // Image optimization and lazy loading
  static optimizeImageUrl(url: string, width?: number, height?: number): string {
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url)!;
    }

    // For Pexels images, add optimization parameters
    if (url.includes('pexels.com')) {
      const optimizedUrl = width && height 
        ? `${url}?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`
        : `${url}?auto=compress&cs=tinysrgb&w=800`;
      
      this.imageCache.set(url, optimizedUrl);
      return optimizedUrl;
    }

    return url;
  }

  // Lazy loading intersection observer
  static createLazyLoader(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };

    return new IntersectionObserver(callback, defaultOptions);
  }

  // Virtual scrolling calculations
  static calculateVisibleItems(
    containerHeight: number,
    itemHeight: number,
    scrollTop: number,
    totalItems: number,
    overscan: number = 5
  ): { startIndex: number; endIndex: number } {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      totalItems - 1
    );

    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(totalItems - 1, visibleEnd + overscan);

    return { startIndex, endIndex };
  }

  // Bundle splitting and code splitting helpers
  static async loadComponent<T>(
    importFunc: () => Promise<{ default: T }>
  ): Promise<T> {
    const cacheKey = importFunc.toString();
    
    if (this.componentCache.has(cacheKey)) {
      return this.componentCache.get(cacheKey);
    }

    try {
      const module = await importFunc();
      this.componentCache.set(cacheKey, module.default);
      return module.default;
    } catch (error) {
      console.error('Failed to load component:', error);
      throw error;
    }
  }

  // Memory management
  static clearCaches(): void {
    this.imageCache.clear();
    this.componentCache.clear();
  }

  // Performance monitoring
  static measurePerformance<T>(
    name: string,
    func: () => T
  ): T {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    
    console.log(`Performance: ${name} took ${end - start} milliseconds`);
    
    // In production, send to analytics
    if (import.meta.env.PROD) {
      // TODO: Send to performance monitoring service
    }
    
    return result;
  }

  // Async performance measurement
  static async measureAsyncPerformance<T>(
    name: string,
    func: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    const result = await func();
    const end = performance.now();
    
    console.log(`Async Performance: ${name} took ${end - start} milliseconds`);
    
    return result;
  }

  // Resource preloading
  static preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }

  static preloadImages(urls: string[]): Promise<void[]> {
    return Promise.all(urls.map(url => this.preloadImage(url)));
  }

  // Network optimization
  static createOptimizedFetch(
    baseURL: string,
    defaultOptions: RequestInit = {}
  ) {
    return async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch(`${baseURL}${endpoint}`, {
          ...defaultOptions,
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...defaultOptions.headers,
            ...options.headers
          }
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };
  }

  // Local storage optimization
  static setStorageItem(key: string, value: any, ttl?: number): void {
    const item = {
      value,
      timestamp: Date.now(),
      ttl: ttl || 24 * 60 * 60 * 1000 // Default 24 hours
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      // Storage full, clear old items
      this.clearExpiredStorage();
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch {
        console.warn('Unable to store item in localStorage');
      }
    }
  }

  static getStorageItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();

      if (now - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  }

  static clearExpiredStorage(): void {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      try {
        const item = JSON.parse(localStorage.getItem(key) || '');
        if (item.timestamp && item.ttl && now - item.timestamp > item.ttl) {
          keysToRemove.push(key);
        }
      } catch {
        // Invalid JSON, remove it
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Web Workers for heavy computations
  static createWorker(workerFunction: Function): Worker {
    const blob = new Blob([`(${workerFunction.toString()})()`], {
      type: 'application/javascript'
    });
    
    return new Worker(URL.createObjectURL(blob));
  }

  // Service Worker registration
  static async registerServiceWorker(scriptURL: string): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(scriptURL);
        console.log('Service Worker registered successfully');
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }
}