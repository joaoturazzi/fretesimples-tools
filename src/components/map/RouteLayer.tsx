
import React, { useEffect } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';

interface RouteLayerProps {
  coordinates: Array<{ lat: number; lng: number }>;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ coordinates }) => {
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

export default RouteLayer;
