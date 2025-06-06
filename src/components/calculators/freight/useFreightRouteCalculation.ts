
import { useCallback, useEffect, useRef } from 'react';
import { mapService } from '@/services/unifiedMapService';
import { useNotify } from '@/components/ui/notification';

export const useFreightRouteCalculation = (
  origin: string,
  destination: string,
  isCalculatingRoute: boolean,
  setIsCalculatingRoute: (value: boolean) => void,
  setDistance: (value: number) => void,
  setRouteDuration: (value: number | undefined) => void,
  setRouteCoordinates: (value: Array<{ lat: number; lng: number }>) => void,
  setShowMap: (value: boolean) => void,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void
) => {
  const notify = useNotify();
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-calculate distance with improved debouncing and error handling
  const autoCalculateDistance = useCallback(async (originAddr: string, destinationAddr: string) => {
    console.log('autoCalculateDistance called:', { originAddr, destinationAddr });
    
    // Cancel previous request
    if (abortControllerRef.current) {
      console.log('Aborting previous request');
      abortControllerRef.current.abort();
    }
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Validate inputs
    if (!originAddr?.trim() || !destinationAddr?.trim() || originAddr === destinationAddr) {
      console.log('Invalid inputs, resetting map state');
      setShowMap(false);
      setRouteCoordinates([]);
      setRouteDuration(undefined);
      setIsCalculatingRoute(false);
      return;
    }

    // Prevent concurrent calculations
    if (isCalculatingRoute) {
      console.log('Already calculating route, skipping');
      return;
    }

    console.log('Starting route calculation');
    setIsCalculatingRoute(true);
    setHasError(false);
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      console.log('Calling mapService.calculateRoute');
      const route = await mapService.calculateRoute(originAddr, destinationAddr);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('Request was aborted');
        return;
      }
      
      if (route) {
        console.log('Route calculated successfully:', route);
        setDistance(route.distance);
        setRouteDuration(route.duration);
        setRouteCoordinates(route.route.geometry);
        setShowMap(true);
        
        notify.success(
          'Rota calculada!',
          `Distância: ${route.distance} km • Tempo: ${Math.floor(route.duration / 60)}h ${route.duration % 60}m`
        );
      } else {
        console.log('No route returned from service');
        setShowMap(false);
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('Request aborted, not showing error');
        return;
      }
      
      console.error('Error auto-calculating distance:', error);
      const message = error instanceof Error ? error.message : 'Erro ao calcular rota';
      notify.warning('Rota não calculada', message);
      setShowMap(false);
    } finally {
      setIsCalculatingRoute(false);
      console.log('Route calculation finished');
    }
  }, [notify, isCalculatingRoute, setDistance, setRouteDuration, setRouteCoordinates, setShowMap, setHasError, setIsCalculatingRoute]);

  // Auto-calculate distance when both origin and destination are filled
  useEffect(() => {
    console.log('useEffect triggered:', { origin, destination });
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer with longer debounce
    debounceTimerRef.current = setTimeout(() => {
      console.log('Debounce timer triggered, calling autoCalculateDistance');
      autoCalculateDistance(origin, destination);
    }, 3000); // Increased debounce time

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      // Cancel ongoing request when effect cleans up
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [origin, destination, autoCalculateDistance]);

  const calculateDistanceFromRoute = async () => {
    if (!origin || !destination) {
      const message = 'Por favor, informe origem e destino para calcular a rota.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Erro de validação', message);
      return;
    }

    await autoCalculateDistance(origin, destination);
  };

  const cleanupRouteCalculation = () => {
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  };

  return {
    calculateDistanceFromRoute,
    cleanupRouteCalculation
  };
};
