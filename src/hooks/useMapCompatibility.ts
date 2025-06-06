
import { useState, useEffect } from 'react';

interface MapCompatibility {
  isSupported: boolean;
  isMobile: boolean;
  canLoadLeaflet: boolean;
  shouldUseSimpleMap: boolean;
}

export const useMapCompatibility = (): MapCompatibility => {
  const [compatibility, setCompatibility] = useState<MapCompatibility>({
    isSupported: false,
    isMobile: false,
    canLoadLeaflet: false,
    shouldUseSimpleMap: false
  });

  useEffect(() => {
    const checkCompatibility = async () => {
      // Detectar dispositivo móvel
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Verificar se Leaflet está disponível
      let canLoadLeaflet = false;
      try {
        const L = await import('leaflet');
        canLoadLeaflet = !!(L && L.Map && typeof L.Map === 'function');
      } catch (error) {
        console.warn('Leaflet não disponível:', error);
        canLoadLeaflet = false;
      }

      // Determinar suporte básico
      const isSupported = !!(
        window.document &&
        window.document.createElement &&
        window.requestAnimationFrame
      );

      // Ser menos restritivo - permitir mapas em mais dispositivos
      // Só usar mapa simples se realmente não há suporte ou se está offline
      const shouldUseSimpleMap = !isSupported || !navigator.onLine;

      setCompatibility({
        isSupported,
        isMobile,
        canLoadLeaflet,
        shouldUseSimpleMap
      });

      console.log('Map compatibility check:', {
        isSupported,
        isMobile,
        canLoadLeaflet,
        shouldUseSimpleMap,
        userAgent: navigator.userAgent
      });
    };

    checkCompatibility();
  }, []);

  return compatibility;
};
