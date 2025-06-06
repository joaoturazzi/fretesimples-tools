
import React, { useRef, useEffect, useState, memo } from 'react';
import { useMapProvider } from './UniversalMapProvider';
import { LoadingState } from '@/components/ui/loading';
import SimpleMapFallback from './SimpleMapFallback';
import InteractiveMap from '../InteractiveMap';
import env from '@/config/env';

interface HybridMapProps {
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
  className?: string;
  height?: number;
  onRouteCalculated?: (data: {
    distance: number;
    duration: number;
    coordinates: Array<{ lat: number; lng: number }>;
  }) => void;
}

const HybridMap: React.FC<HybridMapProps> = memo(({
  origin,
  destination,
  distance,
  duration,
  routeCoordinates = [],
  className = '',
  height = 350,
  onRouteCalculated
}) => {
  const { provider, isReady } = useMapProvider();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapObjects, setMapObjects] = useState<any[]>([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  useEffect(() => {
    if (provider === 'here' && isReady && mapContainerRef.current && !mapRef.current) {
      initializeHereMap();
    }
  }, [provider, isReady]);

  useEffect(() => {
    if (provider === 'here' && mapRef.current && origin && destination) {
      calculateHereRoute();
    }
  }, [origin, destination, provider]);

  const initializeHereMap = async () => {
    if (!window.H || !mapContainerRef.current) return;

    try {
      const platform = new window.H.service.Platform({
        apikey: env.HERE_API_KEY
      });

      const defaultLayers = platform.createDefaultLayers();
      const map = new window.H.Map(
        mapContainerRef.current,
        defaultLayers.vector.normal.map,
        {
          zoom: 5,
          center: { lat: -15.7801, lng: -47.9292 }
        }
      );

      // Enable map interaction
      const behavior = new window.H.mapevents.Behavior();
      const ui = window.H.ui.UI.createDefault(map);

      mapRef.current = map;
      console.log('HERE Map initialized successfully');
    } catch (error) {
      console.error('Error initializing HERE Map:', error);
    }
  };

  const calculateHereRoute = async () => {
    if (!mapRef.current || !window.H || !origin.trim() || !destination.trim()) return;

    setIsCalculatingRoute(true);
    
    try {
      // Clear previous objects
      clearMapObjects();

      // Geocode addresses
      const platform = new window.H.service.Platform({
        apikey: env.HERE_API_KEY
      });

      const geocoder = platform.getSearchService();
      
      const [originResult, destResult] = await Promise.all([
        geocodeAddress(geocoder, origin),
        geocodeAddress(geocoder, destination)
      ]);

      if (!originResult || !destResult) {
        throw new Error('Could not find addresses');
      }

      // Calculate route
      const router = platform.getRoutingService();
      const routeParams = {
        mode: 'fastest;truck',
        representation: 'display',
        waypoint0: `${originResult.lat},${originResult.lng}`,
        waypoint1: `${destResult.lat},${destResult.lng}`,
        routeattributes: 'summary,shape',
        maneuverattributes: 'direction,action'
      };

      router.calculateRoute(routeParams, (result: any) => {
        if (result.response && result.response.route && result.response.route[0]) {
          const route = result.response.route[0];
          const summary = route.summary;
          const shape = route.shape;

          // Convert shape to coordinates
          const coordinates = shape.map((point: string) => {
            const [lat, lng] = point.split(',').map(Number);
            return { lat, lng };
          });

          // Add markers and route to map
          const originMarker = new window.H.map.Marker(originResult);
          const destMarker = new window.H.map.Marker(destResult);
          
          const lineString = new window.H.geo.LineString();
          coordinates.forEach(coord => lineString.pushPoint(coord));
          const polyline = new window.H.map.Polyline(lineString, {
            style: { lineWidth: 5, strokeColor: '#FF6B00' }
          });

          mapRef.current.addObject(originMarker);
          mapRef.current.addObject(destMarker);
          mapRef.current.addObject(polyline);
          
          setMapObjects([originMarker, destMarker, polyline]);

          // Fit map to route
          mapRef.current.getViewModel().setLookAtData({
            bounds: polyline.getBoundingBox()
          });

          // Callback with route data
          if (onRouteCalculated) {
            onRouteCalculated({
              distance: summary.distance / 1000, // Convert to km
              duration: summary.travelTime / 60, // Convert to minutes
              coordinates
            });
          }
        }
      }, (error: any) => {
        console.error('Route calculation error:', error);
      });

    } catch (error) {
      console.error('Error calculating HERE route:', error);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const geocodeAddress = (geocoder: any, address: string): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({
        q: address,
        in: 'countryCode:BRA'
      }, (result: any) => {
        if (result.items && result.items.length > 0) {
          const position = result.items[0].position;
          resolve({ lat: position.lat, lng: position.lng });
        } else {
          reject(new Error('Address not found'));
        }
      }, reject);
    });
  };

  const clearMapObjects = () => {
    if (mapRef.current && mapObjects.length > 0) {
      mapObjects.forEach(obj => mapRef.current.removeObject(obj));
      setMapObjects([]);
    }
  };

  // Render based on provider
  if (provider === 'fallback') {
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

  if (provider === 'leaflet') {
    return (
      <InteractiveMap
        origin={origin}
        destination={destination}
        distance={distance}
        duration={duration}
        routeCoordinates={routeCoordinates}
        className={className}
        height={height}
      />
    );
  }

  // HERE Maps provider
  if (!isReady) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg border ${className}`} style={{ height }}>
        <LoadingState message="Carregando HERE Maps..." icon="map" />
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden border border-gray-200 ${className}`} style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      {isCalculatingRoute && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-gray-600">Calculando rota...</span>
          </div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.origin === nextProps.origin &&
    prevProps.destination === nextProps.destination &&
    prevProps.distance === nextProps.distance &&
    prevProps.duration === nextProps.duration &&
    prevProps.className === nextProps.className &&
    prevProps.height === nextProps.height
  );
});

HybridMap.displayName = 'HybridMap';

export default HybridMap;
