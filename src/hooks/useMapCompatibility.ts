
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
    canLoadLeaflet: false,
    shouldUseSimpleMap: true
  });

  useEffect(() => {
    const checkCompatibility = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const isSupported = !!(
        window.document &&
        window.document.createElement &&
        window.requestAnimationFrame
      );

      // Por enquanto, usar sempre mapa simples para garantir estabilidade
      const shouldUseSimpleMap = true;
      const canLoadLeaflet = false;

      setCompatibility({
        isSupported,
        isMobile,
        canLoadLeaflet,
        shouldUseSimpleMap
      });

      console.log('Map compatibility check (stable mode):', {
        isSupported,
        isMobile,
        canLoadLeaflet,
        shouldUseSimpleMap
      });
    };

    checkCompatibility();
  }, []);

  return compatibility;
};
