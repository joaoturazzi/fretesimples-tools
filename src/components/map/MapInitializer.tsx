
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

    // Verificar se o mapa tem métodos essenciais ANTES de usar
    if (!map.invalidateSize || typeof map.invalidateSize !== 'function' || 
        !map.getContainer || typeof map.getContainer !== 'function') {
      console.warn('MapInitializer: Map object não possui métodos essenciais');
      return;
    }
    
    console.log('MapInitializer: Iniciando inicialização segura do mapa');
    
    // Limpar timeout anterior se existir
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }
    
    // Timeout mais conservador para evitar conflitos
    initTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current || isInitialized) {
        return;
      }
      
      try {
        // Verificação dupla dos métodos no momento da execução
        if (!map || typeof map.invalidateSize !== 'function') {
          console.warn('MapInitializer: Map invalidateSize não disponível no momento da execução');
          return;
        }
        
        const container = map.getContainer();
        
        // Verificar se o container existe e está no DOM
        if (!container || !document.contains(container)) {
          console.warn('MapInitializer: Container do mapa não encontrado no DOM');
          return;
        }
        
        // Verificar se o container tem dimensões
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          console.warn('MapInitializer: Container do mapa tem dimensões zero');
          // Tentar novamente após um delay maior
          if (mountedRef.current) {
            initTimeoutRef.current = setTimeout(() => {
              if (mountedRef.current && !isInitialized && map && typeof map.invalidateSize === 'function') {
                map.invalidateSize();
                setIsInitialized(true);
                console.log('MapInitializer: Mapa inicializado com sucesso (delayed)');
              }
            }, 500);
          }
          return;
        }
        
        // Inicializar o mapa com verificação final
        if (typeof map.invalidateSize === 'function') {
          map.invalidateSize();
          
          if (mountedRef.current) {
            setIsInitialized(true);
            console.log('MapInitializer: Mapa inicializado com sucesso');
          }
        }
        
      } catch (error) {
        console.error('MapInitializer: Erro durante inicialização:', error);
        
        // Para erros específicos do Leaflet, tentar novamente UMA ÚNICA VEZ
        if (error instanceof Error && 
            (error.message.includes('invalidateSize') || 
             error.message.includes('getContainer') ||
             error.message.includes('r is not a function'))) {
          
          if (mountedRef.current) {
            initTimeoutRef.current = setTimeout(() => {
              try {
                if (mountedRef.current && !isInitialized && map && typeof map.invalidateSize === 'function') {
                  map.invalidateSize();
                  setIsInitialized(true);
                  console.log('MapInitializer: Mapa inicializado com sucesso (retry)');
                }
              } catch (retryError) {
                console.error('MapInitializer: Falha no retry:', retryError);
                // Não tentar novamente após o primeiro retry
              }
            }, 1000);
          }
        }
      }
    }, 500); // Timeout mais conservador
    
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
