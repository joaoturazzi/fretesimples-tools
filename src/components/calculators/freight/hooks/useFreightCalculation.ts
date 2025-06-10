
import { useState } from 'react';
import { useNotify } from '@/components/ui/notification';
import { useCalculatorValidation } from '@/hooks/useCalculatorValidation';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';
import { calculateFreight, calculateCostSimulation, FreightCalculationResult, CostSimulationResult } from '../freightCalculations';
import { toNumber } from '@/utils/typeHelpers';

export const useFreightCalculation = () => {
  const notify = useNotify();
  const { validateFreightData } = useCalculatorValidation();
  const { addCalculation } = useCalculationHistory();
  
  const [result, setResult] = useState<FreightCalculationResult | null>(null);
  const [costSimulationResult, setCostSimulationResult] = useState<CostSimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const performCalculation = (
    origin: string,
    destination: string,
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
    monthlyDistance: number | ''
  ) => {
    // Convert all values to numbers for validation
    const inputData = {
      origin,
      destination,
      distance: toNumber(distance),
      weight: toNumber(weight),
      vehicleType,
      costPerKm: toNumber(costPerKm),
      fuelPrice: toNumber(fuelPrice),
      consumption: toNumber(consumption),
      tollsCost: toNumber(tollsCost),
    };

    const validatedData = validateFreightData(inputData);
    if (!validatedData) return;

    setIsCalculating(true);
    setResult(null);
    setHasError(false);
    setErrorMessage('');
    
    setTimeout(() => {
      try {
        const calculatedResult = calculateFreight(
          validatedData.distance,
          validatedData.weight,
          validatedData.vehicleType,
          validatedData.costPerKm,
          validatedData.fuelPrice || 0,
          validatedData.consumption || 0,
          validatedData.tollsCost || 0
        );

        setResult(calculatedResult);

        // Calculate cost simulation if fields are filled
        if (showCostSimulation) {
          const costSim = calculateCostSimulation(
            toNumber(monthlyMaintenance),
            toNumber(driverSalary),
            toNumber(monthlyDistance),
            validatedData.fuelPrice || 0,
            validatedData.consumption || 0,
            validatedData.tollsCost || 0,
            validatedData.distance
          );
          setCostSimulationResult(costSim);
        }

        // Save to history
        addCalculation({
          type: 'freight',
          title: `${origin} → ${destination}`,
          data: validatedData,
          result: calculatedResult
        });

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

  const resetCalculation = () => {
    setResult(null);
    setCostSimulationResult(null);
    setHasError(false);
    setErrorMessage('');
    setIsCalculating(false);
  };

  return {
    result,
    costSimulationResult,
    isCalculating,
    hasError,
    errorMessage,
    performCalculation,
    resetCalculation
  };
};
