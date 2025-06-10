
import React from 'react';
import { Check } from 'lucide-react';

const ContractFeatures = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
      <h4 className="font-bold text-gray-900 mb-4">Recursos Incluídos</h4>
      
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          <Check size={14} className="text-green-500" />
          Validação automática de CPF/CNPJ
        </li>
        <li className="flex items-center gap-2">
          <Check size={14} className="text-green-500" />
          Templates jurídicos atualizados
        </li>
        <li className="flex items-center gap-2">
          <Check size={14} className="text-green-500" />
          Numeração automática
        </li>
        <li className="flex items-center gap-2">
          <Check size={14} className="text-green-500" />
          PDF profissional com design
        </li>
        <li className="flex items-center gap-2">
          <Check size={14} className="text-green-500" />
          Conformidade com Lei 11.442/07
        </li>
      </ul>
    </div>
  );
};

export default ContractFeatures;
