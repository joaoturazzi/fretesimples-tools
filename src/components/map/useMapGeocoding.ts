import { useState, useEffect, useRef } from 'react';
import { LoadingState } from '@/components/ui/loading';
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
        console.log('useMapGeocoding: Missing origin or destination');
        setOriginCoords(null);
        setDestCoords(null);
        setMapReady(false);
        return;
      }
      
      if (geocodingInProgress.current) {
        console.log('useMapGeocoding: Geocoding already in progress');
        return;
      }
      
      console.log('useMapGeocoding: Starting geocoding for:', { origin, destination });
      geocodingInProgress.current = true;
      setIsLoading(true);
      setError(null);
      setMapReady(false);
      
      try {
        console.log('useMapGeocoding: Calling mapService.geocodeAddress');
        const [originData, destinationData] = await Promise.all([
          mapService.geocodeAddress(origin),
          mapService.geocodeAddress(destination)
        ]);
        
        console.log('useMapGeocoding: Geocoding results:', { originData, destinationData });
        
        if (originData) {
          setOriginCoords({ lat: originData.lat, lng: originData.lng });
        } else {
          setError(`Não foi possível encontrar as coordenadas para: ${origin}`);
        }
        
        if (destinationData) {
          setDestCoords({ lat: destinationData.lat, lng: destinationData.lng });
        } else {
          setError(`Não foi possível encontrar as coordenadas para: ${destination}`);
        }
        
        if (originData && destinationData) {
          setMapReady(true);
          console.log('useMapGeocoding: Map ready to render');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao geolocalizar endereços';
        console.error('useMapGeocoding: Geocoding error:', err);
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
