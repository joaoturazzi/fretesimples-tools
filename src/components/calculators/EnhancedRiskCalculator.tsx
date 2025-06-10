
import React from 'react';
import Calculator from '@/components/Calculator';
import { useEnhancedRiskCalculator } from './risk/useEnhancedRiskCalculator';
import EnhancedRiskForm from './risk/EnhancedRiskForm';
import IntelligentRiskResults from './risk/IntelligentRiskResults';
import RiskActionButtons from './risk/RiskActionButtons';
import { generateWhatsAppMessage, openWhatsAppContact } from './risk/WhatsAppContact';

interface EnhancedRiskCalculatorProps {
  isActive: boolean;
}

const EnhancedRiskCalculator = ({ isActive }: EnhancedRiskCalculatorProps) => {
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

  const handleExportReport = () => {
    if (!result) return;
    
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
    
    console.log('Exporting report with factors:', factors);
  };

  const handleContactSpecialist = () => {
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
    
    const message = generateWhatsAppMessage(factors, result);
    openWhatsAppContact(message);
  };

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
            onExportReport={handleExportReport}
            onContactSpecialist={handleContactSpecialist}
          />
        )}
      </div>
    </Calculator>
  );
};

export default EnhancedRiskCalculator;
