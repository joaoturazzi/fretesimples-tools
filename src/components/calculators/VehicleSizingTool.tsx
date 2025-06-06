
import React, { useState, ChangeEvent } from 'react';
import Calculator from '@/components/Calculator';
import { Truck, Package, RefreshCw, Droplets, Scale } from 'lucide-react';

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
  liquidCapacity?: number;
}

interface CargoPreset {
  name: string;
  density: number; // kg/m³
  stackable: boolean;
  fragile: boolean;
  description: string;
}

const vehicleTypes: VehicleType[] = [
  { name: 'Fiorino', weightCapacity: 600, volumeCapacity: 3 },
  { name: 'VUC', weightCapacity: 1500, volumeCapacity: 6 },
  { name: '3/4', weightCapacity: 3000, volumeCapacity: 15 },
  { name: 'Toco', weightCapacity: 6000, volumeCapacity: 30 },
  { name: 'Truck', weightCapacity: 14000, volumeCapacity: 45 },
  { name: 'Carreta', weightCapacity: 25000, volumeCapacity: 90 },
  { name: 'Tanque 15m³', weightCapacity: 15000, volumeCapacity: 0, liquidCapacity: 15000 },
  { name: 'Tanque 30m³', weightCapacity: 30000, volumeCapacity: 0, liquidCapacity: 30000 },
];

const cargoPresets: CargoPreset[] = [
  { name: 'Eletrônicos', density: 200, stackable: true, fragile: true, description: 'TVs, computadores, celulares' },
  { name: 'Móveis', density: 150, stackable: false, fragile: true, description: 'Sofás, camas, armários' },
  { name: 'Roupas', density: 100, stackable: true, fragile: false, description: 'Vestuário em geral' },
  { name: 'Alimentos secos', density: 400, stackable: true, fragile: false, description: 'Grãos, farinhas, conservas' },
  { name: 'Bebidas', density: 800, stackable: true, fragile: true, description: 'Refrigerantes, cervejas, águas' },
  { name: 'Materiais de construção', density: 800, stackable: true, fragile: false, description: 'Cimento, tijolos, telhas' },
  { name: 'Automóveis', density: 1200, stackable: false, fragile: true, description: 'Carros, motos' },
  { name: 'Maquinário', density: 2000, stackable: false, fragile: true, description: 'Equipamentos industriais' },
  { name: 'Líquidos', density: 1000, stackable: false, fragile: false, description: 'Combustíveis, químicos, água' },
  { name: 'Personalizado', density: 0, stackable: true, fragile: false, description: 'Definir manualmente' }
];

