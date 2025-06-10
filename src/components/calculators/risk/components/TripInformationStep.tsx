
import React from 'react';
import { MapPin, Package, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripInformationStepProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  cargoType: string;
  setCargoType: (value: string) => void;
  cargoValue: string;
  setCargoValue: (value: string) => void;
  routeDistance: number | null;
  isCalculatingRoute: boolean;
  validationErrors: Record<string, string>;
}

const cargoOptions = [
  { value: 'eletronicos', label: 'Eletrônicos', risk: 'Alto' },
  { value: 'medicamentos', label: 'Medicamentos', risk: 'Alto' },
  { value: 'combustivel', label: 'Combustível', risk: 'Alto' },
  { value: 'alimentos', label: 'Alimentos', risk: 'Médio' },
  { value: 'bebidas', label: 'Bebidas', risk: 'Médio' },
  { value: 'automoveis', label: 'Automóveis/Peças', risk: 'Médio' },
  { value: 'vestuario', label: 'Vestuário', risk: 'Baixo' },
  { value: 'moveis', label: 'Móveis', risk: 'Baixo' },
  { value: 'outros', label: 'Outros', risk: 'Médio' }
];

const TripInformationStep: React.FC<TripInformationStepProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  cargoType,
  setCargoType,
  cargoValue,
  setCargoValue,
  routeDistance,
  isCalculatingRoute,
  validationErrors
}) => {
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseInt(numericValue) / 100);
    return formattedValue;
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue.length <= 10) { // Limite de R$ 99.999.999,99
      setCargoValue(rawValue);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Alto': return 'bg-red-100 text-red-700';
      case 'Médio': return 'bg-yellow-100 text-yellow-700';
      case 'Baixo': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <MapPin size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Informações da Viagem</h3>
          <p className="text-sm text-gray-600">Defina origem, destino e características da carga</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="calculator-label">
            <MapPin size={16} className="calculator-label-icon" />
            Origem (Cidade/Estado)
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className={cn("input-field", !!validationErrors.origin && "error")}
            placeholder="Ex: São Paulo, SP"
          />
          {validationErrors.origin && (
            <p className="form-error flex items-center gap-1 mt-1">
              <AlertTriangle size={12} />
              {validationErrors.origin}
            </p>
          )}
        </div>

        <div>
          <label className="calculator-label">
            <MapPin size={16} className="calculator-label-icon" />
            Destino (Cidade/Estado)
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={cn("input-field", !!validationErrors.destination && "error")}
            placeholder="Ex: Rio de Janeiro, RJ"
          />
          {validationErrors.destination && (
            <p className="form-error flex items-center gap-1 mt-1">
              <AlertTriangle size={12} />
              {validationErrors.destination}
            </p>
          )}
        </div>
      </div>

      {routeDistance && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <CheckCircle size={16} />
            <strong>Rota identificada:</strong> {routeDistance} km
            {isCalculatingRoute && <span className="text-blue-500">(Recalculando...)</span>}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="calculator-label">
            <Package size={16} className="calculator-label-icon" />
            Tipo de Carga
          </label>
          <select
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value)}
            className="select-field"
          >
            {cargoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="mt-2">
            {cargoOptions.find(opt => opt.value === cargoType) && (
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                getRiskBadgeColor(cargoOptions.find(opt => opt.value === cargoType)?.risk || 'Médio')
              )}>
                Risco: {cargoOptions.find(opt => opt.value === cargoType)?.risk}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="calculator-label">
            <DollarSign size={16} className="calculator-label-icon" />
            Valor da Carga
          </label>
          <input
            type="text"
            value={cargoValue ? formatCurrency(cargoValue) : ''}
            onChange={handleCurrencyChange}
            className={cn("input-field", !!validationErrors.cargoValue && "error")}
            placeholder="R$ 0,00"
          />
          {validationErrors.cargoValue && (
            <p className="form-error flex items-center gap-1 mt-1">
              <AlertTriangle size={12} />
              {validationErrors.cargoValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripInformationStep;
