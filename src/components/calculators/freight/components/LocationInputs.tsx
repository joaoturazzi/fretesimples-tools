
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationInputsProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
}

const LocationInputs: React.FC<LocationInputsProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <Navigation size={16} className="text-frete-500" />
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
    </div>
  );
};

export default LocationInputs;
