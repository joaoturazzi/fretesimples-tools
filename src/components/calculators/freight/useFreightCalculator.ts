
import { useState, useEffect, useCallback, useRef } from 'react';
import { mapService } from '@/services/unifiedMapService';
import { useNotify } from '@/components/ui/notification';
import { calculateFreight, calculateCostSimulation, getDefaultCostPerKm, FreightCalculationResult, CostSimulationResult } from './freightCalculations';

export const useFreightCalculator = () => {
  const notify = useNotify();
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [vehicleType, setVehicleType] = useState('truck');
  const [costPerKm, setCostPerKm] = useState<number | ''>('');
  const [fuelPrice, setFuelPrice] = useState<number | ''>('');
  const [consumption, setConsumption] = useState<number | ''>('');
  const [tollsCost, setTollsCost] = useState<number | ''>('');
  
  // Cost simulation fields
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<number | ''>('');
  const [driverSalary, setDriverSalary] = useState<number | ''>('');
  const [monthlyDistance, setMonthlyDistance] = useState<number | ''>('');
  const [showCostSimulation, setShowCostSimulation] = useState(false);
  
  const [result, setResult] = useState<FreightCalculationResult | null>(null);
  const [costSimulationResult, setCostSimulationResult] = useState<CostSimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ lat: number; lng: number }>>([]);
  const [routeDuration, setRouteDuration] = useState<number | undefined>(undefined);

  // Helper function to convert input values
  const convertValue = (value: string | number): number | '' => {
    if (typeof value === 'number') return value;
    if (value === '' || value === null || value === undefined) return '';
    const parsed = parseFloat(value);
    return isNaN(parsed) ? '' : parsed;
  };

  // Auto-calculate distance with improved debouncing and error handling
  const autoCalculateDistance = useCallback(async (originAddr: string, destinationAddr: string) => {
    console.log('autoCalculateDistance called:', { originAddr, destinationAddr });
    
    // Cancel previous request
    if (abortControllerRef.current) {
      console.log('Aborting previous request');
      abortControllerRef.current.abort();
    }
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Validate inputs
    if (!originAddr?.trim() || !destinationAddr?.trim() || originAddr === destinationAddr) {
      console.log('Invalid inputs, resetting map state');
      setShowMap(false);
      setRouteCoordinates([]);
      setRouteDuration(undefined);
      setIsCalculatingRoute(false);
      return;
    }

    // Prevent concurrent calculations
    if (isCalculatingRoute) {
      console.log('Already calculating route, skipping');
      return;
    }

    console.log('Starting route calculation');
    setIsCalculatingRoute(true);
    setHasError(false);
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      console.log('Calling mapService.calculateRoute');
      const route = await mapService.calculateRoute(originAddr, destinationAddr);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('Request was aborted');
        return;
      }
      
      if (route) {
        console.log('Route calculated successfully:', route);
        setDistance(route.distance);
        setRouteDuration(route.duration);
        setRouteCoordinates(route.route.geometry);
        setShowMap(true);
        
        notify.success(
          'Rota calculada!',
          `Distância: ${route.distance} km • Tempo: ${Math.floor(route.duration / 60)}h ${route.duration % 60}m`
        );
      } else {
        console.log('No route returned from service');
        setShowMap(false);
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('Request aborted, not showing error');
        return;
      }
      
      console.error('Error auto-calculating distance:', error);
      const message = error instanceof Error ? error.message : 'Erro ao calcular rota';
      notify.warning('Rota não calculada', message);
      setShowMap(false);
    } finally {
      setIsCalculatingRoute(false);
      console.log('Route calculation finished');
    }
  }, [notify, isCalculatingRoute]);

  // Auto-calculate distance when both origin and destination are filled
  useEffect(() => {
    console.log('useEffect triggered:', { origin, destination });
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer with longer debounce
    debounceTimerRef.current = setTimeout(() => {
      console.log('Debounce timer triggered, calling autoCalculateDistance');
      autoCalculateDistance(origin, destination);
    }, 3000); // Increased debounce time

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      // Cancel ongoing request when effect cleans up
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [origin, destination, autoCalculateDistance]);

  const calculateDistanceFromRoute = async () => {
    if (!origin || !destination) {
      const message = 'Por favor, informe origem e destino para calcular a rota.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Erro de validação', message);
      return;
    }

    await autoCalculateDistance(origin, destination);
  };

  const validateInputs = () => {
    if (distance === '' || distance <= 0) {
      const message = 'Por favor, informe uma distância válida.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Erro de validação', message);
      return false;
    }

    if (weight === '' || weight <= 0) {
      const message = 'Por favor, informe um peso válido.';
      setErrorMessage(message);
      setHasError(true);
      notify.error('Erro de validação', message);
      return false;
    }

    setHasError(false);
    setErrorMessage('');
    return true;
  };

  const performCalculation = () => {
    console.log('performCalculation called');
    
    if (!validateInputs()) return;

    setIsCalculating(true);
    setResult(null);
    
    setTimeout(() => {
      try {
        const distanceValue = typeof distance === 'number' ? distance : 0;
        const weightValue = typeof weight === 'number' ? weight : 0;
        const fuelPriceValue = typeof fuelPrice === 'number' ? fuelPrice : 0;
        const consumptionValue = typeof consumption === 'number' ? consumption : 0;
        const tollsCostValue = typeof tollsCost === 'number' ? tollsCost : 0;
        const costPerKmValue = typeof costPerKm === 'number' ? costPerKm : getDefaultCostPerKm(vehicleType);

        console.log('Calculating freight with:', {
          distanceValue,
          weightValue,
          vehicleType,
          costPerKmValue
        });

        const calculatedResult = calculateFreight(
          distanceValue,
          weightValue,
          vehicleType,
          costPerKmValue,
          fuelPriceValue,
          consumptionValue,
          tollsCostValue
        );

        setResult(calculatedResult);

        // Calculate cost simulation if fields are filled
        if (showCostSimulation) {
          const monthlyMaintenanceValue = typeof monthlyMaintenance === 'number' ? monthlyMaintenance : 0;
          const driverSalaryValue = typeof driverSalary === 'number' ? driverSalary : 0;
          const monthlyDistanceValue = typeof monthlyDistance === 'number' ? monthlyDistance : 0;
          
          const costSim = calculateCostSimulation(
            monthlyMaintenanceValue,
            driverSalaryValue,
            monthlyDistanceValue,
            fuelPriceValue,
            consumptionValue,
            tollsCostValue,
            distanceValue
          );
          setCostSimulationResult(costSim);
        }

        console.log('Calculation completed successfully');
        notify.success(
          'Cálculo concluído!',
          `Valor do frete: R$ ${calculatedResult.totalFreight.toFixed(2)}`
        );

      } catch (error) {
        const message = 'Ocorreu um erro ao calcular o frete. Por favor, tente novamente.';
        setHasError(true);
        setErrorMessage(message);
        notify.error('Erro no cálculo', message);
        console.error('Erro ao calcular frete:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 600);
  };

  const resetForm = () => {
    console.log('resetForm called');
    
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    setOrigin('');
    setDestination('');
    setDistance('');
    setWeight('');
    setVehicleType('truck');
    setCostPerKm('');
    setFuelPrice('');
    setConsumption('');
    setTollsCost('');
    setMonthlyMaintenance('');
    setDriverSalary('');
    setMonthlyDistance('');
    setResult(null);
    setCostSimulationResult(null);
    setHasError(false);
    setErrorMessage('');
    setShowMap(false);
    setShowCostSimulation(false);
    setRouteCoordinates([]);
    setRouteDuration(undefined);
    setIsCalculatingRoute(false);
    
    notify.info('Formulário limpo', 'Todos os campos foram resetados');
  };

  return {
    // State
    origin, setOrigin,
    destination, setDestination,
    distance, setDistance: (value: number | string) => setDistance(convertValue(value)),
    weight, setWeight: (value: number | string) => setWeight(convertValue(value)),
    vehicleType, setVehicleType,
    costPerKm, setCostPerKm: (value: number | string) => setCostPerKm(convertValue(value)),
    fuelPrice, setFuelPrice: (value: number | string) => setFuelPrice(convertValue(value)),
    consumption, setConsumption: (value: number | string) => setConsumption(convertValue(value)),
    tollsCost, setTollsCost: (value: number | string) => setTollsCost(convertValue(value)),
    monthlyMaintenance, setMonthlyMaintenance: (value: number | string) => setMonthlyMaintenance(convertValue(value)),
    driverSalary, setDriverSalary: (value: number | string) => setDriverSalary(convertValue(value)),
    monthlyDistance, setMonthlyDistance: (value: number | string) => setMonthlyDistance(convertValue(value)),
    showCostSimulation, setShowCostSimulation,
    result,
    costSimulationResult,
    isCalculating,
    isCalculatingRoute,
    hasError,
    errorMessage,
    showMap,
    
    // Methods
    calculateDistanceFromRoute,
    performCalculation,
    resetForm,
    getDefaultCostPerKm: () => getDefaultCostPerKm(vehicleType),
    routeCoordinates,
    routeDuration
  };
};
