
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import { TrendingUp, DollarSign, Target, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import useSharedData from '@/hooks/useSharedData';
import { cn } from '@/lib/utils';

interface ProfitSimulatorProps {
  isActive: boolean;
}

const ProfitSimulator = ({ isActive }: ProfitSimulatorProps) => {
  const { data } = useSharedData();
  
  // Estados do formulário
  const [freightCost, setFreightCost] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [suggestedMargin, setSuggestedMargin] = useState('15');
  const [additionalCosts, setAdditionalCosts] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  
  // Estados de resultado
  const [result, setResult] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);

  // Importar dados da Calculadora de Frete automaticamente
  useEffect(() => {
    if (data.freightData) {
      setFreightCost(data.freightData.totalCost.toString());
      setOrigin(data.freightData.origin);
      setDestination(data.freightData.destination);
      setDistance(data.freightData.distance.toString());
      
      // Calcular preço sugerido baseado na margem padrão
      const suggestedPrice = data.freightData.totalCost * (1 + parseFloat(suggestedMargin) / 100);
      setProposedPrice(suggestedPrice.toFixed(2));
    }
  }, [data.freightData, suggestedMargin]);

  // Cálculo em tempo real
  useEffect(() => {
    if (freightCost && proposedPrice) {
      calculateProfit();
    }
  }, [freightCost, proposedPrice, additionalCosts, suggestedMargin]);

  const calculateProfit = () => {
    const cost = parseFloat(freightCost) || 0;
    const price = parseFloat(proposedPrice) || 0;
    const additional = parseFloat(additionalCosts) || 0;
    const totalCost = cost + additional;
    
    const netProfit = price - totalCost;
    const profitPercentage = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const margin = price > 0 ? (netProfit / price) * 100 : 0;
    
    // Análise de viabilidade
    let viability = 'Inviável';
    let viabilityColor = 'red';
    let recommendation = '';
    
    if (profitPercentage >= 25) {
      viability = 'Excelente';
      viabilityColor = 'green';
      recommendation = 'Operação muito lucrativa. Margem excelente para o setor.';
    } else if (profitPercentage >= 15) {
      viability = 'Viável';
      viabilityColor = 'green';
      recommendation = 'Boa margem de lucro. Operação recomendada.';
    } else if (profitPercentage >= 8) {
      viability = 'Atenção';
      viabilityColor = 'yellow';
      recommendation = 'Margem baixa. Monitore custos e considere renegociar.';
    } else if (profitPercentage >= 0) {
      viability = 'Crítico';
      viabilityColor = 'orange';
      recommendation = 'Margem muito baixa. Risco alto de prejuízo.';
    } else {
      viability = 'Inviável';
      viabilityColor = 'red';
      recommendation = 'Operação com prejuízo. Reavalie custos e preços.';
    }

    const calculatedResult = {
      totalCost,
      proposedPrice: price,
      netProfit,
      profitPercentage,
      margin,
      viability,
      viabilityColor,
      recommendation,
      costPerKm: distance ? totalCost / parseFloat(distance) : 0,
      pricePerKm: distance ? price / parseFloat(distance) : 0
    };

    setResult(calculatedResult);
    generateScenarios(calculatedResult);
  };

  const generateScenarios = (baseResult: any) => {
    const margins = [10, 15, 20, 25, 30];
    const newScenarios = margins.map(margin => {
      const price = baseResult.totalCost * (1 + margin / 100);
      const profit = price - baseResult.totalCost;
      const profitPercentage = (profit / baseResult.totalCost) * 100;
      
      return {
        margin,
        price,
        profit,
        profitPercentage,
        viable: profitPercentage >= 10
      };
    });
    
    setScenarios(newScenarios);
  };

  const handleReset = () => {
    setFreightCost('');
    setProposedPrice('');
    setSuggestedMargin('15');
    setAdditionalCosts('');
    setOrigin('');
    setDestination('');
    setDistance('');
    setResult(null);
    setScenarios([]);
  };

  const applyScenario = (scenario: any) => {
    setProposedPrice(scenario.price.toFixed(2));
    setSuggestedMargin(scenario.margin.toString());
  };

  const getViabilityIcon = (viability: string) => {
    switch (viability) {
      case 'Excelente':
      case 'Viável':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'Atenção':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'Crítico':
        return <AlertTriangle size={20} className="text-orange-500" />;
      default:
        return <AlertTriangle size={20} className="text-red-500" />;
    }
  };

  return (
    <Calculator
      id="simulador-lucro"
      title="Simulador de Lucro"
      description="Simule diferentes cenários de margem e analise a viabilidade da operação."
      isActive={isActive}
    >
      <div className="space-y-6">
        {/* Importação Automática */}
        {data.freightData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle size={20} className="text-blue-500" />
              <span className="font-medium text-blue-700">Dados importados da Calculadora de Frete</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-blue-600">
              <span><strong>Rota:</strong> {data.freightData.origin} → {data.freightData.destination}</span>
              <span><strong>Distância:</strong> {data.freightData.distance} km</span>
              <span><strong>Custo:</strong> R$ {data.freightData.totalCost.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Dados Básicos */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Dados da Operação</h3>
              <p className="text-sm text-gray-600">Custos e preços para análise</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="calculator-label">
                <DollarSign size={16} className="calculator-label-icon" />
                Custo Total do Frete (R$)
              </label>
              <input
                type="number"
                value={freightCost}
                onChange={(e) => setFreightCost(e.target.value)}
                className="input-field"
                placeholder="Ex: 1500.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="calculator-label">
                <Target size={16} className="calculator-label-icon" />
                Preço Proposto (R$)
              </label>
              <input
                type="number"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                className="input-field"
                placeholder="Ex: 1800.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="calculator-label">
                <TrendingUp size={16} className="calculator-label-icon" />
                Margem Sugerida pelo Mercado (%)
              </label>
              <input
                type="number"
                value={suggestedMargin}
                onChange={(e) => setSuggestedMargin(e.target.value)}
                className="input-field"
                placeholder="15"
                step="1"
                min="0"
                max="100"
              />
              <p className="form-helper">
                Sugestão: 15% a 25% para operações seguras
              </p>
            </div>

            <div>
              <label className="calculator-label">
                Custos Adicionais (R$)
              </label>
              <input
                type="number"
                value={additionalCosts}
                onChange={(e) => setAdditionalCosts(e.target.value)}
                className="input-field"
                placeholder="Ex: 50.00"
                step="0.01"
                min="0"
              />
              <p className="form-helper">
                Opcional: taxas, seguros extras, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Resultado Principal */}
        {result && (
          <div className="space-y-6">
            <div className={cn(
              "rounded-xl p-6 border-2",
              result.viabilityColor === 'green' && "bg-green-50 border-green-200",
              result.viabilityColor === 'yellow' && "bg-yellow-50 border-yellow-200",
              result.viabilityColor === 'orange' && "bg-orange-50 border-orange-200",
              result.viabilityColor === 'red' && "bg-red-50 border-red-200"
            )}>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center",
                  result.viabilityColor === 'green' && "bg-green-500",
                  result.viabilityColor === 'yellow' && "bg-yellow-500",
                  result.viabilityColor === 'orange' && "bg-orange-500",
                  result.viabilityColor === 'red' && "bg-red-500"
                )}>
                  {getViabilityIcon(result.viability)}
                </div>
                <div>
                  <h3 className={cn(
                    "text-2xl font-bold",
                    result.viabilityColor === 'green' && "text-green-700",
                    result.viabilityColor === 'yellow' && "text-yellow-700",
                    result.viabilityColor === 'orange' && "text-orange-700",
                    result.viabilityColor === 'red' && "text-red-700"
                  )}>
                    {result.viability}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    result.viabilityColor === 'green' && "text-green-600",
                    result.viabilityColor === 'yellow' && "text-yellow-600",
                    result.viabilityColor === 'orange' && "text-orange-600",
                    result.viabilityColor === 'red' && "text-red-600"
                  )}>
                    {result.recommendation}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">Lucro Líquido</div>
                  <div className={cn(
                    "text-2xl font-bold",
                    result.netProfit >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    R$ {result.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">Lucro Percentual</div>
                  <div className={cn(
                    "text-2xl font-bold",
                    result.profitPercentage >= 15 ? "text-green-600" : 
                    result.profitPercentage >= 8 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {result.profitPercentage.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">Margem sobre Venda</div>
                  <div className={cn(
                    "text-2xl font-bold",
                    result.margin >= 15 ? "text-green-600" : 
                    result.margin >= 8 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {result.margin.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Cenários de Margem */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-purple-500" />
                Cenários de Margem
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {scenarios.map((scenario, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                      scenario.viable 
                        ? "border-green-200 bg-green-50 hover:border-green-300" 
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    )}
                    onClick={() => applyScenario(scenario)}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{scenario.margin}%</div>
                      <div className="text-sm text-gray-600 mb-2">Margem</div>
                      <div className="text-sm font-medium text-gray-900">
                        R$ {scenario.price.toFixed(2)}
                      </div>
                      <div className={cn(
                        "text-xs mt-1",
                        scenario.viable ? "text-green-600" : "text-gray-500"
                      )}>
                        Lucro: {scenario.profitPercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mt-3">
                Clique em um cenário para aplicar automaticamente
              </p>
            </div>

            {/* Detalhamento */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Detalhamento da Operação</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-600 mb-1">Custo Total</div>
                  <div className="text-lg font-semibold text-gray-900">
                    R$ {result.totalCost.toFixed(2)}
                  </div>
                  {distance && (
                    <div className="text-xs text-gray-500">
                      R$ {result.costPerKm.toFixed(2)}/km
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-600 mb-1">Preço Cobrado</div>
                  <div className="text-lg font-semibold text-gray-900">
                    R$ {result.proposedPrice.toFixed(2)}
                  </div>
                  {distance && (
                    <div className="text-xs text-gray-500">
                      R$ {result.pricePerKm.toFixed(2)}/km
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-600 mb-1">Margem sobre Custo</div>
                  <div className="text-lg font-semibold text-blue-700">
                    {result.profitPercentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-blue-600">
                    Lucro/Custo
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-purple-600 mb-1">Margem sobre Venda</div>
                  <div className="text-lg font-semibold text-purple-700">
                    {result.margin.toFixed(1)}%
                  </div>
                  <div className="text-xs text-purple-600">
                    Lucro/Preço
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={calculateProfit}
            className="btn btn-primary"
          >
            <TrendingUp size={18} />
            Simular Lucro
          </button>

          <button 
            onClick={handleReset}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} />
            Limpar
          </button>
        </div>
      </div>
    </Calculator>
  );
};

export default ProfitSimulator;
