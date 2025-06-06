
import React from 'react';
import { CalculatorIcon, RefreshCw, Save } from 'lucide-react';
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
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button 
        onClick={performCalculation}
        className={`btn btn-primary ${isCalculating ? 'btn-loading' : ''}`}
        disabled={isCalculating}
      >
        {!isCalculating && <CalculatorIcon size={18} />}
        Calcular Frete
      </button>

      {result && (
        <button 
          onClick={saveCalculation}
          className="btn btn-success"
        >
          <Save size={18} />
          Salvar Cálculo
        </button>
      )}
      
      <button 
        onClick={resetForm}
        className="btn btn-secondary"
        disabled={isCalculating}
      >
        <RefreshCw size={18} />
        Limpar
      </button>
    </div>
  );
};

export default FreightActionButtons;
