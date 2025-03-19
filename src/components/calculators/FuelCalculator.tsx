
import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import ResultBox from './ResultBox';
import { RefreshCw } from 'lucide-react';

interface FuelCalculatorProps {
  isActive: boolean;
}

const FuelCalculator = ({ isActive }: FuelCalculatorProps) => {
  const [distance, setDistance] = useState('');
  const [consumption, setConsumption] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const calculateFuel = () => {
    if (!distance || !consumption || !fuelPrice) return;
    
    const distanceValue = parseFloat(distance);
    const consumptionValue = parseFloat(consumption);
    const priceValue = parseFloat(fuelPrice);
    
    const liters = distanceValue / consumptionValue;
    const cost = liters * priceValue;
    
    setResult({
      liters: liters.toFixed(2),
      cost: cost.toFixed(2),
      costPerKm: (cost / distanceValue).toFixed(2)
    });
  };
  
  return (
    <Calculator
      id="calculadora-combustivel"
      title="Calculadora de Consumo de Combustível"
      description="Calcule o consumo de combustível e o custo para uma determinada distância."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distância (km)
            </label>
            <input
              type="number"
              id="distance"
              className="input-field"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Ex: 350"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="consumption" className="block text-sm font-medium text-gray-700 mb-1">
              Consumo médio (km/l)
            </label>
            <input
              type="number"
              id="consumption"
              className="input-field"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              placeholder="Ex: 10"
              step="0.1"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="fuelPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Preço do combustível (R$/l)
            </label>
            <input
              type="number"
              id="fuelPrice"
              className="input-field"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              placeholder="Ex: 5.80"
              step="0.01"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateFuel}
        >
          Calcular
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setDistance('');
            setConsumption('');
            setFuelPrice('');
            setResult(null);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado do cálculo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultBox 
              label="Litros necessários" 
              value={result.liters}
              unit="litros"
            />
            <ResultBox 
              label="Custo total" 
              value={`R$ ${result.cost}`}
              className="bg-frete-50"
            />
            <ResultBox 
              label="Custo por quilômetro" 
              value={`R$ ${result.costPerKm}`}
              unit="/km"
            />
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default FuelCalculator;
