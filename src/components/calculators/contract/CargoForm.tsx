
import React from 'react';
import { Package } from 'lucide-react';

interface CargoFormProps {
  cargoDescription: string;
  cargoWeight: number;
  cargoValue: number;
  origin: string;
  destination: string;
  freightValue: number;
  paymentTerms: string;
  deliveryDays: number;
  observations: string;
  onInputChange: (field: string, value: string | number) => void;
  validationErrors: { [key: string]: string };
}

const CargoForm = ({
  cargoDescription,
  cargoWeight,
  cargoValue,
  origin,
  destination,
  freightValue,
  paymentTerms,
  deliveryDays,
  observations,
  onInputChange,
  validationErrors
}: CargoFormProps) => {
  const hasFieldError = (field: string) => !!validationErrors[field];
  const getFieldError = (field: string) => validationErrors[field];

  return (
    <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Package size={20} className="mr-2 text-orange-500" />
        Dados da Carga e Transporte
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="calculator-input-group col-span-full">
          <label className="calculator-label">Descrição da carga *</label>
          <input
            type="text"
            className={`input-field ${hasFieldError('cargoDescription') ? 'border-red-300' : ''}`}
            value={cargoDescription}
            onChange={(e) => onInputChange('cargoDescription', e.target.value)}
            placeholder="Ex: Eletrônicos, móveis, alimentos..."
          />
          {hasFieldError('cargoDescription') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('cargoDescription')}</p>
          )}
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Peso (kg)</label>
          <input
            type="number"
            className="input-field"
            value={cargoWeight || ''}
            onChange={(e) => onInputChange('cargoWeight', parseFloat(e.target.value) || 0)}
            placeholder="1000"
            min="0"
          />
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Valor da carga (R$)</label>
          <input
            type="number"
            className="input-field"
            value={cargoValue || ''}
            onChange={(e) => onInputChange('cargoValue', parseFloat(e.target.value) || 0)}
            placeholder="10000"
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Origem *</label>
          <input
            type="text"
            className={`input-field ${hasFieldError('origin') ? 'border-red-300' : ''}`}
            value={origin}
            onChange={(e) => onInputChange('origin', e.target.value)}
            placeholder="São Paulo, SP"
          />
          {hasFieldError('origin') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('origin')}</p>
          )}
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Destino *</label>
          <input
            type="text"
            className={`input-field ${hasFieldError('destination') ? 'border-red-300' : ''}`}
            value={destination}
            onChange={(e) => onInputChange('destination', e.target.value)}
            placeholder="Rio de Janeiro, RJ"
          />
          {hasFieldError('destination') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('destination')}</p>
          )}
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Valor do frete (R$) *</label>
          <input
            type="number"
            className={`input-field ${hasFieldError('freightValue') ? 'border-red-300' : ''}`}
            value={freightValue || ''}
            onChange={(e) => onInputChange('freightValue', parseFloat(e.target.value) || 0)}
            placeholder="1500"
            min="0"
            step="0.01"
          />
          {hasFieldError('freightValue') && (
            <p className="text-red-600 text-xs mt-1">{getFieldError('freightValue')}</p>
          )}
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Forma de pagamento</label>
          <select
            className="select-field"
            value={paymentTerms}
            onChange={(e) => onInputChange('paymentTerms', e.target.value)}
          >
            <option value="A vista">À vista</option>
            <option value="30 dias">30 dias</option>
            <option value="60 dias">60 dias</option>
            <option value="Na entrega">Na entrega</option>
            <option value="Parcelado">Parcelado</option>
          </select>
        </div>
        
        <div className="calculator-input-group">
          <label className="calculator-label">Prazo de entrega (dias)</label>
          <input
            type="number"
            className="input-field"
            value={deliveryDays || ''}
            onChange={(e) => onInputChange('deliveryDays', parseInt(e.target.value) || 1)}
            placeholder="1"
            min="1"
          />
        </div>
        
        <div className="calculator-input-group col-span-full">
          <label className="calculator-label">Observações adicionais</label>
          <textarea
            className="input-field"
            rows={3}
            value={observations}
            onChange={(e) => onInputChange('observations', e.target.value)}
            placeholder="Informações adicionais, restrições, requisitos especiais..."
          />
        </div>
      </div>
    </div>
  );
};

export default CargoForm;
