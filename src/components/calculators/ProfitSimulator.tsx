
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import ResultBox from './ResultBox';
import { RefreshCw, CheckCircle, XCircle, Download, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import useSharedData from '@/hooks/useSharedData';
import { formatCurrency } from '@/lib/utils';

interface ProfitSimulatorProps {
  isActive: boolean;
}

interface ViabilityResult {
  isViable: boolean;
  profit: string;
  marginPercent: string;
  suggestedPrice: string;
  targetMargin: number;
  minimumMargin: number;
  recommendation: {
    type: 'danger' | 'warning' | 'success';
    title: string;
    message: string;
  };
  breakEvenPoint: string;
  profitabilityIndex: number;
}

const ProfitSimulator = ({ isActive }: ProfitSimulatorProps) => {
  const [totalCost, setTotalCost] = useState('');
  const [price, setPrice] = useState('');
  const [suggestedMargin, setSuggestedMargin] = useState(15);
  const [customMargin, setCustomMargin] = useState('');
  const [result, setResult] = useState<ViabilityResult | null>(null);
  const [canImportFreight, setCanImportFreight] = useState(false);
  
  const { data, saveRiskData } = useSharedData();

  useEffect(() => {
    setCanImportFreight(!!data.freightData);
  }, [data.freightData]);

  const importFreightData = () => {
    if (data.freightData) {
      setTotalCost(data.freightData.totalCost.toString());
      // Sugerir preço com margem padrão
      const suggestedPrice = data.freightData.totalCost * (1 + suggestedMargin / 100);
      setPrice(suggestedPrice.toFixed(2));
    }
  };

  const getMarketSuggestedMargin = (vehicleType: string, distance: number) => {
    // Margem sugerida baseada no tipo de veículo e distância
    const baseMargins = {
      'van': 18,
      'toco': 15,
      'truck': 12,
      'carreta': 10,
      'bitrem': 8
    };
    
    let margin = baseMargins[vehicleType as keyof typeof baseMargins] || 15;
    
    // Ajuste por distância (viagens longas têm margem menor)
    if (distance > 1000) margin -= 2;
    else if (distance > 500) margin -= 1;
    else if (distance < 100) margin += 3;
    
    return Math.max(5, Math.min(25, margin));
  };

  useEffect(() => {
    if (data.freightData) {
      const suggestedMarginValue = getMarketSuggestedMargin(
        data.freightData.vehicleType, 
        data.freightData.distance
      );
      setSuggestedMargin(suggestedMarginValue);
    }
  }, [data.freightData]);
  
  const calculateProfit = () => {
    if (!totalCost || !price) return;
    
    const costValue = parseFloat(totalCost);
    const priceValue = parseFloat(price);
    
    const profit = priceValue - costValue;
    const marginPercent = (profit / priceValue) * 100;
    const isProfit = profit > 0;
    
    // Calcular preço sugerido com margem customizada ou padrão
    const targetMargin = customMargin ? parseFloat(customMargin) : suggestedMargin;
    const suggestedPrice = costValue / (1 - targetMargin / 100);
    
    // Determinar viabilidade baseada na margem mínima
    const minimumMargin = 8; // Margem mínima para viabilidade
    const isViable = marginPercent >= minimumMargin;
    
    // Ponto de equilíbrio (custo total = preço mínimo)
    const breakEvenPoint = costValue.toFixed(2);
    
    // Índice de rentabilidade (preço / custo)
    const profitabilityIndex = priceValue / costValue;
    
    const analysisResult: ViabilityResult = {
      profit: profit.toFixed(2),
      marginPercent: marginPercent.toFixed(2),
      isViable,
      suggestedPrice: suggestedPrice.toFixed(2),
      targetMargin,
      minimumMargin,
      recommendation: getRecommendation(marginPercent, minimumMargin, profitabilityIndex),
      breakEvenPoint,
      profitabilityIndex: parseFloat(profitabilityIndex.toFixed(3))
    };
    
    setResult(analysisResult);
    
    // Salvar dados para outros componentes
    saveRiskData({
      totalCost: costValue,
      price: priceValue,
      viabilityAnalysis: analysisResult,
      timestamp: Date.now()
    });
  };

  const getRecommendation = (margin: number, minimum: number, profitIndex: number) => {
    if (margin < 0) {
      return {
        type: 'danger' as const,
        title: 'Operação com prejuízo',
        message: 'Esta operação gerará prejuízo. Renegocie o preço ou reduza custos urgentemente.'
      };
    } else if (margin < minimum) {
      return {
        type: 'warning' as const,
        title: 'Margem insuficiente',
        message: `Margem abaixo do mínimo recomendado (${minimum}%). Alto risco operacional.`
      };
    } else if (margin < 15) {
      return {
        type: 'success' as const,
        title: 'Operação viável',
        message: 'Margem aceitável, mas há espaço para melhorar a rentabilidade.'
      };
    } else if (margin < 25) {
      return {
        type: 'success' as const,
        title: 'Boa rentabilidade',
        message: 'Margem saudável! Operação altamente recomendada.'
      };
    } else {
      return {
        type: 'success' as const,
        title: 'Excelente rentabilidade',
        message: 'Margem excepcional! Operação muito lucrativa.'
      };
    }
  };

  const exportResults = () => {
    if (!result) return;

    const exportData = {
      calculation: {
        totalCost: parseFloat(totalCost),
        price: parseFloat(price),
        profit: parseFloat(result.profit),
        marginPercent: parseFloat(result.marginPercent),
        isViable: result.isViable,
        targetMargin: result.targetMargin,
        profitabilityIndex: result.profitabilityIndex
      },
      freightData: data.freightData,
      timestamp: new Date().toISOString(),
      recommendation: result.recommendation,
      analysis: {
        breakEvenPoint: result.breakEvenPoint,
        suggestedPrice: result.suggestedPrice,
        viabilityStatus: result.isViable ? 'VIÁVEL' : 'INVIÁVEL'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-lucro-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Calculator
      id="simulador-lucro"
      title="Simulador de Lucro por Frete"
      description="Calcule o lucro líquido, margem percentual e viabilidade completa da operação."
      isActive={isActive}
    >
      {canImportFreight && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">Dados de frete disponíveis</p>
              <p className="text-sm text-blue-600 mt-1">
                Importar dados da última calculadora de frete: {formatCurrency(data.freightData?.totalCost || 0)}
                {data.freightData && (
                  <span className="ml-2 text-xs">
                    (Margem sugerida: {getMarketSuggestedMargin(data.freightData.vehicleType, data.freightData.distance)}%)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={importFreightData}
              className="btn btn-primary btn-sm"
            >
              <Download size={16} className="mr-1" />
              Importar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700 mb-1">
              Custo total do frete (R$) *
            </label>
            <input
              type="number"
              id="totalCost"
              className="input-field"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="Ex: 1200"
              step="0.01"
            />
            {result && (
              <p className="text-xs text-gray-500 mt-1">
                Ponto de equilíbrio: R$ {result.breakEvenPoint}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="suggestedMargin" className="block text-sm font-medium text-gray-700 mb-1">
              Margem sugerida do mercado (%)
            </label>
            <input
              type="number"
              id="suggestedMargin"
              className="input-field"
              value={suggestedMargin}
              onChange={(e) => setSuggestedMargin(parseFloat(e.target.value) || 15)}
              placeholder="15"
              min="0"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Baseada no tipo de veículo e distância da rota
            </p>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Valor cobrado do cliente (R$) *
            </label>
            <input
              type="number"
              id="price"
              className="input-field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 1500"
              step="0.01"
            />
            {result && (
              <p className="text-xs text-gray-500 mt-1">
                Índice de rentabilidade: {result.profitabilityIndex}x
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="customMargin" className="block text-sm font-medium text-gray-700 mb-1">
              Margem personalizada (%) - opcional
            </label>
            <input
              type="number"
              id="customMargin"
              className="input-field"
              value={customMargin}
              onChange={(e) => setCustomMargin(e.target.value)}
              placeholder="Ex: 20"
              min="0"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe vazio para usar a margem sugerida do mercado
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateProfit}
          disabled={!totalCost || !price}
        >
          <TrendingUp size={18} className="mr-2" />
          Analisar Viabilidade
        </button>
        
        {result && (
          <button 
            className="btn btn-secondary"
            onClick={exportResults}
          >
            <Download size={18} className="mr-2" />
            Exportar Análise
          </button>
        )}
        
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setTotalCost('');
            setPrice('');
            setCustomMargin('');
            setResult(null);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Análise Completa de Viabilidade</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <ResultBox 
              label="Lucro Líquido" 
              value={`R$ ${result.profit}`}
              className={parseFloat(result.profit) >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}
            />
            <ResultBox 
              label="Margem de Lucro" 
              value={result.marginPercent}
              unit="%"
              className={result.isViable ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}
            />
            <ResultBox 
              label="Preço Sugerido" 
              value={`R$ ${result.suggestedPrice}`}
              tooltip={`Para margem de ${result.targetMargin}%`}
              className="bg-blue-50 border-blue-200"
            />
            <ResultBox 
              label="Status" 
              value={result.isViable ? "VIÁVEL" : "INVIÁVEL"}
              className={result.isViable ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}
            />
          </div>

          <div className={`p-4 rounded-lg flex items-start gap-3 animate-fade-in mb-4 ${
            result.recommendation.type === 'danger' 
              ? "bg-red-50 border border-red-200 text-red-800" 
              : result.recommendation.type === 'warning'
                ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                : "bg-green-50 border border-green-200 text-green-800"
          }`}>
            {result.recommendation.type === 'danger' ? (
              <XCircle className="text-red-500 mt-0.5 shrink-0" size={20} />
            ) : result.recommendation.type === 'warning' ? (
              <AlertTriangle className="text-yellow-500 mt-0.5 shrink-0" size={20} />
            ) : (
              <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={20} />
            )}
            <div className="flex-1">
              <p className="font-medium">{result.recommendation.title}</p>
              <p className="text-sm mt-1">{result.recommendation.message}</p>
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white/50 p-2 rounded border border-current/20">
                  <p className="font-medium">Ponto de Equilíbrio:</p>
                  <p>R$ {result.breakEvenPoint}</p>
                </div>
                <div className="bg-white/50 p-2 rounded border border-current/20">
                  <p className="font-medium">Rentabilidade:</p>
                  <p>{result.profitabilityIndex}x do investimento</p>
                </div>
                <div className="bg-white/50 p-2 rounded border border-current/20">
                  <p className="font-medium">Margem Mínima:</p>
                  <p>{result.minimumMargin}% para viabilidade</p>
                </div>
              </div>
              
              {!result.isViable && (
                <div className="mt-3 p-3 bg-white/50 rounded border border-current/20">
                  <p className="font-medium text-sm">💡 Ações Recomendadas:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• Negociar preço mínimo de <strong>R$ {result.suggestedPrice}</strong></li>
                    <li>• Ou reduzir custos em <strong>R$ {(parseFloat(totalCost) - (parseFloat(price) * (1 - result.minimumMargin / 100))).toFixed(2)}</strong></li>
                    <li>• Avaliar alternativas de rota ou combustível</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
              <p className="font-medium flex items-center">
                <Info size={16} className="mr-2" />
                Indicadores de Performance
              </p>
              <ul className="mt-2 space-y-1">
                <li>• Margem atual: {result.marginPercent}%</li>
                <li>• Margem ideal: {result.targetMargin}%</li>
                <li>• ROI: {((result.profitabilityIndex - 1) * 100).toFixed(1)}%</li>
                <li>• Gap para meta: {(result.targetMargin - parseFloat(result.marginPercent)).toFixed(1)} pontos</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 text-sm">
              <p className="font-medium">📊 Resumo Executivo:</p>
              <p className="mt-1">
                <strong>{result.isViable ? "✅ OPERAÇÃO APROVADA" : "❌ OPERAÇÃO REJEITADA"}</strong>
              </p>
              <p className="mt-1">
                {result.isViable 
                  ? `Lucro de R$ ${result.profit} com margem de ${result.marginPercent}% confirma viabilidade da operação.` 
                  : `Déficit de R$ ${Math.abs(parseFloat(result.profit)).toFixed(2)} torna a operação inviável no cenário atual.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default ProfitSimulator;
