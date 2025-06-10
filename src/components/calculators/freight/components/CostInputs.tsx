
import React from 'react';
import { DollarSign, Fuel, Navigation } from 'lucide-react';

interface CostInputsProps {
  costPerKm: number | '';
  setCostPerKm: (value: number | string) => void;
  fuelPrice: number | '';
  setFuelPrice: (value: number | string) => void;
  consumption: number | '';
  setConsumption: (value: number | string) => void;
  tollsCost: number | '';
  setTollsCost: (value: number | string) => void;
  getDefaultCostPerKm: () => number;
}

const CostInputs: React.FC<CostInputsProps> = ({
  costPerKm,
  setCostPerKm,
  fuelPrice,
  setFuelPrice,
  consumption,
  setConsumption,
  tollsCost,
  setTollsCost,
  getDefaultCostPerKm
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="calculator-input-group">
          <label htmlFor="costPerKm" className="calculator-label">
            <DollarSign size={16} className="calculator-label-icon" />
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
          <p className="form-helper">
            Custo operacional por quilômetro rodado
          </p>
        </div>

        <div className="calculator-input-group">
          <label htmlFor="fuelPrice" className="calculator-label">
            <Fuel size={16} className="calculator-label-icon" />
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
          <p className="form-helper">
            Preço atual do combustível por litro
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="calculator-input-group">
          <label htmlFor="consumption" className="calculator-label">
            <Fuel size={16} className="calculator-label-icon" />
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
          <p className="form-helper">
            Quilômetros percorridos por litro de combustível
          </p>
        </div>

        <div className="calculator-input-group">
          <label htmlFor="tollsCost" className="calculator-label">
            <Navigation size={16} className="calculator-label-icon" />
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
          <p className="form-helper">
            Custo total com pedágios da rota (opcional)
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostInputs;
