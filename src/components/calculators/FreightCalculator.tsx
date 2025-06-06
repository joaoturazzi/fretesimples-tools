
import React, { useState, useEffect } from 'react';
import { Truck, DollarSign, BarChart3, RefreshCw, CalculatorIcon, CheckCircle, MapPin, Save } from 'lucide-react';
import CalculatorSection from '../Calculator';
import ResultBox from './ResultBox';
import MapComponent from '../MapComponent';
import { formatCurrency } from '@/lib/utils';
import { HereMapsService } from '@/services/hereMapsService';
import useSharedData from '@/hooks/useSharedData';

const FreightCalculator = ({ isActive }: { isActive: boolean }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [vehicleType, setVehicleType] = useState('truck');
  const [costPerKm, setCostPerKm] = useState<number | ''>('');
  const [fuelPrice, setFuelPrice] = useState<number | ''>('');
  const [consumption, setConsumption] = useState<number | ''>('');
  const [tollsCost, setTollsCost] = useState<number | ''>('');
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMap, setShowMap] = useState(false);

  const { saveFreightData } = useSharedData();

  // Auto-calculate distance when both origin and destination are filled
  useEffect(() => {
    const autoCalculateDistance = async () => {
      if (origin.trim() && destination.trim() && origin !== destination) {
        setIsCalculatingRoute(true);
        setHasError(false);
        
        try {
          const route = await HereMapsService.calculateRoute(origin, destination);
          if (route) {
            setDistance(route.distance);
            setShowMap(true);
            console.log('Auto-calculated distance:', route.distance, 'km');
          } else {
            console.log('Could not auto-calculate distance for:', origin, 'to', destination);
          }
        } catch (error) {
          console.error('Error auto-calculating distance:', error);
        } finally {
          setIsCalculatingRoute(false);
        }
      }
    };

    // Debounce the auto-calculation
    const timeoutId = setTimeout(autoCalculateDistance, 1000);
    return () => clearTimeout(timeoutId);
  }, [origin, destination]);

  const calculateDistanceFromRoute = async () => {
    if (!origin || !destination) {
      setErrorMessage('Por favor, informe origem e destino para calcular a rota.');
      setHasError(true);
      return;
    }

    setIsCalculatingRoute(true);
    setHasError(false);

    try {
      const route = await HereMapsService.calculateRoute(origin, destination);
      if (route) {
        setDistance(route.distance);
        setShowMap(true);
      } else {
        setErrorMessage('Não foi possível calcular a rota. Verifique os endereços informados.');
        setHasError(true);
      }
    } catch (error) {
      setErrorMessage('Erro ao calcular rota. Tente novamente.');
      setHasError(true);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const validateInputs = () => {
    if (distance === '' || distance <= 0) {
      setErrorMessage('Por favor, informe uma distância válida.');
      setHasError(true);
      return false;
    }

    if (weight === '' || weight <= 0) {
      setErrorMessage('Por favor, informe um peso válido.');
      setHasError(true);
      return false;
    }

    setHasError(false);
    setErrorMessage('');
    return true;
  };

  const calculateFreight = () => {
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
        const costPerKmValue = typeof costPerKm === 'number' ? costPerKm : getDefaultCostPerKm();

        // Calcular custos
        let fuelCost = 0;
        if (fuelPriceValue > 0 && consumptionValue > 0) {
          const litersNeeded = distanceValue / consumptionValue;
          fuelCost = litersNeeded * fuelPriceValue;
        }

        const distanceCost = distanceValue * costPerKmValue;
        const weightCost = weightValue * getWeightMultiplier();
        const totalFreight = distanceCost + weightCost + fuelCost + tollsCostValue;
        const finalCostPerKm = totalFreight / distanceValue;
        
        const calculatedResult = {
          distanceCost: distanceCost,
          weightCost: weightCost,
          fuelCost: fuelCost,
          tollsCost: tollsCostValue,
          totalFreight: totalFreight,
          costPerKm: finalCostPerKm,
          deliveryTime: calculateEstimatedTime(distanceValue, vehicleType),
          breakdown: {
            distance: distanceValue,
            weight: weightValue,
            fuelPrice: fuelPriceValue,
            consumption: consumptionValue
          }
        };

        setResult(calculatedResult);
      } catch (error) {
        setHasError(true);
        setErrorMessage('Ocorreu um erro ao calcular o frete. Por favor, tente novamente.');
        console.error('Erro ao calcular frete:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 600);
  };

  const getDefaultCostPerKm = (): number => {
    switch (vehicleType) {
      case 'truck': return 2.5;
      case 'van': return 1.8;
      case 'motorcycle': return 1.2;
      default: return 2.0;
    }
  };

  const getWeightMultiplier = (): number => {
    switch (vehicleType) {
      case 'truck': return 0.15;
      case 'van': return 0.1;
      case 'motorcycle': return 0.05;
      default: return 0.1;
    }
  };
  
  const calculateEstimatedTime = (distance: number, vehicleType: string) => {
    let speedPerHour;
    
    switch (vehicleType) {
      case 'truck': speedPerHour = 70; break;
      case 'van': speedPerHour = 80; break;
      case 'motorcycle': speedPerHour = 90; break;
      default: speedPerHour = 60;
    }
    
    const timeInHours = distance / speedPerHour;
    const restTime = Math.floor(distance / 250) * 0.5;
    const totalTime = timeInHours + restTime;
    
    const hours = Math.floor(totalTime);
    const minutes = Math.round((totalTime - hours) * 60);
    
    return `${hours}h ${minutes}min`;
  };

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

  const resetForm = () => {
    setOrigin('');
    setDestination('');
    setDistance('');
    setWeight('');
    setVehicleType('truck');
    setCostPerKm('');
    setFuelPrice('');
    setConsumption('');
    setTollsCost('');
    setResult(null);
    setHasError(false);
    setErrorMessage('');
    setShowMap(false);
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
            Distância (km) {isCalculatingRoute && <span className="text-sm text-gray-500">- Calculando...</span>}
          </label>
          <div className="flex gap-2">
            <input
              id="distance"
              type="number"
              className="input-field"
              value={distance}
              min={0}
              onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="Ex: 100"
            />
            <button
              onClick={calculateDistanceFromRoute}
              disabled={isCalculatingRoute}
              className="btn btn-secondary px-3"
              title="Calcular distância manualmente"
            >
              {isCalculatingRoute ? '...' : '📍'}
            </button>
          </div>
          {origin && destination && (
            <p className="text-xs text-gray-500 mt-1">
              A distância será calculada automaticamente baseada na rota.
            </p>
          )}
        </div>
        
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

        <div className="calculator-input-group">
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

      {showMap && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Rota calculada</h4>
          <MapComponent 
            origin={origin} 
            destination={destination}
            className="h-48 w-full rounded-lg border border-gray-200"
          />
        </div>
      )}
      
      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          onClick={calculateFreight}
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
