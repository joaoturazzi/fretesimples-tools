
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import { RefreshCw, Shield, AlertTriangle, MapPin, FileText, Phone, Download, Star } from 'lucide-react';
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
    if (!result) return;
    
    // Criar um relatório simples em texto
    const reportContent = `
RELATÓRIO DE ANÁLISE DE RISCO
=============================

Data: ${new Date().toLocaleDateString('pt-BR')}

DADOS DA OPERAÇÃO:
- Origem: ${origin}
- Destino: ${destination}
- Distância: ${routeDistance ? routeDistance + ' km' : 'Não calculada'}
- Tipo de carga: ${cargoType}
- Valor da carga: R$ ${parseFloat(cargoValue).toLocaleString('pt-BR')}
- Tipo de contratação: ${contractType}
- Horário da viagem: ${travelTime}
- Tipo de motorista: ${driverType}

RESULTADO DA ANÁLISE:
- Nível de risco: ${result.riskLevel}
- Pontuação: ${result.riskScore}/100
- Fatores de risco:
  * Valor: ${result.valueFactor}
  * Carga: ${result.cargoFactor}
  * Contrato: ${result.contractFactor}
  * Distância: ${result.distanceFactor}
  * Segurança: ${result.toolsFactor}

FERRAMENTAS DE SEGURANÇA UTILIZADAS:
${currentTools.length > 0 ? currentTools.map(tool => `- ${tool}`).join('\n') : '- Nenhuma ferramenta selecionada'}

RECOMENDAÇÕES:
${result.suggestions.map((suggestion: string, index: number) => `${index + 1}. ${suggestion}`).join('\n')}

=============================
Relatório gerado pelo FreteDigital BY CCI
    `.trim();

    // Criar e baixar o arquivo
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-risco-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    { id: 'rastreamento', label: 'Rastreamento GPS', weight: 15 },
    { id: 'isca', label: 'Isca Eletrônica', weight: 12 },
    { id: 'escolta', label: 'Escolta Armada', weight: 20 },
    { id: 'seguro', label: 'Seguro de Carga', weight: 10 },
    { id: 'lacre', label: 'Lacres de Segurança', weight: 8 },
    { id: 'monitoramento', label: 'Monitoramento 24h', weight: 18 },
    { id: 'comunicacao', label: 'Comunicação Constante', weight: 10 }
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

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 50) return 'text-yellow-600';
    if (score <= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const isFormValid = Object.keys(validationErrors).length === 0 && origin && destination && cargoValue;
  
  return (
    <Calculator
      id="calculadora-risco"
      title="Análise de Risco de Transporte"
      description="Avalie o nível de risco da sua operação e receba recomendações personalizadas de segurança baseadas em dados reais."
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

          {isCalculatingRoute && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Calculando rota automaticamente...</strong>
              </p>
            </div>
          )}

          {routeDistance && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-700">
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
              <h3 className="text-lg font-semibold text-gray-900">Ferramentas de Segurança</h3>
              <p className="text-sm text-gray-600">Selecione as ferramentas de segurança que você utiliza</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {securityTools.map((tool) => (
              <label key={tool.id} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer transition-all duration-200 hover:shadow-md">
                <input
                  type="checkbox"
                  checked={currentTools.includes(tool.id)}
                  onChange={(e) => handleToolChange(tool.id, e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{tool.label}</span>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: Math.ceil(tool.weight / 4) }, (_, i) => (
                      <Star key={i} size={12} className="text-orange-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">Peso: {tool.weight}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {currentTools.length > 0 && (
            <div className="mt-4 p-4 bg-green-100 rounded-lg">
              <p className="text-green-700 text-sm font-medium">
                ✅ {currentTools.length} ferramenta(s) de segurança selecionada(s)
              </p>
            </div>
          )}
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
                <Download size={18} />
                Baixar Relatório
              </button>

              <button 
                onClick={contactSpecialist}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Phone size={18} />
                Falar com Especialista
              </button>
            </>
          )}
        </div>

        {/* Resultados - Baseado na imagem fornecida */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Resultado Principal - Inspirado na imagem */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold",
                    result.riskScore <= 30 && "bg-green-500",
                    result.riskScore > 30 && result.riskScore <= 50 && "bg-yellow-500",
                    result.riskScore > 50 && result.riskScore <= 70 && "bg-orange-500",
                    result.riskScore > 70 && "bg-red-500"
                  )}>
                    {result.riskScore}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">Risco {result.riskLevel}</h3>
                    <p className="text-lg text-gray-600">Pontuação: {result.riskScore}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Rota</p>
                  <p className="font-semibold text-gray-900">{routeDistance} km</p>
                </div>
              </div>

              {/* Breakdown por categoria - Como na imagem */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.valueFactor}</div>
                  <div className="text-sm text-gray-500">Valor</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.cargoFactor}</div>
                  <div className="text-sm text-gray-500">Carga</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.contractFactor}</div>
                  <div className="text-sm text-gray-500">Contrato</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.distanceFactor}</div>
                  <div className="text-sm text-gray-500">Distância</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{result.toolsFactor}</div>
                  <div className="text-sm text-gray-500">Segurança</div>
                </div>
              </div>

              {/* Barra de progresso visual */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className={cn(
                    "h-4 rounded-full transition-all duration-500",
                    result.riskScore <= 30 && "bg-green-500",
                    result.riskScore > 30 && result.riskScore <= 50 && "bg-yellow-500",
                    result.riskScore > 50 && result.riskScore <= 70 && "bg-orange-500",
                    result.riskScore > 70 && "bg-red-500"
                  )}
                  style={{ width: `${result.riskScore}%` }}
                ></div>
              </div>
            </div>

            {/* Recomendações Melhoradas */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-orange-500" />
                Recomendações de Segurança
              </h4>
              
              <div className="space-y-3">
                {result.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA para Especialista */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold mb-2">
                    📞 Precisa de uma análise mais detalhada?
                  </h4>
                  <p className="text-green-100">
                    Nossos especialistas podem fazer uma avaliação completa da sua operação
                  </p>
                </div>
                <button 
                  onClick={contactSpecialist}
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2 shadow-lg"
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
