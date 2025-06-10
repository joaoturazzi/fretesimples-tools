
import env from '@/config/env';
import { BaseMapService } from './BaseMapService';

export interface GeocodeResponse {
  lat: number;
  lng: number;
  address: string;
}

export class UnifiedGeocodingService extends BaseMapService {
  
  async geocodeAddress(address: string): Promise<GeocodeResponse | null> {
    if (!address?.trim()) {
      throw new Error('Address is required');
    }

    const cacheKey = this.generateCacheKey('geocode', address);
    const cached = this.getCachedData<GeocodeResponse>(cacheKey);
    if (cached) return cached;

    // Try HERE Maps first
    let result = await this.geocodeWithHere(address);
    
    // If failed, try Nominatim
    if (!result) {
      result = await this.geocodeWithNominatim(address);
    }

    if (!result) {
      throw new Error(`Could not find location for: ${address}`);
    }

    this.setCachedData(cacheKey, result);
    return result;
  }

  private async geocodeWithHere(address: string): Promise<GeocodeResponse | null> {
    try {
      if (!this.checkRateLimit()) {
        await this.delay(60000);
      }

      const url = `${env.HERE_GEOCODE_API}/geocode?q=${encodeURIComponent(address)}&in=countryCode:BRA&apiKey=${env.HERE_API_KEY}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          return {
            lat: item.position.lat,
            lng: item.position.lng,
            address: item.address.label
          };
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private async geocodeWithNominatim(address: string): Promise<GeocodeResponse | null> {
    try {
      await this.delay(1000); // Respect Nominatim rate limits
      
      const url = `${env.NOMINATIM_API}/search?format=json&q=${encodeURIComponent(address)}&countrycodes=br&limit=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'FreteSimples/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const item = data[0];
          return {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            address: item.display_name
          };
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
