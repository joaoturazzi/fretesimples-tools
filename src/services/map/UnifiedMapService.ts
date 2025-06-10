
import { UnifiedGeocodingService, GeocodeResponse } from './UnifiedGeocodingService';
import { UnifiedRoutingService, RouteResponse } from './UnifiedRoutingService';
import { BaseMapService } from './BaseMapService';
import env from '@/config/env';

export class UnifiedMapService extends BaseMapService {
  private geocodingService = new UnifiedGeocodingService();
  private routingService = new UnifiedRoutingService();

  async geocodeAddress(address: string): Promise<GeocodeResponse | null> {
    console.log('UnifiedMapService: Iniciando geocodificação para:', address);
    console.log('UnifiedMapService: Usando API key:', env.HERE_API_KEY ? 'API key configurada' : 'API key não configurada');
    
    try {
      const result = await this.geocodingService.geocodeAddress(address);
      console.log('UnifiedMapService: Resultado da geocodificação:', result);
      return result;
    } catch (error) {
      console.error('UnifiedMapService: Erro na geocodificação:', error);
      throw error;
    }
  }

  async calculateRoute(origin: string, destination: string): Promise<RouteResponse | null> {
    console.log('UnifiedMapService: Iniciando cálculo de rota:', { origin, destination });
    console.log('UnifiedMapService: Usando API key:', env.HERE_API_KEY ? 'API key configurada' : 'API key não configurada');
    
    try {
      const result = await this.routingService.calculateRoute(origin, destination);
      console.log('UnifiedMapService: Resultado do cálculo de rota:', result);
      return result;
    } catch (error) {
      console.error('UnifiedMapService: Erro no cálculo de rota:', error);
      throw error;
    }
  }

  clearCache(): void {
    console.log('UnifiedMapService: Limpando cache');
    super.clearCache();
    this.geocodingService.clearCache();
    this.routingService.clearCache();
  }

  getCacheStats() {
    const baseStats = super.getCacheStats();
    const geocodingStats = this.geocodingService.getCacheStats();
    const routingStats = this.routingService.getCacheStats();
    
    const stats = {
      ...baseStats,
      geocoding: geocodingStats,
      routing: routingStats,
      totalCacheSize: baseStats.cacheSize + geocodingStats.cacheSize + routingStats.cacheSize
    };
    
    console.log('UnifiedMapService: Estatísticas do cache:', stats);
    return stats;
  }
}

// Export singleton instance
export const mapService = new UnifiedMapService();
export default mapService;

// Export types
export type { RouteResponse, GeocodeResponse };
