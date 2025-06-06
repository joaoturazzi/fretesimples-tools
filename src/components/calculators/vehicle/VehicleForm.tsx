
import React from 'react';
import { Package, Droplets, Scale } from 'lucide-react';
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
}

const VehicleForm = ({
  cargoType,
  setCargoType,
  isLiquid,
  liquidVolume,
  setLiquidVolume,
  volume,
  handleInputChange,
  onCargoTypeChange
}: VehicleFormProps) => {
  return (
    <div>
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
              <option key={preset.name} value={preset.name.toLowerCase().replace(' ', '_')}>
                {preset.name} - {preset.description}
              </option>
            ))}
          </select>
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
                Peso de cada volume (kg)
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
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (m)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="0.01"
                  step="0.01"
                  value={volume.height}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                  Largura (m)
                </label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  min="0.01"
                  step="0.01"
                  value={volume.width}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                  Comprimento (m)
                </label>
                <input
                  type="number"
                  id="length"
                  name="length"
                  min="0.01"
                  step="0.01"
                  value={volume.length}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleForm;
