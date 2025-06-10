
import React from 'react';
import { User } from 'lucide-react';

interface ContractorFormProps {
  contractorName: string;
  contractorDoc: string;
  contractorAddress: string;
  contractorPhone: string;
  contractorEmail: string;
  onInputChange: (field: string, value: string) => void;
  validationErrors: { [key: string]: string };
  formatDocument: (doc: string) => string;
}

const ContractorForm = ({
  contractorName,
  contractorDoc,
  contractorAddress,
  contractorPhone,
  contractorEmail,
  onInputChange,
  validationErrors,
  formatDocument
}: ContractorFormProps) => {
  const hasFieldError = (field: string) => !!validationErrors[field];
  const getFieldError = (field: string) => validationErrors[field];

  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <User size={20} className="mr-2 text-blue-500" />
        Dados do Contratante (Embarcador)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="calculator-input-group">
          <label className="calculator-label">Nome/Razão Social *</label>
          <input
            type="text"
            className={`input-field ${hasFieldError('contractorName') ? 'border-red-300' : ''}`}
            value={contractorName}
            onChange={(e) => onInputChange('contractorName', e.target.value)}
            placeholder="Nome completo ou razão social"
          />
          {hasFieldError('contractorName') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('contractorName')}</p>
          )}
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">CPF/CNPJ *</label>
          <input
            type="text"
            className={`input-field ${hasFieldError('contractorDoc') ? 'border-red-300' : ''}`}
            value={contractorDoc}
            onChange={(e) => onInputChange('contractorDoc', formatDocument(e.target.value))}
            placeholder="000.000.000-00 ou 00.000.000/0001-00"
            maxLength={18}
          />
          {hasFieldError('contractorDoc') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('contractorDoc')}</p>
          )}
        </div>
        
        <div className="calculator-input-group col-span-full">
          <label className="calculator-label">Endereço completo</label>
          <input
            type="text"
            className="input-field"
            value={contractorAddress}
            onChange={(e) => onInputChange('contractorAddress', e.target.value)}
            placeholder="Rua, número, bairro, cidade, estado, CEP"
          />
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Telefone</label>
          <input
            type="text"
            className="input-field"
            value={contractorPhone}
            onChange={(e) => onInputChange('contractorPhone', e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">E-mail</label>
          <input
            type="email"
            className={`input-field ${hasFieldError('contractorEmail') ? 'border-red-300' : ''}`}
            value={contractorEmail}
            onChange={(e) => onInputChange('contractorEmail', e.target.value)}
            placeholder="email@exemplo.com"
          />
          {hasFieldError('contractorEmail') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('contractorEmail')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorForm;
