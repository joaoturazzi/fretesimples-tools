
import env from '@/config/env';
import { CacheService } from '../cacheService';
import { HttpClient } from './HttpClient';
import { ApiError } from './ApiError';

export interface GeocodeResponse {
  lat: number;
  lng: number;
  address: string;
}

export class GeocodingService {
  private httpClient = new HttpClient();
  private readonly geocodeUrl = env.HERE_GEOCODE_API;
  private readonly apiKey = env.HERE_API_KEY;

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
          const data = await this.httpClient.makeRequest<any>(url);
          
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

  clearCache(): void {
    CacheService.clear('geocode');
  }
}
