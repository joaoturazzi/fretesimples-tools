
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
    if (cached) {
      console.log('UnifiedGeocodingService: Usando dados em cache para:', address);
      return cached;
    }

    console.log('UnifiedGeocodingService: Iniciando geocodificação para:', address);
    console.log('UnifiedGeocodingService: Status da API key:', env.HERE_API_KEY ? 'Presente' : 'Ausente');

    // Try HERE Maps first
    let result = null;
    if (env.HERE_API_KEY) {
      console.log('UnifiedGeocodingService: Tentando HERE Maps primeiro');
      result = await this.geocodeWithHere(address);
    } else {
      console.log('UnifiedGeocodingService: HERE API key não configurada, pulando HERE Maps');
    }
    
    // If failed, try Nominatim
    if (!result) {
      console.log('UnifiedGeocodingService: HERE Maps falhou ou foi pulado, tentando Nominatim');
      result = await this.geocodeWithNominatim(address);
    }

    if (!result) {
      throw new Error(`Could not find location for: ${address}`);
    }

    console.log('UnifiedGeocodingService: Geocodificação bem-sucedida:', result);
    this.setCachedData(cacheKey, result);
    return result;
  }

  private async geocodeWithHere(address: string): Promise<GeocodeResponse | null> {
    try {
      if (!this.checkRateLimit()) {
        await this.delay(60000);
      }

      const url = `${env.HERE_GEOCODE_API}/geocode?q=${encodeURIComponent(address)}&in=countryCode:BRA&apiKey=${env.HERE_API_KEY}`;
      console.log('UnifiedGeocodingService: Fazendo requisição para HERE Maps');
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('UnifiedGeocodingService: Resposta do HERE Maps recebida');
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          return {
            lat: item.position.lat,
            lng: item.position.lng,
            address: item.address.label
          };
        }
        console.log('UnifiedGeocodingService: HERE Maps não encontrou resultados');
      } else {
        console.error('UnifiedGeocodingService: Erro na resposta do HERE Maps:', response.status, response.statusText);
        if (response.status === 401) {
          console.error('UnifiedGeocodingService: Erro de autenticação (401) - API key inválida ou expirada');
        }
      }
      return null;
    } catch (error) {
      console.error('UnifiedGeocodingService: Erro ao usar HERE Maps:', error);
      return null;
    }
  }

  private async geocodeWithNominatim(address: string): Promise<GeocodeResponse | null> {
    try {
      await this.delay(1000); // Respect Nominatim rate limits
      
      const url = `${env.NOMINATIM_API}/search?format=json&q=${encodeURIComponent(address)}&countrycodes=br&limit=1`;
      console.log('UnifiedGeocodingService: Fazendo requisição para Nominatim');
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'FreteSimples/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('UnifiedGeocodingService: Resposta do Nominatim recebida');
        if (data && data.length > 0) {
          const item = data[0];
          return {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            address: item.display_name
          };
        }
        console.log('UnifiedGeocodingService: Nominatim não encontrou resultados');
      } else {
        console.error('UnifiedGeocodingService: Erro na resposta do Nominatim:', response.status, response.statusText);
      }
      return null;
    } catch (error) {
      console.error('UnifiedGeocodingService: Erro ao usar Nominatim:', error);
      return null;
    }
  }
}
