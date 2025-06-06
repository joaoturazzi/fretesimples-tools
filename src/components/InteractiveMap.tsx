
import React, { memo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { LoadingState } from '@/components/ui/loading';
import MapInitializer from './map/MapInitializer';
import MapMarkers from './map/MapMarkers';
import RouteLayer from './map/RouteLayer';
import MapInfoOverlay from './map/MapInfoOverlay';
import MapErrorBoundary from './map/MapErrorBoundary';
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

const InteractiveMap: React.FC<InteractiveMapProps> = memo(({
  origin,
  destination,
  distance,
  duration,
  routeCoordinates = [],
  className = '',
  height = 400
}) => {
  const {
    originCoords,
    destCoords,
    isLoading,
    error,
    mapReady
  } = useMapGeocoding(origin, destination);

  const mapCenter: LatLngExpression = [-14.235, -51.9253]; // Centro do Brasil

  console.log('InteractiveMap render:', { 
    origin, 
    destination, 
    routeCoordinatesLength: Array.isArray(routeCoordinates) ? routeCoordinates.length : 0,
    mapReady,
    isLoading 
  });

  // Validação rigorosa de props
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

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 text-gray-600 rounded-lg border ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="mb-2">⚠️ Erro ao carregar mapa</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !mapReady) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 rounded-lg border ${className}`} style={{ height }}>
        <LoadingState message="Carregando mapa..." icon="map" />
      </div>
    );
  }

  // Validação de coordenadas antes de renderizar o mapa
  if (!originCoords || !destCoords || 
      typeof originCoords.lat !== 'number' || typeof originCoords.lng !== 'number' ||
      typeof destCoords.lat !== 'number' || typeof destCoords.lng !== 'number') {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 text-gray-600 rounded-lg border ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="mb-2">⚠️ Coordenadas inválidas</p>
          <p className="text-sm">Erro na geolocalização dos endereços</p>
        </div>
      </div>
    );
  }

  console.log('InteractiveMap: Rendering MapContainer with valid coordinates');
  
  return (
    <div className={`relative rounded-lg overflow-hidden border border-gray-200 ${className}`} style={{ height }}>
      <MapErrorBoundary>
        <MapContainer
          center={mapCenter}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          className="z-0"
        >
          <MapInitializer />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapMarkers
            originCoords={originCoords}
            destCoords={destCoords}
            origin={origin}
            destination={destination}
          />
          
          {Array.isArray(routeCoordinates) && routeCoordinates.length > 0 && (
            <RouteLayer coordinates={routeCoordinates} />
          )}
        </MapContainer>
      </MapErrorBoundary>
      
      <MapInfoOverlay distance={distance} duration={duration} />
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação profunda mais segura para evitar re-renders desnecessários
  const routeCoordsEqual = (
    Array.isArray(prevProps.routeCoordinates) && Array.isArray(nextProps.routeCoordinates)
      ? prevProps.routeCoordinates.length === nextProps.routeCoordinates.length
      : prevProps.routeCoordinates === nextProps.routeCoordinates
  );
  
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
