
import { useState, useEffect } from 'react';

interface MapCompatibility {
  isSupported: boolean;
  isMobile: boolean;
  canLoadLeaflet: boolean;
  shouldUseSimpleMap: boolean;
}

export const useMapCompatibility = (): MapCompatibility => {
  const [compatibility, setCompatibility] = useState<MapCompatibility>({
    isSupported: true,
    isMobile: false,
    canLoadLeaflet: true,
    shouldUseSimpleMap: false
  });

  useEffect(() => {
    const checkCompatibility = async () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      let canLoadLeaflet = true;
      try {
        const L = await import('leaflet');
        canLoadLeaflet = !!(L && L.Map && typeof L.Map === 'function');
      } catch (error) {
        console.warn('Leaflet não disponível:', error);
        canLoadLeaflet = false;
      }

      const isSupported = !!(
        window.document &&
        window.document.createElement &&
        window.requestAnimationFrame
      );

      // Apenas usar mapa simples se realmente não há suporte
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
