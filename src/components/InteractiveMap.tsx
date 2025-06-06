
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers for Leaflet - ensure this runs only once
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

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
  const [mapCenter, setMapCenter] = useState<[number, number]>([-14.235, -51.9253]);
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (routeCoordinates.length > 0) {
      // Calculate bounds to fit all route coordinates
      const lats = routeCoordinates.map(coord => coord.lat);
      const lngs = routeCoordinates.map(coord => coord.lng);
      
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      setMapBounds([[minLat, minLng], [maxLat, maxLng]]);
      setIsMapReady(true);
    } else {
      setIsMapReady(true);
    }
  }, [routeCoordinates]);

  const originCoord = routeCoordinates.length > 0 ? routeCoordinates[0] : null;
  const destinationCoord = routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1] : null;

  const polylinePositions: [number, number][] = routeCoordinates.map(coord => [coord.lat, coord.lng]);

  if (!isMapReady) {
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

  try {
    return (
      <div className={className}>
        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
          <MapContainer
            key={`map-${routeCoordinates.length}`}
            center={mapCenter}
            zoom={6}
            className="w-full h-full"
            bounds={mapBounds || undefined}
            boundsOptions={{ padding: [20, 20] }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Origin Marker */}
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
            
            {/* Destination Marker */}
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
            
            {/* Route Polyline */}
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
  } catch (error) {
    console.error('Error rendering map:', error);
    return (
      <div className={className}>
        <div className="w-full h-full rounded-lg overflow-hidden border border-red-200 bg-red-50 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p className="font-medium">Erro ao carregar o mapa</p>
            <p className="text-sm mt-1">Tente recarregar a página</p>
          </div>
        </div>
      </div>
    );
  }
};

export default InteractiveMap;
