
import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStatusProps {
  isFormValid: boolean;
  validationErrors: Record<string, string>;
}

const FormStatus: React.FC<FormStatusProps> = ({
  isFormValid,
  validationErrors
}) => {
  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all duration-200",
      isFormValid 
        ? "bg-green-50 border-green-200 text-green-700"
        : "bg-yellow-50 border-yellow-200 text-yellow-700"
    )}>
      <div className="flex items-center gap-2">
        {isFormValid ? (
          <>
            <CheckCircle size={16} className="text-green-500" />
            <span className="font-medium">Formulário completo - Pronto para análise</span>
          </>
        ) : (
          <>
            <AlertTriangle size={16} className="text-yellow-500" />
            <span className="font-medium">
              Complete os campos obrigatórios para prosseguir ({Object.keys(validationErrors).length} pendente{Object.keys(validationErrors).length > 1 ? 's' : ''})
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default FormStatus;
