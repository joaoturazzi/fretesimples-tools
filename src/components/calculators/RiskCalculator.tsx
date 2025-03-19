
import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import { RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface RiskCalculatorProps {
  isActive: boolean;
}

const RiskCalculator = ({ isActive }: RiskCalculatorProps) => {
  const [cargoType, setCargoType] = useState('alimentos');
  const [cargoValue, setCargoValue] = useState('');
  const [distance, setDistance] = useState('');
  const [region, setRegion] = useState('urbana');
  const [result, setResult] = useState<any>(null);
  
  // Risk score calculation
  const calculateRisk = () => {
    if (!cargoValue || !distance) return;
    
    const value = parseFloat(cargoValue);
    const dist = parseFloat(distance);
    
    // Base risk factors
    const cargoRisk = {
      'eletronicos': 5,
      'alimentos': 2,
      'carga_perigosa': 4,
      'medicamentos': 4,
      'vestuario': 3,
      'moveis': 2,
      'automoveis': 5,
      'outros': 3
    };
    
    const regionRisk = {
      'urbana': 2,
      'rodovia': 3,
      'zona_risco': 5
    };
    
    // Calculate base risk score (0-100)
    let riskScore = 0;
    
    // Value factor (0-40 points)
    const valueFactor = Math.min(40, (value / 50000) * 40);
    
    // Distance factor (0-15 points)
    const distanceFactor = Math.min(15, (dist / 1000) * 15);
    
    // Cargo type factor (0-25 points)
    const cargoFactor = cargoRisk[cargoType as keyof typeof cargoRisk] * 5;
    
    // Region factor (0-20 points)
    const regFactor = regionRisk[region as keyof typeof regionRisk] * 4;
    
    riskScore = valueFactor + distanceFactor + cargoFactor + regFactor;
    
    // Risk level
    let riskLevel = 'Baixo';
    let riskColor = 'green';
    let suggestions = [];
    
    if (riskScore > 70) {
      riskLevel = 'Alto';
      riskColor = 'red';
      suggestions = [
        'Contratar escolta durante todo o trajeto',
        'Utilizar rastreamento em tempo real',
        'Seguro de carga com cobertura completa',
        'Motorista experiente para este tipo de rota',
        'Evitar paradas em locais não seguros',
        'Planejamento detalhado da rota com pontos de descanso seguros'
      ];
    } else if (riskScore > 40) {
      riskLevel = 'Médio';
      riskColor = 'yellow';
      suggestions = [
        'Rastreamento veicular ativo',
        'Seguro de carga adequado',
        'Definir rotas principais e alternativas',
        'Evitar trafegar durante a noite em áreas de risco',
        'Estabelecer check-ins periódicos'
      ];
    } else {
      suggestions = [
        'Rastreamento básico do veículo',
        'Seguro padrão para a carga',
        'Planejar paradas em locais seguros',
        'Verificar condições climáticas da rota'
      ];
    }
    
    setResult({
      riskScore: riskScore.toFixed(0),
      riskLevel,
      riskColor,
      suggestions
    });
  };
  
  return (
    <Calculator
      id="calculadora-risco"
      title="Calculadora de Risco de Transporte"
      description="Avalie o nível de risco da sua operação de transporte e receba recomendações de segurança."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de carga
            </label>
            <select
              id="cargoType"
              className="select-field"
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
            >
              <option value="eletronicos">Eletrônicos</option>
              <option value="alimentos">Alimentos</option>
              <option value="carga_perigosa">Carga perigosa</option>
              <option value="medicamentos">Medicamentos</option>
              <option value="vestuario">Vestuário</option>
              <option value="moveis">Móveis</option>
              <option value="automoveis">Automóveis/Peças</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="cargoValue" className="block text-sm font-medium text-gray-700 mb-1">
              Valor da carga (R$)
            </label>
            <input
              type="number"
              id="cargoValue"
              className="input-field"
              value={cargoValue}
              onChange={(e) => setCargoValue(e.target.value)}
              placeholder="Ex: 50000"
              step="100"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distância (km)
            </label>
            <input
              type="number"
              id="distance"
              className="input-field"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Ex: 350"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Região da entrega
            </label>
            <select
              id="region"
              className="select-field"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="urbana">Urbana</option>
              <option value="rodovia">Rodovia</option>
              <option value="zona_risco">Zona de risco</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateRisk}
        >
          Calcular risco
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setCargoType('alimentos');
            setCargoValue('');
            setDistance('');
            setRegion('urbana');
            setResult(null);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
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
          
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3">
            <Info className="text-blue-500 mt-0.5" size={20} />
            <p className="text-sm">
              Esta avaliação de risco é uma estimativa baseada nas informações fornecidas. 
              Sempre consulte profissionais de segurança e sua seguradora para uma análise completa.
            </p>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default RiskCalculator;
