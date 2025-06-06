
import { useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { 
  freightCalculationSchema, 
  vehicleSizingSchema, 
  riskCalculationSchema,
  validateData 
} from '@/schemas/validation';

export const useCalculatorValidation = () => {
  const { handleValidationError } = useErrorHandler();

  const validateFreightData = useCallback((data: any) => {
    const result = validateData(freightCalculationSchema, data);
    if (!result.success && result.errors) {
      handleValidationError(result.errors, 'Calculadora de Frete');
      return null;
    }
    return result.data;
  }, [handleValidationError]);

  const validateVehicleData = useCallback((data: any) => {
    const result = validateData(vehicleSizingSchema, data);
    if (!result.success && result.errors) {
      handleValidationError(result.errors, 'Dimensionamento de Veículo');
      return null;
    }
    return result.data;
  }, [handleValidationError]);

  const validateRiskData = useCallback((data: any) => {
    const result = validateData(riskCalculationSchema, data);
    if (!result.success && result.errors) {
      handleValidationError(result.errors, 'Calculadora de Risco');
      return null;
    }
    return result.data;
  }, [handleValidationError]);

  return {
    validateFreightData,
    validateVehicleData,
    validateRiskData
  };
};
