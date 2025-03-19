
import React, { useState } from 'react';
import { Truck, DollarSign, BarChart3, RefreshCw, Calculator, CheckCircle } from 'lucide-react';
import Calculator from '../Calculator';
import ResultBox from './ResultBox';
import { formatCurrency } from '@/lib/utils';

const FreightCalculator = ({ isActive }: { isActive: boolean }) => {
  const [distance, setDistance] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [vehicleType, setVehicleType] = useState('truck');
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    
    // Simular uma operação assíncrona
    setTimeout(() => {
      try {
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
        
        // Calcular com base no tipo de veículo
        const distanceMultiplier = vehicleType === 'truck' ? 1.2 : 
                                  vehicleType === 'van' ? 1.0 : 0.8;
        
        const weightMultiplier = vehicleType === 'truck' ? 0.15 : 
                                vehicleType === 'van' ? 0.1 : 0.05;
        
        const distanceValue = typeof distance === 'number' ? distance : 0;
        const weightValue = typeof weight === 'number' ? weight : 0;
        
        const baseFreight = (distanceValue * baseCost * distanceMultiplier);
        const weightCost = (weightValue * weightMultiplier);
        const totalFreight = baseFreight + weightCost;
        const costPerKm = totalFreight / distanceValue;
        
        setResult({
          baseFreight: baseFreight,
          weightCost: weightCost,
          totalFreight: totalFreight,
          costPerKm: costPerKm,
          deliveryTime: calculateEstimatedTime(distanceValue, vehicleType)
        });
      } catch (error) {
        setHasError(true);
        setErrorMessage('Ocorreu um erro ao calcular o frete. Por favor, tente novamente.');
        console.error('Erro ao calcular frete:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 600); // Simulação de carga
  };
  
  const calculateEstimatedTime = (distance: number, vehicleType: string) => {
    let speedPerHour;
    
    switch (vehicleType) {
      case 'truck':
        speedPerHour = 70; // km/h
        break;
      case 'van':
        speedPerHour = 80; // km/h
        break;
      case 'motorcycle':
        speedPerHour = 90; // km/h
        break;
      default:
        speedPerHour = 60;
    }
    
    // Tempo em horas
    const timeInHours = distance / speedPerHour;
    
    // Adicionar paradas e descansos
    const restTime = Math.floor(distance / 250) * 0.5; // 30min a cada 250km
    
    const totalTime = timeInHours + restTime;
    
    // Formatar o tempo em horas e minutos
    const hours = Math.floor(totalTime);
    const minutes = Math.round((totalTime - hours) * 60);
    
    return `${hours}h ${minutes}min`;
  };

  const resetForm = () => {
    setDistance('');
    setWeight('');
    setVehicleType('truck');
    setResult(null);
    setHasError(false);
    setErrorMessage('');
  };

  return (
    <Calculator 
      id="calculadora-frete"
      title="Calculadora de Frete"
      description="Calcule o valor do frete com base na distância, peso da carga e tipo de veículo."
      isActive={isActive}
    >
      {hasError && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 flex items-center gap-2 animate-fade-in">
          <span className="text-danger-500"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3334C14.6024 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6024 1.66669 10 1.66669C5.39765 1.66669 1.66669 5.39765 1.66669 10C1.66669 14.6024 5.39765 18.3334 10 18.3334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6.66669V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 13.3333H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg></span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="calculator-input-group">
          <label htmlFor="distance" className="calculator-label flex items-center gap-1.5">
            <Truck size={16} className="text-frete-500" />
            Distância (km)
          </label>
          <input
            id="distance"
            type="number"
            className={`input-field ${hasError && distance === '' ? 'error' : ''}`}
            value={distance}
            min={0}
            onChange={(e) => setDistance(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="Ex: 100"
          />
        </div>
        
        <div className="calculator-input-group">
          <label htmlFor="weight" className="calculator-label flex items-center gap-1.5">
            <BarChart3 size={16} className="text-frete-500" />
            Peso da carga (kg)
          </label>
          <input
            id="weight"
            type="number"
            className={`input-field ${hasError && weight === '' ? 'error' : ''}`}
            value={weight}
            min={0}
            onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="Ex: 500"
          />
        </div>
        
        <div className="calculator-input-group md:col-span-2">
          <label htmlFor="vehicleType" className="calculator-label flex items-center gap-1.5">
            <DollarSign size={16} className="text-frete-500" />
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
      
      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          onClick={calculateFreight}
          className={`btn btn-primary ${isCalculating ? 'btn-loading' : ''}`}
          disabled={isCalculating}
        >
          {!isCalculating && <Calculator size={18} />}
          Calcular Frete
        </button>
        
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
              label="Valor do frete" 
              value={formatCurrency(result.totalFreight)}
              className="bg-frete-50 border-frete-100"
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
              label="Custo base" 
              value={formatCurrency(result.baseFreight)}
              tooltip="Custo calculado apenas pela distância"
            />
            
            <ResultBox 
              label="Custo adicional por peso" 
              value={formatCurrency(result.weightCost)}
              tooltip="Valor adicional calculado pelo peso da carga"
            />
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm flex items-start gap-2.5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-0.5 text-blue-500">
              <path d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 13.3333V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 6.66669H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="font-medium mb-1">Dica profissional:</p>
              <p>
                O valor do frete é calculado com base na distância, tipo de veículo e peso da carga. 
                Para fretes com caminhões, considere adicionar uma margem de 20% para despesas imprevistas.
              </p>
            </div>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default FreightCalculator;
