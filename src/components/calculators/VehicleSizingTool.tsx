
import React, { useState, ChangeEvent } from 'react';
import Calculator from '@/components/Calculator';
import VehicleForm from './vehicle/VehicleForm';
import VehicleReference from './vehicle/VehicleReference';
import VehicleResults from './vehicle/VehicleResults';
import { RefreshCw } from 'lucide-react';
import { cargoPresets } from './vehicle/vehicleData';
import { 
  calculateTotalWeight, 
  calculateTotalVolume, 
  findRecommendedVehicle,
  type Volume,
  type VehicleResult
} from './vehicle/vehicleCalculations';

interface VehicleSizingToolProps {
  isActive: boolean;
}

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
  
  const [results, setResults] = useState<VehicleResult | null>(null);
  
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
  
  const calculateResults = () => {
    const totalWeight = calculateTotalWeight(volume, isLiquid, liquidVolume);
    const totalVolume = calculateTotalVolume(volume, cargoType, isLiquid, liquidVolume);
    const result = findRecommendedVehicle(totalWeight, totalVolume, isLiquid, cargoType);
    
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
          <VehicleForm
            cargoType={cargoType}
            setCargoType={setCargoType}
            isLiquid={isLiquid}
            liquidVolume={liquidVolume}
            setLiquidVolume={setLiquidVolume}
            volume={volume}
            handleInputChange={handleInputChange}
            onCargoTypeChange={handleCargoTypeChange}
          />
          
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
        
        <div>
          <VehicleReference />
          
          {results && (
            <VehicleResults 
              results={results} 
              isLiquid={isLiquid} 
            />
          )}
        </div>
      </div>
    </Calculator>
  );
};

export default VehicleSizingTool;
