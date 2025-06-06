
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

      // Se é mobile ou não suporta mapas complexos, usar fallback
      if (compatibility.shouldUseSimpleMap) {
        setProvider('fallback');
        setIsReady(true);
        return;
      }

      try {
        if (provider === 'here') {
          // Tentar carregar HERE Maps
          await loadHereMaps();
          setIsReady(true);
        } else if (provider === 'leaflet') {
          // Verificar se Leaflet está disponível
          if (compatibility.canLoadLeaflet) {
            setIsReady(true);
          } else {
            throw new Error('Leaflet not available');
          }
        } else {
          // Fallback sempre funciona
          setIsReady(true);
        }
      } catch (err) {
        console.warn(`Failed to load ${provider}, falling back to simpler map`);
        setProvider('fallback');
        setIsReady(true);
      }
    };

    initializeProvider();
  }, [provider, compatibility]);

  const loadHereMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.H) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.api.here.com/v3/3.1/mapsjs-core.js';
      script.async = true;
      script.onload = () => {
        const serviceScript = document.createElement('script');
        serviceScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-service.js';
        serviceScript.async = true;
        serviceScript.onload = () => {
          const uiScript = document.createElement('script');
          uiScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-ui.js';
          uiScript.async = true;
          uiScript.onload = () => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css';
            document.head.appendChild(link);
            resolve();
          };
          document.head.appendChild(uiScript);
        };
        document.head.appendChild(serviceScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const switchProvider = (newProvider: MapProvider) => {
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
