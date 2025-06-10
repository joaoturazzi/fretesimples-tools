
import React from 'react';
import CalculatorSection from '../Calculator';
import LocationInputs from './freight/components/LocationInputs';
import CargoInputs from './freight/components/CargoInputs';
import CostInputs from './freight/components/CostInputs';
import CostSimulation from './freight/CostSimulation';
import FreightActionButtons from './freight/FreightActionButtons';
import FreightResults from './freight/FreightResults';
import FreightMapSection from './freight/FreightMapSection';
import { useFreightCalculator } from './freight/useFreightCalculator';
import useSharedData from '@/hooks/useSharedData';

const FreightCalculator = ({ isActive }: { isActive: boolean }) => {
  const {
    origin, setOrigin,
    destination, setDestination,
    distance, setDistance,
    weight, setWeight,
    vehicleType, setVehicleType,
    costPerKm, setCostPerKm,
    fuelPrice, setFuelPrice,
    consumption, setConsumption,
    tollsCost, setTollsCost,
    monthlyMaintenance, setMonthlyMaintenance,
    driverSalary, setDriverSalary,
    monthlyDistance, setMonthlyDistance,
    showCostSimulation, setShowCostSimulation,
    result,
    costSimulationResult,
    isCalculating,
    isCalculatingRoute,
    hasError,
    errorMessage,
    showMap,
    calculateDistanceFromRoute,
    performCalculation,
    resetForm,
    getDefaultCostPerKm,
    routeCoordinates,
    routeDuration
  } = useFreightCalculator();

  const { saveFreightData } = useSharedData();

  const saveCalculation = () => {
    if (!result) return;

    const freightData = {
      origin,
      destination,
      distance: typeof distance === 'number' ? distance : 0,
      weight: typeof weight === 'number' ? weight : 0,
      vehicleType,
      fuelPrice: typeof fuelPrice === 'number' ? fuelPrice : 0,
      consumption: typeof consumption === 'number' ? consumption : 0,
      tollsCost: typeof tollsCost === 'number' ? tollsCost : 0,
      costPerKm: result.costPerKm,
      totalCost: result.totalFreight,
      timestamp: Date.now()
    };

    saveFreightData(freightData);
    alert('Cálculo salvo com sucesso! Agora você pode importar estes dados no Simulador de Lucro.');
  };

  return (
    <CalculatorSection 
      id="calculadora-frete"
      title="Calculadora de Frete"
      description="Calcule o valor do frete com base na rota, peso da carga e custos operacionais."
      isActive={isActive}
    >
      {hasError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-8">
        <LocationInputs
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          distance={distance}
          setDistance={setDistance}
          isCalculatingRoute={isCalculatingRoute}
          onCalculateDistance={calculateDistanceFromRoute}
        />
        
        <CargoInputs
          weight={weight}
          setWeight={setWeight}
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
        />
        
        <CostInputs
          costPerKm={costPerKm}
          setCostPerKm={setCostPerKm}
          fuelPrice={fuelPrice}
          setFuelPrice={setFuelPrice}
          consumption={consumption}
          setConsumption={setConsumption}
          tollsCost={tollsCost}
          setTollsCost={setTollsCost}
          getDefaultCostPerKm={getDefaultCostPerKm}
        />

        <CostSimulation
          showCostSimulation={showCostSimulation}
          setShowCostSimulation={setShowCostSimulation}
          monthlyMaintenance={monthlyMaintenance}
          setMonthlyMaintenance={setMonthlyMaintenance}
          driverSalary={driverSalary}
          setDriverSalary={setDriverSalary}
          monthlyDistance={monthlyDistance}
          setMonthlyDistance={setMonthlyDistance}
          costSimulationResult={costSimulationResult}
        />

        <FreightMapSection
          showMap={showMap}
          origin={origin}
          destination={destination}
          distance={typeof distance === 'number' ? distance : undefined}
          routeDuration={routeDuration}
          routeCoordinates={routeCoordinates}
        />
        
        <FreightActionButtons
          performCalculation={performCalculation}
          resetForm={resetForm}
          saveCalculation={saveCalculation}
          isCalculating={isCalculating}
          result={result}
        />
        
        {result && (
          <FreightResults 
            result={result}
            origin={origin}
            destination={destination}
            distance={typeof distance === 'number' ? distance : 0}
            weight={typeof weight === 'number' ? weight : 0}
            vehicleType={vehicleType}
            routeDuration={routeDuration}
          />
        )}
      </div>
    </CalculatorSection>
  );
};

export default FreightCalculator;
