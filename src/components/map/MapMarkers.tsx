
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
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
  return (
    <>
      {originCoords && (
        <Marker position={[originCoords.lat, originCoords.lng]} icon={greenIcon}>
          <Popup>
            <strong>Origem:</strong><br />
            {origin}
          </Popup>
        </Marker>
      )}
      
      {destCoords && (
        <Marker position={[destCoords.lat, destCoords.lng]} icon={redIcon}>
          <Popup>
            <strong>Destino:</strong><br />
            {destination}
          </Popup>
        </Marker>
      )}
    </>
  );
};

export default MapMarkers;
