
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import RiskForm from './risk/RiskForm';
import RiskMap from './risk/RiskMap';
import RiskResults from './risk/RiskResults';
import RiskExport from './risk/RiskExport';
import { RefreshCw } from 'lucide-react';
import { HereMapsService } from '@/services/hereMapsService';
import { calculateRisk } from './risk/riskCalculations';

interface RiskCalculatorProps {
  isActive: boolean;
}

const RiskCalculator = ({ isActive }: RiskCalculatorProps) => {
  const [cargoType, setCargoType] = useState('alimentos');
  const [cargoValue, setCargoValue] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [contractType, setContractType] = useState('frota_propria');
  const [currentTools, setCurrentTools] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  useEffect(() => {
    const autoCalculateRoute = async () => {
      if (origin.trim() && destination.trim() && origin !== destination) {
        setIsCalculatingRoute(true);
        
        try {
          const route = await HereMapsService.calculateRoute(origin, destination);
          if (route) {
            setRouteDistance(route.distance);
            setShowMap(true);
            console.log('Risk calculator - Auto-calculated distance:', route.distance, 'km');
          } else {
            console.log('Risk calculator - Could not auto-calculate distance for:', origin, 'to', destination);
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
  
  const handleCalculateRisk = () => {
    if (!cargoValue || !origin || !destination) return;
    
    const riskResult = calculateRisk({
      cargoType,
      cargoValue: parseFloat(cargoValue),
      contractType,
      routeDistance,
      currentTools
    });
    
    setResult(riskResult);
    setShowMap(true);
  };

  const handleOpenWhatsApp = () => {
    const message = `Olá! Gostaria de uma análise completa de risco para transporte.%0A%0A` +
      `Dados da operação:%0A` +
      `• Origem: ${origin}%0A` +
      `• Destino: ${destination}%0A` +
      `• Distância: ${routeDistance ? routeDistance + ' km' : 'Não calculada'}%0A` +
      `• Tipo de carga: ${cargoType}%0A` +
      `• Valor da carga: R$ ${cargoValue}%0A` +
      `• Tipo de contratação: ${contractType}%0A` +
      `• Nível de risco identificado: ${result?.riskLevel || 'Não calculado'}`;
    
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const handleReset = () => {
    setCargoType('alimentos');
    setCargoValue('');
    setOrigin('');
    setDestination('');
    setContractType('frota_propria');
    setCurrentTools('');
    setResult(null);
    setShowMap(false);
    setRouteDistance(null);
  };
  
  return (
    <Calculator
      id="calculadora-risco"
      title="Calculadora de Risco de Transporte"
      description="Avalie o nível de risco da sua operação de transporte e receba recomendações de segurança."
      isActive={isActive}
    >
      <RiskForm
        cargoType={cargoType}
        setCargoType={setCargoType}
        cargoValue={cargoValue}
        setCargoValue={setCargoValue}
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        contractType={contractType}
        setContractType={setContractType}
        currentTools={currentTools}
        setCurrentTools={setCurrentTools}
        routeDistance={routeDistance}
        isCalculatingRoute={isCalculatingRoute}
      />

      <RiskMap
        origin={origin}
        destination={destination}
        routeDistance={routeDistance}
        showMap={showMap}
      />
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={handleCalculateRisk}
        >
          Calcular risco
        </button>

        {result && (
          <RiskExport
            result={result}
            origin={origin}
            destination={destination}
            cargoType={cargoType}
            cargoValue={cargoValue}
            contractType={contractType}
            currentTools={currentTools}
          />
        )}
        
        <button 
          className="btn btn-secondary"
          onClick={handleReset}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <RiskResults
          result={result}
          onWhatsAppContact={handleOpenWhatsApp}
        />
      )}
    </Calculator>
  );
};

export default RiskCalculator;
