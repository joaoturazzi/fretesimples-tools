
import { useState, useEffect, useRef, useCallback } from 'react';
import { mapService } from '@/services/unifiedMapService';

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
  
  const geocodingInProgress = useRef(false);
  const lastProcessed = useRef<string>('');
  const abortController = useRef<AbortController | null>(null);

  // Stable error handler without dependencies
  const handleError = useCallback((err: any) => {
    const message = err instanceof Error ? err.message : 'Erro ao geolocalizar endereços';
    console.error('useMapGeocoding: Geocoding error:', err);
    setError(message);
  }, []);

  // Clear previous geocoding attempt
  const clearPreviousRequest = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    geocodingInProgress.current = false;
  }, []);

  useEffect(() => {
    const geocode = async () => {
      const currentKey = `${origin}|${destination}`;
      
      // Prevent duplicate processing
      if (!origin || !destination || currentKey === lastProcessed.current) {
        return;
      }
      
      // Prevent concurrent geocoding
      if (geocodingInProgress.current) {
        console.log('useMapGeocoding: Geocoding already in progress, skipping');
        return;
      }
      
      console.log('useMapGeocoding: Starting geocoding for:', { origin, destination });
      
      // Clear previous state
      clearPreviousRequest();
      setOriginCoords(null);
      setDestCoords(null);
      setMapReady(false);
      setError(null);
      setIsLoading(true);
      
      // Mark as in progress and update last processed
      geocodingInProgress.current = true;
      lastProcessed.current = currentKey;
      
      // Create new abort controller
      abortController.current = new AbortController();
      
      try {
        console.log('useMapGeocoding: Calling mapService.geocodeAddress');
        const [originData, destinationData] = await Promise.all([
          mapService.geocodeAddress(origin),
          mapService.geocodeAddress(destination)
        ]);
        
        // Check if request was aborted
        if (abortController.current?.signal.aborted) {
          return;
        }
        
        console.log('useMapGeocoding: Geocoding results:', { originData, destinationData });
        
        if (originData && destinationData) {
          setOriginCoords({ lat: originData.lat, lng: originData.lng });
          setDestCoords({ lat: destinationData.lat, lng: destinationData.lng });
          setMapReady(true);
          console.log('useMapGeocoding: Map ready to render');
        } else {
          if (!originData) {
            setError(`Não foi possível encontrar as coordenadas para: ${origin}`);
          } else {
            setError(`Não foi possível encontrar as coordenadas para: ${destination}`);
          }
        }
      } catch (err) {
        // Don't handle error if request was aborted
        if (abortController.current?.signal.aborted) {
          return;
        }
        handleError(err);
      } finally {
        setIsLoading(false);
        geocodingInProgress.current = false;
      }
    };

    geocode();
    
    // Cleanup on unmount or dependency change
    return () => {
      clearPreviousRequest();
    };
  }, [origin, destination, clearPreviousRequest, handleError]);

  return {
    originCoords,
    destCoords,
    isLoading,
    error,
    mapReady
  };
};
