
import { useState, useEffect } from 'react';
import { mapService } from '@/services/map/UnifiedMapService';
import { calculateIntelligentRisk, RiskFactors } from './intelligentRiskCalculations';

export const useEnhancedRiskCalculator = () => {
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

  const isFormValid = Object.keys(validationErrors).length === 0 && origin && destination && cargoValue;

  return {
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
  };
};
