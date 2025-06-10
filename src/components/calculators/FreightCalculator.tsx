
import React from 'react';
import CalculatorSection from '../Calculator';
import LocationInputs from './freight/LocationInputs';
import CostSimulation from './freight/CostSimulation';
import FreightForm from './freight/FreightForm';
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
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 flex items-center gap-2 animate-fade-in">
          <span className="text-danger-500">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

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
        
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso da Carga (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input"
              placeholder="Ex: 1000"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Veículo
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="input"
            >
              <option value="truck">Caminhão</option>
              <option value="van">Van</option>
              <option value="motorcycle">Moto</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custo por Km (R$)
            </label>
            <input
              type="number"
              value={costPerKm}
              onChange={(e) => setCostPerKm(e.target.value)}
              className="input"
              placeholder={`Padrão: R$ ${getDefaultCostPerKm()}`}
              step="0.1"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço do Combustível (R$/L)
            </label>
            <input
              type="number"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className="input"
              placeholder="Ex: 5.50"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consumo (km/L)
            </label>
            <input
              type="number"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              className="input"
              placeholder="Ex: 8.5"
              step="0.1"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pedagios (R$)
            </label>
            <input
              type="number"
              value={tollsCost}
              onChange={(e) => setTollsCost(e.target.value)}
              className="input"
              placeholder="Ex: 25.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>

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
    </CalculatorSection>
  );
};

export default FreightCalculator;
