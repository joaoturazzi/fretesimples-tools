
import React from 'react';
import { AlertCircle, CheckCircle, Info, MessageCircle } from 'lucide-react';

interface RiskResult {
  riskScore: string;
  riskLevel: string;
  riskColor: string;
  suggestions: string[];
  routeDistance: number | null;
  valueFactor: number;
  cargoFactor: number;
  contractFactor: number;
  distanceFactor: number;
  toolsFactor: number;
}

interface RiskResultsProps {
  result: RiskResult;
  onWhatsAppContact: () => void;
}

const RiskResults = ({ result, onWhatsAppContact }: RiskResultsProps) => {
  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Análise de risco</h3>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Nível de risco</span>
            <div className="text-xl font-medium mt-1 flex items-center">
              <span className={`text-${result.riskColor}-600`}>
                {result.riskLevel}
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-700">{result.riskScore} pontos</span>
              {result.routeDistance && (
                <>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-600">{result.routeDistance} km</span>
                </>
              )}
            </div>
          </div>
          <div 
            className={`h-16 w-16 rounded-full flex items-center justify-center text-white font-bold
              ${result.riskColor === 'red' 
                ? 'bg-red-500' 
                : result.riskColor === 'yellow' 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'}`}
          >
            {result.riskScore}/100
          </div>
        </div>
        
        <div className="p-4">
          <h4 className="font-medium mb-3 flex items-center">
            <AlertCircle size={18} className="mr-2 text-gray-500" />
            Recomendações de segurança
          </h4>
          <ul className="space-y-2">
            {result.suggestions.map((suggestion: string, index: number) => (
              <li 
                key={index}
                className="flex items-start"
              >
                <CheckCircle size={16} className="mr-2 mt-0.5 text-frete-500" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 mb-4">
        <Info className="text-blue-500 mt-0.5" size={20} />
        <p className="text-sm">
          Esta avaliação de risco é uma estimativa baseada nas informações fornecidas. 
          Sempre consulte profissionais de segurança e sua seguradora para uma análise completa.
        </p>
      </div>

      <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start gap-3">
        <MessageCircle className="text-green-500 mt-0.5" size={20} />
        <div>
          <p className="font-medium mb-1">Quer uma análise de risco completa?</p>
          <p className="text-sm mb-3">
            Nossos especialistas podem fazer uma análise detalhada da sua operação e sugerir as melhores práticas de segurança.
          </p>
          <button 
            className="btn btn-sm"
            onClick={onWhatsAppContact}
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            <MessageCircle size={16} className="mr-2" />
            Falar com especialista
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskResults;
