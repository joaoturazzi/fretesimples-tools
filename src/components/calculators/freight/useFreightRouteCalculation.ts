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
  const isFirstRender = useRef(true);

  // Cleanup function
  const cleanupRouteCalculation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Main calculation function with useCallback to prevent recreation
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
          'Rota calculada com sucesso!',
          `Distância: ${route.distance} km • Tempo estimado: ${Math.floor(route.duration / 60)}h ${route.duration % 60}m`
        );
      } else {
        setShowMap(false);
        notify.warning('Aviso', 'Não foi possível calcular a rota automaticamente. Insira a distância manualmente.');
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      const message = error instanceof Error ? error.message : 'Erro ao calcular rota';
      console.warn('Erro no cálculo da rota:', error);
      
      // Determine if it's a geocoding or routing error for better feedback
      if (message.includes('Could not find location')) {
        notify.error('Endereço não encontrado', 'Verifique se os endereços de origem e destino estão corretos.');
        setErrorMessage('Endereço não encontrado. Verifique se os endereços estão corretos.');
      } else {
        notify.warning('Rota não calculada', 'Insira a distância manualmente ou tente novamente.');
        setErrorMessage('Erro ao calcular rota. Tente inserir a distância manualmente.');
      }
      
      setHasError(true);
      setShowMap(false);
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [
    isCalculatingRoute, 
    setDistance, 
    setRouteDuration, 
    setRouteCoordinates, 
    setShowMap, 
    setHasError, 
    setErrorMessage,
    setIsCalculatingRoute, 
    notify, 
    cleanupRouteCalculation
  ]);

  // Auto-calculate with improved debouncing
  useEffect(() => {
    // Skip on first render to prevent immediate calculation
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Only calculate if both fields have meaningful content
    if (origin?.trim() && destination?.trim() && origin !== destination) {
      // Reduced debounce time for better UX
      debounceTimerRef.current = setTimeout(() => {
        performRouteCalculation(origin, destination);
      }, 2000); // Reduced from 5 seconds to 2 seconds
    } else {
      // Clear map and route data if inputs are invalid
      setShowMap(false);
      setRouteCoordinates([]);
      setRouteDuration(undefined);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [origin, destination]);

  // Manual calculation function
  const calculateDistanceFromRoute = useCallback(async () => {
    if (!origin?.trim() || !destination?.trim()) {
      const message = 'Por favor, informe origem e destino para calcular a rota.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Campos obrigatórios', message);
      return;
    }

    if (origin.trim() === destination.trim()) {
      const message = 'Origem e destino não podem ser iguais.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Dados inválidos', message);
      return;
    }

    await performRouteCalculation(origin, destination);
  }, [origin, destination, performRouteCalculation, setErrorMessage, setHasError, notify]);

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
