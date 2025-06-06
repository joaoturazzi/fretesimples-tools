
import React from 'react';
import InteractiveMap from '../../InteractiveMap';
import ErrorBoundary from '../../ErrorBoundary';

interface FreightMapSectionProps {
  showMap: boolean;
  origin: string;
  destination: string;
  distance?: number;
  routeDuration?: number;
  routeCoordinates?: Array<{ lat: number; lng: number }>;
}

const FreightMapSection: React.FC<FreightMapSectionProps> = ({
  showMap,
  origin,
  destination,
  distance,
  routeDuration,
  routeCoordinates
}) => {
  if (!showMap || !origin || !destination) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <span>🗺️</span>
        Mapa da Rota: {origin} → {destination}
      </h4>
      <ErrorBoundary 
        fallback={
          <div className="h-96 w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Erro ao carregar mapa. Tente novamente.</p>
          </div>
        }
      >
        <InteractiveMap 
          origin={origin} 
          destination={destination}
          distance={typeof distance === 'number' ? distance : undefined}
          duration={routeDuration}
          routeCoordinates={routeCoordinates}
          className="h-96 w-full rounded-lg"
        />
      </ErrorBoundary>
    </div>
  );
};

export default FreightMapSection;
