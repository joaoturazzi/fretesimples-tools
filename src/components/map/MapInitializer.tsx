
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

const MapInitializer: React.FC = () => {
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

export default MapInitializer;
