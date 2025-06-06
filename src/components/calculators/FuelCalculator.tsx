
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import ResultBox from './ResultBox';
import InteractiveMap from '@/components/InteractiveMap';
import { RefreshCw, MapPin, Calculator as CalcIcon, Fuel } from 'lucide-react';
import { mapService } from '@/services/unifiedMapService';

interface FuelCalculatorProps {
  isActive: boolean;
}

const FuelCalculator = ({ isActive }: FuelCalculatorProps) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [consumption, setConsumption] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [vehicleType, setVehicleType] = useState('truck');
  const [loadWeight, setLoadWeight] = useState('');
  const [result, setResult] = useState<any>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ lat: number; lng: number }>>([]);
  const [routeDuration, setRouteDuration] = useState<number | undefined>(undefined);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Vehicle consumption patterns (km/l)
  const vehicleConsumption = {
    'van': { empty: 12, loaded: 10 },
    'vuc': { empty: 10, loaded: 8 },
    'toco': { empty: 8, loaded: 6 },
    'truck': { empty: 6, loaded: 4 },
    'carreta': { empty: 4, loaded: 3 },
    'bitrem': { empty: 3.5, loaded: 2.5 }
  };

  // Auto-calculate route when both origin and destination are filled
  useEffect(() => {
    const autoCalculateRoute = async () => {
      if (origin.trim() && destination.trim() && origin !== destination) {
        setIsCalculatingRoute(true);
        
        try {
          const route = await mapService.calculateRoute(origin, destination);
          if (route) {
            setRouteDistance(route.distance);
            setDistance(route.distance.toString());
            setRouteDuration(route.duration);
            setRouteCoordinates(route.route.geometry);
            setShowMap(true);
            console.log('Fuel calculator - Auto-calculated distance:', route.distance, 'km');
          } else {
            console.log('Fuel calculator - Could not auto-calculate distance for:', origin, 'to', destination);
          }
        } catch (error) {
          console.error('Fuel calculator - Error auto-calculating distance:', error);
        } finally {
          setIsCalculatingRoute(false);
        }
      }
    };

    const timeoutId = setTimeout(autoCalculateRoute, 1000);
    return () => clearTimeout(timeoutId);
  }, [origin, destination]);

  // Auto-suggest consumption based on vehicle type and load
  useEffect(() => {
    if (vehicleType && loadWeight) {
      const weight = parseFloat(loadWeight);
      const vehicle = vehicleConsumption[vehicleType as keyof typeof vehicleConsumption];
      
      if (vehicle) {
        // Calculate consumption based on load percentage
        const maxCapacity = getMaxCapacity(vehicleType);
        const loadPercentage = Math.min(1, weight / maxCapacity);
        const suggestedConsumption = vehicle.empty - (vehicle.empty - vehicle.loaded) * loadPercentage;
        setConsumption(suggestedConsumption.toFixed(1));
      }
    } else if (vehicleType) {
      // Default to empty consumption if no load specified
      const vehicle = vehicleConsumption[vehicleType as keyof typeof vehicleConsumption];
      if (vehicle) {
        setConsumption(vehicle.empty.toString());
      }
    }
  }, [vehicleType, loadWeight]);

  const getMaxCapacity = (type: string) => {
    const capacities: { [key: string]: number } = {
      'van': 1000,
      'vuc': 2000,
      'toco': 6000,
      'truck': 14000,
      'carreta': 25000,
      'bitrem': 35000
    };
    return capacities[type] || 14000;
  };
  
  const calculateFuel = () => {
    if (!distance || !consumption || !fuelPrice) return;
    
    const distanceValue = parseFloat(distance);
    const consumptionValue = parseFloat(consumption);
    const priceValue = parseFloat(fuelPrice);
    
    const liters = distanceValue / consumptionValue;
    const cost = liters * priceValue;
    const costPerKm = cost / distanceValue;
    
    // Additional calculations
    const roundTripLiters = liters * 2;
    const roundTripCost = cost * 2;
    const fuelPercentageOfOperation = calculateFuelPercentage(cost);
    
    setResult({
      liters: liters.toFixed(2),
      cost: cost.toFixed(2),
      costPerKm: costPerKm.toFixed(2),
      roundTripLiters: roundTripLiters.toFixed(2),
      roundTripCost: roundTripCost.toFixed(2),
      fuelPercentage: fuelPercentageOfOperation.toFixed(1),
      efficiency: (distanceValue / liters).toFixed(2)
    });
  };

  const calculateFuelPercentage = (fuelCost: number) => {
    // Estimate fuel as percentage of total operation cost
    const estimatedTotalCost = fuelCost * 2.5; // Fuel typically 40% of total cost
    return (fuelCost / estimatedTotalCost) * 100;
  };
  
  return (
    <Calculator
      id="calculadora-combustivel"
      title="Calculadora de Consumo de Combustível"
      description="Calcule o consumo de combustível e custos com integração automática de rotas."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="origin" className="calculator-label flex items-center gap-1.5">
              <MapPin size={16} className="text-frete-500" />
              Origem {isCalculatingRoute && <span className="text-sm text-gray-500">- Calculando...</span>}
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
          
          <div className="mb-4">
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

          <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distância (km)
            </label>
            <input
              type="number"
              id="distance"
              className="input-field"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Ex: 350"
            />
            {routeDistance && (
              <p className="text-xs text-gray-500 mt-1">
                Distância calculada automaticamente: {routeDistance} km
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de veículo
            </label>
            <select
              id="vehicleType"
              className="select-field"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="van">Van (Fiorino/Kangoo)</option>
              <option value="vuc">VUC (3/4)</option>
              <option value="toco">Toco</option>
              <option value="truck">Truck</option>
              <option value="carreta">Carreta</option>
              <option value="bitrem">Bitrem</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="loadWeight" className="block text-sm font-medium text-gray-700 mb-1">
              Peso da carga (kg) - opcional
            </label>
            <input
              type="number"
              id="loadWeight"
              className="input-field"
              value={loadWeight}
              onChange={(e) => setLoadWeight(e.target.value)}
              placeholder="Ex: 5000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ajusta automaticamente o consumo baseado no peso
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="consumption" className="block text-sm font-medium text-gray-700 mb-1">
              Consumo médio (km/l)
            </label>
            <input
              type="number"
              id="consumption"
              className="input-field"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              placeholder="Ex: 10"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Sugestão automática baseada no tipo de veículo
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="fuelPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Preço do combustível (R$/l)
            </label>
            <input
              type="number"
              id="fuelPrice"
              className="input-field"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              placeholder="Ex: 5.80"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {showMap && origin && destination && routeCoordinates && routeCoordinates.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin size={16} className="mr-2 text-frete-500" />
            Rota calculada {routeDistance && `(${routeDistance} km)`}
          </h4>
          <InteractiveMap 
            origin={origin} 
            destination={destination}
            distance={routeDistance || undefined}
            duration={routeDuration}
            routeCoordinates={routeCoordinates}
            className="h-48 w-full rounded-lg border border-gray-200"
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateFuel}
        >
          <CalcIcon size={18} className="mr-2" />
          Calcular
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setOrigin('');
            setDestination('');
            setDistance('');
            setConsumption('');
            setFuelPrice('');
            setLoadWeight('');
            setResult(null);
            setShowMap(false);
            setRouteDistance(null);
            setRouteCoordinates([]);
            setRouteDuration(undefined);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Fuel size={20} className="mr-2 text-frete-500" />
            Resultado do cálculo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <ResultBox 
              label="Litros necessários" 
              value={result.liters}
              unit="litros"
            />
            <ResultBox 
              label="Custo total" 
              value={`R$ ${result.cost}`}
              className="bg-frete-50"
            />
            <ResultBox 
              label="Custo por quilômetro" 
              value={`R$ ${result.costPerKm}`}
              unit="/km"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultBox 
              label="Ida e volta (litros)" 
              value={result.roundTripLiters}
              unit="litros"
              className="bg-blue-50"
            />
            <ResultBox 
              label="Ida e volta (custo)" 
              value={`R$ ${result.roundTripCost}`}
              className="bg-blue-50"
            />
            <ResultBox 
              label="Eficiência" 
              value={result.efficiency}
              unit="km/l"
              className="bg-green-50"
            />
          </div>

          <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">💡 Informações adicionais:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Combustível representa aproximadamente {result.fuelPercentage}% do custo total da operação</li>
              <li>• Para {vehicleType.toUpperCase()}: consumo varia entre {vehicleConsumption[vehicleType as keyof typeof vehicleConsumption]?.loaded} (carregado) e {vehicleConsumption[vehicleType as keyof typeof vehicleConsumption]?.empty} km/l (vazio)</li>
              <li>• Considere fatores como trânsito, relevo e condições climáticas</li>
              <li>• Mantenha sempre uma reserva de 10-15% para imprevistos</li>
            </ul>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default FuelCalculator;
