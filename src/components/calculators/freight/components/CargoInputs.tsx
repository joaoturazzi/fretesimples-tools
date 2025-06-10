
import React from 'react';
import { BarChart3, Truck } from 'lucide-react';

interface CargoInputsProps {
  weight: number | '';
  setWeight: (value: number | string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
}

const CargoInputs: React.FC<CargoInputsProps> = ({
  weight,
  setWeight,
  vehicleType,
  setVehicleType
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
    </div>
  );
};

export default CargoInputs;
