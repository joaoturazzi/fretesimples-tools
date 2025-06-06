
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import MapInitializer from './MapInitializer';
import MapMarkers from './MapMarkers';
import RouteLayer from './RouteLayer';
import MapInfoOverlay from './MapInfoOverlay';
import MapErrorBoundary from './MapErrorBoundary';

interface LeafletMapContainerProps {
  originCoords: { lat: number; lng: number };
  destCoords: { lat: number; lng: number };
  origin: string;
  destination: string;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
  distance?: number;
  duration?: number;
}

const LeafletMapContainer: React.FC<LeafletMapContainerProps> = ({
  originCoords,
  destCoords,
  origin,
  destination,
  routeCoordinates = [],
  distance,
  duration
}) => {
  const mapCenter: LatLngExpression = [-14.235, -51.9253]; // Centro do Brasil

  console.log('LeafletMapContainer: Rendering with coordinates', { originCoords, destCoords });
  
  return (
    <MapErrorBoundary>
      <MapContainer
        center={mapCenter}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="z-0"
        key={`map-${origin}-${destination}`} // Force re-render on location change
      >
        <MapInitializer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
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
      
      <MapInfoOverlay distance={distance} duration={duration} />
    </MapErrorBoundary>
  );
};

export default LeafletMapContainer;
