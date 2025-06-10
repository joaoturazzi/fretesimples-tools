
import React from 'react';
import { DollarSign, TrendingUp, Clock, Route, Truck, AlertCircle } from 'lucide-react';
import { FreightCalculationResult } from './freightCalculations';

interface FreightResultsProps {
  result: FreightCalculationResult;
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  vehicleType: string;
  routeDuration?: number;
}

const FreightResults: React.FC<FreightResultsProps> = ({
  result,
  origin,
  destination,
  distance,
  weight,
  vehicleType,
  routeDuration
}) => {
  const profitabilityColor = () => {
    const margin = ((result.suggestedPrice - result.totalFreight) / result.suggestedPrice) * 100;
    if (margin >= 20) return 'text-green-600';
    if (margin >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVehicleTypeLabel = (type: string) => {
    const labels = {
      truck: 'Caminhão',
      van: 'Van',
      motorcycle: 'Moto'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const profitMargin = ((result.suggestedPrice - result.totalFreight) / result.suggestedPrice) * 100;

  return (
    <div className="space-y-6">
      {/* Header com Informações da Viagem */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Route size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Resultado do Cálculo</h3>
            <p className="text-blue-100">Frete calculado com sucesso</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Route size={16} />
            <span>{origin} → {destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck size={16} />
            <span>{getVehicleTypeLabel(vehicleType)} • {weight}kg</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{distance}km {routeDuration && `• ${Math.round(routeDuration / 60)}h`}</span>
          </div>
        </div>
      </div>

      {/* Resultados Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="result-card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="result-card-header text-green-600">
            <DollarSign size={16} />
            Custo Total
          </div>
          <div className="result-card-value text-green-700">
            R$ {result.totalFreight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-green-600 mt-2">
            R$ {result.costPerKm.toFixed(2)} por km
          </div>
        </div>

        <div className="result-card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="result-card-header text-blue-600">
            <TrendingUp size={16} />
            Preço Sugerido
          </div>
          <div className="result-card-value text-blue-700">
            R$ {result.suggestedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-blue-600 mt-2">
            Margem de {((result.suggestedPrice - result.totalFreight) / result.totalFreight * 100).toFixed(1)}%
          </div>
        </div>

        <div className="result-card bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="result-card-header text-orange-600">
            <TrendingUp size={16} />
            Lucro Estimado
          </div>
          <div className={`result-card-value ${profitabilityColor()}`}>
            R$ {(result.suggestedPrice - result.totalFreight).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-xs mt-2 ${profitabilityColor()}`}>
            {profitMargin.toFixed(1)}% de margem
          </div>
        </div>
      </div>

      {/* Breakdown de Custos */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-orange-500" />
          Detalhamento de Custos
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Combustível</div>
            <div className="text-lg font-semibold text-gray-900">
              R$ {result.fuelCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">
              {(result.fuelCost / result.totalFreight * 100).toFixed(1)}% do total
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Operação</div>
            <div className="text-lg font-semibold text-gray-900">
              R$ {(result.totalFreight - result.fuelCost - (result.tollsCost || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">
              {((result.totalFreight - result.fuelCost - (result.tollsCost || 0)) / result.totalFreight * 100).toFixed(1)}% do total
            </div>
          </div>

          {result.tollsCost && result.tollsCost > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-1">Pedágios</div>
              <div className="text-lg font-semibold text-gray-900">
                R$ {result.tollsCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-500">
                {(result.tollsCost / result.totalFreight * 100).toFixed(1)}% do total
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="text-sm font-medium text-orange-600 mb-1">Margem</div>
            <div className="text-lg font-semibold text-orange-700">
              {profitMargin.toFixed(1)}%
            </div>
            <div className="text-xs text-orange-600">
              R$ {(result.suggestedPrice - result.totalFreight).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Análise de Viabilidade */}
      <div className={`rounded-xl p-6 border-2 ${
        profitMargin >= 20 
          ? 'bg-green-50 border-green-200' 
          : profitMargin >= 10 
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            profitMargin >= 20 
              ? 'bg-green-500' 
              : profitMargin >= 10 
                ? 'bg-yellow-500'
                : 'bg-red-500'
          }`}>
            {profitMargin >= 10 ? (
              <TrendingUp size={20} className="text-white" />
            ) : (
              <AlertCircle size={20} className="text-white" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`text-lg font-semibold mb-2 ${
              profitMargin >= 20 
                ? 'text-green-700' 
                : profitMargin >= 10 
                  ? 'text-yellow-700'
                  : 'text-red-700'
            }`}>
              {profitMargin >= 20 
                ? 'Viagem Muito Viável' 
                : profitMargin >= 10 
                  ? 'Viagem Viável com Atenção'
                  : 'Viagem de Alto Risco'}
            </h4>
            <p className={`text-sm ${
              profitMargin >= 20 
                ? 'text-green-600' 
                : profitMargin >= 10 
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}>
              {profitMargin >= 20 
                ? 'Excelente margem de lucro. Esta operação oferece boa rentabilidade e baixo risco financeiro.'
                : profitMargin >= 10 
                  ? 'Margem adequada, mas monitore os custos. Considere negociar um valor ligeiramente maior.'
                  : 'Margem muito baixa ou negativa. Reavalie os custos ou negocie um valor maior para garantir a viabilidade.'}
            </p>
          </div>
        </div>
      </div>

      {/* Botão para Simulador de Lucro */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              Deseja simular o lucro desta viagem?
            </h4>
            <p className="text-sm text-gray-600">
              Calcule diferentes cenários de margem e analise a viabilidade completa
            </p>
          </div>
          <button 
            onClick={() => {
              const event = new CustomEvent('navigate-section', { detail: 'simulador-lucro' });
              document.dispatchEvent(event);
            }}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <TrendingUp size={18} />
            Simular Lucro
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreightResults;
