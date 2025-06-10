
import React from 'react';
import { Package, Truck } from 'lucide-react';

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
        <label htmlFor="weight" className="calculator-label">
          <Package size={16} className="calculator-label-icon" />
          Peso da carga (kg)
        </label>
        <input
          id="weight"
          type="number"
          className="input-field"
          value={weight}
          min={0}
          onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
          placeholder="Ex: 1000"
        />
        <p className="form-helper">
          Informe o peso total da carga em quilogramas
        </p>
      </div>

      <div className="calculator-input-group">
        <label htmlFor="vehicleType" className="calculator-label">
          <Truck size={16} className="calculator-label-icon" />
          Tipo de veículo
        </label>
        <select
          id="vehicleType"
          className="select-field"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="truck">Caminhão (até 23t)</option>
          <option value="van">Van (até 3.5t)</option>
          <option value="motorcycle">Moto (até 200kg)</option>
        </select>
        <p className="form-helper">
          Selecione o tipo de veículo mais adequado para a carga
        </p>
      </div>
    </div>
  );
};

export default CargoInputs;
