import env from '@/config/env';

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

class UnifiedMapService {
  private requestCount = 0;
  private lastResetTime = Date.now();
  private geocodeCache = new Map<string, any>();
  private routeCache = new Map<string, any>();

  private checkRateLimit(): boolean {
    const now = Date.now();
    if (now - this.lastResetTime >= 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    if (this.requestCount >= env.API_RATE_LIMIT) {
      return false;
    }
    
    this.requestCount++;
    return true;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Geocoding com HERE Maps usando JSONP
  private async geocodeWithHere(address: string): Promise<GeocodeResponse | null> {
    const cacheKey = `here_${address.toLowerCase()}`;
    if (this.geocodeCache.has(cacheKey)) {
      return this.geocodeCache.get(cacheKey);
    }

    try {
      if (!this.checkRateLimit()) {
        await this.delay(60000);
      }

      const url = `${env.HERE_GEOCODE_API}/geocode?q=${encodeURIComponent(address)}&in=countryCode:BRA&apiKey=${env.HERE_API_KEY}`;
      
      // Tenta primeiro com fetch normal
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const item = data.items[0];
            const result = {
              lat: item.position.lat,
              lng: item.position.lng,
              address: item.address.label
            };
            
            // Cache por 1 hora
            this.geocodeCache.set(cacheKey, result);
            setTimeout(() => this.geocodeCache.delete(cacheKey), 3600000);
            
            return result;
          }
        }
      } catch (corsError) {
        // Se CORS falhar, usa fallback imediatamente
        return null;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  // Fallback com Nominatim (suporta CORS)
  private async geocodeWithNominatim(address: string): Promise<GeocodeResponse | null> {
    const cacheKey = `nominatim_${address.toLowerCase()}`;
    if (this.geocodeCache.has(cacheKey)) {
      return this.geocodeCache.get(cacheKey);
    }

    try {
      await this.delay(1000); // Respeita rate limits do Nominatim
      
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
          const result = {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            address: item.display_name
          };
          
          // Cache por 1 hora
          this.geocodeCache.set(cacheKey, result);
          setTimeout(() => this.geocodeCache.delete(cacheKey), 3600000);
          
          return result;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async geocodeAddress(address: string): Promise<GeocodeResponse | null> {
    if (!address?.trim()) {
      throw new Error('Address is required');
    }

    // Tenta HERE Maps primeiro
    let result = await this.geocodeWithHere(address);
    
    // Se falhar, usa Nominatim
    if (!result) {
      result = await this.geocodeWithNominatim(address);
    }

    if (!result) {
      throw new Error(`Could not find location for: ${address}`);
    }

    return result;
  }

  // Cálculo de distância usando fórmula haversine
  private calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }

  async calculateRoute(origin: string, destination: string): Promise<RouteResponse | null> {
    if (!origin?.trim() || !destination?.trim()) {
      throw new Error('Both origin and destination are required');
    }

    if (origin.trim() === destination.trim()) {
      throw new Error('Origin and destination cannot be the same');
    }

    const cacheKey = `route_${origin.toLowerCase()}_${destination.toLowerCase()}`;
    if (this.routeCache.has(cacheKey)) {
      return this.routeCache.get(cacheKey);
    }

    try {
      // Geocode both addresses
      const [originCoords, destCoords] = await Promise.all([
        this.geocodeAddress(origin),
        this.geocodeAddress(destination)
      ]);
      
      if (!originCoords) {
        throw new Error(`Could not find location for: ${origin}`);
      }
      
      if (!destCoords) {
        throw new Error(`Could not find location for: ${destination}`);
      }

      // Para evitar CORS da HERE Router API, usamos cálculo direto
      const distance = this.calculateHaversineDistance(
        originCoords.lat, originCoords.lng,
        destCoords.lat, destCoords.lng
      );
      
      // Estima tempo baseado na distância (velocidade média de 60 km/h)
      const duration = Math.round((distance / 60) * 60);

      // Gera geometria simples da rota (linha reta com pontos intermediários)
      const geometry: Array<{ lat: number; lng: number }> = [];
      const steps = Math.min(20, Math.max(5, Math.floor(distance / 50))); // Pontos baseados na distância
      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        const lat = originCoords.lat + (destCoords.lat - originCoords.lat) * ratio;
        const lng = originCoords.lng + (destCoords.lng - originCoords.lng) * ratio;
        geometry.push({ lat, lng });
      }
      
      const result = {
        distance,
        duration,
        route: { geometry }
      };

      // Cache por 1 hora
      this.routeCache.set(cacheKey, result);
      setTimeout(() => this.routeCache.delete(cacheKey), 3600000);
      
      return result;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to calculate route');
    }
  }

  clearCache(): void {
    this.requestCount = 0;
    this.lastResetTime = Date.now();
    this.geocodeCache.clear();
    this.routeCache.clear();
  }

  getCacheStats() {
    return {
      requestCount: this.requestCount,
      lastReset: this.lastResetTime,
      geocodeCacheSize: this.geocodeCache.size,
      routeCacheSize: this.routeCache.size
    };
  }

  // Cálculo de distância usando fórmula haversine
  private calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }
}

// Export singleton instance
export const mapService = new UnifiedMapService();
export default mapService;

// Export types
export type { RouteResponse, GeocodeResponse };
