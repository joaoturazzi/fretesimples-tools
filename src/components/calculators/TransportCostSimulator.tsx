
import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import ResultBox from './ResultBox';
import { RefreshCw } from 'lucide-react';

interface TransportCostSimulatorProps {
  isActive: boolean;
}

const TransportCostSimulator = ({ isActive }: TransportCostSimulatorProps) => {
  const [fuel, setFuel] = useState('');
  const [tolls, setTolls] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [salary, setSalary] = useState('');
  const [distance, setDistance] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const calculateCosts = () => {
    if (!fuel || !maintenance || !salary || !distance) return;
    
    const fuelCost = parseFloat(fuel);
    const tollsCost = parseFloat(tolls) || 0;
    const maintenanceCost = parseFloat(maintenance);
    const salaryCost = parseFloat(salary);
    const totalDistance = parseFloat(distance);
    
    // Total monthly cost
    const totalCost = fuelCost + tollsCost + maintenanceCost + salaryCost;
    
    // Cost per km
    const costPerKm = totalCost / totalDistance;
    
    // Distribution of costs
    const fuelPercent = (fuelCost / totalCost) * 100;
    const tollsPercent = (tollsCost / totalCost) * 100;
    const maintenancePercent = (maintenanceCost / totalCost) * 100;
    const salaryPercent = (salaryCost / totalCost) * 100;
    
    setResult({
      totalCost: totalCost.toFixed(2),
      costPerKm: costPerKm.toFixed(2),
      fuelPercent: fuelPercent.toFixed(1),
      tollsPercent: tollsPercent.toFixed(1),
      maintenancePercent: maintenancePercent.toFixed(1),
      salaryPercent: salaryPercent.toFixed(1)
    });
  };
  
  return (
    <Calculator
      id="simulador-custos"
      title="Simulador de Custos de Transporte"
      description="Calcule o custo total do seu transporte e o custo por quilômetro rodado."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-1">
              Combustível mensal (R$)
            </label>
            <input
              type="number"
              id="fuel"
              className="input-field"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              placeholder="Ex: 3000"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="tolls" className="block text-sm font-medium text-gray-700 mb-1">
              Pedágios mensais (R$)
            </label>
            <input
              type="number"
              id="tolls"
              className="input-field"
              value={tolls}
              onChange={(e) => setTolls(e.target.value)}
              placeholder="Ex: 500"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distância mensal rodada (km)
            </label>
            <input
              type="number"
              id="distance"
              className="input-field"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Ex: 5000"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="maintenance" className="block text-sm font-medium text-gray-700 mb-1">
              Manutenção mensal (R$)
            </label>
            <input
              type="number"
              id="maintenance"
              className="input-field"
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
              placeholder="Ex: 800"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
              Salário do motorista (R$)
            </label>
            <input
              type="number"
              id="salary"
              className="input-field"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Ex: 2500"
              step="0.01"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateCosts}
        >
          Calcular
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setFuel('');
            setTolls('');
            setMaintenance('');
            setSalary('');
            setDistance('');
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultBox 
              label="Custo total mensal" 
              value={`R$ ${result.totalCost}`}
              className="col-span-full bg-frete-50"
            />
            <ResultBox 
              label="Custo por quilômetro" 
              value={`R$ ${result.costPerKm}`}
              unit="/km"
            />
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Distribuição de custos</h4>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Combustível</span>
                    <span>{result.fuelPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-frete-500 h-2 rounded-full" 
                      style={{ width: `${result.fuelPercent}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pedágios</span>
                    <span>{result.tollsPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${result.tollsPercent}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Manutenção</span>
                    <span>{result.maintenancePercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full" 
                      style={{ width: `${result.maintenancePercent}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Salário</span>
                    <span>{result.salaryPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${result.salaryPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default TransportCostSimulator;
