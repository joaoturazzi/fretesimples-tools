import env from '@/config/env';
import { CacheService } from './cacheService';

interface RouteResponse {
  distance: number;
  duration: number;
  route: {
    geometry: Array<{ lat: number; lng: number }>;
  };
}

interface GeocodeResponse {
  lat: number;
  lng: number;
  address: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class HereMapsServiceClass {
  private readonly baseUrl = env.HERE_ROUTER_API;
  private readonly geocodeUrl = env.HERE_GEOCODE_API;
  private readonly apiKey = env.HERE_API_KEY;
  private requestCount = 0;
  private lastResetTime = Date.now();

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private checkRateLimit(): boolean {
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

  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    if (!this.checkRateLimit()) {
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
        await this.delay(delay);
        return this.makeRequest<T>(url, options, retryCount + 1);
      }
      
      throw error instanceof ApiError ? error : new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  async geocodeAddress(address: string): Promise<GeocodeResponse | null> {
    if (!address?.trim()) {
      throw new ApiError('Address is required');
    }

    return CacheService.cacheApiCall(
      'geocode',
      { address: address.trim().toLowerCase() },
      async () => {
        try {
          const url = `${this.geocodeUrl}/geocode?q=${encodeURIComponent(address)}&in=countryCode:BRA&apiKey=${this.apiKey}`;
          const data = await this.makeRequest<any>(url);
          
          if (data.items && data.items.length > 0) {
            const item = data.items[0];
            return {
              lat: item.position.lat,
              lng: item.position.lng,
              address: item.address.label
            };
          }
          
          return null;
        } catch (error) {
          console.error('Geocoding error:', error);
          throw error instanceof ApiError ? error : new ApiError('Failed to geocode address');
        }
      },
      30 * 60 * 1000 // Cache geocoding for 30 minutes
    );
  }

  async calculateRoute(origin: string, destination: string): Promise<RouteResponse | null> {
    if (!origin?.trim() || !destination?.trim()) {
      throw new ApiError('Both origin and destination are required');
    }

    if (origin.trim() === destination.trim()) {
      throw new ApiError('Origin and destination cannot be the same');
    }

    return CacheService.cacheApiCall(
      'route',
      { 
        origin: origin.trim().toLowerCase(), 
        destination: destination.trim().toLowerCase() 
      },
      async () => {
        try {
          console.log('Calculating route from', origin, 'to', destination);
          
          // Geocode both addresses
          const [originCoords, destCoords] = await Promise.all([
            this.geocodeAddress(origin),
            this.geocodeAddress(destination)
          ]);
          
          if (!originCoords) {
            throw new ApiError(`Could not find location for: ${origin}`);
          }
          
          if (!destCoords) {
            throw new ApiError(`Could not find location for: ${destination}`);
          }

          console.log('Origin coords:', originCoords);
          console.log('Destination coords:', destCoords);

          const url = `${this.baseUrl}/routes?transportMode=truck&origin=${originCoords.lat},${originCoords.lng}&destination=${destCoords.lat},${destCoords.lng}&return=summary,polyline&apiKey=${this.apiKey}`;
          const data = await this.makeRequest<any>(url);
          
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const summary = route.sections[0].summary;
            const polyline = route.sections[0].polyline;
            
            return {
              distance: Math.round(summary.length / 1000), // Convert to km
              duration: Math.round(summary.duration / 60), // Convert to minutes
              route: {
                geometry: this.decodePolyline(polyline || '')
              }
            };
          }
          
          throw new ApiError('No route found between the specified locations');
        } catch (error) {
          console.error('Route calculation error:', error);
          throw error instanceof ApiError ? error : new ApiError('Failed to calculate route');
        }
      },
      15 * 60 * 1000 // Cache routes for 15 minutes
    );
  }

  private decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
    if (!encoded) return [];
    
    try {
      const coords: Array<{ lat: number; lng: number }> = [];
      let index = 0;
      let lat = 0;
      let lng = 0;

      while (index < encoded.length) {
        let b;
        let shift = 0;
        let result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const deltaLat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;

        shift = 0;
        result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        const deltaLng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lng += deltaLng;

        coords.push({
          lat: lat / 1e5,
          lng: lng / 1e5
        });
      }

      return coords;
    } catch (error) {
      console.error('Error decoding polyline:', error);
      return [];
    }
  }

  // Clear cache method for manual cache management
  clearCache(): void {
    CacheService.clear('geocode');
    CacheService.clear('route');
  }

  // Get cache statistics
  getCacheStats() {
    return CacheService.getStats();
  }
}

// Export singleton instance
export const HereMapsService = new HereMapsServiceClass();

// For backward compatibility
export { HereMapsService as default };

// Export types
export type { RouteResponse, GeocodeResponse };
export { ApiError };
