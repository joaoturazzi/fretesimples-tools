
import { useState, useEffect, useRef } from 'react';
import { mapService } from '@/services/map/UnifiedMapService';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface GeocodeResult {
  lat: number;
  lng: number;
}

export const useMapGeocoding = (origin: string, destination: string) => {
  const [originCoords, setOriginCoords] = useState<GeocodeResult | null>(null);
  const [destCoords, setDestCoords] = useState<GeocodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const { handleError } = useErrorHandler();
  const geocodingInProgress = useRef(false);

  useEffect(() => {
    const geocode = async () => {
      if (!origin || !destination) {
        console.log('useMapGeocoding: Origem ou destino em branco');
        setOriginCoords(null);
        setDestCoords(null);
        setMapReady(false);
        return;
      }
      
      if (geocodingInProgress.current) {
        console.log('useMapGeocoding: Geocodificação já em andamento');
        return;
      }
      
      console.log('useMapGeocoding: Iniciando geocodificação para:', { origin, destination });
      geocodingInProgress.current = true;
      setIsLoading(true);
      setError(null);
      setMapReady(false);
      
      try {
        console.log('useMapGeocoding: Chamando mapService.geocodeAddress');
        const [originData, destinationData] = await Promise.all([
          mapService.geocodeAddress(origin),
          mapService.geocodeAddress(destination)
        ]);
        
        console.log('useMapGeocoding: Resultados da geocodificação:', { originData, destinationData });
        
        if (originData) {
          setOriginCoords({ lat: originData.lat, lng: originData.lng });
          console.log('useMapGeocoding: Coordenadas de origem definidas:', { lat: originData.lat, lng: originData.lng });
        } else {
          const errorMsg = `Não foi possível encontrar as coordenadas para: ${origin}`;
          console.error('useMapGeocoding: Erro origem:', errorMsg);
          setError(errorMsg);
        }
        
        if (destinationData) {
          setDestCoords({ lat: destinationData.lat, lng: destinationData.lng });
          console.log('useMapGeocoding: Coordenadas de destino definidas:', { lat: destinationData.lat, lng: destinationData.lng });
        } else {
          const errorMsg = `Não foi possível encontrar as coordenadas para: ${destination}`;
          console.error('useMapGeocoding: Erro destino:', errorMsg);
          setError(errorMsg);
        }
        
        if (originData && destinationData) {
          setMapReady(true);
          console.log('useMapGeocoding: Mapa pronto para renderizar');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao geolocalizar endereços';
        console.error('useMapGeocoding: Erro na geocodificação:', err);
        setError(message);
        handleError(err, 'Geocoding');
      } finally {
        setIsLoading(false);
        geocodingInProgress.current = false;
      }
    };

    geocode();
  }, [origin, destination, handleError]);

  return {
    originCoords,
    destCoords,
    isLoading,
    error,
    mapReady
  };
};
