
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { LoadingState, LoadingOverlay } from '@/components/ui/loading';
import { mapService } from '@/services/unifiedMapService';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import ErrorBoundary from '@/components/ErrorBoundary';

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

const RouteLayer = ({ coordinates }: { coordinates: Array<{ lat: number; lng: number }> }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates.length > 0 && map) {
      try {
        const bounds = L.latLngBounds(coordinates.map(coord => [coord.lat, coord.lng]));
        const timeoutId = setTimeout(() => {
          if (map && map.getContainer()) {
            map.fitBounds(bounds, { padding: [20, 20] });
          }
        }, 100);
        
        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.warn('Error fitting bounds:', error);
      }
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
};

const MapInitializer = () => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    const timeoutId = setTimeout(() => {
      try {
        if (map && map.getContainer() && typeof map.invalidateSize === 'function') {
          map.invalidateSize();
        }
      } catch (error) {
        console.warn('Error invalidating map size:', error);
      }
    }, 200);
    
    return () => clearTimeout(timeoutId);
  }, [map]);

  return null;
};

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
  const [mapReady, setMapReady] = useState(false);
  const { handleError } = useErrorHandler();

  const mapCenter: LatLngExpression = [-14.235, -51.9253]; // Centro do Brasil

  useEffect(() => {
    const geocode = async () => {
      if (!origin || !destination) return;
      
      setIsLoading(true);
      setError(null);
      setMapReady(false);
      
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
        
        setMapReady(true);
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
    } else {
      setOriginCoords(null);
      setDestCoords(null);
      setMapReady(false);
    }
  }, [origin, destination, handleError]);

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

  return (
    <ErrorBoundary>
      <LoadingOverlay isVisible={isLoading} message="Carregando mapa...">
        <div className={`relative rounded-lg overflow-hidden border border-gray-200 ${className}`} style={{ height }}>
          {error ? (
            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-600">
              <div className="text-center">
                <p className="mb-2">⚠️ Erro ao carregar mapa</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : mapReady ? (
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
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <LoadingState message="Preparando mapa..." icon="map" />
            </div>
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
    </ErrorBoundary>
  );
};

export default InteractiveMap;
