
import React from 'react';
import { Truck } from 'lucide-react';
import { vehicleTypes } from './vehicleData';

const VehicleReference = () => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Truck size={20} className="mr-2 text-orange-500" />
        Referência de Veículos
      </h3>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 grid grid-cols-3 font-medium text-gray-700 text-sm">
          <div>Veículo</div>
          <div>Peso (kg)</div>
          <div>Volume (m³)</div>
        </div>
        {vehicleTypes.map((vehicle, index) => (
          <div 
            key={vehicle.name} 
            className={`px-4 py-2 grid grid-cols-3 text-gray-700 text-sm ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <div>{vehicle.name}</div>
            <div>{vehicle.weightCapacity.toLocaleString('pt-BR')}</div>
            <div>
              {vehicle.liquidCapacity 
                ? `${vehicle.liquidCapacity.toLocaleString('pt-BR')}L` 
                : vehicle.volumeCapacity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleReference;
