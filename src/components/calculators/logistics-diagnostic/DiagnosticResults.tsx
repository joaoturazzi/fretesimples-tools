
import React from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { DiagnosticResults } from './types';

interface DiagnosticResultsProps {
  profile: string;
  results: DiagnosticResults;
  onReset: () => void;
}

const DiagnosticResults: React.FC<DiagnosticResultsProps> = ({ profile, results, onReset }) => {
  return (
    <div className="py-4 animate-fade-in">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-3">
          <CheckCircle size={28} className="text-white" />
        </div>
        <h3 className="text-xl font-medium text-gray-900">Diagnóstico Concluído</h3>
        <p className="text-gray-500 mt-1">
          Perfil: {profile === 'transporter' ? 'Transportador' : 'Embarcador'}
        </p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <div className="text-gray-500 text-sm mb-1">Pontuação</div>
              <div className="text-2xl font-bold text-gray-900">{results.score} <span className="text-gray-500 text-lg font-normal">de 50 pontos</span></div>
            </div>
            
            <div className="mb-6">
              <div className="text-gray-500 text-sm mb-1">Nível de maturidade</div>
              <div className="text-xl font-medium text-gray-900">{results.level}</div>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100">
                    Maturidade
                  </span>
                </div>
              </div>
              <div className="flex h-2 mb-4 overflow-hidden bg-gray-200 rounded">
                <div
                  style={{ width: `${(results.score / 50) * 100}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    results.score <= 20
                      ? 'bg-red-500'
                      : results.score <= 35
                      ? 'bg-yellow-500'
                      : results.score <= 45
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                  }`}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Iniciante</span>
                <span>Intermediário</span>
                <span>Avançado</span>
                <span>Excelência</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 text-sm mb-3">Recomendações</div>
            <ul className="space-y-3">
              {results.recommendations.map((recommendation, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex">
                  <span className="text-orange-500 mr-2 flex-shrink-0 mt-0.5">{index + 1}.</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button
          onClick={onReset}
          className="btn btn-secondary"
        >
          <RefreshCw size={18} className="mr-2" />
          Realizar novo diagnóstico
        </button>
      </div>
    </div>
  );
};

export default DiagnosticResults;
