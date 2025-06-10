interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  accessCount: number;
  lastAccessed: number;
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enableCompression: boolean;
  enableAnalytics: boolean;
}

interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  totalRequests: number;
  totalHits: number;
  averageAccessTime: number;
}

class CacheServiceClass {
  private cache = new Map<string, CacheItem<any>>();
  private stats = {
    totalRequests: 0,
    totalHits: 0,
    accessTimes: [] as number[]
  };
  
  private readonly config: CacheConfig = {
    defaultTTL: 10 * 60 * 1000, // 10 minutes
    maxSize: 100,
    enableCompression: true,
    enableAnalytics: true
  };

  // Generate cache key from parameters
  private generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    return `${prefix}:${this.hashString(sortedParams)}`;
  }

  // Simple hash function for cache keys
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Check if cache item is expired
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  // Compress data if enabled
  private compressData<T>(data: T): string {
    if (!this.config.enableCompression) {
      return JSON.stringify(data);
    }
    
    try {
      // Simple compression using JSON.stringify with replacer
      return JSON.stringify(data, (key, value) => {
        if (typeof value === 'string' && value.length > 100) {
          // Basic string compression for long strings
          return value.replace(/\s+/g, ' ').trim();
        }
        return value;
      });
    } catch {
      return JSON.stringify(data);
    }
  }

  // Decompress data
  private decompressData<T>(compressedData: string): T {
    try {
      return JSON.parse(compressedData);
    } catch {
      return compressedData as T;
    }
  }

  // Intelligent cleanup based on usage patterns
  private intelligentCleanup(): void {
    const now = Date.now();
    const itemsToRemove: string[] = [];
    
    for (const [key, item] of this.cache.entries()) {
      // Remove expired items
      if (this.isExpired(item)) {
        itemsToRemove.push(key);
        continue;
      }
      
      // Remove items not accessed recently (older than 1 hour)
      if (now - item.lastAccessed > 60 * 60 * 1000) {
        itemsToRemove.push(key);
        continue;
      }
      
      // Remove items with low access count after 30 minutes
      if (item.accessCount < 2 && now - item.timestamp > 30 * 60 * 1000) {
        itemsToRemove.push(key);
      }
    }
    
    itemsToRemove.forEach(key => this.cache.delete(key));
    
    // If still over limit, remove least recently used items
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      const itemsToRemoveCount = this.cache.size - this.config.maxSize + 10;
      for (let i = 0; i < itemsToRemoveCount; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
  }

  // Track analytics
  private trackAnalytics(operation: string, duration?: number): void {
    if (!this.config.enableAnalytics) return;
    
    this.stats.totalRequests++;
    
    if (duration) {
      this.stats.accessTimes.push(duration);
      // Keep only last 100 access times for average calculation
      if (this.stats.accessTimes.length > 100) {
        this.stats.accessTimes.shift();
      }
    }
    
    // Track in Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cache_operation', {
        event_category: 'performance',
        event_label: operation,
        value: duration ? Math.round(duration) : undefined
      });
    }
  }

  // Get data from cache
  get<T>(key: string): T | null {
    const startTime = performance.now();
    this.intelligentCleanup();
    
    const item = this.cache.get(key);
    if (!item || this.isExpired(item)) {
      this.cache.delete(key);
      this.trackAnalytics('cache_miss', performance.now() - startTime);
      return null;
    }
    
    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();
    
    this.stats.totalHits++;
    this.trackAnalytics('cache_hit', performance.now() - startTime);
    
    try {
      return this.decompressData<T>(item.data);
    } catch {
      this.cache.delete(key);
      return null;
    }
  }

  // Set data in cache
  set<T>(key: string, data: T, ttl?: number): void {
    const startTime = performance.now();
    this.intelligentCleanup();
    
    try {
      const compressedData = this.compressData(data);
      const item: CacheItem<string> = {
        data: compressedData,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL,
        accessCount: 1,
        lastAccessed: Date.now()
      };
      
      this.cache.set(key, item);
      this.trackAnalytics('cache_set', performance.now() - startTime);
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  // Cache API call result with intelligent strategies
  async cacheApiCall<T>(
    prefix: string,
    params: Record<string, any>,
    apiCall: () => Promise<T>,
    options?: {
      ttl?: number;
      forceRefresh?: boolean;
      fallbackOnError?: boolean;
    }
  ): Promise<T> {
    const key = this.generateKey(prefix, params);
    const startTime = performance.now();
    
    // Try to get from cache first (unless force refresh)
    if (!options?.forceRefresh) {
      const cached = this.get<T>(key);
      if (cached !== null) {
        console.log(`Cache hit for ${key}`);
        this.trackAnalytics('api_cache_hit', performance.now() - startTime);
        return cached;
      }
    }
    
    // Cache miss - make API call
    console.log(`Cache miss for ${key} - making API call`);
    try {
      const result = await apiCall();
      this.set(key, result, options?.ttl);
      this.trackAnalytics('api_call_success', performance.now() - startTime);
      return result;
    } catch (error) {
      console.error(`API call failed for ${key}:`, error);
      
      // Try to return stale cache if fallback is enabled
      if (options?.fallbackOnError) {
        const staleCache = this.getStale<T>(key);
        if (staleCache) {
          console.log(`Returning stale cache for ${key}`);
          this.trackAnalytics('api_fallback_cache', performance.now() - startTime);
          return staleCache;
        }
      }
      
      this.trackAnalytics('api_call_error', performance.now() - startTime);
      throw error;
    }
  }

  // Get stale cache (even if expired)
  private getStale<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    try {
      return this.decompressData<T>(item.data);
    } catch {
      return null;
    }
  }

  // Clear specific cache entries
  clear(prefix?: string): void {
    if (prefix) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
      this.stats = {
        totalRequests: 0,
        totalHits: 0,
        accessTimes: []
      };
    }
    
    this.trackAnalytics('cache_clear');
  }

  // Get detailed cache statistics
  getStats(): CacheStats {
    this.intelligentCleanup();
    
    const averageAccessTime = this.stats.accessTimes.length > 0
      ? this.stats.accessTimes.reduce((a, b) => a + b, 0) / this.stats.accessTimes.length
      : 0;
    
    const hitRate = this.stats.totalRequests > 0
      ? (this.stats.totalHits / this.stats.totalRequests) * 100
      : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: Math.round(hitRate * 100) / 100,
      totalRequests: this.stats.totalRequests,
      totalHits: this.stats.totalHits,
      averageAccessTime: Math.round(averageAccessTime * 100) / 100
    };
  }

  // Preload frequently used data
  async preload(prefixes: string[]): Promise<void> {
    console.log('Preloading cache for prefixes:', prefixes);
    // Implementation for preloading commonly used calculations
    this.trackAnalytics('cache_preload');
  }

  // Export cache for backup
  export(): string {
    const exportData = {
      cache: Array.from(this.cache.entries()),
      stats: this.stats,
      timestamp: Date.now()
    };
    
    return JSON.stringify(exportData);
  }

  // Import cache from backup
  import(data: string): boolean {
    try {
      const importData = JSON.parse(data);
      
      // Validate import data
      if (!importData.cache || !Array.isArray(importData.cache)) {
        return false;
      }
      
      // Clear current cache
      this.cache.clear();
      
      // Import cache entries
      for (const [key, item] of importData.cache) {
        this.cache.set(key, item);
      }
      
      // Import stats if available
      if (importData.stats) {
        this.stats = { ...this.stats, ...importData.stats };
      }
      
      this.trackAnalytics('cache_import');
      return true;
    } catch (error) {
      console.error('Failed to import cache:', error);
      return false;
    }
  }
}

// Export singleton instance
export const CacheService = new CacheServiceClass();
export default CacheService;
