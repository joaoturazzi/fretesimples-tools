
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="calculator-input-group">
          <label htmlFor="origin" className="calculator-label">
            <MapPin size={16} className="calculator-label-icon" />
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
          <p className="form-helper">
            Digite o nome da cidade e estado (ex: São Paulo, SP)
          </p>
        </div>
        
        <div className="calculator-input-group">
          <label htmlFor="destination" className="calculator-label">
            <Navigation size={16} className="calculator-label-icon" />
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
          <p className="form-helper">
            Digite o nome da cidade e estado (ex: Rio de Janeiro, RJ)
          </p>
        </div>
      </div>

      <div className="calculator-input-group">
        <label htmlFor="distance" className="calculator-label">
          <Navigation size={16} className="calculator-label-icon" />
          Distância (km)
          {isCalculatingRoute && (
            <span className="text-sm text-orange-600 flex items-center gap-1 ml-2">
              <div className="animate-spin h-3 w-3 border border-orange-600 border-t-transparent rounded-full"></div>
              Calculando rota...
            </span>
          )}
        </label>
        <div className="flex gap-3">
          <input
            id="distance"
            type="number"
            className="input-field flex-1"
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
            className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            title="Calcular distância automaticamente"
          >
            {isCalculatingRoute ? (
              <div className="animate-spin h-4 w-4 border border-current border-t-transparent rounded-full"></div>
            ) : (
              <>
                <Navigation size={16} />
                Calcular
              </>
            )}
          </button>
        </div>
        
        {origin?.trim() && destination?.trim() && !isCalculatingRoute && (
          <p className="form-helper text-green-600">
            ✓ A distância será calculada automaticamente
          </p>
        )}
        
        {(!origin?.trim() || !destination?.trim()) && (
          <p className="form-helper">
            Informe origem e destino para cálculo automático da distância
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationInputs;
