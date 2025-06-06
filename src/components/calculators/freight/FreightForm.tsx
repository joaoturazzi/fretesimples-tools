
import React from 'react';
import { Truck, DollarSign, BarChart3 } from 'lucide-react';

interface FreightFormProps {
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
  getDefaultCostPerKm: () => number;
}

const FreightForm: React.FC<FreightFormProps> = ({
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
  getDefaultCostPerKm
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};

export default FreightForm;
