
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
  const lastCalculatedRef = useRef<string>('');
  const isInitialMount = useRef(true);

  // Cleanup function
  const cleanupRouteCalculation = useCallback(() => {
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Main calculation function
  const performRouteCalculation = useCallback(async (originAddr: string, destinationAddr: string) => {
    const routeKey = `${originAddr}|${destinationAddr}`;
    
    // Prevent duplicate calculations
    if (lastCalculatedRef.current === routeKey) {
      return;
    }
    
    // Cancel previous request
    cleanupRouteCalculation();
    
    // Validate inputs
    if (!originAddr?.trim() || !destinationAddr?.trim() || originAddr === destinationAddr) {
      setShowMap(false);
      setRouteCoordinates([]);
      setRouteDuration(undefined);
      return;
    }

    // Prevent concurrent calculations
    if (isCalculatingRoute) {
      return;
    }

    setIsCalculatingRoute(true);
    setHasError(false);
    lastCalculatedRef.current = routeKey;
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      const route = await mapService.calculateRoute(originAddr, destinationAddr);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      if (route) {
        setDistance(route.distance);
        setRouteDuration(route.duration);
        setRouteCoordinates(route.route.geometry);
        setShowMap(true);
        
        notify.success(
          'Rota calculada!',
          `Distância: ${route.distance} km • Tempo: ${Math.floor(route.duration / 60)}h ${route.duration % 60}m`
        );
      } else {
        setShowMap(false);
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      const message = error instanceof Error ? error.message : 'Erro ao calcular rota';
      notify.warning('Rota não calculada', message);
      setShowMap(false);
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [isCalculatingRoute, setDistance, setRouteDuration, setRouteCoordinates, setShowMap, setHasError, setIsCalculatingRoute, notify, cleanupRouteCalculation]);

  // Auto-calculate with improved debouncing
  useEffect(() => {
    // Skip on initial mount to prevent immediate calculation
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer with longer debounce
    debounceTimerRef.current = setTimeout(() => {
      performRouteCalculation(origin, destination);
    }, 5000); // Increased debounce time to 5 seconds

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [origin, destination]); // Removed performRouteCalculation from dependencies to prevent loop

  // Manual calculation function
  const calculateDistanceFromRoute = async () => {
    if (!origin || !destination) {
      const message = 'Por favor, informe origem e destino para calcular a rota.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Erro de validação', message);
      return;
    }

    await performRouteCalculation(origin, destination);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRouteCalculation();
    };
  }, [cleanupRouteCalculation]);

  return {
    calculateDistanceFromRoute,
    cleanupRouteCalculation
  };
};
