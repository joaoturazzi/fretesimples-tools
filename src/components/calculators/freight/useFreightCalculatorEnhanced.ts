
import { useFreightFormState } from './hooks/useFreightFormState';
import { useRouteCalculation } from './hooks/useRouteCalculation';
import { useFreightCalculation } from './hooks/useFreightCalculation';
import { getDefaultCostPerKm } from './freightCalculations';

export const useFreightCalculatorEnhanced = () => {
  const formState = useFreightFormState();
  const routeCalc = useRouteCalculation(formState.origin, formState.destination);
  const freightCalc = useFreightCalculation();

  return {
    ...formState,
    ...routeCalc,
    ...freightCalc,
    getDefaultCostPerKm: () => getDefaultCostPerKm(formState.vehicleType)
  };
};
