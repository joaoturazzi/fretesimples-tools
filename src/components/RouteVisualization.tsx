
import React from 'react';
import { MapPin, Navigation, Clock, Route } from 'lucide-react';

interface RouteVisualizationProps {
  origin: string;
  destination: string;
  distance?: number;
  duration?: number;
  className?: string;
}

const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  origin,
  destination,
  distance,
  duration,
  className = "h-48 w-full rounded-lg border border-gray-200"
}) => {
  return (
    <div className={className}>
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 flex flex-col justify-center">
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Route className="text-blue-600" size={20} />
            Rota Calculada
          </h4>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-green-700">
            <MapPin size={16} />
            <span className="font-medium">Origem:</span>
          </div>
          <div className="text-right max-w-[60%]">
            <span className="text-sm text-gray-700 break-words">{origin}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center my-3">
          <div className="flex-1 h-px bg-gradient-to-r from-green-300 to-blue-300"></div>
          <Navigation className="mx-3 text-blue-500" size={20} />
          <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-red-300"></div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <MapPin size={16} />
            <span className="font-medium">Destino:</span>
          </div>
          <div className="text-right max-w-[60%]">
            <span className="text-sm text-gray-700 break-words">{destination}</span>
          </div>
        </div>
        
        {distance && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{distance} km</div>
              <div className="text-xs text-gray-500">Distância</div>
            </div>
            {duration && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                  <Clock size={16} />
                  {Math.floor(duration / 60)}h {duration % 60}m
                </div>
                <div className="text-xs text-gray-500">Tempo estimado</div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-500 bg-white/50 rounded px-2 py-1 inline-block">
            ✅ Rota calculada com sucesso via HERE Maps API
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteVisualization;
