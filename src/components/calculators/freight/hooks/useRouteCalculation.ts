
import { useState, useEffect, useRef } from 'react';
import { mapService } from '@/services/map/UnifiedMapService';
import { useNotify } from '@/components/ui/notification';

export const useRouteCalculation = (origin: string, destination: string) => {
  const notify = useNotify();
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ lat: number; lng: number }>>([]);
  const [routeDuration, setRouteDuration] = useState<number | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-calculate distance when both origin and destination are filled
  useEffect(() => {
    const autoCalculateDistance = async () => {
      if (origin.trim() && destination.trim() && origin !== destination) {
        setIsCalculatingRoute(true);
        
        try {
          const route = await mapService.calculateRoute(origin, destination);
          if (route) {
            setRouteDuration(route.duration);
            setRouteCoordinates(route.route.geometry);
            setShowMap(true);
            console.log('Auto-calculated distance:', route.distance, 'km');
            
            notify.success(
              'Rota calculada!',
              `Distância: ${route.distance} km • Tempo: ${Math.floor(route.duration / 60)}h ${route.duration % 60}m`
            );
            
            return route.distance;
          }
        } catch (error) {
          console.error('Error auto-calculating distance:', error);
          const message = error instanceof Error ? error.message : 'Erro ao calcular rota';
          notify.warning('Rota não calculada', message);
        } finally {
          setIsCalculatingRoute(false);
        }
      } else {
        setShowMap(false);
        setRouteCoordinates([]);
        setRouteDuration(undefined);
      }
      return null;
    };

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(autoCalculateDistance, 1500);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [origin, destination, notify]);

  const resetRouteData = () => {
    setShowMap(false);
    setRouteCoordinates([]);
    setRouteDuration(undefined);
    setIsCalculatingRoute(false);
  };

  return {
    isCalculatingRoute,
    showMap,
    routeCoordinates,
    routeDuration,
    resetRouteData
  };
};
