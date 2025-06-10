
import React from 'react';
import { Truck } from 'lucide-react';

interface ContracteeFormProps {
  contracteeName: string;
  contracteeDoc: string;
  contracteeAddress: string;
  contracteePhone: string;
  contracteeEmail: string;
  onInputChange: (field: string, value: string) => void;
  validationErrors: { [key: string]: string };
  formatDocument: (doc: string) => string;
}

const ContracteeForm = ({
  contracteeName,
  contracteeDoc,
  contracteeAddress,
  contracteePhone,
  contracteeEmail,
  onInputChange,
  validationErrors,
  formatDocument
}: ContracteeFormProps) => {
  const hasFieldError = (field: string) => !!validationErrors[field];
  const getFieldError = (field: string) => validationErrors[field];

  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Truck size={20} className="mr-2 text-green-500" />
        Dados do Contratado (Transportador)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="calculator-input-group">
          <label className="calculator-label">Nome/Razão Social *</label>
          <input
            type="text"
            className={`input-field ${hasFieldError('contracteeName') ? 'border-red-300' : ''}`}
            value={contracteeName}
            onChange={(e) => onInputChange('contracteeName', e.target.value)}
            placeholder="Nome completo ou razão social"
          />
          {hasFieldError('contracteeName') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('contracteeName')}</p>
          )}
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">CPF/CNPJ *</label>
          <input
            type="text"
            className={`input-field ${hasFieldError('contracteeDoc') ? 'border-red-300' : ''}`}
            value={contracteeDoc}
            onChange={(e) => onInputChange('contracteeDoc', formatDocument(e.target.value))}
            placeholder="000.000.000-00 ou 00.000.000/0001-00"
            maxLength={18}
          />
          {hasFieldError('contracteeDoc') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('contracteeDoc')}</p>
          )}
        </div>
        
        <div className="calculator-input-group col-span-full">
          <label className="calculator-label">Endereço completo</label>
          <input
            type="text"
            className="input-field"
            value={contracteeAddress}
            onChange={(e) => onInputChange('contracteeAddress', e.target.value)}
            placeholder="Rua, número, bairro, cidade, estado, CEP"
          />
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Telefone</label>
          <input
            type="text"
            className="input-field"
            value={contracteePhone}
            onChange={(e) => onInputChange('contracteePhone', e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">E-mail</label>
          <input
            type="email"
            className={`input-field ${hasFieldError('contracteeEmail') ? 'border-red-300' : ''}`}
            value={contracteeEmail}
            onChange={(e) => onInputChange('contracteeEmail', e.target.value)}
            placeholder="email@exemplo.com"
          />
          {hasFieldError('contracteeEmail') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('contracteeEmail')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContracteeForm;
