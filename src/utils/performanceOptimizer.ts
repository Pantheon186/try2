// Performance optimization utilities
export class PerformanceOptimizer {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static observers = new Map<string, IntersectionObserver>();

  // Memoization with TTL
  static memoize<T extends (...args: any[]) => any>(
    fn: T,
    keyGenerator: (...args: Parameters<T>) => string,
    ttl: number = 300000 // 5 minutes default
  ): T {
    return ((...args: Parameters<T>) => {
      const key = keyGenerator(...args);
      const cached = this.cache.get(key);
      
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
      
      const result = fn(...args);
      this.cache.set(key, {
        data: result,
        timestamp: Date.now(),
        ttl
      });
      
      return result;
    }) as T;
  }

  // Debounce function calls
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

  // Throttle function calls
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

  // Lazy loading with Intersection Observer
  static createLazyLoader(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    const observer = new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
    
    return observer;
  }

  // Virtual scrolling helper
  static calculateVisibleItems(
    containerHeight: number,
    itemHeight: number,
    scrollTop: number,
    totalItems: number,
    overscan: number = 5
  ): { startIndex: number; endIndex: number; visibleItems: number } {
    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan * 2);
    
    return { startIndex, endIndex, visibleItems };
  }

  // Image optimization
  static optimizeImageUrl(
    url: string,
    width?: number,
    height?: number,
    quality: number = 80
  ): string {
    // In a real app, this would integrate with image optimization services
    // like Cloudinary, ImageKit, or custom CDN
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', quality.toString());
    params.append('f', 'auto'); // Auto format selection
    
    return `${url}?${params.toString()}`;
  }

  // Bundle splitting helper
  static async loadComponent<T>(
    importFn: () => Promise<{ default: T }>
  ): Promise<T> {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      console.error('Failed to load component:', error);
      throw error;
    }
  }

  // Memory usage monitoring
  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      };
    }
    return null;
  }

  // Clear cache
  static clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const [key] of this.cache) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Cleanup expired cache entries
  static cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Preload critical resources
  static preloadResource(url: string, type: 'script' | 'style' | 'image' | 'fetch'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'image':
        link.as = 'image';
        break;
      case 'fetch':
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
        break;
    }
    
    document.head.appendChild(link);
  }

  // Performance monitoring
  static measurePerformance<T>(
    name: string,
    fn: () => T
  ): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`Performance: ${name} took ${end - start} milliseconds`);
    
    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      // Send to analytics service
    }
    
    return result;
  }

  // Async performance measurement
  static async measureAsyncPerformance<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    console.log(`Async Performance: ${name} took ${end - start} milliseconds`);
    
    return result;
  }
}

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  React.useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`Component ${componentName} was mounted for ${end - start} milliseconds`);
    };
  }, [componentName]);
};

// Auto cleanup cache on interval
setInterval(() => {
  PerformanceOptimizer.cleanupCache();
}, 300000); // Clean every 5 minutes