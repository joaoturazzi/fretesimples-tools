
import React from 'react';
import { MapPin } from 'lucide-react';

interface RiskFormProps {
  cargoType: string;
  setCargoType: (value: string) => void;
  cargoValue: string;
  setCargoValue: (value: string) => void;
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  contractType: string;
  setContractType: (value: string) => void;
  currentTools: string;
  setCurrentTools: (value: string) => void;
  routeDistance: number | null;
  isCalculatingRoute: boolean;
}

const RiskForm = ({
  cargoType, setCargoType,
  cargoValue, setCargoValue,
  origin, setOrigin,
  destination, setDestination,
  contractType, setContractType,
  currentTools, setCurrentTools,
  routeDistance,
  isCalculatingRoute
}: RiskFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="mb-4">
          <label htmlFor="origin" className="calculator-label flex items-center gap-1.5">
            <MapPin size={16} className="text-frete-500" />
            Origem {isCalculatingRoute && <span className="text-sm text-gray-500">- Calculando rota...</span>}
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
        
        <div className="mb-4">
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
          {origin && destination && routeDistance && (
            <p className="text-xs text-gray-500 mt-1">
              Distância da rota: {routeDistance} km (calculada automaticamente)
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de carga
          </label>
          <select
            id="cargoType"
            className="select-field"
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value)}
          >
            <option value="eletronicos">Eletrônicos</option>
            <option value="alimentos">Alimentos</option>
            <option value="carga_perigosa">Carga perigosa</option>
            <option value="medicamentos">Medicamentos</option>
            <option value="vestuario">Vestuário</option>
            <option value="moveis">Móveis</option>
            <option value="automoveis">Automóveis/Peças</option>
            <option value="combustivel">Combustível</option>
            <option value="quimicos">Químicos</option>
            <option value="joias">Joias/Valores</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="cargoValue" className="block text-sm font-medium text-gray-700 mb-1">
            Valor da carga (R$)
          </label>
          <input
            type="number"
            id="cargoValue"
            className="input-field"
            value={cargoValue}
            onChange={(e) => setCargoValue(e.target.value)}
            placeholder="Ex: 50000"
            step="100"
          />
        </div>
      </div>
      
      <div>
        <div className="mb-4">
          <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de contratação
          </label>
          <select
            id="contractType"
            className="select-field"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
          >
            <option value="frota_propria">Frota própria</option>
            <option value="agregado">Agregado</option>
            <option value="terceiro">Terceiro</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="currentTools" className="block text-sm font-medium text-gray-700 mb-1">
            Ferramentas que utiliza hoje
          </label>
          <textarea
            id="currentTools"
            className="input-field"
            value={currentTools}
            onChange={(e) => setCurrentTools(e.target.value)}
            placeholder="Ex: rastreamento, seguro, escolta, lacres..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskForm;
