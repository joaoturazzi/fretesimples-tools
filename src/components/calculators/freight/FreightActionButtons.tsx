
import React from 'react';
import { CalculatorIcon, RefreshCw, Save, TrendingUp } from 'lucide-react';
import { FreightCalculationResult } from './freightCalculations';

interface FreightActionButtonsProps {
  performCalculation: () => void;
  resetForm: () => void;
  saveCalculation: () => void;
  isCalculating: boolean;
  result: FreightCalculationResult | null;
}

const FreightActionButtons: React.FC<FreightActionButtonsProps> = ({
  performCalculation,
  resetForm,
  saveCalculation,
  isCalculating,
  result
}) => {
  const handleSimulateProfitClick = () => {
    const event = new CustomEvent('navigate-section', { detail: 'simulador-lucro' });
    document.dispatchEvent(event);
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      <button 
        onClick={performCalculation}
        className={`btn btn-primary ${isCalculating ? 'btn-loading' : ''}`}
        disabled={isCalculating}
      >
        {!isCalculating && <CalculatorIcon size={18} />}
        {isCalculating ? 'Calculando...' : 'Calcular Frete'}
      </button>

      {result && (
        <>
          <button 
            onClick={saveCalculation}
            className="btn btn-success"
          >
            <Save size={18} />
            Salvar Cálculo
          </button>

          <button 
            onClick={handleSimulateProfitClick}
            className="btn-secondary bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 hover:from-purple-600 hover:to-indigo-700"
          >
            <TrendingUp size={18} />
            Simular Lucro
          </button>
        </>
      )}
      
      <button 
        onClick={resetForm}
        className="btn btn-ghost"
        disabled={isCalculating}
      >
        <RefreshCw size={18} />
        Limpar
      </button>
    </div>
  );
};

export default FreightActionButtons;
