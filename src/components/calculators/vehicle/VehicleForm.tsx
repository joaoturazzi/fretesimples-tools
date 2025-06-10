
import React from 'react';
import { Package, Droplets, Scale, Route, User } from 'lucide-react';
import { cargoPresets } from './vehicleData';

interface VehicleFormProps {
  cargoType: string;
  setCargoType: (type: string) => void;
  isLiquid: boolean;
  liquidVolume: number;
  setLiquidVolume: (volume: number) => void;
  volume: {
    quantity: number;
    weight: number;
    height: number;
    width: number;
    length: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCargoTypeChange: (type: string) => void;
  distance: number;
  setDistance: (distance: number) => void;
  clientDoc: string;
  onDocumentChange: (doc: string) => void;
  docValidation: { isValid: boolean; type: string | null };
}

const VehicleForm = ({
  cargoType,
  isLiquid,
  liquidVolume,
  setLiquidVolume,
  volume,
  handleInputChange,
  onCargoTypeChange,
  distance,
  setDistance,
  clientDoc,
  onDocumentChange,
  docValidation
}: VehicleFormProps) => {
  
  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF format: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ format: 00.000.000/0001-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const handleDocumentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value);
    onDocumentChange(formatted);
  };

  const selectedPreset = cargoPresets.find(p => p.name.toLowerCase().includes(cargoType.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Cliente Information */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <User size={20} className="mr-2 text-blue-500" />
          Dados do Cliente
        </h3>
        
        <div>
          <label htmlFor="clientDoc" className="block text-sm font-medium text-gray-700 mb-1">
            CPF/CNPJ do Cliente *
          </label>
          <input
            type="text"
            id="clientDoc"
            value={clientDoc}
            onChange={handleDocumentInput}
            className={`input-field ${!docValidation.isValid && clientDoc ? 'border-red-300 focus:border-red-500' : ''}`}
            placeholder="000.000.000-00 ou 00.000.000/0001-00"
            maxLength={18}
          />
          {docValidation.type && docValidation.isValid && (
            <p className="text-green-600 text-xs mt-1">✓ {docValidation.type} válido</p>
          )}
        </div>
      </div>

      {/* Cargo Information */}
      <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Package size={20} className="mr-2 text-orange-500" />
          Informações da Carga
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de carga
            </label>
            <select
              id="cargoType"
              className="select-field"
              value={cargoType}
              onChange={(e) => onCargoTypeChange(e.target.value)}
            >
              {cargoPresets.map(preset => (
                <option key={preset.name} value={preset.name.toLowerCase().replace(/\s+/g, '_')}>
                  {preset.name} - {preset.description}
                </option>
              ))}
            </select>
            
            {selectedPreset && selectedPreset.specialRequirements && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm font-medium mb-1">⚠️ Requisitos especiais:</p>
                <ul className="text-yellow-700 text-xs space-y-1">
                  {selectedPreset.specialRequirements.map((req, idx) => (
                    <li key={idx}>• {req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {isLiquid ? (
            <div>
              <label htmlFor="liquidVolume" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Droplets size={16} className="mr-1 text-blue-500" />
                Volume de líquido (litros)
              </label>
              <input
                type="number"
                id="liquidVolume"
                min="1"
                value={liquidVolume}
                onChange={(e) => setLiquidVolume(parseFloat(e.target.value) || 0)}
                className="input-field"
                placeholder="Ex: 15000"
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade de volumes
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={volume.quantity}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Scale size={16} className="mr-1 text-gray-500" />
                    Peso unitário (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    min="0.1"
                    step="0.1"
                    value={volume.weight}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Dimensões unitárias (metros)</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="height" className="block text-xs text-gray-600 mb-1">
                      Altura
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      min="0.01"
                      step="0.01"
                      value={volume.height}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="width" className="block text-xs text-gray-600 mb-1">
                      Largura
                    </label>
                    <input
                      type="number"
                      id="width"
                      name="width"
                      min="0.01"
                      step="0.01"
                      value={volume.width}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="length" className="block text-xs text-gray-600 mb-1">
                      Comprimento
                    </label>
                    <input
                      type="number"
                      id="length"
                      name="length"
                      min="0.01"
                      step="0.01"
                      value={volume.length}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  Volume total: {(volume.quantity * volume.height * volume.width * volume.length).toFixed(3)} m³ |
                  Peso total: {(volume.quantity * volume.weight).toLocaleString('pt-BR')} kg
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Route Information */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Route size={20} className="mr-2 text-green-500" />
          Informações da Rota
        </h3>
        
        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
            Distância estimada (km)
          </label>
          <input
            type="number"
            id="distance"
            min="1"
            value={distance}
            onChange={(e) => setDistance(parseFloat(e.target.value) || 100)}
            className="input-field"
            placeholder="100"
          />
          <p className="text-xs text-gray-500 mt-1">Usado para cálculo de custos operacionais</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;
