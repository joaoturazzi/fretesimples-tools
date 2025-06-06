
import React, { useEffect, useRef } from 'react';

interface MapComponentProps {
  origin?: string;
  destination?: string;
  onRouteCalculated?: (distance: number, duration: number) => void;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  origin, 
  destination, 
  onRouteCalculated, 
  className = "h-64 w-full rounded-lg border border-gray-200" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeGroupRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = () => {
      try {
        // Check if HERE Maps is available
        if (typeof window === 'undefined' || !window.H) {
          console.warn('HERE Maps API not loaded');
          return;
        }

        const platform = new window.H.service.Platform({
          'apikey': 'JeglUu9l7gXwCMcH6x5-FaX0AkwABnmICqMupmCfIng'
        });

        const defaultMapTypes = platform.createDefaultMapTypes();
        const map = new window.H.Map(
          mapRef.current!,
          defaultMapTypes.vector.normal.map,
          {
            zoom: 6,
            center: { lat: -14.235, lng: -51.9253 }
          }
        );

        const behavior = new window.H.mapview.behavior.Behavior();
        const ui = window.H.ui.UI.createDefault(map);

        mapInstanceRef.current = map;

        // Add route if both origin and destination are provided
        if (origin && destination) {
          geocodeAndShowRoute(platform, map, origin, destination);
        }

      } catch (error) {
        console.error('Error initializing HERE Map:', error);
      }
    };

    const geocodeAndShowRoute = async (platform: any, map: any, originAddr: string, destAddr: string) => {
      try {
        const geocoder = platform.getSearchService();
        
        // Geocode origin
        const originResult = await new Promise<any>((resolve, reject) => {
          geocoder.geocode({
            q: originAddr + ', Brasil'
          }, resolve, reject);
        });

        // Geocode destination
        const destResult = await new Promise<any>((resolve, reject) => {
          geocoder.geocode({
            q: destAddr + ', Brasil'
          }, resolve, reject);
        });

        if (originResult.Response?.View?.[0]?.Result?.[0] && destResult.Response?.View?.[0]?.Result?.[0]) {
          const originPos = originResult.Response.View[0].Result[0].Location.DisplayPosition;
          const destPos = destResult.Response.View[0].Result[0].Location.DisplayPosition;

          // Clear previous routes
          if (routeGroupRef.current) {
            map.removeObject(routeGroupRef.current);
          }
          routeGroupRef.current = new window.H.map.Group();

          // Add markers
          const originMarker = new window.H.map.Marker({ lat: originPos.Latitude, lng: originPos.Longitude });
          const destMarker = new window.H.map.Marker({ lat: destPos.Latitude, lng: destPos.Longitude });
          
          routeGroupRef.current.addObject(originMarker);
          routeGroupRef.current.addObject(destMarker);

          // Calculate route
          const router = platform.getRoutingService();
          const routeParams = {
            mode: 'fastest;truck',
            waypoint0: `${originPos.Latitude},${originPos.Longitude}`,
            waypoint1: `${destPos.Latitude},${destPos.Longitude}`,
            representation: 'display'
          };

          router.calculateRoute(routeParams, (result: any) => {
            if (result.response && result.response.route) {
              const route = result.response.route[0];
              const routeShape = route.shape;
              
              const lineString = new window.H.geo.LineString();
              routeShape.forEach((point: string) => {
                const coords = point.split(',');
                lineString.pushPoint({ lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) });
              });

              const routeLine = new window.H.map.Polyline(lineString, {
                style: { strokeColor: '#ff6b35', lineWidth: 4 }
              });

              routeGroupRef.current!.addObject(routeLine);
              map.addObject(routeGroupRef.current!);

              // Set viewport to show the route
              map.getViewModel().setLookAtData({
                bounds: routeGroupRef.current!.getBoundingBox()
              });

              // Calculate distance and notify parent
              const distanceInMeters = route.summary.distance;
              const durationInSeconds = route.summary.travelTime;
              const distanceInKm = Math.round(distanceInMeters / 1000);
              const durationInMinutes = Math.round(durationInSeconds / 60);

              if (onRouteCalculated) {
                onRouteCalculated(distanceInKm, durationInMinutes);
              }
            }
          }, (error: any) => {
            console.error('Route calculation failed:', error);
          });
        }
      } catch (error) {
        console.error('Geocoding failed:', error);
      }
    };

    // Initialize map when HERE Maps API is loaded
    if (typeof window !== 'undefined' && window.H) {
      initializeMap();
    } else {
      // Wait for HERE Maps to load
      const checkHereMaps = () => {
        if (window.H) {
          initializeMap();
        } else {
          setTimeout(checkHereMaps, 100);
        }
      };
      checkHereMaps();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
      }
    };
  }, [origin, destination, onRouteCalculated]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default MapComponent;
