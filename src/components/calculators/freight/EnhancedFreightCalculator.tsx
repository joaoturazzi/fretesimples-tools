
import React from 'react';
import { useFreightCalculatorEnhanced } from './useFreightCalculatorEnhanced';
import FreightForm from './FreightForm';
import FreightResults from './FreightResults';
import CostSimulation from './CostSimulation';
import FreightMapSection from './FreightMapSection';
import FreightActionButtons from './FreightActionButtons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNotify } from '@/components/ui/notification';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toNumber } from '@/utils/typeHelpers';

const EnhancedFreightCalculator = () => {
  const notify = useNotify();
  const calculator = useFreightCalculatorEnhanced();

  const handleSaveCalculation = () => {
    if (calculator.result) {
      notify.success(
        'Cálculo salvo!',
        'O resultado foi salvo no histórico de cálculos'
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📊</span>
              Calculadora de Frete Avançada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FreightForm
              origin={calculator.origin}
              setOrigin={calculator.setOrigin}
              destination={calculator.destination}
              setDestination={calculator.setDestination}
              distance={calculator.distance}
              setDistance={calculator.setDistance}
              weight={calculator.weight}
              setWeight={calculator.setWeight}
              vehicleType={calculator.vehicleType}
              setVehicleType={calculator.setVehicleType}
              costPerKm={calculator.costPerKm}
              setCostPerKm={calculator.setCostPerKm}
              fuelPrice={calculator.fuelPrice}
              setFuelPrice={calculator.setFuelPrice}
              consumption={calculator.consumption}
              setConsumption={calculator.setConsumption}
              tollsCost={calculator.tollsCost}
              setTollsCost={calculator.setTollsCost}
              isCalculatingRoute={calculator.isCalculatingRoute}
              getDefaultCostPerKm={calculator.getDefaultCostPerKm}
              hasError={calculator.hasError}
              errorMessage={calculator.errorMessage}
            />

            <Separator />

            <CostSimulation
              showCostSimulation={calculator.showCostSimulation}
              setShowCostSimulation={calculator.setShowCostSimulation}
              monthlyMaintenance={calculator.monthlyMaintenance}
              setMonthlyMaintenance={calculator.setMonthlyMaintenance}
              driverSalary={calculator.driverSalary}
              setDriverSalary={calculator.setDriverSalary}
              monthlyDistance={calculator.monthlyDistance}
              setMonthlyDistance={calculator.setMonthlyDistance}
              costSimulationResult={calculator.costSimulationResult}
            />

            <FreightActionButtons
              performCalculation={calculator.performCalculation}
              resetForm={calculator.resetForm}
              saveCalculation={handleSaveCalculation}
              isCalculating={calculator.isCalculating}
              result={calculator.result}
            />
          </CardContent>
        </Card>

        {calculator.result && (
          <FreightResults 
            result={calculator.result}
            origin={calculator.origin}
            destination={calculator.destination}
            distance={toNumber(calculator.distance)}
            weight={toNumber(calculator.weight)}
            vehicleType={calculator.vehicleType}
            routeDuration={calculator.routeDuration}
          />
        )}

        <FreightMapSection
          showMap={calculator.showMap}
          origin={calculator.origin}
          destination={calculator.destination}
          distance={toNumber(calculator.distance)}
          routeDuration={calculator.routeDuration}
          routeCoordinates={calculator.routeCoordinates}
        />
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedFreightCalculator;
