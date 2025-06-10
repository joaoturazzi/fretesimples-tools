
import React from 'react';
import { Navigation } from 'lucide-react';

interface DistanceInputProps {
  distance: number | '';
  setDistance: (value: number | string) => void;
  isCalculatingRoute: boolean;
  hasError: boolean;
  errorMessage: string;
}

const DistanceInput: React.FC<DistanceInputProps> = ({
  distance,
  setDistance,
  isCalculatingRoute,
  hasError,
  errorMessage
}) => {
  return (
    <div className="calculator-input-group">
      <label htmlFor="distance" className="calculator-label flex items-center gap-1.5">
        <Navigation size={16} className="text-frete-500" />
        Distância (km)
        {isCalculatingRoute && (
          <span className="text-sm text-blue-600 ml-2 flex items-center gap-1">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            Calculando...
          </span>
        )}
      </label>
      <input
        id="distance"
        type="number"
        className={`input-field ${hasError ? 'border-red-500' : ''}`}
        value={distance}
        min={0}
        onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : '')}
        placeholder="Ex: 450"
      />
      {hasError && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default DistanceInput;
