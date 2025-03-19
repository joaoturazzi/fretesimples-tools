
import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import { RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react';

interface FreightViabilityCheckerProps {
  isActive: boolean;
}

const FreightViabilityChecker = ({ isActive }: FreightViabilityCheckerProps) => {
  const [totalCost, setTotalCost] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const checkViability = () => {
    if (!totalCost || !price) return;
    
    const costValue = parseFloat(totalCost);
    const priceValue = parseFloat(price);
    
    const profit = priceValue - costValue;
    const marginPercent = (profit / priceValue) * 100;
    const isViable = profit > 0;
    
    // Suggested minimum price (cost + 20% margin)
    const suggestedPrice = costValue / 0.8;
    
    setResult({
      isViable,
      profit: profit.toFixed(2),
      marginPercent: marginPercent.toFixed(2),
      suggestedPrice: suggestedPrice.toFixed(2),
      priceDifference: (suggestedPrice - priceValue).toFixed(2)
    });
  };
  
  return (
    <Calculator
      id="verificador-viabilidade"
      title="Verificador de Viabilidade de Frete"
      description="Verifique se um frete é viável financeiramente e obtenha sugestões de preço mínimo."
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
          onClick={checkViability}
        >
          Verificar viabilidade
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
          <div 
            className={`p-5 rounded-lg mb-6 flex items-start gap-4 ${
              result.isViable 
                ? "bg-green-50 border border-green-100" 
                : "bg-red-50 border border-red-100"
            }`}
          >
            {result.isViable ? (
              <CheckCircle size={24} className="text-green-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={24} className="text-red-500 shrink-0 mt-0.5" />
            )}
            
            <div>
              <h3 className={`text-lg font-medium ${
                result.isViable ? "text-green-800" : "text-red-800"
              }`}>
                {result.isViable ? "Vale a pena" : "Prejuízo"}
              </h3>
              
              <p className={`mt-1 ${
                result.isViable ? "text-green-700" : "text-red-700"
              }`}>
                {result.isViable 
                  ? `Este frete gera um lucro de R$ ${result.profit} (margem de ${result.marginPercent}%).` 
                  : `Este frete gera um prejuízo de R$ ${Math.abs(parseFloat(result.profit)).toFixed(2)}.`}
              </p>
              
              {!result.isViable && (
                <div className="mt-4">
                  <p className="font-medium text-gray-800">
                    Para uma margem de lucro de 20%, o valor mínimo recomendado seria:
                  </p>
                  <p className="text-lg font-bold mt-1 text-frete-600">
                    R$ {result.suggestedPrice} <span className="text-sm font-normal text-gray-500">(R$ {result.priceDifference} a mais que o valor atual)</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
            <div className="text-blue-800 text-sm">
              <p className="font-medium">Dica profissional:</p>
              <p className="mt-1">
                Para um frete ser considerado viável, ele deve cobrir todos os custos e ainda gerar uma margem de 
                lucro satisfatória (geralmente entre 15% a 30%).
              </p>
            </div>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default FreightViabilityChecker;
