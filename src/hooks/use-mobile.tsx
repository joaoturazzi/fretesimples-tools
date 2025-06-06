
import { useState, useEffect, useCallback } from 'react';

// Função utilitária para detectar mobile sem hooks
const isMobileDevice = (breakpoint: number = 768): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoint;
};

export const useIsMobile = (breakpoint: number = 768) => {
  // Inicialização segura para prevenir hidration mismatch
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use useCallback to prevent recreation of the function on each render
  const checkIsMobile = useCallback(() => {
    if (typeof window === 'undefined') return;
    const mobile = window.innerWidth < breakpoint;
    setIsMobile(mobile);
    if (!isInitialized) setIsInitialized(true);
  }, [breakpoint, isInitialized]);

  useEffect(() => {
    // Check on initial load
    checkIsMobile();
    
    // Throttle the resize event to improve performance
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        checkIsMobile();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [checkIsMobile]);

  // Retorna false até estar inicializado para prevenir erros
  return isInitialized ? isMobile : false;
};

// Additional hooks for more specific breakpoints
export const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkIsTablet = () => {
      if (typeof window === 'undefined') return;
      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setIsTablet(tablet);
      if (!isInitialized) setIsInitialized(true);
    };

    checkIsTablet();
    
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        checkIsTablet();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isInitialized]);

  return isInitialized ? isTablet : false;
};

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      if (typeof window === 'undefined') return;
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!isInitialized) setIsInitialized(true);
    };

    checkIsDesktop();
    
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        checkIsDesktop();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isInitialized]);

  return isInitialized ? isDesktop : false;
};

// Função utilitária exportada para uso direto
export { isMobileDevice };
