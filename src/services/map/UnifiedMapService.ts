
import { UnifiedGeocodingService, GeocodeResponse } from './UnifiedGeocodingService';
import { UnifiedRoutingService, RouteResponse } from './UnifiedRoutingService';
import { BaseMapService } from './BaseMapService';

export class UnifiedMapService extends BaseMapService {
  private geocodingService = new UnifiedGeocodingService();
  private routingService = new UnifiedRoutingService();

  async geocodeAddress(address: string): Promise<GeocodeResponse | null> {
    return this.geocodingService.geocodeAddress(address);
  }

  async calculateRoute(origin: string, destination: string): Promise<RouteResponse | null> {
    return this.routingService.calculateRoute(origin, destination);
  }

  clearCache(): void {
    super.clearCache();
    this.geocodingService.clearCache();
    this.routingService.clearCache();
  }

  getCacheStats() {
    const baseStats = super.getCacheStats();
    const geocodingStats = this.geocodingService.getCacheStats();
    const routingStats = this.routingService.getCacheStats();
    
    return {
      ...baseStats,
      geocoding: geocodingStats,
      routing: routingStats,
      totalCacheSize: baseStats.cacheSize + geocodingStats.cacheSize + routingStats.cacheSize
    };
  }
}

// Export singleton instance
export const mapService = new UnifiedMapService();
export default mapService;

// Export types
export type { RouteResponse, GeocodeResponse };
