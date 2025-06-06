
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import ResultBox from './ResultBox';
import { RefreshCw, CheckCircle, XCircle, Download, AlertTriangle } from 'lucide-react';
import useSharedData from '@/hooks/useSharedData';
import { formatCurrency } from '@/lib/utils';

interface ProfitSimulatorProps {
  isActive: boolean;
}

const ProfitSimulator = ({ isActive }: ProfitSimulatorProps) => {
  const [totalCost, setTotalCost] = useState('');
  const [price, setPrice] = useState('');
  const [suggestedMargin, setSuggestedMargin] = useState(15);
  const [customMargin, setCustomMargin] = useState('');
  const [result, setResult] = useState<any>(null);
  const [canImportFreight, setCanImportFreight] = useState(false);
  
  const { data } = useSharedData();

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
    const minimumMargin = 10;
    const isViable = marginPercent >= minimumMargin;
    
    setResult({
      profit: profit.toFixed(2),
      marginPercent: marginPercent.toFixed(2),
      isProfit,
      isViable,
      suggestedPrice: suggestedPrice.toFixed(2),
      targetMargin,
      minimumMargin,
      recommendation: getRecommendation(marginPercent, minimumMargin)
    });
  };

  const getRecommendation = (margin: number, minimum: number) => {
    if (margin < 0) {
      return {
        type: 'danger',
        title: 'Operação com prejuízo',
        message: 'Esta operação gerará prejuízo. Renegocie o preço ou reduza custos.'
      };
    } else if (margin < minimum) {
      return {
        type: 'warning',
        title: 'Margem insuficiente',
        message: `Margem abaixo do mínimo recomendado (${minimum}%). Considere aumentar o preço.`
      };
    } else if (margin < 20) {
      return {
        type: 'success',
        title: 'Operação viável',
        message: 'Margem aceitável, mas há espaço para melhorar a rentabilidade.'
      };
    } else {
      return {
        type: 'success',
        title: 'Excelente rentabilidade',
        message: 'Margem muito boa! Operação altamente rentável.'
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
        targetMargin: result.targetMargin
      },
      freightData: data.freightData,
      timestamp: new Date().toISOString(),
      recommendation: result.recommendation
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
      description="Calcule o lucro líquido, margem percentual e viabilidade da operação."
      isActive={isActive}
    >
      {canImportFreight && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">Dados de frete disponíveis</p>
              <p className="text-sm text-blue-600 mt-1">
                Importar dados da última calculadora de frete: {formatCurrency(data.freightData?.totalCost || 0)}
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
              Custo total do frete (R$)
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
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Valor cobrado do cliente (R$)
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
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateProfit}
        >
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Análise de Viabilidade</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <ResultBox 
              label="Lucro Líquido" 
              value={`R$ ${result.profit}`}
              className={result.isProfit ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}
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
          </div>

          <div className={`p-4 rounded-lg flex items-start gap-3 animate-fade-in ${
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
            <div>
              <p className="font-medium">{result.recommendation.title}</p>
              <p className="text-sm mt-1">{result.recommendation.message}</p>
              
              {!result.isViable && (
                <div className="mt-3 p-3 bg-white/50 rounded border border-current/20">
                  <p className="font-medium text-sm">💡 Recomendação:</p>
                  <p className="text-sm mt-1">
                    Para atingir a margem mínima de {result.minimumMargin}%, 
                    cobre pelo menos <strong>R$ {result.suggestedPrice}</strong> ou 
                    reduza os custos em <strong>R$ {(parseFloat(totalCost) - (parseFloat(price) * (1 - result.minimumMargin / 100))).toFixed(2)}</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
            <p className="font-medium">📊 Status da Operação:</p>
            <p className="mt-1">
              <strong>{result.isViable ? "✅ VIÁVEL" : "❌ INVIÁVEL"}</strong> - 
              {result.isViable 
                ? ` Margem de ${result.marginPercent}% está acima do mínimo recomendado.` 
                : ` Margem de ${result.marginPercent}% está abaixo do mínimo de ${result.minimumMargin}%.`}
            </p>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default ProfitSimulator;
