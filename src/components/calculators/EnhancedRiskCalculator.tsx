
import React from 'react';
import Calculator from '@/components/Calculator';
import { useEnhancedRiskCalculator } from './risk/useEnhancedRiskCalculator';
import EnhancedRiskForm from './risk/EnhancedRiskForm';
import IntelligentRiskResults from './risk/IntelligentRiskResults';
import RiskActionButtons from './risk/RiskActionButtons';

interface EnhancedRiskCalculatorProps {
  isActive: boolean;
  onBackToHome?: () => void;
}

const EnhancedRiskCalculator = ({ isActive, onBackToHome }: EnhancedRiskCalculatorProps) => {
  const {
    // Form states
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
    
    // Calculation states
    result,
    routeDistance,
    isCalculatingRoute,
    isCalculating,
    validationErrors,
    isFormValid,
    
    // Actions
    handleCalculateRisk,
    handleReset
  } = useEnhancedRiskCalculator();

  const factors = {
    origin,
    destination,
    cargoType,
    cargoValue: parseFloat(cargoValue) / 100,
    contractType,
    travelTime,
    securityTools,
    routeDistance
  };
  
  return (
    <Calculator
      id="calculadora-risco-inteligente"
      title="Análise Inteligente de Risco de Transporte"
      description="Sistema avançado de avaliação de risco com análise regional, de rota e recomendações personalizadas baseadas em dados reais."
      isActive={isActive}
      onBackToHome={onBackToHome}
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

        <RiskActionButtons
          isFormValid={isFormValid}
          isCalculating={isCalculating}
          onCalculateRisk={handleCalculateRisk}
          onReset={handleReset}
          result={result}
          factors={factors}
        />

        {result && (
          <IntelligentRiskResults
            result={result}
            onExportReport={() => {
              if (!result) return;
              console.log('Exporting report with factors:', factors);
            }}
            onContactSpecialist={() => {
              console.log('Contact specialist clicked');
            }}
          />
        )}
      </div>
    </Calculator>
  );
};

export default EnhancedRiskCalculator;
