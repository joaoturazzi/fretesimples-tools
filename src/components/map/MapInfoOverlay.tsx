
import React from 'react';

interface MapInfoOverlayProps {
  distance?: number;
  duration?: number;
}

const MapInfoOverlay: React.FC<MapInfoOverlayProps> = ({ distance, duration }) => {
  if (!distance && !duration) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
      {distance && (
        <div className="text-sm font-medium text-gray-700">
          📏 Distância: {distance} km
        </div>
      )}
      {duration && (
        <div className="text-sm text-gray-600">
          ⏱️ Tempo: {Math.floor(duration / 60)}h {duration % 60}min
        </div>
      )}
    </div>
  );
};

export default MapInfoOverlay;