const VehicleSizingTool = ({ isActive }: VehicleSizingToolProps) => {
  const [cargoType, setCargoType] = useState('personalizado');
  const [isLiquid, setIsLiquid] = useState(false);
  const [liquidVolume, setLiquidVolume] = useState<number>(0);
  
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
    utilizationPercentage: number;
    alternativeVehicles: string[];
    warnings: string[];
  } | null>(null);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setVolume(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handleCargoTypeChange = (type: string) => {
    setCargoType(type);
    
    if (type === 'liquidos') {
      setIsLiquid(true);
      return;
    }
    
    setIsLiquid(false);
    
    const preset = cargoPresets.find(p => p.name.toLowerCase().includes(type.toLowerCase()));
    if (preset && preset.density > 0) {
      // Auto-calculate weight based on density and volume
      const currentVolume = volume.height * volume.width * volume.length;
      const suggestedWeight = currentVolume * preset.density;
      setVolume(prev => ({ ...prev, weight: Math.round(suggestedWeight) }));
    }
  };
  
  const calculateTotalWeight = (): number => {
    if (isLiquid) {
      return liquidVolume * 1000; // Assuming 1L = 1kg for most liquids
    }
    return volume.quantity * volume.weight;
  };
  
  const calculateTotalVolume = (): number => {
    if (isLiquid) {
      return liquidVolume / 1000; // Convert liters to m³
    }
    
    const preset = cargoPresets.find(p => p.name.toLowerCase().includes(cargoType.toLowerCase()));
    let volumePerUnit = volume.height * volume.width * volume.length;
    
    // Apply stacking factor for non-stackable items
    if (preset && !preset.stackable && volume.quantity > 1) {
      volumePerUnit *= 1.3; // 30% additional space for non-stackable items
    }
    
    return volume.quantity * volumePerUnit;
  };
  
  const findRecommendedVehicle = (totalWeight: number, totalVolume: number): {
    vehicle: string;
    utilization: number;
    alternatives: string[];
    warnings: string[];
  } => {
    const warnings: string[] = [];
    const alternatives: string[] = [];
    
    // Filter vehicles based on cargo type
    let availableVehicles = vehicleTypes;
    if (isLiquid) {
      availableVehicles = vehicleTypes.filter(v => v.liquidCapacity);
    }
    
    for (const vehicle of availableVehicles) {
      let fits = false;
      let utilization = 0;
      
      if (isLiquid && vehicle.liquidCapacity) {
        fits = totalWeight <= vehicle.weightCapacity && (totalVolume * 1000) <= vehicle.liquidCapacity;
        utilization = Math.max(
          (totalWeight / vehicle.weightCapacity) * 100,
          ((totalVolume * 1000) / vehicle.liquidCapacity) * 100
        );
      } else if (!isLiquid) {
        fits = totalWeight <= vehicle.weightCapacity && totalVolume <= vehicle.volumeCapacity;
        utilization = Math.max(
          (totalWeight / vehicle.weightCapacity) * 100,
          (totalVolume / vehicle.volumeCapacity) * 100
        );
      }
      
      if (fits) {
        // Add to alternatives if utilization is reasonable
        if (utilization >= 60 && utilization <= 95) {
          alternatives.push(`${vehicle.name} (${utilization.toFixed(1)}% utilização)`);
        }
        
        return {
          vehicle: vehicle.name,
          utilization,
          alternatives: alternatives.slice(0, 3), // Limit to 3 alternatives
          warnings
        };
      }
    }
    
    // Add warnings for special cargo types
    const preset = cargoPresets.find(p => p.name.toLowerCase().includes(cargoType.toLowerCase()));
    if (preset?.fragile) {
      warnings.push('Carga frágil: considere proteções especiais e motorista experiente');
    }
    if (preset && !preset.stackable) {
      warnings.push('Carga não empilhável: pode necessitar veículo maior que o calculado');
    }
    
    return {
      vehicle: 'Carreta (carga excede limites padrão)',
      utilization: 100,
      alternatives: [],
      warnings: ['Carga excede capacidades padrão - consulte especialista em transporte especial']
    };
  };
  
  const calculateResults = () => {
    const totalWeight = calculateTotalWeight();
    const totalVolume = calculateTotalVolume();
    const result = findRecommendedVehicle(totalWeight, totalVolume);
    
    setResults({
      totalWeight,
      totalVolume,
      recommendedVehicle: result.vehicle,
      utilizationPercentage: result.utilization,
      alternativeVehicles: result.alternatives,
      warnings: result.warnings
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
    setCargoType('personalizado');
    setIsLiquid(false);
    setLiquidVolume(0);
    setResults(null);
  };
  
  return (
    <Calculator
      id="dimensionamento-veiculo"
      title="Dimensionamento de Veículo"
      description="Calcule o tipo ideal de veículo com base no tipo de carga, peso e dimensões."
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
              <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de carga
              </label>
              <select
                id="cargoType"
                className="select-field"
                value={cargoType}
                onChange={(e) => handleCargoTypeChange(e.target.value)}
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
            <div className="bg-gray-50 px-4 py-2 grid grid-cols-3 font-medium text-gray-700 text-sm">
              <div>Veículo</div>
              <div>Peso (kg)</div>
              <div>Volume (m³)</div>
            </div>
            {vehicleTypes.map((vehicle, index) => (
              <div 
                key={vehicle.name} 
                className={`px-4 py-2 grid grid-cols-3 text-gray-700 text-sm ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div>{vehicle.name}</div>
                <div>{vehicle.weightCapacity.toLocaleString('pt-BR')}</div>
                <div>
                  {vehicle.liquidCapacity 
                    ? `${vehicle.liquidCapacity.toLocaleString('pt-BR')}L` 
                    : vehicle.volumeCapacity}
                </div>
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
                  <div className="font-medium">
                    {isLiquid 
                      ? `${(results.totalVolume * 1000).toLocaleString('pt-BR')} litros`
                      : `${results.totalVolume.toFixed(2)} m³`}
                  </div>
                </div>
                
                <div className="bg-white rounded p-3 border border-orange-100 grid grid-cols-2">
                  <div className="text-gray-700">Veículo recomendado:</div>
                  <div className="font-medium">{results.recommendedVehicle}</div>
                </div>
                
                <div className="bg-white rounded p-3 border border-orange-100 grid grid-cols-2">
                  <div className="text-gray-700">Utilização:</div>
                  <div className="font-medium">{results.utilizationPercentage.toFixed(1)}%</div>
                </div>
                
                {results.alternativeVehicles.length > 0 && (
                  <div className="bg-blue-50 rounded p-3 border border-blue-100">
                    <p className="font-medium text-blue-800 mb-2">Alternativas viáveis:</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {results.alternativeVehicles.map((alt, idx) => (
                        <li key={idx}>• {alt}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {results.warnings.length > 0 && (
                  <div className="bg-yellow-50 rounded p-3 border border-yellow-100">
                    <p className="font-medium text-yellow-800 mb-2">⚠️ Atenção:</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {results.warnings.map((warning, idx) => (
                        <li key={idx}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="text-orange-700 text-sm bg-orange-100 rounded p-3 mt-3">
                  <strong>Resumo:</strong> Para {isLiquid ? 'líquido' : 'carga sólida'} de{' '}
                  {results.totalWeight.toLocaleString('pt-BR')} kg e{' '}
                  {isLiquid 
                    ? `${(results.totalVolume * 1000).toLocaleString('pt-BR')} litros`
                    : `${results.totalVolume.toFixed(2)} m³`}, o veículo recomendado é{' '}
                  <strong>{results.recommendedVehicle}</strong> com{' '}
                  {results.utilizationPercentage.toFixed(1)}% de utilização.
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
