
import React from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { greenIcon, redIcon } from './MapIcons';

interface GeocodeResult {
  lat: number;
  lng: number;
}

interface MapMarkersProps {
  originCoords: GeocodeResult | null;
  destCoords: GeocodeResult | null;
  origin: string;
  destination: string;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  originCoords,
  destCoords,
  origin,
  destination
}) => {
  const map = useMap();
  
  // Verificação mais rigorosa se o mapa está disponível
  if (!map) {
    console.warn('MapMarkers: Map não disponível');
    return null;
  }
  
  // Verificar métodos essenciais do mapa
  if (typeof map.fitBounds !== 'function') {
    console.warn('MapMarkers: Map não possui método fitBounds');
    return null;
  }
  
  // Validar coordenadas antes de renderizar
  const isValidCoord = (coord: GeocodeResult | null): coord is GeocodeResult => {
    return coord !== null && 
           typeof coord.lat === 'number' && 
           typeof coord.lng === 'number' &&
           !isNaN(coord.lat) && 
           !isNaN(coord.lng) &&
           coord.lat >= -90 && coord.lat <= 90 &&
           coord.lng >= -180 && coord.lng <= 180;
  };

  const validOrigin = isValidCoord(originCoords);
  const validDest = isValidCoord(destCoords);
  
  // Ajustar zoom para mostrar ambos os marcadores se ambos forem válidos
  React.useEffect(() => {
    if (validOrigin && validDest && map && typeof map.fitBounds === 'function') {
      try {
        const bounds = [
          [originCoords.lat, originCoords.lng],
          [destCoords.lat, destCoords.lng]
        ] as [[number, number], [number, number]];
        
        // Adicionar padding para melhor visualização
        map.fitBounds(bounds, { padding: [20, 20] });
        console.log('MapMarkers: Bounds ajustados com sucesso');
      } catch (error) {
        console.warn('MapMarkers: Erro ao ajustar bounds:', error);
      }
    }
  }, [validOrigin, validDest, originCoords, destCoords, map]);

  // Não renderizar nada se não há coordenadas válidas
  if (!validOrigin && !validDest) {
    return null;
  }

  return (
    <>
      {validOrigin && (
        <Marker 
          position={[originCoords.lat, originCoords.lng]} 
          icon={greenIcon}
        >
          <Popup>
            <strong>Origem:</strong><br />
            {origin || 'Endereço não informado'}
          </Popup>
        </Marker>
      )}
      
      {validDest && (
        <Marker 
          position={[destCoords.lat, destCoords.lng]} 
          icon={redIcon}
        >
          <Popup>
            <strong>Destino:</strong><br />
            {destination || 'Endereço não informado'}
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default MapMarkers;
