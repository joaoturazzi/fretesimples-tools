
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface ValidationStatusProps {
  validationErrors: { [key: string]: string };
}

const ValidationStatus = ({ validationErrors }: ValidationStatusProps) => {
  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h4 className="font-bold text-gray-900 mb-4">Status de Validação</h4>
      
      <div className="space-y-2">
        {!hasErrors ? (
          <div className="flex items-center gap-2 text-green-600">
            <Check size={16} />
            <span className="text-sm font-medium">Formulário válido</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">
                {Object.keys(validationErrors).length} erro(s) encontrado(s)
              </span>
            </div>
            <ul className="text-xs text-red-600 space-y-1 ml-6">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationStatus;
