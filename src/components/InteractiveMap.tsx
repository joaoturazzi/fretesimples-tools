
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertCircle } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import 'leaflet/dist/leaflet.css';

// Fix default markers for Leaflet with error handling
try {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
} catch (error) {
  console.warn('Leaflet icon configuration failed:', error);
}

interface InteractiveMapProps {
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
  className?: string;
  onError?: (error: Error) => void;
}

const LoadingState = ({ className }: { className: string }) => (
  <div className={className}>
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Carregando mapa...</p>
      </div>
    </div>
  </div>
);

const ErrorState = ({ 
  className, 
  error, 
  onRetry 
}: { 
  className: string; 
  error: string; 
  onRetry: () => void;
}) => (
  <div className={className}>
    <div className="w-full h-full rounded-lg overflow-hidden border border-red-200 flex items-center justify-center bg-red-50">
      <div className="text-center p-4">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 text-sm font-medium mb-2">Erro ao carregar mapa</p>
        <p className="text-red-500 text-xs mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  </div>
);

const MapContent: React.FC<{
  routeCoordinates: Array<{ lat: number; lng: number }>;
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
}> = ({ routeCoordinates, origin, destination, distance, duration }) => {
  const mapRef = useRef<L.Map | null>(null);

  const originCoord = routeCoordinates[0];
  const destinationCoord = routeCoordinates[routeCoordinates.length - 1];
  const polylinePositions: [number, number][] = routeCoordinates.map(coord => [coord.lat, coord.lng]);

  // Calculate bounds with proper padding
  const lats = routeCoordinates.map(coord => coord.lat);
  const lngs = routeCoordinates.map(coord => coord.lng);
  const padding = 0.01;
  const bounds: [[number, number], [number, number]] = [
    [Math.min(...lats) - padding, Math.min(...lngs) - padding],
    [Math.max(...lats) + padding, Math.max(...lngs) + padding]
  ];

  return (
    <MapContainer
      bounds={bounds}
      className="w-full h-full"
      boundsOptions={{ padding: [20, 20] }}
      ref={mapRef}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
        console.log('Map instance created successfully');
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        errorTileUrl="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+Tile Error</text></svg>"
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
  );
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  origin,
  destination,
  distance,
  duration,
  routeCoordinates = [],
  className = "h-96 w-full rounded-lg",
  onError
}) => {
  const [mapState, setMapState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback((err: Error) => {
    console.error('InteractiveMap error:', err);
    setError(err.message);
    setMapState('error');
    onError?.(err);
  }, [onError]);

  const handleRetry = useCallback(() => {
    setMapState('loading');
    setError(null);
    setRetryCount(prev => prev + 1);
    
    // Add a small delay before retrying
    setTimeout(() => {
      if (routeCoordinates && routeCoordinates.length > 0) {
        setMapState('ready');
      } else {
        setError('Coordenadas da rota não disponíveis');
        setMapState('error');
      }
    }, 100);
  }, [routeCoordinates]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!routeCoordinates || routeCoordinates.length === 0) {
        return; // Keep loading state
      }

      // Validate coordinates
      const validCoords = routeCoordinates.every(coord => 
        typeof coord.lat === 'number' && 
        typeof coord.lng === 'number' &&
        !isNaN(coord.lat) && 
        !isNaN(coord.lng) &&
        coord.lat >= -90 && coord.lat <= 90 &&
        coord.lng >= -180 && coord.lng <= 180
      );

      if (!validCoords) {
        setError('Coordenadas inválidas fornecidas');
        setMapState('error');
        return;
      }

      setMapState('ready');
    }, 200);

    return () => clearTimeout(timer);
  }, [routeCoordinates, retryCount]);

  if (mapState === 'loading') {
    return <LoadingState className={className} />;
  }

  if (mapState === 'error') {
    return (
      <ErrorState 
        className={className} 
        error={error || 'Erro desconhecido'} 
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className={className}>
      <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
        <ErrorBoundary
          onError={handleError}
          fallback={
            <ErrorState 
              className="w-full h-full" 
              error="Erro interno do componente de mapa" 
              onRetry={handleRetry}
            />
          }
        >
          <MapContent
            routeCoordinates={routeCoordinates}
            origin={origin}
            destination={destination}
            distance={distance}
            duration={duration}
          />
        </ErrorBoundary>
      </div>
      
      {distance && (
        <div className="mt-2 text-center text-sm text-gray-600 flex items-center justify-center gap-2">
          <MapPin size={14} className="text-orange-500" />
          Rota calculada: {distance} km
          {duration && ` • Tempo estimado: ${Math.floor(duration / 60)}h ${duration % 60}m`}
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
