
import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { LoadingState } from '@/components/ui/loading';
import { useMapCompatibility } from '@/hooks/useMapCompatibility';
import SimpleMapFallback from './SimpleMapFallback';
import MapErrorBoundary from './MapErrorBoundary';

interface StableInteractiveMapProps {
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
  className?: string;
  height?: number;
}

const StableInteractiveMap: React.FC<StableInteractiveMapProps> = memo(({
  origin,
  destination,
  distance,
  duration,
  routeCoordinates = [],
  className = '',
  height = 400
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const compatibility = useMapCompatibility();
  
  // Sempre chamar hooks na mesma ordem
  const validInput = useMemo(() => 
    Boolean(origin?.trim() && destination?.trim()), 
    [origin, destination]
  );

  const shouldShowSimpleMap = useMemo(() => 
    compatibility.shouldUseSimpleMap || !compatibility.canLoadLeaflet,
    [compatibility]
  );

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const renderMap = useCallback(() => {
    if (!isLoaded || !validInput) {
      return (
        <div className={`flex items-center justify-center h-full bg-gray-50 text-gray-600 rounded-lg border ${className}`} style={{ height }}>
          <div className="text-center">
            <p className="mb-2">🗺️ Mapa da rota</p>
            <p className="text-sm">
              {!validInput ? 'Insira origem e destino para visualizar' : 'Carregando...'}
            </p>
          </div>
        </div>
      );
    }

    if (shouldShowSimpleMap) {
      return (
        <SimpleMapFallback
          origin={origin}
          destination={destination}
          distance={distance}
          duration={duration}
          className={className}
        />
      );
    }

    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 rounded-lg border ${className}`} style={{ height }}>
        <LoadingState message="Mapa interativo em desenvolvimento..." icon="map" />
      </div>
    );
  }, [isLoaded, validInput, shouldShowSimpleMap, origin, destination, distance, duration, className, height]);

  return (
    <MapErrorBoundary 
      origin={origin} 
      destination={destination} 
      distance={distance} 
      duration={duration}
      className={className}
    >
      {renderMap()}
    </MapErrorBoundary>
  );
});

StableInteractiveMap.displayName = 'StableInteractiveMap';

export default StableInteractiveMap;
