
import env from '@/config/env';
import { BaseMapService } from './BaseMapService';
import { UnifiedGeocodingService, GeocodeResponse } from './UnifiedGeocodingService';

export interface RouteResponse {
  distance: number;
  duration: number;
  route: {
    geometry: Array<{ lat: number; lng: number }>;
  };
}

export class UnifiedRoutingService extends BaseMapService {
  private geocodingService = new UnifiedGeocodingService();

  async calculateRoute(origin: string, destination: string): Promise<RouteResponse | null> {
    if (!origin?.trim() || !destination?.trim()) {
      throw new Error('Both origin and destination are required');
    }

    if (origin.trim() === destination.trim()) {
      throw new Error('Origin and destination cannot be the same');
    }

    const cacheKey = this.generateCacheKey('route', { origin: origin.toLowerCase(), destination: destination.toLowerCase() });
    const cached = this.getCachedData<RouteResponse>(cacheKey);
    if (cached) {
      console.log('UnifiedRoutingService: Usando dados em cache para rota:', { origin, destination });
      return cached;
    }

    try {
      console.log('UnifiedRoutingService: Calculando rota de', origin, 'para', destination);
      console.log('UnifiedRoutingService: Status da API key:', env.HERE_API_KEY ? 'Presente' : 'Ausente');
      
      // Geocode both addresses
      const [originCoords, destCoords] = await Promise.all([
        this.geocodingService.geocodeAddress(origin),
        this.geocodingService.geocodeAddress(destination)
      ]);
      
      if (!originCoords) {
        throw new Error(`Could not find location for: ${origin}`);
      }
      
      if (!destCoords) {
        throw new Error(`Could not find location for: ${destination}`);
      }

      console.log('UnifiedRoutingService: Coordenadas obtidas:', { originCoords, destCoords });

      // Calculate direct distance using Haversine formula
      const distance = this.calculateHaversineDistance(
        originCoords.lat, originCoords.lng,
        destCoords.lat, destCoords.lng
      );
      
      // Estimate duration based on distance (average speed 60 km/h)
      const duration = Math.round((distance / 60) * 60);

      // Generate simple route geometry
      const geometry = this.generateRouteGeometry(originCoords, destCoords, distance);
      
      const result = {
        distance,
        duration,
        route: { geometry }
      };

      console.log('UnifiedRoutingService: Rota calculada com sucesso:', result);
      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('UnifiedRoutingService: Erro ao calcular rota:', error);
      throw error instanceof Error ? error : new Error('Failed to calculate route');
    }
  }

  private calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }

  private generateRouteGeometry(origin: GeocodeResponse, destination: GeocodeResponse, distance: number): Array<{ lat: number; lng: number }> {
    const geometry: Array<{ lat: number; lng: number }> = [];
    const steps = Math.min(20, Math.max(5, Math.floor(distance / 50)));
    
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = origin.lat + (destination.lat - origin.lat) * ratio;
      const lng = origin.lng + (destination.lng - origin.lng) * ratio;
      geometry.push({ lat, lng });
    }
    
    return geometry;
  }
}
