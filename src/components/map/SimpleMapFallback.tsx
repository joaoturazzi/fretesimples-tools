
import React from 'react';
import { MapPin } from 'lucide-react';

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
  return (
    <div className={`relative bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        <div className="mb-4">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">Rota da viagem</h3>
          <p className="text-sm text-gray-500">Visualização simplificada</p>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Origem</span>
            </div>
            <span className="text-sm text-gray-600 truncate max-w-[200px]">{origin}</span>
          </div>
          
          <div className="flex items-center justify-center py-2">
            <div className="flex flex-col items-center gap-1">
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-px h-8 bg-gray-300"></div>
            </div>
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
                <div className="font-medium">{distance.toFixed(1)} km</div>
              </div>
            )}
            {duration && (
              <div className="text-center">
                <div className="text-sm text-gray-500">Duração</div>
                <div className="font-medium">{Math.floor(duration / 60)}h {duration % 60}min</div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          Mapa interativo não disponível neste momento
        </div>
      </div>
    </div>
  );
};

export default SimpleMapFallback;
