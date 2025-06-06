
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { mapService } from '@/services/unifiedMapService';

interface GeocodeResult {
  lat: number;
  lng: number;
}

interface CacheEntry {
  result: { originCoords: GeocodeResult | null; destCoords: GeocodeResult | null };
  timestamp: number;
}

// Cache global para evitar re-geocoding desnecessário
const geocodeCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export const useMapGeocoding = (origin: string, destination: string) => {
  const [originCoords, setOriginCoords] = useState<GeocodeResult | null>(null);
  const [destCoords, setDestCoords] = useState<GeocodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  
  const mountedRef = useRef(true);
  const currentRequestRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função estável para limpar estados - sem dependências
  const clearStates = useCallback(() => {
    if (!mountedRef.current) return;
    setOriginCoords(null);
    setDestCoords(null);
    setMapReady(false);
    setError(null);
  }, []);

  // Função estável para tratamento de erro - sem dependências
  const handleGeocodingError = useCallback((err: any, context: string) => {
    if (!mountedRef.current) return;
    
    const message = err instanceof Error ? err.message : 'Erro ao geolocalizar endereços';
    console.error(`useMapGeocoding ${context}:`, err);
    setError(message);
    setIsLoading(false);
  }, []);

  // Gerar chave de cache estável
  const cacheKey = useMemo(() => {
    if (!origin?.trim() || !destination?.trim()) return '';
    return `${origin.trim().toLowerCase()}|${destination.trim().toLowerCase()}`;
  }, [origin, destination]);

  // Verificar cache válido
  const getCachedResult = useCallback((key: string): CacheEntry | null => {
    const cached = geocodeCache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > CACHE_TTL;
    if (isExpired) {
      geocodeCache.delete(key);
      return null;
    }
    
    return cached;
  }, []);

  // Função principal de geocoding - memoizada
  const performGeocoding = useCallback(async (requestKey: string) => {
    if (!mountedRef.current || !cacheKey) return;
    
    // Verificar cache primeiro
    const cached = getCachedResult(cacheKey);
    if (cached) {
      console.log('useMapGeocoding: Using cached result for:', cacheKey);
      setOriginCoords(cached.result.originCoords);
      setDestCoords(cached.result.destCoords);
      setMapReady(!!(cached.result.originCoords && cached.result.destCoords));
      setIsLoading(false);
      return;
    }

    // Verificar se ainda é a requisição atual
    if (currentRequestRef.current !== requestKey || !mountedRef.current) {
      return;
    }

    console.log('useMapGeocoding: Starting geocoding for:', { origin, destination });
    
    try {
      setIsLoading(true);
      setError(null);
      
      const [originData, destinationData] = await Promise.all([
        mapService.geocodeAddress(origin),
        mapService.geocodeAddress(destination)
      ]);
      
      // Verificar se ainda é a requisição atual e component está montado
      if (currentRequestRef.current !== requestKey || !mountedRef.current) {
        return;
      }
      
      console.log('useMapGeocoding: Geocoding results:', { originData, destinationData });
      
      const originCoords = originData ? { lat: originData.lat, lng: originData.lng } : null;
      const destCoords = destinationData ? { lat: destinationData.lat, lng: destinationData.lng } : null;
      
      // Atualizar estados apenas se component ainda estiver montado
      if (mountedRef.current) {
        setOriginCoords(originCoords);
        setDestCoords(destCoords);
        setMapReady(!!(originCoords && destCoords));
        
        // Salvar no cache
        geocodeCache.set(cacheKey, {
          result: { originCoords, destCoords },
          timestamp: Date.now()
        });
        
        if (!originCoords) {
          setError(`Não foi possível encontrar as coordenadas para: ${origin}`);
        } else if (!destCoords) {
          setError(`Não foi possível encontrar as coordenadas para: ${destination}`);
        }
      }
      
    } catch (err) {
      // Verificar se ainda é a requisição atual
      if (currentRequestRef.current === requestKey && mountedRef.current) {
        handleGeocodingError(err, 'performGeocoding');
      }
    } finally {
      if (mountedRef.current && currentRequestRef.current === requestKey) {
        setIsLoading(false);
      }
    }
  }, [cacheKey, origin, destination, getCachedResult, handleGeocodingError]);

  // Effect principal - APENAS com cacheKey como dependência
  useEffect(() => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Validar inputs
    if (!cacheKey || !origin?.trim() || !destination?.trim()) {
      clearStates();
      return;
    }

    // Gerar ID único para esta requisição
    const requestId = `${cacheKey}_${Date.now()}`;
    currentRequestRef.current = requestId;

    // Verificar cache imediatamente para resposta instantânea
    const cached = getCachedResult(cacheKey);
    if (cached) {
      console.log('useMapGeocoding: Immediate cache hit for:', cacheKey);
      setOriginCoords(cached.result.originCoords);
      setDestCoords(cached.result.destCoords);
      setMapReady(!!(cached.result.originCoords && cached.result.destCoords));
      setIsLoading(false);
      return;
    }

    // Debounce para novas requisições
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current && currentRequestRef.current === requestId) {
        performGeocoding(requestId);
      }
    }, 1000);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [cacheKey]); // APENAS cacheKey como dependência

  // Cleanup no unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    originCoords,
    destCoords,
    isLoading,
    error,
    mapReady
  };
};
