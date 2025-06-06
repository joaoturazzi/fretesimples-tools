
import env from '@/config/env';
import { ApiError } from './ApiError';
import { RateLimiter } from './RateLimiter';

export class HttpClient {
  private rateLimiter = new RateLimiter();

  async makeRequest<T>(
    url: string, 
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    if (!this.rateLimiter.checkRateLimit()) {
      throw new ApiError('Rate limit exceeded. Please try again later.');
    }

    try {
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`API Error ${response.status}:`, errorData);
        
        throw new ApiError(
          `API request failed: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error(`Request failed (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < env.API_RETRY_ATTEMPTS - 1) {
        const delay = env.API_RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Retrying in ${delay}ms...`);
        await this.rateLimiter.delay(delay);
        return this.makeRequest<T>(url, options, retryCount + 1);
      }
      
      throw error instanceof ApiError ? error : new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }
}
