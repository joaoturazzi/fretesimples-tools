
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  origin,
  destination,
  distance,
  duration,
  routeCoordinates = [],
  className = "h-96 w-full rounded-lg"
}) => {
  const [mapKey, setMapKey] = useState(0);

  // Force re-render when route coordinates change
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [routeCoordinates.length]);

  if (!routeCoordinates || routeCoordinates.length === 0) {
    return (
      <div className={className}>
        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Carregando mapa...</p>
          </div>
        </div>
      </div>
    );
  }

  const originCoord = routeCoordinates[0];
  const destinationCoord = routeCoordinates[routeCoordinates.length - 1];
  const polylinePositions: [number, number][] = routeCoordinates.map(coord => [coord.lat, coord.lng]);

  // Calculate center and bounds
  const lats = routeCoordinates.map(coord => coord.lat);
  const lngs = routeCoordinates.map(coord => coord.lng);
  const bounds: [[number, number], [number, number]] = [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)]
  ];

  return (
    <div className={className}>
      <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          key={mapKey}
          bounds={bounds}
          className="w-full h-full"
          boundsOptions={{ padding: [20, 20] }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {originCoord && (
            <Marker position={[originCoord.lat, originCoord.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong>Origem:</strong><br />
                  {origin}
                </div>
              </Popup>
            </Marker>
          )}
          
          {destinationCoord && (
            <Marker position={[destinationCoord.lat, destinationCoord.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong>Destino:</strong><br />
                  {destination}
                  {distance && (
                    <div className="mt-1 text-xs text-gray-600">
                      Distância: {distance} km
                      {duration && ` • ${Math.floor(duration / 60)}h ${duration % 60}m`}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
          
          {polylinePositions.length > 1 && (
            <Polyline
              positions={polylinePositions}
              color="#ff6b35"
              weight={4}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>
      
      {distance && (
        <div className="mt-2 text-center text-sm text-gray-600">
          Rota calculada: {distance} km
          {duration && ` • Tempo estimado: ${Math.floor(duration / 60)}h ${duration % 60}m`}
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
