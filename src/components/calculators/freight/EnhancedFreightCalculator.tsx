
import React, { useState, useCallback, useEffect } from 'react';
import { Truck, DollarSign, BarChart3, RefreshCw, CalculatorIcon, MapPin, Fuel, Gauge } from 'lucide-react';
import CalculatorSection from '../../Calculator';
import { useFreightCalculator } from './useFreightCalculator';
import { MapProviderProvider } from '../../map/UniversalMapProvider';
import HybridMap from '../../map/HybridMap';
import FreightResults from './FreightResults';
import { useNotify } from '@/components/ui/notification';

const EnhancedFreightCalculator = ({ isActive }: { isActive: boolean }) => {
  const notify = useNotify();
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
    result,
    isCalculating,
    hasError,
    errorMessage,
    performCalculation,
    resetForm,
    getDefaultCostPerKm
  } = useFreightCalculator();

  const [routeData, setRouteData] = useState<{
    distance: number;
    duration: number;
    coordinates: Array<{ lat: number; lng: number }>;
  } | null>(null);

  // Auto-sync route data with form
  useEffect(() => {
    if (routeData && routeData.distance !== distance) {
      setDistance(routeData.distance);
      notify.success(
        'Rota calculada!',
        `Distância: ${routeData.distance.toFixed(1)} km • Tempo: ${Math.floor(routeData.duration / 60)}h ${routeData.duration % 60}m`
      );
    }
  }, [routeData, distance, setDistance, notify]);

  const handleRouteCalculated = useCallback((data: {
    distance: number;
    duration: number;
    coordinates: Array<{ lat: number; lng: number }>;
  }) => {
    setRouteData(data);
  }, []);

  const handleCalculate = () => {
    if (!origin.trim() || !destination.trim()) {
      notify.error('Endereços obrigatórios', 'Por favor, informe origem e destino');
      return;
    }
    performCalculation();
  };

  const handleReset = () => {
    setRouteData(null);
    resetForm();
  };

  return (
    <MapProviderProvider preferredProvider="here">
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

        {/* Mapa sempre visível */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <span>🗺️</span>
            Visualização da Rota
          </h4>
          <HybridMap
            origin={origin}
            destination={destination}
            distance={routeData?.distance}
            duration={routeData?.duration}
            routeCoordinates={routeData?.coordinates}
            onRouteCalculated={handleRouteCalculated}
            className="w-full"
            height={300}
          />
        </div>

        {/* Campos de entrada organizados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Origem e Destino lado a lado */}
          <div className="space-y-4">
            <div className="calculator-input-group">
              <label htmlFor="origin" className="calculator-label flex items-center gap-1.5">
                <MapPin size={16} className="text-frete-500" />
                Origem
              </label>
              <input
                id="origin"
                type="text"
                className="input-field"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ex: São Paulo, SP"
              />
            </div>
            
            <div className="calculator-input-group">
              <label htmlFor="destination" className="calculator-label flex items-center gap-1.5">
                <MapPin size={16} className="text-frete-500" />
                Destino
              </label>
              <input
                id="destination"
                type="text"
                className="input-field"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ex: Rio de Janeiro, RJ"
              />
            </div>

            <div className="calculator-input-group">
              <label htmlFor="distance" className="calculator-label flex items-center gap-1.5">
                <Truck size={16} className="text-frete-500" />
                Distância (km)
                {routeData && (
                  <span className="text-xs text-green-600 ml-2">Auto-calculada</span>
                )}
              </label>
              <input
                id="distance"
                type="number"
                className="input-field"
                value={distance}
                onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : '')}
                placeholder="Ex: 450"
                min={0}
              />
            </div>
          </div>

          {/* Dados da carga e custos */}
          <div className="space-y-4">
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
                onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
                placeholder="Ex: 500"
                min={0}
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
                <option value="car">Carro</option>
              </select>
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
                onChange={(e) => setCostPerKm(e.target.value ? parseFloat(e.target.value) : '')}
                placeholder={`Ex: ${getDefaultCostPerKm()}`}
                min={0}
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Campos de combustível em linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="calculator-input-group">
            <label htmlFor="fuelPrice" className="calculator-label flex items-center gap-1.5">
              <Fuel size={16} className="text-frete-500" />
              Preço do combustível (R$/L)
            </label>
            <input
              id="fuelPrice"
              type="number"
              className="input-field"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="Ex: 5.50"
              min={0}
              step="0.01"
            />
          </div>

          <div className="calculator-input-group">
            <label htmlFor="consumption" className="calculator-label flex items-center gap-1.5">
              <Gauge size={16} className="text-frete-500" />
              Consumo (km/L)
            </label>
            <input
              id="consumption"
              type="number"
              className="input-field"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="Ex: 10.5"
              min={0}
              step="0.1"
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button 
            onClick={handleCalculate}
            className={`btn btn-primary ${isCalculating ? 'btn-loading' : ''}`}
            disabled={isCalculating}
          >
            {!isCalculating && <CalculatorIcon size={18} />}
            Calcular Frete
          </button>
          
          <button 
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={isCalculating}
          >
            <RefreshCw size={18} />
            Limpar
          </button>

          {routeData && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg">
              <span className="text-green-600">✓</span>
              Rota: {routeData.distance.toFixed(1)} km • {Math.floor(routeData.duration / 60)}h {routeData.duration % 60}m
            </div>
          )}
        </div>
        
        {result && <FreightResults result={result} />}
      </CalculatorSection>
    </MapProviderProvider>
  );
};

export default EnhancedFreightCalculator;
