
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
}

class CacheServiceClass {
  private cache = new Map<string, CacheItem<any>>();
  private readonly config: CacheConfig = {
    defaultTTL: 10 * 60 * 1000, // 10 minutes
    maxSize: 100,
  };

  // Generate cache key from parameters
  private generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }

  // Check if cache item is expired
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  // Clean expired items
  private cleanup(): void {
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
      }
    }
  }

  // Ensure cache doesn't exceed max size
  private enforceMaxSize(): void {
    if (this.cache.size > this.config.maxSize) {
      // Remove oldest items first
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const itemsToRemove = entries.slice(0, this.cache.size - this.config.maxSize + 10);
      itemsToRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  // Get data from cache
  get<T>(key: string): T | null {
    this.cleanup();
    
    const item = this.cache.get(key);
    if (!item || this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  // Set data in cache
  set<T>(key: string, data: T, ttl?: number): void {
    this.cleanup();
    this.enforceMaxSize();
    
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };
    
    this.cache.set(key, item);
  }

  // Cache API call result
  async cacheApiCall<T>(
    prefix: string,
    params: Record<string, any>,
    apiCall: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const key = this.generateKey(prefix, params);
    
    // Try to get from cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      console.log(`Cache hit for ${key}`);
      return cached;
    }
    
    // Cache miss - make API call
    console.log(`Cache miss for ${key} - making API call`);
    try {
      const result = await apiCall();
      this.set(key, result, ttl);
      return result;
    } catch (error) {
      console.error(`API call failed for ${key}:`, error);
      throw error;
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
    }
  }

  // Get cache statistics
  getStats() {
    this.cleanup();
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      defaultTTL: this.config.defaultTTL,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const CacheService = new CacheServiceClass();
export default CacheService;
