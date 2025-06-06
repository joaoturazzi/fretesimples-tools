
import React, { useEffect, useRef, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { LoadingState, LoadingOverlay } from '@/components/ui/loading';
import { mapService } from '@/services/unifiedMapService';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface InteractiveMapProps {
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
  className?: string;
  height?: number;
}

interface GeocodeResult {
  lat: number;
  lng: number;
}

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const RouteLayer = memo(({ coordinates }: { coordinates: Array<{ lat: number; lng: number }> }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates.map(coord => [coord.lat, coord.lng]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [coordinates, map]);

  return coordinates.length > 0 ? (
    <Polyline 
      positions={coordinates.map(coord => [coord.lat, coord.lng] as LatLngExpression)}
      color="#ef4444"
      weight={4}
      opacity={0.8}
    />
  ) : null;
});

RouteLayer.displayName = 'RouteLayer';

const MapInitializer = memo(() => {
  const map = useMap();
  
  useEffect(() => {
    // Fix: Use a simple timeout instead of map.whenReady to avoid callback issues
    const timeoutId = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [map]);

  return null;
});

MapInitializer.displayName = 'MapInitializer';

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  origin,
  destination,
  distance,
  duration,
  routeCoordinates = [],
  className = '',
  height = 400
}) => {
  const [originCoords, setOriginCoords] = useState<GeocodeResult | null>(null);
  const [destCoords, setDestCoords] = useState<GeocodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { handleError } = useErrorHandler();

  const mapCenter: LatLngExpression = [-14.235, -51.9253]; // Centro do Brasil

  useEffect(() => {
    const geocode = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [originData, destinationData] = await Promise.all([
          mapService.geocodeAddress(origin),
          mapService.geocodeAddress(destination)
        ]);
        
        if (originData) {
          setOriginCoords({ lat: originData.lat, lng: originData.lng });
        } else {
          setError(`Não foi possível encontrar as coordenadas para: ${origin}`);
        }
        
        if (destinationData) {
          setDestCoords({ lat: destinationData.lat, lng: destinationData.lng });
        } else {
          setError(`Não foi possível encontrar as coordenadas para: ${destination}`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao geolocalizar endereços';
        setError(message);
        handleError(err, 'Geocoding');
      } finally {
        setIsLoading(false);
      }
    };

    if (origin && destination) {
      geocode();
    }
  }, [origin, destination, handleError]);

  return (
    <LoadingOverlay isVisible={isLoading} message="Carregando mapa...">
      <div className={`relative rounded-lg overflow-hidden border border-gray-200 ${className}`} style={{ height }}>
        {error ? (
          <div className="flex items-center justify-center h-full bg-gray-50 text-gray-600">
            <div className="text-center">
              <p className="mb-2">⚠️ Erro ao carregar mapa</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : (
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
            
            {originCoords && (
              <Marker position={[originCoords.lat, originCoords.lng]} icon={greenIcon}>
                <Popup>
                  <strong>Origem:</strong><br />
                  {origin}
                </Popup>
              </Marker>
            )}
            
            {destCoords && (
              <Marker position={[destCoords.lat, destCoords.lng]} icon={redIcon}>
                <Popup>
                  <strong>Destino:</strong><br />
                  {destination}
                </Popup>
              </Marker>
            )}
            
            <RouteLayer coordinates={routeCoordinates} />
          </MapContainer>
        )}
        
        {(distance || duration) && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
            {distance && (
              <div className="text-sm font-medium text-gray-700">
                📏 Distância: {distance} km
              </div>
            )}
            {duration && (
              <div className="text-sm text-gray-600">
                ⏱️ Tempo: {Math.floor(duration / 60)}h {duration % 60}min
              </div>
            )}
          </div>
        )}
      </div>
    </LoadingOverlay>
  );
};

export default memo(InteractiveMap);
