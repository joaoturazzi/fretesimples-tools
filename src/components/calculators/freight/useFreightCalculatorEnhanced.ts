
import { useFreightFormState } from './hooks/useFreightFormState';
import { useRouteCalculation } from './hooks/useRouteCalculation';
import { useFreightCalculation } from './hooks/useFreightCalculation';
import { getDefaultCostPerKm } from './freightCalculations';

export const useFreightCalculatorEnhanced = () => {
  const formState = useFreightFormState();
  const routeCalc = useRouteCalculation(formState.origin, formState.destination);
  const freightCalc = useFreightCalculation();

  // Create a wrapper function that passes all required parameters
  const performCalculation = () => {
    freightCalc.performCalculation(
      formState.origin,
      formState.destination,
      formState.distance,
      formState.weight,
      formState.vehicleType,
      formState.costPerKm,
      formState.fuelPrice,
      formState.consumption,
      formState.tollsCost,
      formState.showCostSimulation,
      formState.monthlyMaintenance,
      formState.driverSalary,
      formState.monthlyDistance
    );
  };

  return {
    ...formState,
    ...routeCalc,
    result: freightCalc.result,
    costSimulationResult: freightCalc.costSimulationResult,
    isCalculating: freightCalc.isCalculating,
    hasError: freightCalc.hasError,
    errorMessage: freightCalc.errorMessage,
    performCalculation,
    resetCalculation: freightCalc.resetCalculation,
    getDefaultCostPerKm: () => getDefaultCostPerKm(formState.vehicleType)
  };
};
