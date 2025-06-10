
import React from 'react';
import { DollarSign, TrendingUp, Clock, Route, Truck, AlertCircle, Calculator } from 'lucide-react';
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

  const handleSimulateProfitClick = () => {
    // Salvar dados do frete para usar no simulador
    const freightData = {
      origin,
      destination,
      distance,
      weight,
      vehicleType,
      totalCost: result.totalFreight,
      suggestedPrice: result.suggestedPrice,
      costPerKm: result.costPerKm,
      fuelCost: result.fuelCost,
      timestamp: Date.now()
    };
    
    localStorage.setItem('freight-data-for-profit', JSON.stringify(freightData));
    
    // Disparar evento customizado para mudar seção
    const event = new CustomEvent('changeActiveSection', { 
      detail: 'simulador-lucro' 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Premium com Informações da Viagem */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Route size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">Cálculo Concluído</h3>
            <p className="text-blue-100 text-lg">Frete calculado com sucesso ✨</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Route size={20} className="text-blue-200" />
            <div>
              <p className="text-blue-100 text-xs">Rota</p>
              <p className="font-semibold">{origin} → {destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck size={20} className="text-blue-200" />
            <div>
              <p className="text-blue-100 text-xs">Veículo & Carga</p>
              <p className="font-semibold">{getVehicleTypeLabel(vehicleType)} • {weight}kg</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-blue-200" />
            <div>
              <p className="text-blue-100 text-xs">Distância & Tempo</p>
              <p className="font-semibold">{distance}km {routeDuration && `• ${Math.round(routeDuration / 60)}h`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados Principais - Cards Melhorados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-green-600 text-sm font-medium">Custo Total</p>
              <p className="text-2xl font-bold text-green-700">
                R$ {result.totalFreight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="bg-green-100 rounded-lg p-3">
            <p className="text-green-700 text-sm font-medium">
              R$ {result.costPerKm.toFixed(2)} por km
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-blue-600 text-sm font-medium">Preço Sugerido</p>
              <p className="text-2xl font-bold text-blue-700">
                R$ {result.suggestedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="bg-blue-100 rounded-lg p-3">
            <p className="text-blue-700 text-sm font-medium">
              Margem de {((result.suggestedPrice - result.totalFreight) / result.totalFreight * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-orange-600 text-sm font-medium">Lucro Estimado</p>
              <p className={`text-2xl font-bold ${profitabilityColor()}`}>
                R$ {(result.suggestedPrice - result.totalFreight).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="bg-orange-100 rounded-lg p-3">
            <p className={`text-sm font-medium ${profitabilityColor()}`}>
              {profitMargin.toFixed(1)}% de margem de lucro
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown de Custos Melhorado */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <DollarSign size={20} className="text-white" />
          </div>
          Detalhamento de Custos
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 border border-red-200">
            <div className="text-sm font-semibold text-red-600 mb-2">💛 Combustível</div>
            <div className="text-2xl font-bold text-red-700">
              R$ {result.fuelCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-red-600 mt-2">
              {(result.fuelCost / result.totalFreight * 100).toFixed(1)}% do total
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
            <div className="text-sm font-semibold text-purple-600 mb-2">⚙️ Operação</div>
            <div className="text-2xl font-bold text-purple-700">
              R$ {(result.totalFreight - result.fuelCost - (result.tollsCost || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-purple-600 mt-2">
              {((result.totalFreight - result.fuelCost - (result.tollsCost || 0)) / result.totalFreight * 100).toFixed(1)}% do total
            </div>
          </div>

          {result.tollsCost && result.tollsCost > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-200">
              <div className="text-sm font-semibold text-yellow-600 mb-2">🛣️ Pedágios</div>
              <div className="text-2xl font-bold text-yellow-700">
                R$ {result.tollsCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-yellow-600 mt-2">
                {(result.tollsCost / result.totalFreight * 100).toFixed(1)}% do total
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300">
            <div className="text-sm font-semibold text-green-600 mb-2">📊 Margem de Lucro</div>
            <div className="text-2xl font-bold text-green-700">
              {profitMargin.toFixed(1)}%
            </div>
            <div className="text-xs text-green-600 mt-2">
              R$ {(result.suggestedPrice - result.totalFreight).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Análise de Viabilidade Melhorada */}
      <div className={`rounded-2xl p-6 border-2 shadow-lg ${
        profitMargin >= 20 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
          : profitMargin >= 10 
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
            : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            profitMargin >= 20 
              ? 'bg-green-500' 
              : profitMargin >= 10 
                ? 'bg-yellow-500'
                : 'bg-red-500'
          }`}>
            {profitMargin >= 10 ? (
              <TrendingUp size={28} className="text-white" />
            ) : (
              <AlertCircle size={28} className="text-white" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`text-xl font-bold mb-3 ${
              profitMargin >= 20 
                ? 'text-green-700' 
                : profitMargin >= 10 
                  ? 'text-yellow-700'
                  : 'text-red-700'
            }`}>
              {profitMargin >= 20 
                ? '✅ Viagem Muito Viável' 
                : profitMargin >= 10 
                  ? '⚠️ Viagem Viável com Atenção'
                  : '❌ Viagem de Alto Risco'}
            </h4>
            <p className={`${
              profitMargin >= 20 
                ? 'text-green-600' 
                : profitMargin >= 10 
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}>
              {profitMargin >= 20 
                ? 'Excelente margem de lucro! Esta operação oferece boa rentabilidade e baixo risco financeiro. Recomendamos prosseguir com a operação.'
                : profitMargin >= 10 
                  ? 'Margem adequada, mas monitore os custos de perto. Considere negociar um valor ligeiramente maior para aumentar a segurança.'
                  : 'Margem muito baixa ou negativa! Reavalie os custos ou negocie um valor maior para garantir a viabilidade da operação.'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA para Simulador de Lucro - CORRIGIDO */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Calculator size={28} className="text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">
                💡 Deseja simular cenários de lucro?
              </h4>
              <p className="text-purple-100">
                Calcule diferentes margens, analise riscos e otimize sua rentabilidade
              </p>
            </div>
          </div>
          <button 
            onClick={handleSimulateProfitClick}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <TrendingUp size={20} />
            Simular Lucro
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreightResults;
