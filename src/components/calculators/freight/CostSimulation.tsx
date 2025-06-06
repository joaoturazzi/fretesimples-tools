
import React from 'react';
import { TrendingUp } from 'lucide-react';
import ResultBox from '../ResultBox';
import { formatCurrency } from '@/lib/utils';
import { CostSimulationResult } from './freightCalculations';

interface CostSimulationProps {
  showCostSimulation: boolean;
  setShowCostSimulation: (show: boolean) => void;
  monthlyMaintenance: number | string;
  setMonthlyMaintenance: (value: number | string) => void;
  driverSalary: number | string;
  setDriverSalary: (value: number | string) => void;
  monthlyDistance: number | string;
  setMonthlyDistance: (value: number | string) => void;
  costSimulationResult: CostSimulationResult | null;
}

const CostSimulation: React.FC<CostSimulationProps> = ({
  showCostSimulation,
  setShowCostSimulation,
  monthlyMaintenance,
  setMonthlyMaintenance,
  driverSalary,
  setDriverSalary,
  monthlyDistance,
  setMonthlyDistance,
  costSimulationResult
}) => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <TrendingUp size={20} className="text-frete-500" />
          Simulação de Custos Operacionais
        </h4>
        <button
          onClick={() => setShowCostSimulation(!showCostSimulation)}
          className="btn btn-secondary text-sm"
        >
          {showCostSimulation ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {showCostSimulation && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="calculator-input-group">
            <label htmlFor="monthlyMaintenance" className="calculator-label">
              Manutenção mensal (R$)
            </label>
            <input
              id="monthlyMaintenance"
              type="number"
              className="input-field"
              value={monthlyMaintenance}
              onChange={(e) => setMonthlyMaintenance(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="Ex: 800"
              step="0.01"
            />
          </div>
          
          <div className="calculator-input-group">
            <label htmlFor="driverSalary" className="calculator-label">
              Salário do motorista (R$)
            </label>
            <input
              id="driverSalary"
              type="number"
              className="input-field"
              value={driverSalary}
              onChange={(e) => setDriverSalary(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="Ex: 2500"
              step="0.01"
            />
          </div>
          
          <div className="calculator-input-group">
            <label htmlFor="monthlyDistance" className="calculator-label">
              Distância mensal rodada (km)
            </label>
            <input
              id="monthlyDistance"
              type="number"
              className="input-field"
              value={monthlyDistance}
              onChange={(e) => setMonthlyDistance(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="Ex: 5000"
            />
          </div>
        </div>
      )}

      {costSimulationResult && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Análise de Custos Operacionais</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <ResultBox 
              label="Custo total mensal" 
              value={formatCurrency(costSimulationResult.totalMonthlyCost)}
              className="bg-blue-50"
            />
            <ResultBox 
              label="Custo por quilômetro calculado" 
              value={formatCurrency(costSimulationResult.costPerKmCalculated)}
              unit="/km"
              className="bg-green-50"
            />
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Distribuição de custos</h5>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Combustível</span>
                  <span>{costSimulationResult.fuelPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-frete-500 h-2 rounded-full" 
                    style={{ width: `${costSimulationResult.fuelPercent}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Manutenção</span>
                  <span>{costSimulationResult.maintenancePercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-400 h-2 rounded-full" 
                    style={{ width: `${costSimulationResult.maintenancePercent}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Salário</span>
                  <span>{costSimulationResult.salaryPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${costSimulationResult.salaryPercent}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pedágios</span>
                  <span>{costSimulationResult.tollsPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full" 
                    style={{ width: `${costSimulationResult.tollsPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostSimulation;
