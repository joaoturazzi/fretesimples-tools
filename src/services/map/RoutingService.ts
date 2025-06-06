
import env from '@/config/env';
import { CacheService } from '../cacheService';
import { HttpClient } from './HttpClient';
import { PolylineDecoder } from './PolylineDecoder';
import { GeocodingService, GeocodeResponse } from './GeocodingService';
import { ApiError } from './ApiError';

export interface RouteResponse {
  distance: number;
  duration: number;
  route: {
    geometry: Array<{ lat: number; lng: number }>;
  };
}

export class RoutingService {
  private httpClient = new HttpClient();
  private geocodingService = new GeocodingService();
  private readonly baseUrl = env.HERE_ROUTER_API;
  private readonly apiKey = env.HERE_API_KEY;

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
            this.geocodingService.geocodeAddress(origin),
            this.geocodingService.geocodeAddress(destination)
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
          const data = await this.httpClient.makeRequest<any>(url);
          
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const summary = route.sections[0].summary;
            const polyline = route.sections[0].polyline;
            
            return {
              distance: Math.round(summary.length / 1000), // Convert to km
              duration: Math.round(summary.duration / 60), // Convert to minutes
              route: {
                geometry: PolylineDecoder.decode(polyline || '')
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

  clearCache(): void {
    CacheService.clear('route');
  }
}
