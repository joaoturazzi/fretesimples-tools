
import React from 'react';
import { Truck, DollarSign, BarChart3, RefreshCw, CalculatorIcon, CheckCircle, Save } from 'lucide-react';
import CalculatorSection from '../Calculator';
import ResultBox from './ResultBox';
import MapComponent from '../MapComponent';
import LocationInputs from './freight/LocationInputs';
import CostSimulation from './freight/CostSimulation';
import { useFreightCalculator } from './freight/useFreightCalculator';
import { formatCurrency } from '@/lib/utils';
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
    getDefaultCostPerKm
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <div className="calculator-input-group">
          <label htmlFor="weight" className="calculator-label flex items-center gap-1.5">
            <BarChart3 size={16} className="text-frete-500" />
            Peso da carga (kg)
          </label>
          <input
            id="weight"
            type="number"
            className="input-field"
            value={weight}
            min={0}
            onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="Ex: 500"
          />
        </div>

        <div className="calculator-input-group">
          <label htmlFor="costPerKm" className="calculator-label flex items-center gap-1.5">
            <DollarSign size={16} className="text-frete-500" />
            Custo por km (R$)
          </label>
          <input
            id="costPerKm"
            type="number"
            className="input-field"
            value={costPerKm}
            min={0}
            step={0.01}
            onChange={(e) => setCostPerKm(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder={`Padrão: R$ ${getDefaultCostPerKm().toFixed(2)}`}
          />
        </div>
        
        <div className="calculator-input-group">
          <label htmlFor="vehicleType" className="calculator-label flex items-center gap-1.5">
            <Truck size={16} className="text-frete-500" />
            Tipo de veículo
          </label>
          <select
            id="vehicleType"
            className="select-field"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="truck">Caminhão</option>
            <option value="van">Van</option>
            <option value="motorcycle">Motocicleta</option>
          </select>
        </div>

        <div className="calculator-input-group">
          <label htmlFor="fuelPrice" className="calculator-label">
            Preço do combustível (R$/litro)
          </label>
          <input
            id="fuelPrice"
            type="number"
            className="input-field"
            value={fuelPrice}
            min={0}
            step={0.01}
            onChange={(e) => setFuelPrice(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="Ex: 5.80"
          />
        </div>

        <div className="calculator-input-group">
          <label htmlFor="consumption" className="calculator-label">
            Consumo médio (km/l)
          </label>
          <input
            id="consumption"
            type="number"
            className="input-field"
            value={consumption}
            min={0}
            step={0.1}
            onChange={(e) => setConsumption(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="Ex: 8.5"
          />
        </div>

        <div className="calculator-input-group col-span-full">
          <label htmlFor="tollsCost" className="calculator-label">
            Valor total de pedágios (R$)
          </label>
          <input
            id="tollsCost"
            type="number"
            className="input-field"
            value={tollsCost}
            min={0}
            step={0.01}
            onChange={(e) => setTollsCost(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="Ex: 120.00"
          />
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

      {showMap && origin && destination && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span>🗺️</span>
            Rota calculada: {origin} → {destination}
          </h4>
          <MapComponent 
            origin={origin} 
            destination={destination}
            onRouteCalculated={(dist, duration) => {
              console.log('Route calculated via map:', dist, 'km,', duration, 'min');
              if (!distance || distance === 0) {
                setDistance(dist);
              }
            }}
            className="h-48 w-full rounded-lg border border-gray-200"
          />
        </div>
      )}
      
      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          onClick={performCalculation}
          className={`btn btn-primary ${isCalculating ? 'btn-loading' : ''}`}
          disabled={isCalculating}
        >
          {!isCalculating && <CalculatorIcon size={18} />}
          Calcular Frete
        </button>

        {result && (
          <button 
            onClick={saveCalculation}
            className="btn btn-success"
          >
            <Save size={18} />
            Salvar Cálculo
          </button>
        )}
        
        <button 
          onClick={resetForm}
          className="btn btn-secondary"
          disabled={isCalculating}
        >
          <RefreshCw size={18} />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="calculator-result">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-success-500" size={20} />
            <h3 className="text-xl font-semibold text-gray-900">Resultado</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResultBox 
              label="Valor total do frete" 
              value={formatCurrency(result.totalFreight)}
              className="bg-frete-50 border-frete-100 col-span-full"
            />
            
            <ResultBox 
              label="Custo por km" 
              value={formatCurrency(result.costPerKm)}
              unit="/km"
            />
            
            <ResultBox 
              label="Tempo estimado" 
              value={result.deliveryTime}
              tooltip="Tempo estimado considerando velocidade média e paradas"
            />
            
            <ResultBox 
              label="Custo combustível" 
              value={formatCurrency(result.fuelCost)}
              tooltip="Custo estimado de combustível para a viagem"
            />
            
            <ResultBox 
              label="Custo pedágios" 
              value={formatCurrency(result.tollsCost)}
            />
            
            <ResultBox 
              label="Custo por peso" 
              value={formatCurrency(result.weightCost)}
              tooltip="Valor adicional calculado pelo peso da carga"
            />
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm flex items-start gap-2.5">
            <CheckCircle className="shrink-0 mt-0.5 text-blue-500" size={16} />
            <div>
              <p className="font-medium mb-1">Cálculo salvo automaticamente!</p>
              <p>
                Use o botão "Salvar Cálculo" para compartilhar estes dados com outras ferramentas.
                O valor calculado considera distância, peso, combustível e pedágios.
              </p>
            </div>
          </div>
        </div>
      )}
    </CalculatorSection>
  );
};

export default FreightCalculator;
