
import React from 'react';
import InteractiveMap from '@/components/InteractiveMap';
import { MapPin } from 'lucide-react';

interface RiskMapProps {
  origin: string;
  destination: string;
  routeDistance: number | null;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
  routeDuration?: number;
  showMap: boolean;
}

const RiskMap = ({ origin, destination, routeDistance, routeCoordinates = [], routeDuration, showMap }: RiskMapProps) => {
  if (!showMap || !origin || !destination) return null;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <MapPin size={16} className="mr-2 text-frete-500" />
        Rota da operação {routeDistance && `(${routeDistance} km)`}
      </h4>
      <InteractiveMap 
        origin={origin} 
        destination={destination}
        distance={routeDistance || undefined}
        duration={routeDuration}
        routeCoordinates={routeCoordinates}
        className="h-48 w-full rounded-lg border border-gray-200"
      />
    </div>
  );
};

export default RiskMap;
