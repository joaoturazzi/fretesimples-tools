
import { useNotify } from '@/components/ui/notification';
import { getDefaultCostPerKm } from './freightCalculations';
import { useFreightState } from './useFreightState';
import { useFreightValidation } from './useFreightValidation';
import { useFreightRouteCalculation } from './useFreightRouteCalculation';
import { useFreightCalculation } from './useFreightCalculation';

export const useFreightCalculator = () => {
  const notify = useNotify();
  const state = useFreightState();
  const { validateInputs: validateInputsBase } = useFreightValidation();
  const { performCalculation: performCalculationBase } = useFreightCalculation();

  const {
    origin, destination, distance, weight, vehicleType, costPerKm, fuelPrice,
    consumption, tollsCost, monthlyMaintenance, driverSalary, monthlyDistance,
    showCostSimulation, result, costSimulationResult, isCalculating,
    isCalculatingRoute, hasError, errorMessage, showMap, routeCoordinates,
    routeDuration, setHasError, setErrorMessage, resetForm
  } = state;

  const { calculateDistanceFromRoute, cleanupRouteCalculation } = useFreightRouteCalculation(
    origin,
    destination,
    isCalculatingRoute,
    state.setIsCalculatingRoute,
    state.setDistance,
    state.setRouteDuration,
    state.setRouteCoordinates,
    state.setShowMap,
    setHasError,
    setErrorMessage
  );

  const validateInputs = () => validateInputsBase(distance, weight, setHasError, setErrorMessage);

  const performCalculation = () => {
    performCalculationBase(
      distance, weight, vehicleType, costPerKm, fuelPrice, consumption, tollsCost,
      showCostSimulation, monthlyMaintenance, driverSalary, monthlyDistance,
      state.setIsCalculating, state.setResult, state.setCostSimulationResult,
      setHasError, setErrorMessage, validateInputs
    );
  };

  const resetFormWithCleanup = () => {
    console.log('resetForm called');
    
    cleanupRouteCalculation();
    resetForm();
    
    notify.info('Formulário limpo', 'Todos os campos foram resetados');
  };

  return {
    // State
    ...state,
    
    // Methods
    calculateDistanceFromRoute,
    performCalculation,
    resetForm: resetFormWithCleanup,
    getDefaultCostPerKm: () => getDefaultCostPerKm(vehicleType)
  };
};
