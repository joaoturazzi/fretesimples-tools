
import { CacheService } from './cacheService';
import { GeocodingService } from './map/GeocodingService';
import { RoutingService } from './map/RoutingService';
import { ApiError } from './map/ApiError';

// Re-export types and classes for backward compatibility
export type { GeocodeResponse } from './map/GeocodingService';
export type { RouteResponse } from './map/RoutingService';
export { ApiError };

class HereMapsServiceClass {
  private geocodingService = new GeocodingService();
  private routingService = new RoutingService();

  async geocodeAddress(address: string) {
    return this.geocodingService.geocodeAddress(address);
  }

  async calculateRoute(origin: string, destination: string) {
    return this.routingService.calculateRoute(origin, destination);
  }

  // Clear cache method for manual cache management
  clearCache(): void {
    this.geocodingService.clearCache();
    this.routingService.clearCache();
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
