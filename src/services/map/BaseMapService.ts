
import env from '@/config/env';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class BaseMapService {
  protected requestCount = 0;
  protected lastResetTime = Date.now();
  protected cache = new Map<string, CacheItem<any>>();

  protected checkRateLimit(): boolean {
    const now = Date.now();
    if (now - this.lastResetTime >= 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    if (this.requestCount >= env.API_RATE_LIMIT) {
      return false;
    }
    
    this.requestCount++;
    return true;
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected generateCacheKey(prefix: string, data: any): string {
    return `${prefix}_${JSON.stringify(data).toLowerCase()}`;
  }

  protected getCachedData<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  protected setCachedData<T>(key: string, data: T, ttl: number = 3600000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    
    // Auto cleanup old entries
    setTimeout(() => this.cache.delete(key), ttl);
  }

  clearCache(): void {
    this.requestCount = 0;
    this.lastResetTime = Date.now();
    this.cache.clear();
  }

  getCacheStats() {
    return {
      requestCount: this.requestCount,
      lastReset: this.lastResetTime,
      cacheSize: this.cache.size
    };
  }
}
