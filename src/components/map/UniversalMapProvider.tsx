
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMapCompatibility } from '@/hooks/useMapCompatibility';

export type MapProvider = 'here' | 'leaflet' | 'fallback';

interface MapProviderContextType {
  provider: MapProvider;
  isReady: boolean;
  error: string | null;
  switchProvider: (provider: MapProvider) => void;
}

const MapProviderContext = createContext<MapProviderContextType | null>(null);

export const useMapProvider = () => {
  const context = useContext(MapProviderContext);
  if (!context) {
    throw new Error('useMapProvider must be used within MapProviderProvider');
  }
  return context;
};

interface MapProviderProviderProps {
  children: ReactNode;
  preferredProvider?: MapProvider;
}

export const MapProviderProvider: React.FC<MapProviderProviderProps> = ({
  children,
  preferredProvider = 'here'
}) => {
  const [provider, setProvider] = useState<MapProvider>(preferredProvider);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const compatibility = useMapCompatibility();

  useEffect(() => {
    const initializeProvider = async () => {
      setIsReady(false);
      setError(null);
      console.log('Initializing map provider:', provider);

      try {
        if (provider === 'here') {
          console.log('Attempting to load HERE Maps...');
          await loadHereMapsWithTimeout();
          console.log('HERE Maps loaded successfully');
          setIsReady(true);
        } else if (provider === 'leaflet') {
          console.log('Using Leaflet provider...');
          if (compatibility.canLoadLeaflet) {
            setIsReady(true);
          } else {
            throw new Error('Leaflet not available');
          }
        } else {
          console.log('Using fallback provider...');
          setIsReady(true);
        }
      } catch (err) {
        console.warn(`Failed to load ${provider}:`, err);
        
        // Automatic fallback sequence: HERE -> Leaflet -> Simple Fallback
        if (provider === 'here' && compatibility.canLoadLeaflet) {
          console.log('Falling back to Leaflet...');
          setProvider('leaflet');
          return;
        } else if (provider === 'here' || provider === 'leaflet') {
          console.log('Falling back to simple map...');
          setProvider('fallback');
          return;
        }
        
        // If we're already on fallback, just mark as ready
        setIsReady(true);
        setError(err instanceof Error ? err.message : 'Map initialization failed');
      }
    };

    initializeProvider();
  }, [provider, compatibility]);

  const loadHereMapsWithTimeout = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Set timeout for loading
      const timeout = setTimeout(() => {
        reject(new Error('HERE Maps loading timeout'));
      }, 10000); // 10 seconds timeout

      const cleanup = () => clearTimeout(timeout);

      if (window.H) {
        cleanup();
        resolve();
        return;
      }

      const loadScript = (src: string): Promise<void> => {
        return new Promise((scriptResolve, scriptReject) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = () => scriptResolve();
          script.onerror = () => scriptReject(new Error(`Failed to load ${src}`));
          document.head.appendChild(script);
        });
      };

      const loadStyles = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css';
        document.head.appendChild(link);
      };

      // Load scripts sequentially
      const loadSequence = async () => {
        try {
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js');
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js');
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js');
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js');
          loadStyles();
          
          // Verify HERE Maps is actually available
          if (!window.H || !window.H.Map || !window.H.service) {
            throw new Error('HERE Maps components not properly loaded');
          }
          
          cleanup();
          resolve();
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      loadSequence();
    });
  };

  const switchProvider = (newProvider: MapProvider) => {
    console.log('Switching to provider:', newProvider);
    setProvider(newProvider);
  };

  return (
    <MapProviderContext.Provider value={{
      provider,
      isReady,
      error,
      switchProvider
    }}>
      {children}
    </MapProviderContext.Provider>
  );
};
