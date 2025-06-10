
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
      <label htmlFor="distance" className="calculator-label">
        <Navigation size={16} className="calculator-label-icon" />
        Distância (km)
        {isCalculatingRoute && (
          <span className="text-sm text-orange-600 ml-2 flex items-center gap-1">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
            Calculando...
          </span>
        )}
      </label>
      <input
        id="distance"
        type="number"
        className={`input-field ${hasError ? 'error' : ''}`}
        value={distance}
        min={0}
        step={0.1}
        onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : '')}
        placeholder="Ex: 450"
      />
      {hasError && errorMessage && (
        <p className="form-error">{errorMessage}</p>
      )}
      {!hasError && (
        <p className="form-helper">
          Distância em quilômetros entre origem e destino
        </p>
      )}
    </div>
  );
};

export default DistanceInput;
