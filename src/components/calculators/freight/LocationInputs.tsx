
import React from 'react';
import { MapPin, Truck, AlertCircle } from 'lucide-react';

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
          Cidade de Origem
        </label>
        <input
          id="origin"
          type="text"
          className="input-field"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Ex: São Paulo, SP"
          disabled={isCalculatingRoute}
        />
        <p className="text-xs text-gray-500 mt-1">
          Digite o nome da cidade e estado (ex: São Paulo, SP)
        </p>
      </div>
      
      <div className="calculator-input-group">
        <label htmlFor="destination" className="calculator-label flex items-center gap-1.5">
          <MapPin size={16} className="text-frete-500" />
          Cidade de Destino
        </label>
        <input
          id="destination"
          type="text"
          className="input-field"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Ex: Rio de Janeiro, RJ"
          disabled={isCalculatingRoute}
        />
        <p className="text-xs text-gray-500 mt-1">
          Digite o nome da cidade e estado (ex: Rio de Janeiro, RJ)
        </p>
      </div>

      <div className="calculator-input-group">
        <label htmlFor="distance" className="calculator-label flex items-center gap-1.5">
          <Truck size={16} className="text-frete-500" />
          Distância (km)
          {isCalculatingRoute && (
            <span className="text-sm text-orange-600 flex items-center gap-1">
              <div className="animate-spin h-3 w-3 border border-orange-600 border-t-transparent rounded-full"></div>
              Calculando rota...
            </span>
          )}
        </label>
        <div className="flex gap-2">
          <input
            id="distance"
            type="number"
            className="input-field"
            value={distance}
            min={0}
            max={5000}
            onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="Ex: 450"
            disabled={isCalculatingRoute}
          />
          <button
            onClick={onCalculateDistance}
            disabled={isCalculatingRoute || !origin?.trim() || !destination?.trim()}
            className="btn btn-secondary px-3 flex items-center gap-1"
            title="Calcular distância automaticamente"
          >
            {isCalculatingRoute ? (
              <div className="animate-spin h-4 w-4 border border-current border-t-transparent rounded-full"></div>
            ) : (
              '🗺️'
            )}
          </button>
        </div>
        
        {origin?.trim() && destination?.trim() && (
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            A distância será calculada automaticamente em 2 segundos
          </div>
        )}
        
        {(!origin?.trim() || !destination?.trim()) && (
          <p className="text-xs text-gray-500 mt-1">
            Informe origem e destino para cálculo automático da distância
          </p>
        )}
      </div>
    </>
  );
};

export default LocationInputs;
