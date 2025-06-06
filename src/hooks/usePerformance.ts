
import { useEffect, useCallback } from 'react';

export const usePerformance = () => {
  // Performance monitoring
  const measurePerformance = useCallback((name: string, fn: () => void | Promise<void>) => {
    return async () => {
      const start = performance.now();
      
      try {
        await fn();
      } finally {
        const end = performance.now();
        const duration = end - start;
        
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
        
        // Track slow operations
        if (duration > 1000) {
          console.warn(`Slow operation detected: ${name} (${duration.toFixed(2)}ms)`);
        }
      }
    };
  }, []);

  // Image lazy loading
  const setupLazyLoading = useCallback(() => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });

      return () => imageObserver.disconnect();
    }
  }, []);

  // Memory usage monitoring
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usage = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
      
      if (usage > 80) {
        console.warn(`High memory usage: ${usage.toFixed(2)}%`);
      }
      
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: usage
      };
    }
    return null;
  }, []);

  useEffect(() => {
    // Setup performance monitoring
    const cleanup = setupLazyLoading();
    
    // Monitor memory every 30 seconds
    const memoryInterval = setInterval(checkMemoryUsage, 30000);
    
    return () => {
      cleanup?.();
      clearInterval(memoryInterval);
    };
  }, [setupLazyLoading, checkMemoryUsage]);

  return {
    measurePerformance,
    checkMemoryUsage
  };
};
