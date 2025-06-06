
import React from 'react';
import StableInteractiveMap from './map/StableInteractiveMap';

interface InteractiveMapProps {
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
  className?: string;
  height?: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = (props) => {
  return <StableInteractiveMap {...props} />;
};

export default InteractiveMap;
