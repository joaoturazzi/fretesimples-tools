
import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import ResultBox from './ResultBox';
import { RefreshCw } from 'lucide-react';

interface FreightCalculatorProps {
  isActive: boolean;
}

const FreightCalculator = ({ isActive }: FreightCalculatorProps) => {
  const [distance, setDistance] = useState('');
  const [weight, setWeight] = useState('');
  const [vehicleType, setVehicleType] = useState('van');
  const [fuelPrice, setFuelPrice] = useState('');
  const [tolls, setTolls] = useState('');
  const [profitMargin, setProfitMargin] = useState('');
  const [result, setResult] = useState<any>(null);
  
  // Vehicle consumption based on type (km/l)
  const vehicleConsumption = {
    moto: 30,
    van: 10,
    caminhao: 5,
    carreta: 2.5
  };
  
  // Vehicle daily cost based on type (R$)
  const vehicleDailyCost = {
    moto: 50,
    van: 150,
    caminhao: 350,
    carreta: 600
  };
  
  const calculateFreight = () => {
    if (!distance || !weight || !fuelPrice || !profitMargin) return;
    
    const distanceNum = parseFloat(distance);
    const weightNum = parseFloat(weight);
    const fuelPriceNum = parseFloat(fuelPrice);
    const tollsNum = parseFloat(tolls) || 0;
    const profitMarginNum = parseFloat(profitMargin) / 100;
    
    // Calculate fuel cost
    const consumption = vehicleConsumption[vehicleType as keyof typeof vehicleConsumption];
    const fuelCost = (distanceNum / consumption) * fuelPriceNum;
    
    // Calculate weight cost (R$ 0.02 per kg per 100km)
    const weightCost = (weightNum * 0.02) * (distanceNum / 100);
    
    // Daily cost based on vehicle type
    const dailyCost = vehicleDailyCost[vehicleType as keyof typeof vehicleDailyCost];
    
    // Calculate days (assume 500km per day)
    const days = Math.max(1, Math.ceil(distanceNum / 500));
    
    // Total operational cost
    const operationalCost = fuelCost + tollsNum + (dailyCost * days) + weightCost;
    
    // Add profit margin
    const totalCost = operationalCost * (1 + profitMarginNum);
    
    // Cost per km
    const costPerKm = totalCost / distanceNum;
    
    setResult({
      totalCost: totalCost.toFixed(2),
      operationalCost: operationalCost.toFixed(2),
      profitValue: (totalCost - operationalCost).toFixed(2),
      fuelCost: fuelCost.toFixed(2),
      costPerKm: costPerKm.toFixed(2),
      days
    });
  };
  
  // Reset form
  const resetForm = () => {
    setDistance('');
    setWeight('');
    setVehicleType('van');
    setFuelPrice('');
    setTolls('');
    setProfitMargin('');
    setResult(null);
  };
  
  return (
    <Calculator
      id="calculadora-frete"
      title="Calculadora de Custo de Frete"
      description="Calcule o valor do frete baseado nos custos operacionais e na margem de lucro desejada."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="mb-4">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Peso da carga (kg)
            </label>
            <input
              type="number"
              id="weight"
              className="input-field"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 1500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de veículo
            </label>
            <select
              id="vehicleType"
              className="select-field"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="moto">Moto</option>
              <option value="van">Van</option>
              <option value="caminhao">Caminhão</option>
              <option value="carreta">Carreta</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="fuelPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Preço do combustível (R$/litro)
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
          
          <div className="mb-4">
            <label htmlFor="tolls" className="block text-sm font-medium text-gray-700 mb-1">
              Pedágios estimados (R$)
            </label>
            <input
              type="number"
              id="tolls"
              className="input-field"
              value={tolls}
              onChange={(e) => setTolls(e.target.value)}
              placeholder="Ex: 120"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="profitMargin" className="block text-sm font-medium text-gray-700 mb-1">
              Margem de lucro (%)
            </label>
            <input
              type="number"
              id="profitMargin"
              className="input-field"
              value={profitMargin}
              onChange={(e) => setProfitMargin(e.target.value)}
              placeholder="Ex: 20"
              max="100"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateFreight}
        >
          Calcular
        </button>
        <button 
          className="btn btn-secondary"
          onClick={resetForm}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado do cálculo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ResultBox 
              label="Custo total do frete" 
              value={`R$ ${result.totalCost}`}
              tooltip="Inclui todos os custos e a margem de lucro"
              className="col-span-full sm:col-span-2 bg-frete-50"
            />
            <ResultBox 
              label="Custo operacional" 
              value={`R$ ${result.operationalCost}`}
              tooltip="Soma de todos os custos sem lucro"
            />
            <ResultBox 
              label="Valor do lucro" 
              value={`R$ ${result.profitValue}`}
              tooltip="Valor monetário de lucro"
            />
            <ResultBox 
              label="Custo de combustível" 
              value={`R$ ${result.fuelCost}`}
              tooltip="Apenas o custo com combustível"
            />
            <ResultBox 
              label="Custo por km" 
              value={`R$ ${result.costPerKm}`}
              tooltip="Custo total dividido pela distância"
              unit="/km"
            />
            <ResultBox 
              label="Tempo estimado" 
              value={result.days}
              tooltip="Dias estimados para completar a viagem"
              unit={result.days === 1 ? "dia" : "dias"}
            />
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default FreightCalculator;
