
import React, { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';

const MapInitializer: React.FC = () => {
  const map = useMap();
  const [isInitialized, setIsInitialized] = useState(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Verificações rigorosas antes de tentar inicializar
    if (!map || isInitialized || !mountedRef.current) {
      return;
    }

    // Verificar se o mapa tem métodos essenciais
    if (typeof map.invalidateSize !== 'function' || 
        typeof map.getContainer !== 'function') {
      console.warn('MapInitializer: Map object is missing essential methods');
      return;
    }
    
    console.log('MapInitializer: Starting map initialization');
    
    // Limpar timeout anterior se existir
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }
    
    initTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current || isInitialized) {
        return;
      }
      
      try {
        const container = map.getContainer();
        
        // Verificar se o container existe e está no DOM
        if (!container || !document.contains(container)) {
          console.warn('MapInitializer: Map container not found in DOM');
          return;
        }
        
        // Verificar se o container tem dimensões
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          console.warn('MapInitializer: Map container has zero dimensions');
          // Tentar novamente em 200ms
          if (mountedRef.current) {
            initTimeoutRef.current = setTimeout(() => {
              if (mountedRef.current && !isInitialized) {
                map.invalidateSize();
                setIsInitialized(true);
                console.log('MapInitializer: Map initialized successfully (delayed)');
              }
            }, 200);
          }
          return;
        }
        
        // Inicializar o mapa
        map.invalidateSize();
        
        if (mountedRef.current) {
          setIsInitialized(true);
          console.log('MapInitializer: Map initialized successfully');
        }
        
      } catch (error) {
        console.error('MapInitializer: Error during map initialization:', error);
        
        // Para erros específicos do Leaflet, tentar novamente uma vez
        if (error instanceof Error && 
            (error.message.includes('invalidateSize') || 
             error.message.includes('getContainer'))) {
          
          if (mountedRef.current) {
            initTimeoutRef.current = setTimeout(() => {
              try {
                if (mountedRef.current && !isInitialized && map && typeof map.invalidateSize === 'function') {
                  map.invalidateSize();
                  setIsInitialized(true);
                  console.log('MapInitializer: Map initialized successfully (retry)');
                }
              } catch (retryError) {
                console.error('MapInitializer: Retry failed:', retryError);
              }
            }, 500);
          }
        }
      }
    }, 300);
    
    // Cleanup function
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
    };
  }, [map, isInitialized]);

  return null;
};

export default MapInitializer;
