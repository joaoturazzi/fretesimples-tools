
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
    if (!coordinates || coordinates.length === 0 || !map) {
      console.log('RouteLayer: Invalid coordinates or map not ready');
      return;
    }

    try {
      console.log('RouteLayer: Fitting bounds for coordinates:', coordinates.length);
      const bounds = L.latLngBounds(coordinates.map(coord => [coord.lat, coord.lng]));
      
      const timeoutId = setTimeout(() => {
        try {
          if (map && map.getContainer() && typeof map.fitBounds === 'function') {
            map.fitBounds(bounds, { padding: [20, 20] });
            console.log('RouteLayer: Bounds fitted successfully');
          }
        } catch (error) {
          console.warn('RouteLayer: Error fitting bounds in timeout:', error);
        }
      }, 200);
      
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.warn('RouteLayer: Error creating bounds:', error);
    }
  }, [coordinates, map]);

  if (!coordinates || coordinates.length === 0) {
    console.log('RouteLayer: No coordinates to render');
    return null;
  }

  try {
    const positions = coordinates.map(coord => [coord.lat, coord.lng] as LatLngExpression);
    console.log('RouteLayer: Rendering polyline with', positions.length, 'points');
    
    return (
      <Polyline 
        positions={positions}
        color="#ef4444"
        weight={4}
        opacity={0.8}
      />
    );
  } catch (error) {
    console.error('RouteLayer: Error rendering polyline:', error);
    return null;
  }
};

const MapInitializer = () => {
  const map = useMap();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!map || isInitialized) {
      return;
    }
    
    console.log('MapInitializer: Initializing map');
    
    const timeoutId = setTimeout(() => {
      try {
        if (map && map.getContainer() && typeof map.invalidateSize === 'function') {
          map.invalidateSize();
          setIsInitialized(true);
          console.log('MapInitializer: Map initialized successfully');
        }
      } catch (error) {
        console.warn('MapInitializer: Error invalidating map size:', error);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [map, isInitialized]);

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
  const geocodingInProgress = useRef(false);

  const mapCenter: LatLngExpression = [-14.235, -51.9253]; // Centro do Brasil

  console.log('InteractiveMap render:', { 
    origin, 
    destination, 
    routeCoordinatesLength: routeCoordinates?.length,
    mapReady,
    isLoading 
  });

  useEffect(() => {
    const geocode = async () => {
      if (!origin || !destination) {
        console.log('InteractiveMap: Missing origin or destination');
        setOriginCoords(null);
        setDestCoords(null);
        setMapReady(false);
        return;
      }
      
      if (geocodingInProgress.current) {
        console.log('InteractiveMap: Geocoding already in progress');
        return;
      }
      
      console.log('InteractiveMap: Starting geocoding for:', { origin, destination });
      geocodingInProgress.current = true;
      setIsLoading(true);
      setError(null);
      setMapReady(false);
      
      try {
        console.log('InteractiveMap: Calling mapService.geocodeAddress');
        const [originData, destinationData] = await Promise.all([
          mapService.geocodeAddress(origin),
          mapService.geocodeAddress(destination)
        ]);
        
        console.log('InteractiveMap: Geocoding results:', { originData, destinationData });
        
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
        
        if (originData && destinationData) {
          setMapReady(true);
          console.log('InteractiveMap: Map ready to render');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao geolocalizar endereços';
        console.error('InteractiveMap: Geocoding error:', err);
        setError(message);
        handleError(err, 'Geocoding');
      } finally {
        setIsLoading(false);
        geocodingInProgress.current = false;
      }
    };

    geocode();
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
          
          {routeCoordinates && routeCoordinates.length > 0 && (
            <RouteLayer coordinates={routeCoordinates} />
          )}
        </MapContainer>
        
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
