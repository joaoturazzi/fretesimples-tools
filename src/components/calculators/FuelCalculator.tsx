import React, { useState } from 'react';
import CalculatorSection from '../Calculator';
import ResultBox from './ResultBox';
import { CalculatorIcon, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { mapService } from '@/services/map/UnifiedMapService';

interface FuelCalculatorProps {
  isActive: boolean;
}

const FuelCalculator: React.FC<FuelCalculatorProps> = ({ isActive }) => {
  const [distance, setDistance] = useState<number | ''>('');
  const [fuelPrice, setFuelPrice] = useState<number | ''>('');
  const [consumption, setConsumption] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);

  const calculateFuelCost = () => {
    if (typeof distance === 'number' && typeof fuelPrice === 'number' && typeof consumption === 'number') {
      if (distance > 0 && fuelPrice > 0 && consumption > 0) {
        const totalCost = (distance / consumption) * fuelPrice;
        setResult(totalCost);
      } else {
        setResult(null);
        alert('Por favor, insira valores maiores que zero.');
      }
    } else {
      setResult(null);
      alert('Por favor, preencha todos os campos com valores numéricos.');
    }
  };

  const resetForm = () => {
    setDistance('');
    setFuelPrice('');
    setConsumption('');
    setResult(null);
  };

  return (
    <CalculatorSection
      id="calculadora-combustivel"
      title="Calculadora de Combustível"
      description="Estime o custo total de combustível para sua viagem."
      isActive={isActive}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distância (km)
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="input"
            placeholder="Ex: 400"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço do Combustível (R$/L)
          </label>
          <input
            type="number"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(Number(e.target.value))}
            className="input"
            placeholder="Ex: 5.50"
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consumo do Veículo (km/L)
          </label>
          <input
            type="number"
            value={consumption}
            onChange={(e) => setConsumption(Number(e.target.value))}
            className="input"
            placeholder="Ex: 12"
            min="0"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={calculateFuelCost}
          className="btn btn-primary"
        >
          <CalculatorIcon size={18} />
          Calcular Custo
        </button>

        <button
          onClick={resetForm}
          className="btn btn-secondary"
        >
          <RefreshCw size={18} />
          Limpar
        </button>
      </div>

      {result !== null && (
        <div className="mt-8">
          <ResultBox
            label="Custo Total de Combustível"
            value={formatCurrency(result)}
            className="bg-fuel-50 border-fuel-100"
          />
        </div>
      )}
    </CalculatorSection>
  );
};

export default FuelCalculator;
