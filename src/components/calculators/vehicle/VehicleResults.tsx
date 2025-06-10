
import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, DollarSign, Fuel, Package, Target } from 'lucide-react';

interface VehicleResultsProps {
  results: {
    totalWeight: number;
    totalVolume: number;
    recommendedVehicle: string;
    utilizationPercentage: number;
    alternativeVehicles: string[];
    warnings: string[];
    efficiencyScore: number;
    operationalCost: number;
    fuelConsumption: number;
    specialRequirements: string[];
  };
  isLiquid: boolean;
  distance: number;
}

const VehicleResults = ({ results, isLiquid, distance }: VehicleResultsProps) => {
  const getEfficiencyColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyBg = (score: number) => {
    if (score >= 85) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const fuelCost = (distance / results.fuelConsumption) * 6.0;
  const totalOperationalCost = results.operationalCost * distance;
  const totalCost = totalOperationalCost + fuelCost;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Results Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Package size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">Análise Concluída</h3>
            <p className="text-blue-100 text-lg">Veículo recomendado com análise detalhada</p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Veículo Recomendado</p>
              <p className="text-2xl font-bold">{results.recommendedVehicle}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Score de Eficiência</p>
              <p className="text-2xl font-bold">{results.efficiencyScore}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Target size={24} className="text-blue-500" />
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Utilização</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{results.utilizationPercentage.toFixed(1)}%</p>
          <p className="text-gray-600 text-sm">Capacidade utilizada</p>
        </div>

        <div className={`rounded-xl p-5 border shadow-sm ${getEfficiencyBg(results.efficiencyScore)}`}>
          <div className="flex items-center justify-between mb-3">
            <TrendingUp size={24} className={getEfficiencyColor(results.efficiencyScore)} />
            <span className={`text-xs px-2 py-1 rounded-full ${
              results.efficiencyScore >= 85 ? 'bg-green-100 text-green-700' :
              results.efficiencyScore >= 70 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-red-100 text-red-700'
            }`}>
              {results.efficiencyScore >= 85 ? 'Excelente' : 
               results.efficiencyScore >= 70 ? 'Bom' : 'Ruim'}
            </span>
          </div>
          <p className={`text-2xl font-bold ${getEfficiencyColor(results.efficiencyScore)}`}>
            {results.efficiencyScore}
          </p>
          <p className="text-gray-600 text-sm">Score de eficiência</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <DollarSign size={24} className="text-green-500" />
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Custo</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">R$ {totalCost.toFixed(2)}</p>
          <p className="text-gray-600 text-sm">Custo total ({distance}km)</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Fuel size={24} className="text-orange-500" />
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Combustível</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{results.fuelConsumption}</p>
          <p className="text-gray-600 text-sm">km/litro</p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package size={20} className="text-orange-500" />
          Análise Detalhada da Carga
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Dimensões e Peso</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Peso total:</span>
                  <span className="font-medium">{results.totalWeight.toLocaleString('pt-BR')} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume total:</span>
                  <span className="font-medium">
                    {isLiquid 
                      ? `${(results.totalVolume * 1000).toLocaleString('pt-BR')} litros`
                      : `${results.totalVolume.toFixed(2)} m³`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-3">Custos Operacionais</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Custo operacional:</span>
                  <span className="font-medium">R$ {totalOperationalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Combustível estimado:</span>
                  <span className="font-medium">R$ {fuelCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 flex justify-between font-medium">
                  <span className="text-blue-900">Total:</span>
                  <span className="text-blue-900">R$ {totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {results.alternativeVehicles.length > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <h5 className="font-medium text-indigo-900 mb-3">Alternativas Viáveis</h5>
                <ul className="space-y-2 text-sm">
                  {results.alternativeVehicles.map((alt, idx) => (
                    <li key={idx} className="text-indigo-700 flex items-start gap-2">
                      <CheckCircle size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                      {alt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {results.specialRequirements.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-900 mb-3">Requisitos Especiais</h5>
                <ul className="space-y-2 text-sm">
                  {results.specialRequirements.map((req, idx) => (
                    <li key={idx} className="text-purple-700 flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5 shrink-0">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warnings */}
      {results.warnings.length > 0 && (
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-yellow-600" />
            Atenção - Recomendações Importantes
          </h4>
          <ul className="space-y-2">
            {results.warnings.map((warning, idx) => (
              <li key={idx} className="text-yellow-700 text-sm flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5 shrink-0">⚠️</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-3">Resumo Executivo</h4>
        <p className="text-gray-700 leading-relaxed">
          Para {isLiquid ? 'transporte de líquidos' : 'carga sólida'} de{' '}
          <strong>{results.totalWeight.toLocaleString('pt-BR')} kg</strong> e{' '}
          <strong>
            {isLiquid 
              ? `${(results.totalVolume * 1000).toLocaleString('pt-BR')} litros`
              : `${results.totalVolume.toFixed(2)} m³`}
          </strong>, 
          o veículo recomendado é <strong>{results.recommendedVehicle}</strong> com{' '}
          <strong>{results.utilizationPercentage.toFixed(1)}%</strong> de utilização e score de eficiência de{' '}
          <strong>{results.efficiencyScore}/100</strong>. 
          O custo total estimado para {distance}km é de <strong>R$ {totalCost.toFixed(2)}</strong>.
        </p>
      </div>
    </div>
  );
};

export default VehicleResults;
