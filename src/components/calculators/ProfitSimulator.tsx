
import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import ResultBox from './ResultBox';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface ProfitSimulatorProps {
  isActive: boolean;
}

const ProfitSimulator = ({ isActive }: ProfitSimulatorProps) => {
  const [totalCost, setTotalCost] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const calculateProfit = () => {
    if (!totalCost || !price) return;
    
    const costValue = parseFloat(totalCost);
    const priceValue = parseFloat(price);
    
    const profit = priceValue - costValue;
    const marginPercent = (profit / priceValue) * 100;
    
    setResult({
      profit: profit.toFixed(2),
      marginPercent: marginPercent.toFixed(2),
      isProfit: profit > 0
    });
  };
  
  return (
    <Calculator
      id="simulador-lucro"
      title="Simulador de Lucro por Frete"
      description="Calcule o lucro líquido e a margem percentual com base no valor cobrado e nos custos."
      isActive={isActive}
    >
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
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateProfit}
        >
          Calcular
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setTotalCost('');
            setPrice('');
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
              label="Lucro Líquido" 
              value={`R$ ${result.profit}`}
              className={result.isProfit ? "bg-green-50" : "bg-red-50"}
            />
            <ResultBox 
              label="Margem de Lucro" 
              value={result.marginPercent}
              unit="%"
              className={result.isProfit ? "bg-green-50" : "bg-red-50"}
            />
          </div>
          
          <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 animate-fade-in ${result.isProfit ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {result.isProfit ? (
              <CheckCircle className="text-green-500 mt-0.5" size={20} />
            ) : (
              <XCircle className="text-red-500 mt-0.5" size={20} />
            )}
            <div>
              <p className="font-medium">
                {result.isProfit 
                  ? "Operação com lucro" 
                  : "Operação com prejuízo"}
              </p>
              <p className="text-sm mt-1">
                {result.isProfit 
                  ? `Você está tendo um lucro de R$ ${result.profit} (${result.marginPercent}%) neste frete.` 
                  : `Você está tendo um prejuízo de R$ ${Math.abs(parseFloat(result.profit)).toFixed(2)} neste frete. Considere renegociar o valor ou reduzir custos.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default ProfitSimulator;
