
import React, { useState, useEffect } from 'react';
import CalculatorSection from '../Calculator';
import { Calculator as CalculatorIcon, RefreshCw, MapPin, Fuel, DollarSign, Route } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { mapService } from '@/services/map/UnifiedMapService';

interface FuelCalculatorProps {
  isActive: boolean;
}

interface FuelResult {
  totalCost: number;
  fuelNeeded: number;
  distance: number;
  costPerKm: number;
}

const FuelCalculator: React.FC<FuelCalculatorProps> = ({ isActive }) => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [distance, setDistance] = useState<number | null>(null);
  const [fuelPrice, setFuelPrice] = useState<number | ''>('');
  const [consumption, setConsumption] = useState<number | ''>('');
  const [result, setResult] = useState<FuelResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string>('');

  // Auto-calculate distance when origin and destination change
  useEffect(() => {
    const autoCalculateDistance = async () => {
      if (origin.trim() && destination.trim() && origin !== destination) {
        setIsCalculatingRoute(true);
        setRouteError('');
        
        try {
          const route = await mapService.calculateRoute(origin, destination);
          if (route) {
            setDistance(route.distance);
            console.log('Fuel Calculator - Auto-calculated distance:', route.distance, 'km');
          }
        } catch (error) {
          console.error('Fuel Calculator - Error calculating distance:', error);
          setRouteError('Erro ao calcular distância. Verifique os endereços informados.');
        } finally {
          setIsCalculatingRoute(false);
        }
      } else {
        setDistance(null);
      }
    };

    const timeoutId = setTimeout(autoCalculateDistance, 1000);
    return () => clearTimeout(timeoutId);
  }, [origin, destination]);

  const calculateFuelCost = () => {
    if (distance && typeof fuelPrice === 'number' && typeof consumption === 'number') {
      if (distance > 0 && fuelPrice > 0 && consumption > 0) {
        const fuelNeeded = distance / consumption;
        const totalCost = fuelNeeded * fuelPrice;
        const costPerKm = totalCost / distance;
        
        setResult({
          totalCost,
          fuelNeeded,
          distance,
          costPerKm
        });
      } else {
        setResult(null);
        alert('Por favor, insira valores maiores que zero.');
      }
    } else {
      setResult(null);
      alert('Por favor, preencha todos os campos com valores numéricos válidos.');
    }
  };

  const resetForm = () => {
    setOrigin('');
    setDestination('');
    setDistance(null);
    setFuelPrice('');
    setConsumption('');
    setResult(null);
    setRouteError('');
  };

  const isFormValid = origin && destination && distance && fuelPrice && consumption;

  return (
    <CalculatorSection
      id="calculadora-combustivel"
      title="Calculadora de Combustível"
      description="Calcule o custo de combustível informando origem, destino e dados do veículo."
      isActive={isActive}
    >
      <div className="space-y-6">
        {/* Seção de Rota */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Route size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rota da Viagem</h3>
              <p className="text-sm text-gray-600">Informe origem e destino para calcular a distância</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Origem
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: São Paulo, SP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Destino
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Rio de Janeiro, RJ"
              />
            </div>
          </div>

          {isCalculatingRoute && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-blue-700 text-sm">📍 Calculando distância...</p>
            </div>
          )}

          {distance && !isCalculatingRoute && (
            <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium">
                ✅ Distância calculada: <strong>{distance} km</strong>
              </p>
            </div>
          )}

          {routeError && (
            <div className="mt-4 p-4 bg-red-100 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm">❌ {routeError}</p>
            </div>
          )}
        </div>

        {/* Seção de Dados do Veículo */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Fuel size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Dados do Veículo</h3>
              <p className="text-sm text-gray-600">Informações sobre combustível e consumo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Preço do Combustível (R$/L)
              </label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: 5.50"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⛽ Consumo do Veículo (km/L)
              </label>
              <input
                type="number"
                value={consumption}
                onChange={(e) => setConsumption(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: 12"
                step="0.1"
                min="0"
              />
            </div>
          </div>

          {/* Dicas de Consumo */}
          <div className="mt-4 p-4 bg-orange-100 rounded-lg">
            <p className="text-orange-700 text-sm font-medium mb-2">💡 Dicas de Consumo:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-orange-600">
              <p>🚛 Caminhão: 3-6 km/L</p>
              <p>🚐 Van: 8-12 km/L</p>
              <p>🏍️ Moto: 25-35 km/L</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={calculateFuelCost}
            disabled={!isFormValid || isCalculatingRoute}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CalculatorIcon size={18} />
            Calcular Combustível
          </button>

          <button
            onClick={resetForm}
            className="btn btn-secondary"
          >
            <RefreshCw size={18} />
            Limpar
          </button>
        </div>

        {/* Resultados */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Card Principal de Resultado */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Fuel size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Custo Total de Combustível</h3>
                  <p className="text-green-100">Para {result.distance} km de viagem</p>
                </div>
              </div>
              <div className="text-4xl font-bold">
                {formatCurrency(result.totalCost)}
              </div>
            </div>

            {/* Detalhamento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Fuel size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Combustível Necessário</h4>
                <p className="text-2xl font-bold text-blue-700">{result.fuelNeeded.toFixed(1)} L</p>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-purple-900 mb-2">Custo por Km</h4>
                <p className="text-2xl font-bold text-purple-700">R$ {result.costPerKm.toFixed(2)}</p>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Route size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-orange-900 mb-2">Distância Total</h4>
                <p className="text-2xl font-bold text-orange-700">{result.distance} km</p>
              </div>
            </div>

            {/* Resumo Detalhado */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Resumo do Cálculo</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Rota:</span>
                  <span className="font-medium">{origin} → {destination}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Distância:</span>
                  <span className="font-medium">{result.distance} km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Preço do combustível:</span>
                  <span className="font-medium">R$ {Number(fuelPrice).toFixed(2)}/L</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Consumo do veículo:</span>
                  <span className="font-medium">{consumption} km/L</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Combustível necessário:</span>
                  <span className="font-medium text-blue-600">{result.fuelNeeded.toFixed(1)} L</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-4">
                  <span className="text-gray-900 font-semibold">Total a pagar:</span>
                  <span className="font-bold text-green-600 text-xl">{formatCurrency(result.totalCost)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorSection>
  );
};

export default FuelCalculator;
