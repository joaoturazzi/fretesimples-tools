
import React from 'react';

interface VehicleResultsProps {
  results: {
    totalWeight: number;
    totalVolume: number;
    recommendedVehicle: string;
    utilizationPercentage: number;
    alternativeVehicles: string[];
    warnings: string[];
  };
  isLiquid: boolean;
}

const VehicleResults = ({ results, isLiquid }: VehicleResultsProps) => {
  return (
    <div className="mt-6 bg-orange-50 border border-orange-100 rounded-lg p-5 animate-fade-in">
      <h4 className="text-lg font-medium text-orange-800 mb-3">Resultado:</h4>
      
      <div className="space-y-3">
        <div className="bg-white rounded p-3 border border-orange-100 grid grid-cols-2">
          <div className="text-gray-700">Peso total:</div>
          <div className="font-medium">{results.totalWeight.toLocaleString('pt-BR')} kg</div>
        </div>
        
        <div className="bg-white rounded p-3 border border-orange-100 grid grid-cols-2">
          <div className="text-gray-700">Volume total:</div>
          <div className="font-medium">
            {isLiquid 
              ? `${(results.totalVolume * 1000).toLocaleString('pt-BR')} litros`
              : `${results.totalVolume.toFixed(2)} m³`}
          </div>
        </div>
        
        <div className="bg-white rounded p-3 border border-orange-100 grid grid-cols-2">
          <div className="text-gray-700">Veículo recomendado:</div>
          <div className="font-medium">{results.recommendedVehicle}</div>
        </div>
        
        <div className="bg-white rounded p-3 border border-orange-100 grid grid-cols-2">
          <div className="text-gray-700">Utilização:</div>
          <div className="font-medium">{results.utilizationPercentage.toFixed(1)}%</div>
        </div>
        
        {results.alternativeVehicles.length > 0 && (
          <div className="bg-blue-50 rounded p-3 border border-blue-100">
            <p className="font-medium text-blue-800 mb-2">Alternativas viáveis:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              {results.alternativeVehicles.map((alt, idx) => (
                <li key={idx}>• {alt}</li>
              ))}
            </ul>
          </div>
        )}
        
        {results.warnings.length > 0 && (
          <div className="bg-yellow-50 rounded p-3 border border-yellow-100">
            <p className="font-medium text-yellow-800 mb-2">⚠️ Atenção:</p>
            <ul className="text-sm text-yellow-700 space-y-1">
              {results.warnings.map((warning, idx) => (
                <li key={idx}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="text-orange-700 text-sm bg-orange-100 rounded p-3 mt-3">
          <strong>Resumo:</strong> Para {isLiquid ? 'líquido' : 'carga sólida'} de{' '}
          {results.totalWeight.toLocaleString('pt-BR')} kg e{' '}
          {isLiquid 
            ? `${(results.totalVolume * 1000).toLocaleString('pt-BR')} litros`
            : `${results.totalVolume.toFixed(2)} m³`}, o veículo recomendado é{' '}
          <strong>{results.recommendedVehicle}</strong> com{' '}
          {results.utilizationPercentage.toFixed(1)}% de utilização.
        </div>
      </div>
    </div>
  );
};

export default VehicleResults;
