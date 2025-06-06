
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { LoadingState } from '@/components/ui/loading';
import MapInitializer from './map/MapInitializer';
import MapMarkers from './map/MapMarkers';
import RouteLayer from './map/RouteLayer';
import MapInfoOverlay from './map/MapInfoOverlay';
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

const InteractiveMap: React.FC<InteractiveMapProps> = ({
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
    routeCoordinatesLength: routeCoordinates?.length,
    mapReady,
    isLoading 
  });

  if (!origin || !destination) {
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

  try {
    console.log('InteractiveMap: Rendering MapContainer');
    return (
      <div className={`relative rounded-lg overflow-hidden border border-gray-200 ${className}`} style={{ height }}>
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
          
          {routeCoordinates && routeCoordinates.length > 0 && (
            <RouteLayer coordinates={routeCoordinates} />
          )}
        </MapContainer>
        
        <MapInfoOverlay distance={distance} duration={duration} />
      </div>
    );
  } catch (error) {
    console.error('InteractiveMap: Error rendering map:', error);
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 text-gray-600 rounded-lg border ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="mb-2">⚠️ Erro ao renderizar mapa</p>
          <p className="text-sm">Tente recarregar a página</p>
        </div>
      </div>
    );
  }
};

export default InteractiveMap;
