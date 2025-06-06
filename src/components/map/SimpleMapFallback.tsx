
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface SimpleMapFallbackProps {
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
  className?: string;
}

const SimpleMapFallback: React.FC<SimpleMapFallbackProps> = ({
  origin,
  destination,
  distance,
  duration,
  className = ''
}) => {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`relative bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        <div className="mb-4">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">Rota da viagem</h3>
          <p className="text-sm text-gray-500">Visualize no Google Maps</p>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Origem</span>
            </div>
            <span className="text-sm text-gray-600 truncate max-w-[200px]">{origin}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Destino</span>
            </div>
            <span className="text-sm text-gray-600 truncate max-w-[200px]">{destination}</span>
          </div>
        </div>

        {(distance || duration) && (
          <div className="flex justify-center gap-4 mb-4">
            {distance && (
              <div className="text-center">
                <div className="text-sm text-gray-500">Distância</div>
                <div className="font-medium">{distance} km</div>
              </div>
            )}
            {duration && (
              <div className="text-center">
                <div className="text-sm text-gray-500">Duração</div>
                <div className="font-medium">{Math.round(duration / 60)}h {duration % 60}min</div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={openInGoogleMaps}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Navigation size={16} />
          Ver no Google Maps
        </button>
      </div>
    </div>
  );
};

export default SimpleMapFallback;
