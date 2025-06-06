
import React from 'react';
import { MapPin, Truck } from 'lucide-react';

interface LocationInputsProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  distance: number | string;
  setDistance: (value: number | string) => void;
  isCalculatingRoute: boolean;
  onCalculateDistance: () => void;
}

const LocationInputs: React.FC<LocationInputsProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  distance,
  setDistance,
  isCalculatingRoute,
  onCalculateDistance
}) => {
  return (
    <>
      <div className="calculator-input-group">
        <label htmlFor="origin" className="calculator-label flex items-center gap-1.5">
          <MapPin size={16} className="text-frete-500" />
          Origem
        </label>
        <input
          id="origin"
          type="text"
          className="input-field"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Ex: São Paulo, SP"
        />
      </div>
      
      <div className="calculator-input-group">
        <label htmlFor="destination" className="calculator-label flex items-center gap-1.5">
          <MapPin size={16} className="text-frete-500" />
          Destino
        </label>
        <input
          id="destination"
          type="text"
          className="input-field"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Ex: Rio de Janeiro, RJ"
        />
      </div>

      <div className="calculator-input-group">
        <label htmlFor="distance" className="calculator-label flex items-center gap-1.5">
          <Truck size={16} className="text-frete-500" />
          Distância (km) {isCalculatingRoute && <span className="text-sm text-gray-500">- Calculando...</span>}
        </label>
        <div className="flex gap-2">
          <input
            id="distance"
            type="number"
            className="input-field"
            value={distance}
            min={0}
            onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="Ex: 100"
          />
          <button
            onClick={onCalculateDistance}
            disabled={isCalculatingRoute}
            className="btn btn-secondary px-3"
            title="Calcular distância manualmente"
          >
            {isCalculatingRoute ? '...' : '📍'}
          </button>
        </div>
        {origin && destination && (
          <p className="text-xs text-gray-500 mt-1">
            A distância será calculada automaticamente baseada na rota.
          </p>
        )}
      </div>
    </>
  );
};

export default LocationInputs;
