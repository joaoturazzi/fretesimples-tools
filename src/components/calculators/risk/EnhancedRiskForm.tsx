
import React, { useState, useEffect } from 'react';
import { MapPin, Package, Clock, Shield, DollarSign, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedRiskFormProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  cargoType: string;
  setCargoType: (value: string) => void;
  cargoValue: string;
  setCargoValue: (value: string) => void;
  contractType: string;
  setContractType: (value: string) => void;
  travelTime: string;
  setTravelTime: (value: string) => void;
  securityTools: string[];
  setSecurityTools: (value: string[]) => void;
  routeDistance: number | null;
  isCalculatingRoute: boolean;
  isFormValid: boolean;
  validationErrors: Record<string, string>;
}

const EnhancedRiskForm: React.FC<EnhancedRiskFormProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  cargoType,
  setCargoType,
  cargoValue,
  setCargoValue,
  contractType,
  setContractType,
  travelTime,
  setTravelTime,
  securityTools,
  setSecurityTools,
  routeDistance,
  isCalculatingRoute,
  isFormValid,
  validationErrors
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  const handleSecurityToolToggle = (tool: string) => {
    if (securityTools.includes(tool)) {
      setSecurityTools(securityTools.filter(t => t !== tool));
    } else {
      setSecurityTools([...securityTools, tool]);
    }
  };

  const securityToolOptions = [
    { id: 'rastreamento', label: 'Rastreamento GPS', description: 'Monitoramento em tempo real' },
    { id: 'isca', label: 'Isca Eletrônica', description: 'Dispositivo de segurança oculto' },
    { id: 'lacre', label: 'Lacre Eletrônico', description: 'Proteção contra violação' },
    { id: 'seguro', label: 'Seguro Especializado', description: 'Cobertura para transporte' },
    { id: 'escolta', label: 'Escolta Armada', description: 'Acompanhamento de segurança' },
    { id: 'comunicacao', label: 'Comunicação 24h', description: 'Central de monitoramento' }
  ];

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

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Alto': return 'bg-red-100 text-red-700';
      case 'Médio': return 'bg-yellow-100 text-yellow-700';
      case 'Baixo': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progresso da Avaliação</span>
          <span className="text-sm text-gray-500">{currentStep}/{totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Informações da Viagem */}
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
              className={cn("input-field", validationErrors.origin && "error")}
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
              className={cn("input-field", validationErrors.destination && "error")}
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
              className={cn("input-field", validationErrors.cargoValue && "error")}
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

      {/* Step 2: Configuração Operacional */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Configuração Operacional</h3>
            <p className="text-sm text-gray-600">Tipo de contratação e horário da viagem</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="calculator-label">
              <Users size={16} className="calculator-label-icon" />
              Tipo de Contratação
            </label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="select-field"
            >
              <option value="frota_propria">Frota Própria</option>
              <option value="agregado">Motorista Agregado</option>
              <option value="terceiro">Terceiro/Aplicativo</option>
            </select>
            <p className="form-helper">
              {contractType === 'frota_propria' && 'Menor risco - Controle total'}
              {contractType === 'agregado' && 'Risco moderado - Motorista conhecido'}
              {contractType === 'terceiro' && 'Maior risco - Motorista desconhecido'}
            </p>
          </div>

          <div>
            <label className="calculator-label">
              <Clock size={16} className="calculator-label-icon" />
              Horário Previsto da Viagem
            </label>
            <select
              value={travelTime}
              onChange={(e) => setTravelTime(e.target.value)}
              className="select-field"
            >
              <option value="manha">Manhã (6h - 12h)</option>
              <option value="tarde">Tarde (12h - 18h)</option>
              <option value="noite">Noite (18h - 24h)</option>
              <option value="madrugada">Madrugada (0h - 6h)</option>
            </select>
            <p className="form-helper">
              {travelTime === 'manha' && 'Horário ideal - Menor risco'}
              {travelTime === 'tarde' && 'Horário seguro - Baixo risco'}
              {travelTime === 'noite' && 'Atenção - Risco moderado'}
              {travelTime === 'madrugada' && 'Alto risco - Não recomendado'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 3: Ferramentas de Segurança */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ferramentas de Segurança</h3>
            <p className="text-sm text-gray-600">Selecione as ferramentas que você utiliza ou pretende utilizar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {securityToolOptions.map((tool) => (
            <label key={tool.id} className={cn(
              "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
              securityTools.includes(tool.id) 
                ? "border-orange-300 bg-orange-50" 
                : "border-gray-200 bg-white hover:border-orange-200"
            )}>
              <input
                type="checkbox"
                checked={securityTools.includes(tool.id)}
                onChange={() => handleSecurityToolToggle(tool.id)}
                className="checkbox-field mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{tool.label}</div>
                <div className="text-xs text-gray-600 mt-1">{tool.description}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4 p-3 bg-orange-100 rounded-lg">
          <p className="text-sm text-orange-700">
            <strong>Ferramentas selecionadas:</strong> {securityTools.length}/6
            {securityTools.length === 0 && ' - Recomendamos pelo menos 2 ferramentas'}
            {securityTools.length < 3 && securityTools.length > 0 && ' - Considere adicionar mais proteções'}
            {securityTools.length >= 3 && ' - Boa cobertura de segurança'}
          </p>
        </div>
      </div>

      {/* Form Status */}
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
    </div>
  );
};

export default EnhancedRiskForm;
