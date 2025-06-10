
import React from 'react';
import { Eye, Download, RefreshCw } from 'lucide-react';

interface ContractActionsProps {
  showPreview: boolean;
  isGenerating: boolean;
  validationErrors: { [key: string]: string };
  onTogglePreview: () => void;
  onGeneratePDF: () => void;
  onResetForm: () => void;
}

const ContractActions = ({
  showPreview,
  isGenerating,
  validationErrors,
  onTogglePreview,
  onGeneratePDF,
  onResetForm
}: ContractActionsProps) => {
  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h4 className="font-bold text-gray-900 mb-4">Ações</h4>
      
      <div className="space-y-3">
        <button
          onClick={onTogglePreview}
          className="btn btn-secondary w-full"
          disabled={hasErrors}
        >
          <Eye size={18} />
          {showPreview ? 'Ocultar Preview' : 'Visualizar Preview'}
        </button>
        
        <button
          onClick={onGeneratePDF}
          className={`btn btn-primary w-full ${isGenerating ? 'btn-loading' : ''}`}
          disabled={isGenerating || hasErrors}
        >
          {!isGenerating && <Download size={18} />}
          {isGenerating ? 'Gerando...' : 'Gerar Contrato PDF'}
        </button>
        
        <button
          onClick={onResetForm}
          className="btn btn-secondary w-full"
          disabled={isGenerating}
        >
          <RefreshCw size={18} />
          Limpar Formulário
        </button>
      </div>
    </div>
  );
};

export default ContractActions;
