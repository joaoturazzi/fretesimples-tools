
import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Fuel, DollarSign, Route, AlertCircle, Package, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FreightFormProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  distance: number | '';
  setDistance: (value: number | string) => void;
  weight: number | '';
  setWeight: (value: number | string) => void;
  costPerKm: number | '';
  setCostPerKm: (value: number | string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
  fuelPrice: number | '';
  setFuelPrice: (value: number | string) => void;
  consumption: number | '';
  setConsumption: (value: number | string) => void;
  tollsCost: number | '';
  setTollsCost: (value: number | string) => void;
  isCalculatingRoute: boolean;
  getDefaultCostPerKm: () => number;
  hasError: boolean;
  errorMessage: string;
}

const FreightForm: React.FC<FreightFormProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  distance,
  setDistance,
  weight,
  setWeight,
  costPerKm,
  setCostPerKm,
  vehicleType,
  setVehicleType,
  fuelPrice,
  setFuelPrice,
  consumption,
  setConsumption,
  tollsCost,
  setTollsCost,
  isCalculatingRoute,
  getDefaultCostPerKm,
  hasError,
  errorMessage
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Valores padrão por tipo de veículo
  const vehicleDefaults = {
    truck: { costPerKm: 3.2, consumption: 3.5, fuelPrice: 6.20 },
    van: { costPerKm: 2.1, consumption: 8.5, fuelPrice: 5.80 },
    motorcycle: { costPerKm: 0.8, consumption: 35.0, fuelPrice: 5.50 }
  };

  // Validação em tempo real
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    if (!origin.trim()) errors.origin = 'Origem é obrigatória';
    if (!destination.trim()) errors.destination = 'Destino é obrigatório';
    if (!distance || distance <= 0) errors.distance = 'Distância deve ser maior que 0';
    if (!weight || weight <= 0) errors.weight = 'Peso deve ser maior que 0';
    if (!costPerKm || costPerKm <= 0) errors.costPerKm = 'Custo por km inválido';
    if (!fuelPrice || fuelPrice <= 0) errors.fuelPrice = 'Preço do combustível inválido';
    if (!consumption || consumption <= 0) errors.consumption = 'Consumo inválido';
    
    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [origin, destination, distance, weight, costPerKm, fuelPrice, consumption]);

  // Atualizar valores padrão quando o tipo de veículo muda
  useEffect(() => {
    const defaults = vehicleDefaults[vehicleType as keyof typeof vehicleDefaults];
    if (defaults) {
      if (!costPerKm) setCostPerKm(defaults.costPerKm);
      if (!consumption) setConsumption(defaults.consumption);
      if (!fuelPrice) setFuelPrice(defaults.fuelPrice);
    }
  }, [vehicleType, costPerKm, consumption, fuelPrice, setCostPerKm, setConsumption, setFuelPrice]);

  const getFieldError = (field: string) => validationErrors[field];
  const hasFieldError = (field: string) => !!validationErrors[field];

  return (
    <div className="space-y-6">
      {/* Informações da Rota */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Route size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Informações da Rota</h3>
            <p className="text-sm text-gray-600">Defina origem, destino e distância</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="calculator-label">
              <MapPin size={16} className="calculator-label-icon" />
              Origem
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className={cn(
                "input-field",
                hasFieldError('origin') && "error"
              )}
              placeholder="Ex: São Paulo, SP"
            />
            {hasFieldError('origin') && (
              <p className="form-error flex items-center gap-1">
                <AlertCircle size={12} />
                {getFieldError('origin')}
              </p>
            )}
          </div>

          <div>
            <label className="calculator-label">
              <MapPin size={16} className="calculator-label-icon" />
              Destino
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={cn(
                "input-field",
                hasFieldError('destination') && "error"
              )}
              placeholder="Ex: Rio de Janeiro, RJ"
            />
            {hasFieldError('destination') && (
              <p className="form-error flex items-center gap-1">
                <AlertCircle size={12} />
                {getFieldError('destination')}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="calculator-label">
            <Route size={16} className="calculator-label-icon" />
            Distância (km)
            {isCalculatingRoute && (
              <span className="text-orange-500 text-xs font-normal ml-2">
                Calculando automaticamente...
              </span>
            )}
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className={cn(
              "input-field",
              hasFieldError('distance') && "error"
            )}
            placeholder="Ex: 450"
            min="0"
            step="0.1"
          />
          {hasFieldError('distance') && (
            <p className="form-error flex items-center gap-1">
              <AlertCircle size={12} />
              {getFieldError('distance')}
            </p>
          )}
          {hasError && (
            <p className="form-error flex items-center gap-1 mt-1">
              <AlertCircle size={12} />
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {/* Informações da Carga */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Informações da Carga</h3>
            <p className="text-sm text-gray-600">Peso e tipo de veículo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="calculator-label">
              <Package size={16} className="calculator-label-icon" />
              Peso da Carga (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={cn(
                "input-field",
                hasFieldError('weight') && "error"
              )}
              placeholder="Ex: 1000"
              min="0"
              step="0.1"
            />
            {hasFieldError('weight') && (
              <p className="form-error flex items-center gap-1">
                <AlertCircle size={12} />
                {getFieldError('weight')}
              </p>
            )}
          </div>

          <div>
            <label className="calculator-label">
              <Truck size={16} className="calculator-label-icon" />
              Tipo de Veículo
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="select-field"
            >
              <option value="truck">Caminhão (até 23t)</option>
              <option value="van">Van (até 3.5t)</option>
              <option value="motorcycle">Moto (até 200kg)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custos Operacionais */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <DollarSign size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Custos Operacionais</h3>
            <p className="text-sm text-gray-600">Valores sugeridos baseados no tipo de veículo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="calculator-label">
              <DollarSign size={16} className="calculator-label-icon" />
              Custo por Km (R$)
            </label>
            <input
              type="number"
              value={costPerKm}
              onChange={(e) => setCostPerKm(e.target.value)}
              className={cn(
                "input-field",
                hasFieldError('costPerKm') && "error"
              )}
              placeholder={`Sugerido: R$ ${getDefaultCostPerKm()}`}
              min="0"
              step="0.01"
            />
            {hasFieldError('costPerKm') && (
              <p className="form-error flex items-center gap-1">
                <AlertCircle size={12} />
                {getFieldError('costPerKm')}
              </p>
            )}
            <p className="form-helper">
              Valor sugerido: R$ {vehicleDefaults[vehicleType as keyof typeof vehicleDefaults]?.costPerKm.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="calculator-label">
              <Fuel size={16} className="calculator-label-icon" />
              Preço Combustível (R$/L)
            </label>
            <input
              type="number"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className={cn(
                "input-field",
                hasFieldError('fuelPrice') && "error"
              )}
              placeholder="Ex: 6.20"
              min="0"
              step="0.01"
            />
            {hasFieldError('fuelPrice') && (
              <p className="form-error flex items-center gap-1">
                <AlertCircle size={12} />
                {getFieldError('fuelPrice')}
              </p>
            )}
            <p className="form-helper">
              Valor sugerido: R$ {vehicleDefaults[vehicleType as keyof typeof vehicleDefaults]?.fuelPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="calculator-label">
              <Fuel size={16} className="calculator-label-icon" />
              Consumo (km/L)
            </label>
            <input
              type="number"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              className={cn(
                "input-field",
                hasFieldError('consumption') && "error"
              )}
              placeholder="Ex: 8.5"
              min="0"
              step="0.1"
            />
            {hasFieldError('consumption') && (
              <p className="form-error flex items-center gap-1">
                <AlertCircle size={12} />
                {getFieldError('consumption')}
              </p>
            )}
            <p className="form-helper">
              Valor sugerido: {vehicleDefaults[vehicleType as keyof typeof vehicleDefaults]?.consumption.toFixed(1)} km/L
            </p>
          </div>

          <div>
            <label className="calculator-label">
              <Route size={16} className="calculator-label-icon" />
              Pedágios (R$)
            </label>
            <input
              type="number"
              value={tollsCost}
              onChange={(e) => setTollsCost(e.target.value)}
              className="input-field"
              placeholder="Ex: 25.00"
              min="0"
              step="0.01"
            />
            <p className="form-helper">
              Opcional - deixe em branco se não houver
            </p>
          </div>
        </div>
      </div>

      {/* Indicador de Status do Formulário */}
      <div className={cn(
        "p-4 rounded-xl border transition-all duration-200",
        isFormValid 
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-yellow-50 border-yellow-200 text-yellow-700"
      )}>
        <div className="flex items-center gap-2">
          {isFormValid ? (
            <>
              <CheckCircle size={16} className="text-green-500" />
              <span className="font-medium">Formulário completo e válido</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="text-yellow-500" />
              <span className="font-medium">
                Preencha todos os campos obrigatórios ({Object.keys(validationErrors).length} pendente{Object.keys(validationErrors).length > 1 ? 's' : ''})
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreightForm;
