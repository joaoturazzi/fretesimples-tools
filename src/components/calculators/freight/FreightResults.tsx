
import React from 'react';
import { CheckCircle } from 'lucide-react';
import ResultBox from '../ResultBox';
import { FreightCalculationResult } from './freightCalculations';
import { formatCurrency } from '@/lib/utils';

interface FreightResultsProps {
  result: FreightCalculationResult;
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  vehicleType: string;
  routeDuration?: number;
}

const FreightResults: React.FC<FreightResultsProps> = ({ 
  result, 
  origin, 
  destination, 
  distance, 
  weight, 
  vehicleType, 
  routeDuration 
}) => {
  return (
    <div className="calculator-result">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="text-success-500" size={20} />
        <h3 className="text-xl font-semibold text-gray-900">Resultado do Frete</h3>
      </div>
      
      {/* Route info */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Informações da Rota</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Origem:</span>
            <span className="ml-2 font-medium">{origin}</span>
          </div>
          <div>
            <span className="text-gray-600">Destino:</span>
            <span className="ml-2 font-medium">{destination}</span>
          </div>
          <div>
            <span className="text-gray-600">Distância:</span>
            <span className="ml-2 font-medium">{distance} km</span>
          </div>
          <div>
            <span className="text-gray-600">Peso:</span>
            <span className="ml-2 font-medium">{weight} kg</span>
          </div>
          <div>
            <span className="text-gray-600">Veículo:</span>
            <span className="ml-2 font-medium">
              {vehicleType === 'truck' ? 'Caminhão' : 
               vehicleType === 'van' ? 'Van' : 'Motocicleta'}
            </span>
          </div>
          {routeDuration && (
            <div>
              <span className="text-gray-600">Tempo estimado:</span>
              <span className="ml-2 font-medium">
                {Math.floor(routeDuration / 60)}h {routeDuration % 60}m
              </span>
            </div>
          )}
        </div>
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
  );
};

export default FreightResults;
