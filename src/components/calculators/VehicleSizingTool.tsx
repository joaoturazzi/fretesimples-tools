
import React, { useState, ChangeEvent } from 'react';
import Calculator from '@/components/Calculator';
import { Truck, Package, RefreshCw } from 'lucide-react';

interface VehicleSizingToolProps {
  isActive: boolean;
}

interface Volume {
  quantity: number;
  weight: number;
  height: number;
  width: number;
  length: number;
}

interface VehicleType {
  name: string;
  weightCapacity: number;
  volumeCapacity: number;
}

const vehicleTypes: VehicleType[] = [
  { name: 'Fiorino', weightCapacity: 600, volumeCapacity: 3 },
  { name: 'VUC', weightCapacity: 1500, volumeCapacity: 6 },
  { name: '3/4', weightCapacity: 3000, volumeCapacity: 15 },
  { name: 'Toco', weightCapacity: 6000, volumeCapacity: 30 },
  { name: 'Truck', weightCapacity: 14000, volumeCapacity: 45 },
  { name: 'Carreta', weightCapacity: 25000, volumeCapacity: 90 },
];

const VehicleSizingTool = ({ isActive }: VehicleSizingToolProps) => {
  const [volume, setVolume] = useState<Volume>({
    quantity: 1,
    weight: 100,
    height: 0.5,
    width: 0.5,
    length: 0.5,
  });
  
  const [results, setResults] = useState<{
    totalWeight: number;
    totalVolume: number;
    recommendedVehicle: string;
  } | null>(null);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert to appropriate type
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setVolume(prev => ({ ...prev, [name]: numValue }));
    }
  };
  
  const calculateTotalWeight = (): number => {
    return volume.quantity * volume.weight;
  };
  
  const calculateTotalVolume = (): number => {
    return volume.quantity * volume.height * volume.width * volume.length;
  };
  
  const findRecommendedVehicle = (totalWeight: number, totalVolume: number): string => {
    for (const vehicle of vehicleTypes) {
      if (totalWeight <= vehicle.weightCapacity && totalVolume <= vehicle.volumeCapacity) {
        return vehicle.name;
      }
    }
    
    // If no vehicle can accommodate the load
    return 'Carreta (carga excede limites padrão)';
  };
  
  const calculateResults = () => {
    const totalWeight = calculateTotalWeight();
    const totalVolume = calculateTotalVolume();
    const recommendedVehicle = findRecommendedVehicle(totalWeight, totalVolume);
    
    setResults({
      totalWeight,
      totalVolume,
      recommendedVehicle
    });
  };
  
  const resetForm = () => {
    setVolume({
      quantity: 1,
      weight: 100,
      height: 0.5,
      width: 0.5,
      length: 0.5,
    });
    setResults(null);
  };
  
  return (
    <Calculator
      id="dimensionamento-veiculo"
      title="Dimensionamento de Veículo"
      description="Calcule o tipo ideal de veículo com base no peso e dimensões da sua carga."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Package size={20} className="mr-2 text-orange-500" />
            Informações da Carga
          </h3>
          
          <div className="space-y-4">
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
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
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
            
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Altura de cada volume (metros)
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
                Largura de cada volume (metros)
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
                Comprimento de cada volume (metros)
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
            
            <div className="flex gap-3 mt-6">
              <button 
                className="btn btn-primary"
                onClick={calculateResults}
              >
                Calcular veículo ideal
              </button>
              <button 
                className="btn btn-secondary"
                onClick={resetForm}
              >
                <RefreshCw size={18} className="mr-2" />
                Limpar
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Truck size={20} className="mr-2 text-orange-500" />
            Referência de Veículos
          </h3>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 grid grid-cols-3 font-medium text-gray-700">
              <div>Veículo</div>
              <div>Capacidade de Peso (kg)</div>
              <div>Capacidade de Volume (m³)</div>
            </div>
            {vehicleTypes.map((vehicle, index) => (
              <div 
                key={vehicle.name} 
                className={`px-4 py-2 grid grid-cols-3 text-gray-700 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div>{vehicle.name}</div>
                <div>{vehicle.weightCapacity.toLocaleString('pt-BR')}</div>
                <div>{vehicle.volumeCapacity}</div>
              </div>
            ))}
          </div>
          
          {results && (
            <div className="mt-6 bg-orange-50 border border-orange-100 rounded-lg p-5 animate-fade-in">
              <h4 className="text-lg font-medium text-orange-800 mb-3">Resultado:</h4>
              
              <div className="space-y-3">
                <div className="bg-white rounded p-3 border border-orange-100 grid grid-cols-2">
                  <div className="text-gray-700">Peso total:</div>
                  <div className="font-medium">{results.totalWeight.toLocaleString('pt-BR')} kg</div>
                </div>
                
                <div className="bg-white rounded p-3 border border-orange-100 grid grid-cols-2">
                  <div className="text-gray-700">Volume total:</div>
                  <div className="font-medium">{results.totalVolume.toFixed(2)} m³</div>
                </div>
                
                <div className="bg-white rounded p-3 border border-orange-100 grid grid-cols-2">
                  <div className="text-gray-700">Veículo recomendado:</div>
                  <div className="font-medium">{results.recommendedVehicle}</div>
                </div>
                
                <div className="text-orange-700 text-sm bg-orange-100 rounded p-3 mt-3">
                  Com peso total de {results.totalWeight.toLocaleString('pt-BR')} kg e cubagem de {results.totalVolume.toFixed(2)} m³, o veículo mais indicado é um <strong>{results.recommendedVehicle}</strong>.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Calculator>
  );
};

export default VehicleSizingTool;
