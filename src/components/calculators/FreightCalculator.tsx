
import React, { useState } from 'react';
import Calculator from '../Calculator';

const FreightCalculator = ({ isActive }: { isActive: boolean }) => {
  const [distance, setDistance] = useState(0);
  const [weight, setWeight] = useState(0);
  const [vehicleType, setVehicleType] = useState('truck');
  const [result, setResult] = useState(0);

  const calculateFreight = () => {
    let baseCost = 0;
    
    switch (vehicleType) {
      case 'truck':
        baseCost = 2.5;
        break;
      case 'van':
        baseCost = 1.8;
        break;
      case 'motorcycle':
        baseCost = 1.2;
        break;
      default:
        baseCost = 2.0;
    }
    
    const freight = (distance * baseCost) + (weight * 0.1);
    setResult(freight);
  };

  return (
    <Calculator 
      id="calculadora-frete"
      title="Calculadora de Frete"
      description="Calcule o valor do frete com base na distância, peso da carga e tipo de veículo."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="calculator-input-group">
          <label htmlFor="distance" className="calculator-label">Distância (km)</label>
          <input
            id="distance"
            type="number"
            className="input-field"
            value={distance}
            min={0}
            onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
            placeholder="Ex: 100"
          />
        </div>
        
        <div className="calculator-input-group">
          <label htmlFor="weight" className="calculator-label">Peso da carga (kg)</label>
          <input
            id="weight"
            type="number"
            className="input-field"
            value={weight}
            min={0}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            placeholder="Ex: 500"
          />
        </div>
        
        <div className="calculator-input-group md:col-span-2">
          <label htmlFor="vehicleType" className="calculator-label">Tipo de veículo</label>
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
      
      <div className="mt-6">
        <button 
          onClick={calculateFreight}
          className="btn btn-primary w-full md:w-auto"
        >
          Calcular Frete
        </button>
      </div>
      
      {result > 0 && (
        <div className="calculator-result">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Resultado</h3>
          <div className="bg-frete-50 border border-frete-100 rounded-lg p-4">
            <p className="text-lg font-medium text-gray-800">
              Valor estimado do frete: <span className="text-frete-600 font-bold">R$ {result.toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default FreightCalculator;
