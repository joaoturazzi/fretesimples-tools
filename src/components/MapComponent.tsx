
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

  useEffect(() => {
    if (!mapRef.current) return;

    // Check if HERE Maps is loaded
    if (typeof window !== 'undefined' && window.H) {
      try {
        const platform = new window.H.service.Platform({
          'apikey': 'JeglUu9l7gXwCMcH6x5-FaX0AkwABnmICqMupmCfIng'
        });

        const defaultMapTypes = platform.createDefaultMapTypes();
        const map = new window.H.Map(
          mapRef.current,
          defaultMapTypes.vector.normal.map,
          {
            zoom: 6,
            center: { lat: -14.235, lng: -51.9253 } // Centro do Brasil
          }
        );

        const behavior = new window.H.mapview.behavior.Behavior({});
        const ui = new window.H.ui.UI.createDefault(map);

        return () => {
          try {
            map.getViewPort().removeEventListener('resize', () => map.getViewPort().resize());
            map.dispose();
          } catch (error) {
            console.error('Error disposing map:', error);
          }
        };
      } catch (error) {
        console.error('Error initializing HERE Map:', error);
      }
    } else {
      console.warn('HERE Maps API not loaded');
    }
  }, [origin, destination]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default MapComponent;
