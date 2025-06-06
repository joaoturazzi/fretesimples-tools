
import { useNotify } from '@/components/ui/notification';
import { calculateFreight, calculateCostSimulation, getDefaultCostPerKm, FreightCalculationResult, CostSimulationResult } from './freightCalculations';

export const useFreightCalculation = () => {
  const notify = useNotify();

  const performCalculation = (
    distance: number | '',
    weight: number | '',
    vehicleType: string,
    costPerKm: number | '',
    fuelPrice: number | '',
    consumption: number | '',
    tollsCost: number | '',
    showCostSimulation: boolean,
    monthlyMaintenance: number | '',
    driverSalary: number | '',
    monthlyDistance: number | '',
    setIsCalculating: (value: boolean) => void,
    setResult: (value: FreightCalculationResult | null) => void,
    setCostSimulationResult: (value: CostSimulationResult | null) => void,
    setHasError: (value: boolean) => void,
    setErrorMessage: (value: string) => void,
    validateInputs: () => boolean
  ) => {
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

  return { performCalculation };
};
