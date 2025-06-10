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
      throw new ApiError('Endereço é obrigatório');
    }

    console.log('GeocodingService: Iniciando geocodificação para:', address);

    return CacheService.cacheApiCall(
      'geocode',
      { address: address.trim().toLowerCase() },
      async () => {
        try {
          // Tenta HERE Maps primeiro
          const hereResult = await this.tryHereGeocoding(address);
          if (hereResult) {
            console.log('GeocodingService: Sucesso com HERE Maps:', hereResult);
            return hereResult;
          }

          // Se falhar, tenta Nominatim
          console.log('GeocodingService: Tentando fallback com Nominatim');
          const nominatimResult = await this.tryNominatimGeocoding(address);
          if (nominatimResult) {
            console.log('GeocodingService: Sucesso com Nominatim:', nominatimResult);
            return nominatimResult;
          }

          console.error('GeocodingService: Todas as tentativas de geocodificação falharam');
          return null;
        } catch (error) {
          console.error('GeocodingService: Erro na geocodificação:', error);
          throw error instanceof ApiError ? error : new ApiError('Falha ao geocodificar endereço');
        }
      },
      30 * 60 * 1000 // Cache por 30 minutos
    );
  }

  private async tryHereGeocoding(address: string): Promise<GeocodeResponse | null> {
    try {
      if (!this.apiKey) {
        console.warn('GeocodingService: HERE API key não configurada');
        return null;
      }

      const url = `${this.geocodeUrl}/geocode?q=${encodeURIComponent(address)}&in=countryCode:BRA&apiKey=${this.apiKey}`;
      console.log('GeocodingService: Tentando HERE Maps API:', url);
      
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
      console.error('GeocodingService: Erro na geocodificação HERE:', error);
      return null;
    }
  }

  private async tryNominatimGeocoding(address: string): Promise<GeocodeResponse | null> {
    try {
      const url = `${env.NOMINATIM_API}/search?format=json&q=${encodeURIComponent(address)}&countrycodes=br&limit=1`;
      console.log('GeocodingService: Tentando Nominatim API:', url);
      
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
      console.error('GeocodingService: Erro na geocodificação Nominatim:', error);
      return null;
    }
  }

  clearCache(): void {
    CacheService.clear('geocode');
  }
}
