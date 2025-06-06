
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMapCompatibility } from '@/hooks/useMapCompatibility';

export type MapProvider = 'here' | 'leaflet' | 'fallback';

interface MapProviderContextType {
  provider: MapProvider;
  isReady: boolean;
  error: string | null;
  switchProvider: (provider: MapProvider) => void;
  isInitialized: boolean;
}

const MapProviderContext = createContext<MapProviderContextType | null>(null);

export const useMapProvider = () => {
  const context = useContext(MapProviderContext);
  if (!context) {
    // Retornar valores padrão enquanto o contexto não está pronto
    console.warn('useMapProvider called before MapProviderProvider is ready, using fallback');
    return {
      provider: 'fallback' as MapProvider,
      isReady: true,
      error: null,
      switchProvider: () => {},
      isInitialized: false
    };
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
  const [isInitialized, setIsInitialized] = useState(false);
  const compatibility = useMapCompatibility();

  useEffect(() => {
    const initializeProvider = async () => {
      console.log('Initializing map provider:', provider);
      setIsReady(false);
      setError(null);

      try {
        if (provider === 'here') {
          console.log('Attempting to load HERE Maps...');
          const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('HERE Maps timeout')), 8000)
          );
          
          await Promise.race([loadHereMapsWithTimeout(), timeout]);
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
        
        // Fallback automático: HERE -> Leaflet -> Simple Fallback
        if (provider === 'here' && compatibility.canLoadLeaflet) {
          console.log('Auto-falling back to Leaflet...');
          setProvider('leaflet');
          return;
        } else if (provider === 'here' || provider === 'leaflet') {
          console.log('Auto-falling back to simple map...');
          setProvider('fallback');
          return;
        }
        
        // Se já estamos no fallback, marcar como pronto
        setIsReady(true);
        setError(err instanceof Error ? err.message : 'Map initialization failed');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeProvider();
  }, [provider, compatibility]);

  const loadHereMapsWithTimeout = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.H && window.H.Map && window.H.service) {
        resolve();
        return;
      }

      const loadScript = (src: string): Promise<void> => {
        return new Promise((scriptResolve, scriptReject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            scriptResolve();
            return;
          }
          
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = () => scriptResolve();
          script.onerror = () => scriptReject(new Error(`Failed to load ${src}`));
          document.head.appendChild(script);
        });
      };

      const loadStyles = () => {
        if (!document.querySelector('link[href*="mapsjs-ui.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css';
          document.head.appendChild(link);
        }
      };

      const loadSequence = async () => {
        try {
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js');
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js');
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js');
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js');
          loadStyles();
          
          // Aguardar um pouco para garantir que os scripts foram processados
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (!window.H || !window.H.Map || !window.H.service) {
            throw new Error('HERE Maps components not properly loaded');
          }
          
          resolve();
        } catch (error) {
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

  const contextValue: MapProviderContextType = {
    provider,
    isReady,
    error,
    switchProvider,
    isInitialized
  };

  return (
    <MapProviderContext.Provider value={contextValue}>
      {children}
    </MapProviderContext.Provider>
  );
};
