
import React from 'react';
import { RefreshCw, Phone, CalculatorIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import RiskReportExporter from './RiskReportExporter';
import { RiskFactors } from './intelligentRiskCalculations';
import { generateWhatsAppMessage, openWhatsAppContact } from './WhatsAppContact';

interface RiskActionButtonsProps {
  isFormValid: boolean;
  isCalculating: boolean;
  onCalculateRisk: () => void;
  onReset: () => void;
  result: any;
  factors: RiskFactors;
}

const RiskActionButtons: React.FC<RiskActionButtonsProps> = ({
  isFormValid,
  isCalculating,
  onCalculateRisk,
  onReset,
  result,
  factors
}) => {
  const handleContactSpecialist = () => {
    const message = generateWhatsAppMessage(factors, result);
    openWhatsAppContact(message);
  };

  const handleExportReport = () => {
    if (!result) return;
    console.log('Exporting report with factors:', factors);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button 
        onClick={onCalculateRisk}
        disabled={!isFormValid || isCalculating}
        className={cn(
          "btn btn-primary",
          (!isFormValid || isCalculating) && "opacity-50 cursor-not-allowed",
          isCalculating && "btn-loading"
        )}
      >
        {!isCalculating && <CalculatorIcon size={18} />}
        {isCalculating ? 'Analisando Risco...' : 'Analisar Risco'}
      </button>

      <button 
        onClick={onReset}
        className="btn btn-secondary"
        disabled={isCalculating}
      >
        <RefreshCw size={18} />
        Nova Análise
      </button>

      {result && (
        <RiskReportExporter 
          result={result} 
          factors={factors}
        />
      )}

      {result && (result.riskLevel === 'Alto' || result.riskLevel === 'Crítico') && (
        <button 
          onClick={handleContactSpecialist}
          className="btn btn-warning bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600"
        >
          <Phone size={18} />
          Falar com Especialista
        </button>
      )}
    </div>
  );
};

export default RiskActionButtons;
