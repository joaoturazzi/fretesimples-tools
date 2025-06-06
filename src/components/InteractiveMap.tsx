
import React, { memo, Suspense } from 'react';
import { LoadingState } from '@/components/ui/loading';
import { useMapCompatibility } from '@/hooks/useMapCompatibility';
import SimpleMapFallback from './map/SimpleMapFallback';
import { useMapGeocoding } from './map/useMapGeocoding';

interface InteractiveMapProps {
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
  className?: string;
  height?: number;
}

// Lazy load do mapa completo apenas quando suportado
const LazyLeafletMap = React.lazy(() => import('./map/LeafletMapContainer'));

const InteractiveMap: React.FC<InteractiveMapProps> = memo(({
  origin,
  destination,
  distance,
  duration,
  routeCoordinates = [],
  className = '',
  height = 400
}) => {
  const compatibility = useMapCompatibility();
  const {
    originCoords,
    destCoords,
    isLoading,
    error,
    mapReady
  } = useMapGeocoding(origin, destination);

  console.log('InteractiveMap render:', { 
    origin, 
    destination, 
    compatibility,
    mapReady,
    isLoading 
  });

  // Validação básica de props
  if (!origin?.trim() || !destination?.trim()) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 text-gray-600 rounded-lg border ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="mb-2">🗺️ Mapa da rota</p>
          <p className="text-sm">Insira origem e destino para visualizar</p>
        </div>
      </div>
    );
  }

  // Se não há compatibilidade ou erro de geocoding, usar fallback
  if (compatibility.shouldUseSimpleMap || error) {
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

  // Loading state
  if (isLoading || !mapReady || !compatibility.canLoadLeaflet) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 rounded-lg border ${className}`} style={{ height }}>
        <LoadingState message="Carregando mapa..." icon="map" />
      </div>
    );
  }

  // Validação de coordenadas
  if (!originCoords || !destCoords || 
      typeof originCoords.lat !== 'number' || typeof originCoords.lng !== 'number' ||
      typeof destCoords.lat !== 'number' || typeof destCoords.lng !== 'number') {
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

  // Renderizar mapa completo com lazy loading e Suspense
  return (
    <div className={`relative rounded-lg overflow-hidden border border-gray-200 ${className}`} style={{ height }}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-full bg-gray-50">
          <LoadingState message="Carregando componentes do mapa..." icon="map" />
        </div>
      }>
        <LazyLeafletMap
          originCoords={originCoords}
          destCoords={destCoords}
          origin={origin}
          destination={destination}
          routeCoordinates={routeCoordinates}
          distance={distance}
          duration={duration}
        />
      </Suspense>
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação otimizada para evitar re-renders desnecessários
  const routeCoordsEqual = (() => {
    const prev = prevProps.routeCoordinates;
    const next = nextProps.routeCoordinates;
    
    if (!prev && !next) return true;
    if (!prev || !next) return false;
    if (Array.isArray(prev) && Array.isArray(next)) {
      return prev.length === next.length;
    }
    return prev === next;
  })();
  
  return (
    prevProps.origin === nextProps.origin &&
    prevProps.destination === nextProps.destination &&
    prevProps.distance === nextProps.distance &&
    prevProps.duration === nextProps.duration &&
    routeCoordsEqual &&
    prevProps.className === nextProps.className &&
    prevProps.height === nextProps.height
  );
});

InteractiveMap.displayName = 'InteractiveMap';

export default InteractiveMap;
