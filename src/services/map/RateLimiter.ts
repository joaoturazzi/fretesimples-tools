
import env from '@/config/env';

export class RateLimiter {
  private requestCount = 0;
  private lastResetTime = Date.now();

  checkRateLimit(): boolean {
    const now = Date.now();
    if (now - this.lastResetTime >= 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    if (this.requestCount >= env.API_RATE_LIMIT) {
      console.warn('HERE Maps API rate limit exceeded');
      return false;
    }
    
    this.requestCount++;
    return true;
  }

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
