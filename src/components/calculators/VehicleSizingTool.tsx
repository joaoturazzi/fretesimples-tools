
import React, { useState, ChangeEvent } from 'react';
import Calculator from '@/components/Calculator';
import VehicleForm from './vehicle/VehicleForm';
import VehicleReference from './vehicle/VehicleReference';
import VehicleResults from './vehicle/VehicleResults';
import { RefreshCw, Calculator as CalcIcon, TrendingUp } from 'lucide-react';
import { cargoPresets } from './vehicle/vehicleData';
import { 
  calculateTotalWeight, 
  calculateTotalVolume, 
  findRecommendedVehicle,
  validateDocuments,
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
  const [distance, setDistance] = useState<number>(100);
  const [clientDoc, setClientDoc] = useState('');
  const [docValidation, setDocValidation] = useState<{ isValid: boolean; type: string | null }>({ isValid: true, type: null });
  
  const [volume, setVolume] = useState<Volume>({
    quantity: 1,
    weight: 100,
    height: 0.5,
    width: 0.5,
    length: 0.5,
  });
  
  const [results, setResults] = useState<VehicleResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setVolume(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handleDocumentChange = (doc: string) => {
    setClientDoc(doc);
    if (doc.length > 0) {
      const validation = validateDocuments(doc);
      setDocValidation(validation);
    } else {
      setDocValidation({ isValid: true, type: null });
    }
  };

  const handleCargoTypeChange = (type: string) => {
    setCargoType(type);
    
    if (type === 'liquidos' || type === 'combustiveis') {
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
  
  const calculateResults = async () => {
    setIsCalculating(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const totalWeight = calculateTotalWeight(volume, isLiquid, liquidVolume);
    const totalVolume = calculateTotalVolume(volume, cargoType, isLiquid, liquidVolume);
    const result = findRecommendedVehicle(totalWeight, totalVolume, isLiquid, cargoType, distance);
    
    setResults({
      totalWeight,
      totalVolume,
      recommendedVehicle: result.vehicle,
      utilizationPercentage: result.utilization,
      alternativeVehicles: result.alternatives,
      warnings: result.warnings,
      efficiencyScore: result.efficiencyScore,
      operationalCost: result.operationalCost,
      fuelConsumption: result.fuelConsumption,
      specialRequirements: result.specialRequirements
    });
    
    setIsCalculating(false);
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
    setDistance(100);
    setClientDoc('');
    setDocValidation({ isValid: true, type: null });
    setResults(null);
  };
  
  return (
    <Calculator
      id="dimensionamento-veiculo"
      title="Dimensionamento Inteligente de Veículo"
      description="Sistema avançado para cálculo do veículo ideal com base no tipo de carga, peso, dimensões e custo operacional."
      isActive={isActive}
    >
      <div className="space-y-8">
        {/* Progress indicator */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <CalcIcon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Calculadora Inteligente</h3>
              <p className="text-blue-600">Análise completa de viabilidade e custos operacionais</p>
            </div>
          </div>
          
          {results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/60 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-green-500" />
                <div>
                  <p className="text-xs text-gray-600">Eficiência</p>
                  <p className="font-bold text-green-600">{results.efficiencyScore}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalcIcon size={20} className="text-blue-500" />
                <div>
                  <p className="text-xs text-gray-600">Utilização</p>
                  <p className="font-bold text-blue-600">{results.utilizationPercentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-500">💰</span>
                <div>
                  <p className="text-xs text-gray-600">Custo/km</p>
                  <p className="font-bold text-orange-600">R$ {results.operationalCost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <VehicleForm
              cargoType={cargoType}
              setCargoType={setCargoType}
              isLiquid={isLiquid}
              liquidVolume={liquidVolume}
              setLiquidVolume={setLiquidVolume}
              volume={volume}
              handleInputChange={handleInputChange}
              onCargoTypeChange={handleCargoTypeChange}
              distance={distance}
              setDistance={setDistance}
              clientDoc={clientDoc}
              onDocumentChange={handleDocumentChange}
              docValidation={docValidation}
            />
            
            <div className="flex gap-3">
              <button 
                className={`btn btn-primary flex-1 ${isCalculating ? 'btn-loading' : ''}`}
                onClick={calculateResults}
                disabled={isCalculating || !docValidation.isValid}
              >
                {!isCalculating && <CalcIcon size={18} className="mr-2" />}
                {isCalculating ? 'Calculando...' : 'Calcular Veículo Ideal'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={isCalculating}
              >
                <RefreshCw size={18} className="mr-2" />
                Limpar
              </button>
            </div>
            
            {!docValidation.isValid && clientDoc && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm font-medium">
                  CPF/CNPJ inválido. Verifique os dados informados.
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <VehicleReference />
            
            {results && (
              <VehicleResults 
                results={results} 
                isLiquid={isLiquid}
                distance={distance}
              />
            )}
          </div>
        </div>
      </div>
    </Calculator>
  );
};

export default VehicleSizingTool;
