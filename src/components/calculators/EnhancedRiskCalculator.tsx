
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import { RefreshCw, Shield, Phone, CalculatorIcon } from 'lucide-react';
import { mapService } from '@/services/map/UnifiedMapService';
import { calculateIntelligentRisk, RiskFactors } from './risk/intelligentRiskCalculations';
import EnhancedRiskForm from './risk/EnhancedRiskForm';
import IntelligentRiskResults from './risk/IntelligentRiskResults';
import RiskReportExporter from './risk/RiskReportExporter';
import { cn } from '@/lib/utils';

interface EnhancedRiskCalculatorProps {
  isActive: boolean;
}

const EnhancedRiskCalculator = ({ isActive }: EnhancedRiskCalculatorProps) => {
  // Form states
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoType, setCargoType] = useState('alimentos');
  const [cargoValue, setCargoValue] = useState('');
  const [contractType, setContractType] = useState('frota_propria');
  const [travelTime, setTravelTime] = useState('manha');
  const [securityTools, setSecurityTools] = useState<string[]>([]);
  
  // Calculation states
  const [result, setResult] = useState<any>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Auto-calculate route distance
  useEffect(() => {
    const autoCalculateRoute = async () => {
      if (origin.trim() && destination.trim() && origin !== destination) {
        setIsCalculatingRoute(true);
        
        try {
          const route = await mapService.calculateRoute(origin, destination);
          if (route) {
            setRouteDistance(route.distance);
            console.log('Enhanced Risk - Auto-calculated distance:', route.distance, 'km');
          }
        } catch (error) {
          console.error('Enhanced Risk - Error auto-calculating distance:', error);
        } finally {
          setIsCalculatingRoute(false);
        }
      }
    };

    const timeoutId = setTimeout(autoCalculateRoute, 1000);
    return () => clearTimeout(timeoutId);
  }, [origin, destination]);

  // Real-time validation
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    if (!origin.trim()) errors.origin = 'Origem é obrigatória';
    if (!destination.trim()) errors.destination = 'Destino é obrigatório';
    if (!cargoValue || parseFloat(cargoValue) <= 0) {
      errors.cargoValue = 'Valor da carga deve ser maior que 0';
    }
    
    setValidationErrors(errors);
  }, [origin, destination, cargoValue]);

  const handleCalculateRisk = async () => {
    if (Object.keys(validationErrors).length > 0) return;
    
    setIsCalculating(true);
    
    try {
      // Convert cargoValue from cents to reais
      const cargoValueInReais = parseFloat(cargoValue) / 100;
      
      const factors: RiskFactors = {
        origin,
        destination,
        cargoType,
        cargoValue: cargoValueInReais,
        contractType,
        travelTime,
        securityTools,
        routeDistance
      };
      
      const riskResult = calculateIntelligentRisk(factors);
      setResult(riskResult);
      
      console.log('Risk calculation completed:', riskResult);
    } catch (error) {
      console.error('Error calculating risk:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setOrigin('');
    setDestination('');
    setCargoType('alimentos');
    setCargoValue('');
    setContractType('frota_propria');
    setTravelTime('manha');
    setSecurityTools([]);
    setResult(null);
    setRouteDistance(null);
  };

  const handleExportReport = () => {
    if (!result) return;
    
    // The RiskReportExporter component will handle the export
    const factors: RiskFactors = {
      origin,
      destination,
      cargoType,
      cargoValue: parseFloat(cargoValue) / 100,
      contractType,
      travelTime,
      securityTools,
      routeDistance
    };
    
    // This would be handled by the RiskReportExporter component
    console.log('Exporting report with factors:', factors);
  };

  const handleContactSpecialist = () => {
    const message = `Olá! Preciso de uma análise completa de risco para transporte.%0A%0A` +
      `📍 *Dados da Operação:*%0A` +
      `• Origem: ${origin}%0A` +
      `• Destino: ${destination}%0A` +
      `• Distância: ${routeDistance ? routeDistance + ' km' : 'Não calculada'}%0A` +
      `• Tipo de carga: ${cargoType}%0A` +
      `• Valor da carga: R$ ${cargoValue ? (parseFloat(cargoValue) / 100).toLocaleString('pt-BR') : '0'}%0A` +
      `• Contratação: ${contractType}%0A` +
      `• Horário: ${travelTime}%0A%0A` +
      `⚠️ *Resultado da Análise:*%0A` +
      `• Nível de risco: ${result?.riskLevel || 'Não calculado'}%0A` +
      `• Pontuação: ${result?.totalScore || 0} pontos%0A` +
      `• Índice de segurança: ${result?.safetyScore || 0}%%0A%0A` +
      `Gostaria de uma consulta especializada para otimizar a segurança desta operação.`;
    
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const isFormValid = Object.keys(validationErrors).length === 0 && origin && destination && cargoValue;
  
  return (
    <Calculator
      id="calculadora-risco-inteligente"
      title="Análise Inteligente de Risco de Transporte"
      description="Sistema avançado de avaliação de risco com análise regional, de rota e recomendações personalizadas baseadas em dados reais."
      isActive={isActive}
    >
      <div className="space-y-6">
        <EnhancedRiskForm
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          cargoType={cargoType}
          setCargoType={setCargoType}
          cargoValue={cargoValue}
          setCargoValue={setCargoValue}
          contractType={contractType}
          setContractType={setContractType}
          travelTime={travelTime}
          setTravelTime={setTravelTime}
          securityTools={securityTools}
          setSecurityTools={setSecurityTools}
          routeDistance={routeDistance}
          isCalculatingRoute={isCalculatingRoute}
          isFormValid={isFormValid}
          validationErrors={validationErrors}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleCalculateRisk}
            disabled={!isFormValid || isCalculating}
            className={cn(
              "btn btn-primary",
              (!isFormValid || isCalculating) && "opacity-50 cursor-not-allowed",
              isCalculating && "btn-loading"
            )}
          >
            {!isCalculating && <CalculatorIcon size={18} />}
            {isCalculating ? 'Analisando Risco...' : 'Analisar Risco'}
          </button>

          <button 
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={isCalculating}
          >
            <RefreshCw size={18} />
            Nova Análise
          </button>

          {result && (
            <RiskReportExporter 
              result={result} 
              factors={{
                origin,
                destination,
                cargoType,
                cargoValue: parseFloat(cargoValue) / 100,
                contractType,
                travelTime,
                securityTools,
                routeDistance
              }}
            />
          )}

          {result && (result.riskLevel === 'Alto' || result.riskLevel === 'Crítico') && (
            <button 
              onClick={handleContactSpecialist}
              className="btn btn-warning bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600"
            >
              <Phone size={18} />
              Falar com Especialista
            </button>
          )}
        </div>

        {/* Results */}
        {result && (
          <IntelligentRiskResults
            result={result}
            onExportReport={handleExportReport}
            onContactSpecialist={handleContactSpecialist}
          />
        )}
      </div>
    </Calculator>
  );
};

export default EnhancedRiskCalculator;
