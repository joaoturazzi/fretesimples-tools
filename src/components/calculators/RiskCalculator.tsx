
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import { RefreshCw, Shield, AlertTriangle, MapPin, FileText, Phone } from 'lucide-react';
import { mapService } from '@/services/map/UnifiedMapService';
import { calculateRisk } from './risk/riskCalculations';
import { cn } from '@/lib/utils';

interface RiskCalculatorProps {
  isActive: boolean;
}

const RiskCalculator = ({ isActive }: RiskCalculatorProps) => {
  // Estados básicos
  const [cargoType, setCargoType] = useState('alimentos');
  const [cargoValue, setCargoValue] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [contractType, setContractType] = useState('frota_propria');
  const [currentTools, setCurrentTools] = useState<string[]>([]);
  const [travelTime, setTravelTime] = useState('diurno');
  const [driverType, setDriverType] = useState('proprio');
  
  // Estados de cálculo
  const [result, setResult] = useState<any>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ lat: number; lng: number }>>([]);
  const [routeDuration, setRouteDuration] = useState<number | undefined>(undefined);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Auto-cálculo de rota
  useEffect(() => {
    const autoCalculateRoute = async () => {
      if (origin.trim() && destination.trim() && origin !== destination) {
        setIsCalculatingRoute(true);
        
        try {
          const route = await mapService.calculateRoute(origin, destination);
          if (route) {
            setRouteDistance(route.distance);
            setRouteDuration(route.duration);
            setRouteCoordinates(route.route.geometry);
            console.log('Risk calculator - Auto-calculated distance:', route.distance, 'km');
          }
        } catch (error) {
          console.error('Risk calculator - Error auto-calculating distance:', error);
        } finally {
          setIsCalculatingRoute(false);
        }
      }
    };

    const timeoutId = setTimeout(autoCalculateRoute, 1000);
    return () => clearTimeout(timeoutId);
  }, [origin, destination]);

  // Validação em tempo real
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    if (!origin.trim()) errors.origin = 'Origem é obrigatória';
    if (!destination.trim()) errors.destination = 'Destino é obrigatório';
    if (!cargoValue || parseFloat(cargoValue) <= 0) errors.cargoValue = 'Valor da carga deve ser maior que 0';
    
    setValidationErrors(errors);
  }, [origin, destination, cargoValue]);

  const handleToolChange = (tool: string, checked: boolean) => {
    if (checked) {
      setCurrentTools(prev => [...prev, tool]);
    } else {
      setCurrentTools(prev => prev.filter(t => t !== tool));
    }
  };

  const handleCalculateRisk = () => {
    if (Object.keys(validationErrors).length > 0) return;
    
    const riskResult = calculateRisk({
      cargoType,
      cargoValue: parseFloat(cargoValue),
      contractType,
      routeDistance,
      currentTools: currentTools.join(', '),
      travelTime,
      driverType
    });
    
    setResult(riskResult);
  };

  const handleReset = () => {
    setCargoType('alimentos');
    setCargoValue('');
    setOrigin('');
    setDestination('');
    setContractType('frota_propria');
    setCurrentTools([]);
    setTravelTime('diurno');
    setDriverType('proprio');
    setResult(null);
    setRouteDistance(null);
    setRouteCoordinates([]);
    setRouteDuration(undefined);
  };

  const generateReport = () => {
    // Implementar geração de PDF
    alert('Funcionalidade de relatório em desenvolvimento');
  };

  const contactSpecialist = () => {
    const message = `Olá! Gostaria de uma análise completa de risco para transporte.%0A%0A` +
      `Dados da operação:%0A` +
      `• Origem: ${origin}%0A` +
      `• Destino: ${destination}%0A` +
      `• Distância: ${routeDistance ? routeDistance + ' km' : 'Não calculada'}%0A` +
      `• Tipo de carga: ${cargoType}%0A` +
      `• Valor da carga: R$ ${cargoValue}%0A` +
      `• Nível de risco: ${result?.riskLevel || 'Não calculado'}`;
    
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const securityTools = [
    { id: 'rastreamento', label: 'Rastreamento GPS' },
    { id: 'isca', label: 'Isca Eletrônica' },
    { id: 'escolta', label: 'Escolta Armada' },
    { id: 'seguro', label: 'Seguro de Carga' },
    { id: 'lacre', label: 'Lacres de Segurança' },
    { id: 'monitoramento', label: 'Monitoramento 24h' },
    { id: 'comunicacao', label: 'Comunicação Constante' }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Baixo': return 'green';
      case 'Médio': return 'yellow';
      case 'Alto': return 'orange';
      case 'Crítico': return 'red';
      default: return 'gray';
    }
  };

  const isFormValid = Object.keys(validationErrors).length === 0 && origin && destination && cargoValue;
  
  return (
    <Calculator
      id="calculadora-risco"
      title="Análise de Risco de Transporte"
      description="Avalie o nível de risco da sua operação e receba recomendações personalizadas de segurança."
      isActive={isActive}
    >
      <div className="space-y-6">
        {/* Informações da Viagem */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <MapPin size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Informações da Viagem</h3>
              <p className="text-sm text-gray-600">Rota, carga e características da operação</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="calculator-label">
                <MapPin size={16} className="calculator-label-icon" />
                Origem
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className={cn("input-field", validationErrors.origin && "error")}
                placeholder="Ex: São Paulo, SP"
              />
              {validationErrors.origin && (
                <p className="form-error">{validationErrors.origin}</p>
              )}
            </div>

            <div>
              <label className="calculator-label">
                <MapPin size={16} className="calculator-label-icon" />
                Destino
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={cn("input-field", validationErrors.destination && "error")}
                placeholder="Ex: Rio de Janeiro, RJ"
              />
              {validationErrors.destination && (
                <p className="form-error">{validationErrors.destination}</p>
              )}
            </div>
          </div>

          {routeDistance && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Distância calculada:</strong> {routeDistance} km
                {routeDuration && ` • Duração estimada: ${Math.round(routeDuration / 60)}h`}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="calculator-label">Tipo de Carga</label>
              <select
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                className="select-field"
              >
                <option value="alimentos">Alimentos</option>
                <option value="eletronicos">Eletrônicos</option>
                <option value="medicamentos">Medicamentos</option>
                <option value="vestuario">Vestuário</option>
                <option value="moveis">Móveis</option>
                <option value="automoveis">Automóveis</option>
                <option value="combustivel">Combustível</option>
                <option value="quimicos">Químicos</option>
                <option value="carga_perigosa">Carga Perigosa</option>
                <option value="joias">Joias/Valores</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="calculator-label">Valor da Carga (R$)</label>
              <input
                type="number"
                value={cargoValue}
                onChange={(e) => setCargoValue(e.target.value)}
                className={cn("input-field", validationErrors.cargoValue && "error")}
                placeholder="Ex: 50000"
                min="0"
                step="0.01"
              />
              {validationErrors.cargoValue && (
                <p className="form-error">{validationErrors.cargoValue}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="calculator-label">Tipo de Contratação</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="select-field"
              >
                <option value="frota_propria">Frota Própria</option>
                <option value="agregado">Motorista Agregado</option>
                <option value="terceiro">Transportadora Terceira</option>
              </select>
            </div>

            <div>
              <label className="calculator-label">Horário da Viagem</label>
              <select
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                className="select-field"
              >
                <option value="diurno">Diurno (6h-18h)</option>
                <option value="noturno">Noturno (18h-6h)</option>
                <option value="madrugada">Madrugada (0h-6h)</option>
              </select>
            </div>

            <div>
              <label className="calculator-label">Tipo de Motorista</label>
              <select
                value={driverType}
                onChange={(e) => setDriverType(e.target.value)}
                className="select-field"
              >
                <option value="proprio">Motorista Próprio</option>
                <option value="agregado">Motorista Agregado</option>
                <option value="aplicativo">Motorista de Aplicativo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Segurança Operacional */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Segurança Operacional</h3>
              <p className="text-sm text-gray-600">Ferramentas e recursos de segurança utilizados</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {securityTools.map((tool) => (
              <label key={tool.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={currentTools.includes(tool.id)}
                  onChange={(e) => handleToolChange(tool.id, e.target.checked)}
                  className="checkbox-field"
                />
                <span className="text-sm font-medium text-gray-700">{tool.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleCalculateRisk}
            disabled={!isFormValid}
            className={cn(
              "btn btn-primary",
              !isFormValid && "opacity-50 cursor-not-allowed"
            )}
          >
            <Shield size={18} />
            Analisar Risco
          </button>

          <button 
            onClick={handleReset}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} />
            Limpar
          </button>

          {result && (
            <>
              <button 
                onClick={generateReport}
                className="btn btn-ghost"
              >
                <FileText size={18} />
                Gerar Relatório
              </button>

              <button 
                onClick={contactSpecialist}
                className="btn-warning bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 hover:from-yellow-600 hover:to-orange-600"
              >
                <Phone size={18} />
                Falar com Especialista
              </button>
            </>
          )}
        </div>

        {/* Resultados */}
        {result && (
          <div className="space-y-6">
            {/* Resultado Principal */}
            <div className={cn(
              "rounded-xl p-6 border-2",
              result.riskColor === 'green' && "bg-green-50 border-green-200",
              result.riskColor === 'yellow' && "bg-yellow-50 border-yellow-200",
              result.riskColor === 'red' && "bg-red-50 border-red-200"
            )}>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center",
                  result.riskColor === 'green' && "bg-green-500",
                  result.riskColor === 'yellow' && "bg-yellow-500",
                  result.riskColor === 'red' && "bg-red-500"
                )}>
                  <AlertTriangle size={28} className="text-white" />
                </div>
                <div>
                  <h3 className={cn(
                    "text-2xl font-bold",
                    result.riskColor === 'green' && "text-green-700",
                    result.riskColor === 'yellow' && "text-yellow-700",
                    result.riskColor === 'red' && "text-red-700"
                  )}>
                    Risco {result.riskLevel}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    result.riskColor === 'green' && "text-green-600",
                    result.riskColor === 'yellow' && "text-yellow-600",
                    result.riskColor === 'red' && "text-red-600"
                  )}>
                    Pontuação: {result.riskScore}/100
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-700">Valor</div>
                  <div className="text-lg font-bold text-gray-900">{result.valueFactor}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-700">Carga</div>
                  <div className="text-lg font-bold text-gray-900">{result.cargoFactor}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-700">Contrato</div>
                  <div className="text-lg font-bold text-gray-900">{result.contractFactor}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-700">Distância</div>
                  <div className="text-lg font-bold text-gray-900">{result.distanceFactor}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-700">Segurança</div>
                  <div className="text-lg font-bold text-gray-900">{result.toolsFactor}</div>
                </div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-orange-500" />
                Recomendações de Segurança
              </h4>
              
              <div className="space-y-3">
                {result.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA para Especialista */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold mb-2">
                    Quer uma análise de risco completa?
                  </h4>
                  <p className="text-orange-100">
                    Nossos especialistas podem fazer uma avaliação detalhada da sua operação
                  </p>
                </div>
                <button 
                  onClick={contactSpecialist}
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2"
                >
                  <Phone size={18} />
                  Falar Agora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Calculator>
  );
};

export default RiskCalculator;
