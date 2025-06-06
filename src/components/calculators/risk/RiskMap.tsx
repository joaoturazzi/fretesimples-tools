
import React from 'react';
import MapComponent from '@/components/MapComponent';
import { MapPin } from 'lucide-react';

interface RiskMapProps {
  origin: string;
  destination: string;
  routeDistance: number | null;
  showMap: boolean;
}

const RiskMap = ({ origin, destination, routeDistance, showMap }: RiskMapProps) => {
  if (!showMap || !origin || !destination) return null;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <MapPin size={16} className="mr-2 text-frete-500" />
        Rota da operação {routeDistance && `(${routeDistance} km)`}
      </h4>
      <MapComponent 
        origin={origin} 
        destination={destination}
        className="h-48 w-full rounded-lg border border-gray-200"
      />
    </div>
  );
};

export default RiskMap;
