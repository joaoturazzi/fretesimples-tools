
import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  HelpCircle,
  Info,
  RefreshCw
} from 'lucide-react';

// Componente para exibir resultados
const ResultBox = ({ label, value, unit = '', className = '', tooltip = '' }) => {
  return (
    <div className={`result-box ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-500">{label}</span>
        {tooltip && (
          <div className="has-tooltip">
            <HelpCircle size={16} className="text-gray-400" />
            <span className="tooltip">{tooltip}</span>
          </div>
        )}
      </div>
      <div className="text-xl font-medium text-gray-900">
        {value} {unit && <span className="text-gray-500 text-sm">{unit}</span>}
      </div>
    </div>
  );
};

// 1. Calculadora de Custo de Frete
export const FreightCalculator = ({ isActive }) => {
  const [distance, setDistance] = useState('');
  const [weight, setWeight] = useState('');
  const [vehicleType, setVehicleType] = useState('van');
  const [fuelPrice, setFuelPrice] = useState('');
  const [tolls, setTolls] = useState('');
  const [profitMargin, setProfitMargin] = useState('');
  const [result, setResult] = useState(null);
  
  // Vehicle consumption based on type (km/l)
  const vehicleConsumption = {
    moto: 30,
    van: 10,
    caminhao: 5,
    carreta: 2.5
  };
  
  // Vehicle daily cost based on type (R$)
  const vehicleDailyCost = {
    moto: 50,
    van: 150,
    caminhao: 350,
    carreta: 600
  };
  
  const calculateFreight = () => {
    if (!distance || !weight || !fuelPrice || !profitMargin) return;
    
    const distanceNum = parseFloat(distance);
    const weightNum = parseFloat(weight);
    const fuelPriceNum = parseFloat(fuelPrice);
    const tollsNum = parseFloat(tolls) || 0;
    const profitMarginNum = parseFloat(profitMargin) / 100;
    
    // Calculate fuel cost
    const consumption = vehicleConsumption[vehicleType];
    const fuelCost = (distanceNum / consumption) * fuelPriceNum;
    
    // Calculate weight cost (R$ 0.02 per kg per 100km)
    const weightCost = (weightNum * 0.02) * (distanceNum / 100);
    
    // Daily cost based on vehicle type
    const dailyCost = vehicleDailyCost[vehicleType];
    
    // Calculate days (assume 500km per day)
    const days = Math.max(1, Math.ceil(distanceNum / 500));
    
    // Total operational cost
    const operationalCost = fuelCost + tollsNum + (dailyCost * days) + weightCost;
    
    // Add profit margin
    const totalCost = operationalCost * (1 + profitMarginNum);
    
    // Cost per km
    const costPerKm = totalCost / distanceNum;
    
    setResult({
      totalCost: totalCost.toFixed(2),
      operationalCost: operationalCost.toFixed(2),
      profitValue: (totalCost - operationalCost).toFixed(2),
      fuelCost: fuelCost.toFixed(2),
      costPerKm: costPerKm.toFixed(2),
      days
    });
  };
  
  // Reset form
  const resetForm = () => {
    setDistance('');
    setWeight('');
    setVehicleType('van');
    setFuelPrice('');
    setTolls('');
    setProfitMargin('');
    setResult(null);
  };
  
  return (
    <Calculator
      id="calculadora-frete"
      title="Calculadora de Custo de Frete"
      description="Calcule o valor do frete baseado nos custos operacionais e na margem de lucro desejada."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Peso da carga (kg)
            </label>
            <input
              type="number"
              id="weight"
              className="input-field"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 1500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de veículo
            </label>
            <select
              id="vehicleType"
              className="select-field"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="moto">Moto</option>
              <option value="van">Van</option>
              <option value="caminhao">Caminhão</option>
              <option value="carreta">Carreta</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="fuelPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Preço do combustível (R$/litro)
            </label>
            <input
              type="number"
              id="fuelPrice"
              className="input-field"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              placeholder="Ex: 5.80"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="tolls" className="block text-sm font-medium text-gray-700 mb-1">
              Pedágios estimados (R$)
            </label>
            <input
              type="number"
              id="tolls"
              className="input-field"
              value={tolls}
              onChange={(e) => setTolls(e.target.value)}
              placeholder="Ex: 120"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="profitMargin" className="block text-sm font-medium text-gray-700 mb-1">
              Margem de lucro (%)
            </label>
            <input
              type="number"
              id="profitMargin"
              className="input-field"
              value={profitMargin}
              onChange={(e) => setProfitMargin(e.target.value)}
              placeholder="Ex: 20"
              max="100"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateFreight}
        >
          Calcular
        </button>
        <button 
          className="btn btn-secondary"
          onClick={resetForm}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado do cálculo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ResultBox 
              label="Custo total do frete" 
              value={`R$ ${result.totalCost}`}
              tooltip="Inclui todos os custos e a margem de lucro"
              className="col-span-full sm:col-span-2 bg-frete-50"
            />
            <ResultBox 
              label="Custo operacional" 
              value={`R$ ${result.operationalCost}`}
              tooltip="Soma de todos os custos sem lucro"
            />
            <ResultBox 
              label="Valor do lucro" 
              value={`R$ ${result.profitValue}`}
              tooltip="Valor monetário de lucro"
            />
            <ResultBox 
              label="Custo de combustível" 
              value={`R$ ${result.fuelCost}`}
              tooltip="Apenas o custo com combustível"
            />
            <ResultBox 
              label="Custo por km" 
              value={`R$ ${result.costPerKm}`}
              tooltip="Custo total dividido pela distância"
              unit="/km"
            />
            <ResultBox 
              label="Tempo estimado" 
              value={result.days}
              tooltip="Dias estimados para completar a viagem"
              unit={result.days === 1 ? "dia" : "dias"}
            />
          </div>
        </div>
      )}
    </Calculator>
  );
};

// 2. Simulador de Lucro por Frete
export const ProfitSimulator = ({ isActive }) => {
  const [totalCost, setTotalCost] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState(null);
  
  const calculateProfit = () => {
    if (!totalCost || !price) return;
    
    const costValue = parseFloat(totalCost);
    const priceValue = parseFloat(price);
    
    const profit = priceValue - costValue;
    const marginPercent = (profit / priceValue) * 100;
    
    setResult({
      profit: profit.toFixed(2),
      marginPercent: marginPercent.toFixed(2),
      isProfit: profit > 0
    });
  };
  
  return (
    <Calculator
      id="simulador-lucro"
      title="Simulador de Lucro por Frete"
      description="Calcule o lucro líquido e a margem percentual com base no valor cobrado e nos custos."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700 mb-1">
              Custo total do frete (R$)
            </label>
            <input
              type="number"
              id="totalCost"
              className="input-field"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="Ex: 1200"
              step="0.01"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Valor cobrado do cliente (R$)
            </label>
            <input
              type="number"
              id="price"
              className="input-field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 1500"
              step="0.01"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateProfit}
        >
          Calcular
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setTotalCost('');
            setPrice('');
            setResult(null);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado do cálculo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultBox 
              label="Lucro Líquido" 
              value={`R$ ${result.profit}`}
              className={result.isProfit ? "bg-green-50" : "bg-red-50"}
            />
            <ResultBox 
              label="Margem de Lucro" 
              value={result.marginPercent}
              unit="%"
              className={result.isProfit ? "bg-green-50" : "bg-red-50"}
            />
          </div>
          
          <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 animate-fade-in ${result.isProfit ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {result.isProfit ? (
              <CheckCircle className="text-green-500 mt-0.5" size={20} />
            ) : (
              <XCircle className="text-red-500 mt-0.5" size={20} />
            )}
            <div>
              <p className="font-medium">
                {result.isProfit 
                  ? "Operação com lucro" 
                  : "Operação com prejuízo"}
              </p>
              <p className="text-sm mt-1">
                {result.isProfit 
                  ? `Você está tendo um lucro de R$ ${result.profit} (${result.marginPercent}%) neste frete.` 
                  : `Você está tendo um prejuízo de R$ ${Math.abs(parseFloat(result.profit)).toFixed(2)} neste frete. Considere renegociar o valor ou reduzir custos.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </Calculator>
  );
};

// 3. Calculadora de Risco de Transporte
export const RiskCalculator = ({ isActive }) => {
  const [cargoType, setCargoType] = useState('alimentos');
  const [cargoValue, setCargoValue] = useState('');
  const [distance, setDistance] = useState('');
  const [region, setRegion] = useState('urbana');
  const [result, setResult] = useState(null);
  
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
    const cargoFactor = cargoRisk[cargoType] * 5;
    
    // Region factor (0-20 points)
    const regFactor = regionRisk[region] * 4;
    
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
                {result.suggestions.map((suggestion, index) => (
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

// 4. Simulador de Custos de Transporte
export const TransportCostSimulator = ({ isActive }) => {
  const [fuel, setFuel] = useState('');
  const [tolls, setTolls] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [salary, setSalary] = useState('');
  const [distance, setDistance] = useState('');
  const [result, setResult] = useState(null);
  
  const calculateCosts = () => {
    if (!fuel || !maintenance || !salary || !distance) return;
    
    const fuelCost = parseFloat(fuel);
    const tollsCost = parseFloat(tolls) || 0;
    const maintenanceCost = parseFloat(maintenance);
    const salaryCost = parseFloat(salary);
    const totalDistance = parseFloat(distance);
    
    // Total monthly cost
    const totalCost = fuelCost + tollsCost + maintenanceCost + salaryCost;
    
    // Cost per km
    const costPerKm = totalCost / totalDistance;
    
    // Distribution of costs
    const fuelPercent = (fuelCost / totalCost) * 100;
    const tollsPercent = (tollsCost / totalCost) * 100;
    const maintenancePercent = (maintenanceCost / totalCost) * 100;
    const salaryPercent = (salaryCost / totalCost) * 100;
    
    setResult({
      totalCost: totalCost.toFixed(2),
      costPerKm: costPerKm.toFixed(2),
      fuelPercent: fuelPercent.toFixed(1),
      tollsPercent: tollsPercent.toFixed(1),
      maintenancePercent: maintenancePercent.toFixed(1),
      salaryPercent: salaryPercent.toFixed(1)
    });
  };
  
  return (
    <Calculator
      id="simulador-custos"
      title="Simulador de Custos de Transporte"
      description="Calcule o custo total do seu transporte e o custo por quilômetro rodado."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-1">
              Combustível mensal (R$)
            </label>
            <input
              type="number"
              id="fuel"
              className="input-field"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              placeholder="Ex: 3000"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="tolls" className="block text-sm font-medium text-gray-700 mb-1">
              Pedágios mensais (R$)
            </label>
            <input
              type="number"
              id="tolls"
              className="input-field"
              value={tolls}
              onChange={(e) => setTolls(e.target.value)}
              placeholder="Ex: 500"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distância mensal rodada (km)
            </label>
            <input
              type="number"
              id="distance"
              className="input-field"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Ex: 5000"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="maintenance" className="block text-sm font-medium text-gray-700 mb-1">
              Manutenção mensal (R$)
            </label>
            <input
              type="number"
              id="maintenance"
              className="input-field"
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
              placeholder="Ex: 800"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
              Salário do motorista (R$)
            </label>
            <input
              type="number"
              id="salary"
              className="input-field"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Ex: 2500"
              step="0.01"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateCosts}
        >
          Calcular
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setFuel('');
            setTolls('');
            setMaintenance('');
            setSalary('');
            setDistance('');
            setResult(null);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado do cálculo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultBox 
              label="Custo total mensal" 
              value={`R$ ${result.totalCost}`}
              className="col-span-full bg-frete-50"
            />
            <ResultBox 
              label="Custo por quilômetro" 
              value={`R$ ${result.costPerKm}`}
              unit="/km"
            />
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Distribuição de custos</h4>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Combustível</span>
                    <span>{result.fuelPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-frete-500 h-2 rounded-full" 
                      style={{ width: `${result.fuelPercent}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pedágios</span>
                    <span>{result.tollsPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${result.tollsPercent}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Manutenção</span>
                    <span>{result.maintenancePercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full" 
                      style={{ width: `${result.maintenancePercent}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Salário</span>
                    <span>{result.salaryPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${result.salaryPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Calculator>
  );
};

// 5. Calculadora de Consumo de Combustível
export const FuelCalculator = ({ isActive }) => {
  const [distance, setDistance] = useState('');
  const [consumption, setConsumption] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [result, setResult] = useState(null);
  
  const calculateFuel = () => {
    if (!distance || !consumption || !fuelPrice) return;
    
    const distanceValue = parseFloat(distance);
    const consumptionValue = parseFloat(consumption);
    const priceValue = parseFloat(fuelPrice);
    
    const liters = distanceValue / consumptionValue;
    const cost = liters * priceValue;
    
    setResult({
      liters: liters.toFixed(2),
      cost: cost.toFixed(2),
      costPerKm: (cost / distanceValue).toFixed(2)
    });
  };
  
  return (
    <Calculator
      id="calculadora-combustivel"
      title="Calculadora de Consumo de Combustível"
      description="Calcule o consumo de combustível e o custo para uma determinada distância."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="consumption" className="block text-sm font-medium text-gray-700 mb-1">
              Consumo médio (km/l)
            </label>
            <input
              type="number"
              id="consumption"
              className="input-field"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              placeholder="Ex: 10"
              step="0.1"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="fuelPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Preço do combustível (R$/l)
            </label>
            <input
              type="number"
              id="fuelPrice"
              className="input-field"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              placeholder="Ex: 5.80"
              step="0.01"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateFuel}
        >
          Calcular
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setDistance('');
            setConsumption('');
            setFuelPrice('');
            setResult(null);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado do cálculo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultBox 
              label="Litros necessários" 
              value={result.liters}
              unit="litros"
            />
            <ResultBox 
              label="Custo total" 
              value={`R$ ${result.cost}`}
              className="bg-frete-50"
            />
            <ResultBox 
              label="Custo por quilômetro" 
              value={`R$ ${result.costPerKm}`}
              unit="/km"
            />
          </div>
        </div>
      )}
    </Calculator>
  );
};

// 6. Verificador de Viabilidade de Frete
export const FreightViabilityChecker = ({ isActive }) => {
  const [totalCost, setTotalCost] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState(null);
  
  const checkViability = () => {
    if (!totalCost || !price) return;
    
    const costValue = parseFloat(totalCost);
    const priceValue = parseFloat(price);
    
    const profit = priceValue - costValue;
    const marginPercent = (profit / priceValue) * 100;
    const isViable = profit > 0;
    
    // Suggested minimum price (cost + 20% margin)
    const suggestedPrice = costValue / 0.8;
    
    setResult({
      isViable,
      profit: profit.toFixed(2),
      marginPercent: marginPercent.toFixed(2),
      suggestedPrice: suggestedPrice.toFixed(2),
      priceDifference: (suggestedPrice - priceValue).toFixed(2)
    });
  };
  
  return (
    <Calculator
      id="verificador-viabilidade"
      title="Verificador de Viabilidade de Frete"
      description="Verifique se um frete é viável financeiramente e obtenha sugestões de preço mínimo."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700 mb-1">
              Custo total do frete (R$)
            </label>
            <input
              type="number"
              id="totalCost"
              className="input-field"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="Ex: 1200"
              step="0.01"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Valor cobrado do cliente (R$)
            </label>
            <input
              type="number"
              id="price"
              className="input-field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 1500"
              step="0.01"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={checkViability}
        >
          Verificar viabilidade
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setTotalCost('');
            setPrice('');
            setResult(null);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {result && (
        <div className="mt-8 animate-fade-in">
          <div 
            className={`p-5 rounded-lg mb-6 flex items-start gap-4 ${
              result.isViable 
                ? "bg-green-50 border border-green-100" 
                : "bg-red-50 border border-red-100"
            }`}
          >
            {result.isViable ? (
              <CheckCircle size={24} className="text-green-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={24} className="text-red-500 shrink-0 mt-0.5" />
            )}
            
            <div>
              <h3 className={`text-lg font-medium ${
                result.isViable ? "text-green-800" : "text-red-800"
              }`}>
                {result.isViable ? "Vale a pena" : "Prejuízo"}
              </h3>
              
              <p className={`mt-1 ${
                result.isViable ? "text-green-700" : "text-red-700"
              }`}>
                {result.isViable 
                  ? `Este frete gera um lucro de R$ ${result.profit} (margem de ${result.marginPercent}%).` 
                  : `Este frete gera um prejuízo de R$ ${Math.abs(parseFloat(result.profit)).toFixed(2)}.`}
              </p>
              
              {!result.isViable && (
                <div className="mt-4">
                  <p className="font-medium text-gray-800">
                    Para uma margem de lucro de 20%, o valor mínimo recomendado seria:
                  </p>
                  <p className="text-lg font-bold mt-1 text-frete-600">
                    R$ {result.suggestedPrice} <span className="text-sm font-normal text-gray-500">(R$ {result.priceDifference} a mais que o valor atual)</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
            <div className="text-blue-800 text-sm">
              <p className="font-medium">Dica profissional:</p>
              <p className="mt-1">
                Para um frete ser considerado viável, ele deve cobrir todos os custos e ainda gerar uma margem de 
                lucro satisfatória (geralmente entre 15% a 30%).
              </p>
            </div>
          </div>
        </div>
      )}
    </Calculator>
  );
};

// 7. Checklist de Viagem para Transportadores
export const TripChecklist = ({ isActive }) => {
  const [cargoType, setCargoType] = useState('normal');
  const [distance, setDistance] = useState('curta');
  const [vehicleType, setVehicleType] = useState('van');
  const [checklist, setChecklist] = useState(null);
  
  // Generate checklist based on selections
  const generateChecklist = () => {
    // Common items for all trips
    const commonItems = [
      { item: 'Documento do veículo (CRLV)', category: 'Documentação' },
      { item: 'Carteira de habilitação', category: 'Documentação' },
      { item: 'Documentação da carga/Nota fiscal', category: 'Documentação' },
      { item: 'Verificar nível de combustível', category: 'Veículo' },
      { item: 'Verificar nível de óleo', category: 'Veículo' },
      { item: 'Verificar pressão dos pneus', category: 'Veículo' },
      { item: 'Verificar faróis, lanternas e setas', category: 'Veículo' },
      { item: 'Água para radiador e limpador', category: 'Veículo' },
      { item: 'Kit de ferramentas básicas', category: 'Emergência' },
      { item: 'Triângulo de sinalização', category: 'Emergência' },
    ];
    
    // Distance-specific items
    const distanceItems = {
      'curta': [
        { item: 'Rota planejada', category: 'Planejamento' },
        { item: 'Contato do destinatário', category: 'Contatos' },
      ],
      'media': [
        { item: 'Rota planejada com pontos de parada', category: 'Planejamento' },
        { item: 'Contato de emergência da empresa', category: 'Contatos' },
        { item: 'Dinheiro para pedágios', category: 'Financeiro' },
        { item: 'Água e lanche', category: 'Pessoal' },
        { item: 'Verificar estepe', category: 'Veículo' },
      ],
      'longa': [
        { item: 'Rota completa com alternativas', category: 'Planejamento' },
        { item: 'Planejamento de paradas para descanso', category: 'Planejamento' },
        { item: 'Contatos de emergência ao longo da rota', category: 'Contatos' },
        { item: 'Dinheiro para pedágios e emergências', category: 'Financeiro' },
        { item: 'Cartão de crédito/débito', category: 'Financeiro' },
        { item: 'Kit de primeiros socorros', category: 'Emergência' },
        { item: 'Lanterna', category: 'Emergência' },
        { item: 'Cobertor', category: 'Pessoal' },
        { item: 'Roupas extras', category: 'Pessoal' },
        { item: 'Produtos de higiene pessoal', category: 'Pessoal' },
        { item: 'Verificar suspensão e freios', category: 'Veículo' },
        { item: 'Reserva de óleo do motor', category: 'Veículo' },
      ],
    };
    
    // Vehicle-specific items
    const vehicleItems = {
      'moto': [
        { item: 'Capacete', category: 'Equipamento' },
        { item: 'Luvas', category: 'Equipamento' },
        { item: 'Jaqueta de proteção', category: 'Equipamento' },
        { item: 'Capa de chuva', category: 'Equipamento' },
        { item: 'Verificar corrente', category: 'Veículo' },
      ],
      'van': [
        { item: 'Verificar portas de carga', category: 'Veículo' },
        { item: 'Cintas/cordas para fixação', category: 'Equipamento' },
        { item: 'Lonas/coberturas para carga', category: 'Equipamento' },
      ],
      'caminhao': [
        { item: 'Verificar freio de ar', category: 'Veículo' },
        { item: 'Tacógrafo calibrado', category: 'Veículo' },
        { item: 'Cintas/amarrações para carga', category: 'Equipamento' },
        { item: 'Lonas/coberturas para carga', category: 'Equipamento' },
        { item: 'Calços para rodas', category: 'Equipamento' },
        { item: 'Cabos de aço/correntes', category: 'Equipamento' },
      ],
      'carreta': [
        { item: 'Verificar freio de ar', category: 'Veículo' },
        { item: 'Tacógrafo calibrado', category: 'Veículo' },
        { item: 'Verificar engate/quinta roda', category: 'Veículo' },
        { item: 'Cintas/amarrações para carga', category: 'Equipamento' },
        { item: 'Lonas/coberturas para carga', category: 'Equipamento' },
        { item: 'Calços para rodas', category: 'Equipamento' },
        { item: 'Cabos de aço/correntes', category: 'Equipamento' },
        { item: 'Extintor especial', category: 'Emergência' },
      ],
    };
    
    // Cargo-specific items
    const cargoItems = {
      'normal': [
        { item: 'Verificar embalagem', category: 'Carga' },
      ],
      'perecivel': [
        { item: 'Verificar sistema de refrigeração', category: 'Veículo' },
        { item: 'Verificar termômetro', category: 'Equipamento' },
        { item: 'Registro de temperatura', category: 'Documentação' },
        { item: 'Certificado sanitário', category: 'Documentação' },
      ],
      'perigosa': [
        { item: 'Ficha de emergência', category: 'Documentação' },
        { item: 'Envelope para transporte', category: 'Documentação' },
        { item: 'Sinalização específica do produto', category: 'Equipamento' },
        { item: 'EPIs específicos', category: 'Equipamento' },
        { item: 'Curso MOPP atualizado', category: 'Documentação' },
        { item: 'Kit de contenção de vazamento', category: 'Emergência' },
        { item: 'Extintores específicos', category: 'Emergência' },
      ],
      'fragil': [
        { item: 'Material de proteção adicional', category: 'Equipamento' },
        { item: 'Verificar sistema de amortecimento', category: 'Veículo' },
        { item: 'Etiquetas de "Frágil"', category: 'Equipamento' },
      ],
      'valiosa': [
        { item: 'Seguro específico', category: 'Documentação' },
        { item: 'Sistema de rastreamento ativo', category: 'Equipamento' },
        { item: 'Trava adicional', category: 'Equipamento' },
        { item: 'Plano de rota segura', category: 'Planejamento' },
      ],
    };
    
    // Combine all relevant items
    let allItems = [...commonItems];
    
    if (distanceItems[distance]) {
      allItems = [...allItems, ...distanceItems[distance]];
    }
    
    if (vehicleItems[vehicleType]) {
      allItems = [...allItems, ...vehicleItems[vehicleType]];
    }
    
    if (cargoItems[cargoType]) {
      allItems = [...allItems, ...cargoItems[cargoType]];
    }
    
    // Group by category
    const groupedItems = allItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item.item);
      return acc;
    }, {});
    
    setChecklist(groupedItems);
  };
  
  return (
    <Calculator
      id="checklist-viagem"
      title="Checklist de Viagem para Transportadores"
      description="Gere um checklist personalizado para sua viagem com base no tipo de carga e distância."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <option value="normal">Normal/Geral</option>
              <option value="perecivel">Perecível</option>
              <option value="perigosa">Perigosa</option>
              <option value="fragil">Frágil</option>
              <option value="valiosa">Valiosa</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distância
            </label>
            <select
              id="distance"
              className="select-field"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              <option value="curta">Curta (até 100km)</option>
              <option value="media">Média (100-500km)</option>
              <option value="longa">Longa (acima de 500km)</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de veículo
            </label>
            <select
              id="vehicleType"
              className="select-field"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="moto">Moto</option>
              <option value="van">Van</option>
              <option value="caminhao">Caminhão</option>
              <option value="carreta">Carreta</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={generateChecklist}
        >
          Gerar checklist
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setCargoType('normal');
            setDistance('curta');
            setVehicleType('van');
            setChecklist(null);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {checklist && (
        <div className="mt-8 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Checklist de viagem</h3>
            <button 
              className="btn btn-small bg-gray-100 hover:bg-gray-200 text-gray-700"
              onClick={() => {
                // Print checklist
                window.print();
              }}
            >
              Imprimir
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {Object.keys(checklist).map((category, index) => (
              <div 
                key={category}
                className={`${index > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div className="bg-gray-50 px-4 py-2 font-medium text-gray-700">
                  {category}
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {checklist[category].map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start p-2 border border-gray-100 rounded"
                      >
                        <input 
                          type="checkbox" 
                          id={`item-${index}-${idx}`}
                          className="mt-0.5 mr-3 h-4 w-4 text-frete-500 rounded border-gray-300 focus:ring-frete-400"
                        />
                        <label 
                          htmlFor={`item-${index}-${idx}`}
                          className="text-gray-700"
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-gray-500 text-sm italic">
            Este checklist foi gerado com base nos parâmetros selecionados. Certifique-se de adicionar itens específicos para sua operação se necessário.
          </div>
        </div>
      )}
    </Calculator>
  );
};

// 8. Marketplace de Vagas para Motoristas
export const JobMarketplace = ({ isActive }) => {
  // State for job listings
  const [jobs, setJobs] = useState([]);
  const [drivers, setDrivers] = useState([]);
  
  // State for forms
  const [jobForm, setJobForm] = useState({
    company: '',
    route: '',
    type: 'frete',
    payment: '',
    contact: '',
    description: ''
  });
  
  const [driverForm, setDriverForm] = useState({
    name: '',
    experience: '',
    license: 'B',
    region: '',
    contact: '',
    availability: 'integral'
  });
  
  const [activeTab, setActiveTab] = useState('jobs');
  
  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedJobs = localStorage.getItem('fretesimples_jobs');
      const savedDrivers = localStorage.getItem('fretesimples_drivers');
      
      if (savedJobs) {
        try {
          setJobs(JSON.parse(savedJobs));
        } catch (e) {
          console.error('Error parsing saved jobs', e);
        }
      }
      
      if (savedDrivers) {
        try {
          setDrivers(JSON.parse(savedDrivers));
        } catch (e) {
          console.error('Error parsing saved drivers', e);
        }
      }
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fretesimples_jobs', JSON.stringify(jobs));
      localStorage.setItem('fretesimples_drivers', JSON.stringify(drivers));
    }
  }, [jobs, drivers]);
  
  // Handle job form changes
  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle driver form changes
  const handleDriverFormChange = (e) => {
    const { name, value } = e.target;
    setDriverForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add new job
  const addJob = (e) => {
    e.preventDefault();
    
    if (!jobForm.company || !jobForm.route || !jobForm.payment || !jobForm.contact) {
      return; // Don't add incomplete entries
    }
    
    const newJob = {
      ...jobForm,
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR')
    };
    
    setJobs(prev => [newJob, ...prev]);
    
    // Reset form
    setJobForm({
      company: '',
      route: '',
      type: 'frete',
      payment: '',
      contact: '',
      description: ''
    });
  };
  
  // Add new driver
  const addDriver = (e) => {
    e.preventDefault();
    
    if (!driverForm.name || !driverForm.experience || !driverForm.region || !driverForm.contact) {
      return; // Don't add incomplete entries
    }
    
    const newDriver = {
      ...driverForm,
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR')
    };
    
    setDrivers(prev => [newDriver, ...prev]);
    
    // Reset form
    setDriverForm({
      name: '',
      experience: '',
      license: 'B',
      region: '',
      contact: '',
      availability: 'integral'
    });
  };
  
  // Remove a job
  const removeJob = (id) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };
  
  // Remove a driver
  const removeDriver = (id) => {
    setDrivers(prev => prev.filter(driver => driver.id !== id));
  };
  
  return (
    <Calculator
      id="marketplace"
      title="Marketplace de Vagas para Motoristas"
      description="Encontre ou anuncie vagas para motoristas e transportadores."
      isActive={isActive}
    >
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-3 px-4 font-medium text-sm flex-1 ${
              activeTab === 'jobs' 
                ? 'text-frete-600 border-b-2 border-frete-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('jobs')}
          >
            Vagas disponíveis
          </button>
          <button
            className={`py-3 px-4 font-medium text-sm flex-1 ${
              activeTab === 'drivers' 
                ? 'text-frete-600 border-b-2 border-frete-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('drivers')}
          >
            Motoristas disponíveis
          </button>
          <button
            className={`py-3 px-4 font-medium text-sm flex-1 ${
              activeTab === 'add' 
                ? 'text-frete-600 border-b-2 border-frete-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('add')}
          >
            Adicionar anúncio
          </button>
        </div>
      </div>
      
      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vagas disponíveis</h3>
            
            {jobs.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Nenhuma vaga disponível no momento.</p>
                <button
                  className="mt-4 btn btn-small btn-primary"
                  onClick={() => setActiveTab('add')}
                >
                  Adicionar uma vaga
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div 
                    key={job.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.company}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-frete-100 text-frete-800">
                            {job.type === 'frete' ? 'Frete' : job.type === 'fixo' ? 'Emprego Fixo' : 'Temporário'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {job.date}
                          </span>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeJob(job.id)}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      <div>
                        <span className="text-sm text-gray-500">Rota/Local:</span>
                        <p className="text-gray-800">{job.route}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Valor/Salário:</span>
                        <p className="text-gray-800">{job.payment}</p>
                      </div>
                    </div>
                    
                    {job.description && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-500">Descrição:</span>
                        <p className="text-gray-700 text-sm mt-1">{job.description}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span>Contato: </span>
                        <span className="font-medium text-gray-900">{job.contact}</span>
                      </div>
                      <a
                        href={`https://wa.me/${job.contact.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-small btn-primary bg-green-500 hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Motoristas disponíveis</h3>
            
            {drivers.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Nenhum motorista disponível no momento.</p>
                <button
                  className="mt-4 btn btn-small btn-primary"
                  onClick={() => setActiveTab('add')}
                >
                  Adicionar perfil de motorista
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {drivers.map(driver => (
                  <div 
                    key={driver.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{driver.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {`CNH ${driver.license}`}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {driver.availability === 'integral' ? 'Tempo Integral' : driver.availability === 'parcial' ? 'Tempo Parcial' : 'Fins de semana'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {driver.date}
                          </span>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => removeDriver(driver.id)}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      <div>
                        <span className="text-sm text-gray-500">Experiência:</span>
                        <p className="text-gray-800">{driver.experience}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Região:</span>
                        <p className="text-gray-800">{driver.region}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span>Contato: </span>
                        <span className="font-medium text-gray-900">{driver.contact}</span>
                      </div>
                      <a
                        href={`https://wa.me/${driver.contact.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-small btn-primary bg-green-500 hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Add Listing Tab */}
      {activeTab === 'add' && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adicionar anúncio</h3>
            
            <div className="mb-4">
              <div className="flex rounded-md overflow-hidden border border-gray-200">
                <button
                  className={`flex-1 py-3 px-4 ${
                    activeTab === 'add' && jobForm.company !== undefined
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => {
                    setJobForm({
                      company: '',
                      route: '',
                      type: 'frete',
                      payment: '',
                      contact: '',
                      description: ''
                    });
                    setDriverForm(undefined);
                  }}
                >
                  Anunciar vaga
                </button>
                <button
                  className={`flex-1 py-3 px-4 ${
                    activeTab === 'add' && driverForm.name !== undefined
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => {
                    setDriverForm({
                      name: '',
                      experience: '',
                      license: 'B',
                      region: '',
                      contact: '',
                      availability: 'integral'
                    });
                    setJobForm(undefined);
                  }}
                >
                  Perfil de motorista
                </button>
              </div>
            </div>
            
            {/* Job Form */}
            {jobForm && (
              <form onSubmit={addJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa/Nome *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      className="input-field"
                      value={jobForm.company}
                      onChange={handleJobFormChange}
                      placeholder="Nome da empresa ou pessoa"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                      Rota/Local *
                    </label>
                    <input
                      type="text"
                      id="route"
                      name="route"
                      required
                      className="input-field"
                      value={jobForm.route}
                      onChange={handleJobFormChange}
                      placeholder="Ex: São Paulo - Rio de Janeiro"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de vaga
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="select-field"
                      value={jobForm.type}
                      onChange={handleJobFormChange}
                    >
                      <option value="frete">Frete</option>
                      <option value="fixo">Emprego Fixo</option>
                      <option value="temporario">Temporário</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-1">
                      Valor/Salário *
                    </label>
                    <input
                      type="text"
                      id="payment"
                      name="payment"
                      required
                      className="input-field"
                      value={jobForm.payment}
                      onChange={handleJobFormChange}
                      placeholder="Ex: R$ 2.500,00 ou R$ 1.200 por viagem"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                      Contato (telefone) *
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      required
                      className="input-field"
                      value={jobForm.contact}
                      onChange={handleJobFormChange}
                      placeholder="Ex: (11) 98765-4321"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição (opcional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="input-field"
                      value={jobForm.description}
                      onChange={handleJobFormChange}
                      placeholder="Detalhe o serviço, requisitos, benefícios, etc."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary">
                    Publicar vaga
                  </button>
                </div>
              </form>
            )}
            
            {/* Driver Form */}
            {driverForm && (
              <form onSubmit={addDriver} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="input-field"
                      value={driverForm.name}
                      onChange={handleDriverFormChange}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria da CNH
                    </label>
                    <select
                      id="license"
                      name="license"
                      className="select-field"
                      value={driverForm.license}
                      onChange={handleDriverFormChange}
                    >
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Experiência *
                    </label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      required
                      className="input-field"
                      value={driverForm.experience}
                      onChange={handleDriverFormChange}
                      placeholder="Ex: 5 anos como motorista de caminhão"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Região de atuação *
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      required
                      className="input-field"
                      value={driverForm.region}
                      onChange={handleDriverFormChange}
                      placeholder="Ex: Grande São Paulo, Nordeste, Todo Brasil"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                      Contato (telefone) *
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      required
                      className="input-field"
                      value={driverForm.contact}
                      onChange={handleDriverFormChange}
                      placeholder="Ex: (11) 98765-4321"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                      Disponibilidade
                    </label>
                    <select
                      id="availability"
                      name="availability"
                      className="select-field"
                      value={driverForm.availability}
                      onChange={handleDriverFormChange}
                    >
                      <option value="integral">Tempo Integral</option>
                      <option value="parcial">Tempo Parcial</option>
                      <option value="fds">Fins de semana</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary">
                    Publicar perfil
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-yellow-800 text-sm">
            <p className="flex items-start gap-2">
              <AlertCircle className="shrink-0 text-yellow-500 mt-0.5" size={18} />
              <span>
                Este é um marketplace simples armazenado apenas no seu navegador. As informações não são enviadas 
                para um servidor e ficarão salvas apenas neste dispositivo.
              </span>
            </p>
          </div>
        </>
      )}
    </Calculator>
  );
};
