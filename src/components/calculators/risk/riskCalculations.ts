
interface RiskFactors {
  cargoType: string;
  cargoValue: number;
  contractType: string;
  routeDistance: number | null;
  currentTools: string;
  travelTime?: string;
  driverType?: string;
}

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

const cargoRisk = {
  'eletronicos': 9,
  'alimentos': 3,
  'carga_perigosa': 10,
  'medicamentos': 8,
  'vestuario': 4,
  'moveis': 3,
  'automoveis': 9,
  'combustivel': 10,
  'quimicos': 9,
  'joias': 10,
  'outros': 5
};

const contractRisk = {
  'frota_propria': 1,
  'agregado': 4,
  'terceiro': 6
};

const travelTimeRisk = {
  'diurno': 1,
  'noturno': 3,
  'madrugada': 5
};

const driverTypeRisk = {
  'proprio': 1,
  'agregado': 3,
  'aplicativo': 5
};

// Trechos críticos do Brasil
const criticalRoutes = [
  'BR-116', 'BR-101', 'SP-330', 'SP-348', 'BR-493',
  'Baixada Santista', 'Grande Rio', 'Dutra', 'Fernão Dias'
];

export const calculateRisk = (factors: RiskFactors): RiskResult => {
  const { cargoType, cargoValue, contractType, routeDistance, currentTools, travelTime = 'diurno', driverType = 'proprio' } = factors;

  // Enhanced distance risk factor
  const distanceRisk = routeDistance ? Math.min(10, Math.floor(routeDistance / 200)) : 5;
  
  // Calculate enhanced risk score (0-100)
  let riskScore = 0;
  
  // Value factor (0-25 points) - progressive scale
  let valueFactor = 0;
  if (cargoValue <= 10000) valueFactor = 3;
  else if (cargoValue <= 50000) valueFactor = 8;
  else if (cargoValue <= 100000) valueFactor = 15;
  else if (cargoValue <= 500000) valueFactor = 20;
  else valueFactor = 25;
  
  // Cargo type factor (0-20 points)
  const cargoFactor = (cargoRisk[cargoType as keyof typeof cargoRisk] || 5) * 2;
  
  // Contract type factor (0-15 points)
  const contractFactor = contractRisk[contractType as keyof typeof contractRisk] * 2.5;
  
  // Distance factor (0-10 points)
  const distanceFactor = distanceRisk;
  
  // Travel time factor (0-10 points)
  const timeFactor = travelTimeRisk[travelTime as keyof typeof travelTimeRisk] * 2;
  
  // Driver type factor (0-10 points)
  const driverFactor = driverTypeRisk[driverType as keyof typeof driverTypeRisk] * 2;
  
  // Tools factor (0-20 points) - enhanced evaluation
  let toolsFactor = 20;
  const tools = currentTools.toLowerCase();
  if (tools.includes('rastreamento') || tools.includes('gps')) toolsFactor -= 4;
  if (tools.includes('seguro')) toolsFactor -= 4;
  if (tools.includes('escolta')) toolsFactor -= 6;
  if (tools.includes('lacre') || tools.includes('isca')) toolsFactor -= 3;
  if (tools.includes('monitoramento')) toolsFactor -= 3;
  
  riskScore = valueFactor + cargoFactor + contractFactor + distanceFactor + timeFactor + driverFactor + Math.max(0, toolsFactor);
  
  // Enhanced risk categorization
  let riskLevel = 'Baixo';
  let riskColor = 'green';
  let suggestions: string[] = [];
  
  if (riskScore > 75) {
    riskLevel = 'Crítico';
    riskColor = 'red';
    suggestions = [
      'Escolta armada obrigatória durante todo o trajeto',
      'Rastreamento em tempo real com central 24h',
      'Seguro de carga com cobertura total do valor',
      'Motorista experiente e certificado para cargas de alto valor',
      'Plano de contingência detalhado com rotas alternativas',
      'Comunicação constante com base operacional a cada 30 minutos',
      'Isca eletrônica e lacres de segurança avançados',
      'Evitar paradas não programadas e áreas de risco',
      'Análise de inteligência da rota com atualizações em tempo real',
      'Considerar fracionamento da carga em múltiplos veículos'
    ];
  } else if (riskScore > 55) {
    riskLevel = 'Alto';
    riskColor = 'red';
    suggestions = [
      'Escolta recomendada em trechos críticos da rota',
      'Rastreamento ativo com alertas automáticos',
      'Seguro de carga adequado ao valor transportado',
      'Motorista experiente para este tipo de carga',
      'Evitar trafegar durante a madrugada (0h-6h)',
      'Pontos de parada seguros pré-definidos',
      'Lacres de segurança e verificação periódica',
      'Check-ins regulares a cada hora',
      'Comunicação direta com equipe de monitoramento'
    ];
  } else if (riskScore > 35) {
    riskLevel = 'Médio';
    riskColor = 'yellow';
    suggestions = [
      'Rastreamento veicular básico obrigatório',
      'Seguro proporcional ao valor da carga',
      'Planejamento de rota principal e alternativa',
      'Evitar áreas de risco conhecidas durante a viagem',
      'Check-ins em pontos estratégicos da rota',
      'Documentação completa e organizada',
      'Motorista com experiência mínima de 2 anos',
      'Verificação das condições do veículo antes da partida'
    ];
  } else if (riskScore > 20) {
    riskLevel = 'Baixo';
    riskColor = 'yellow';
    suggestions = [
      'Rastreamento básico recomendado',
      'Seguro padrão para transporte de cargas',
      'Planejar paradas em locais seguros e movimentados',
      'Verificar condições da rota antes da partida',
      'Documentação em ordem e acessível',
      'Comunicação com base ao início e fim da viagem',
      'Evitar excesso de velocidade e direção defensiva'
    ];
  } else {
    suggestions = [
      'Operação de baixo risco, mas mantenha cuidados básicos',
      'Documentação completa e atualizada',
      'Verificação básica do veículo',
      'Comunicação com base conforme necessário',
      'Seguir normas de trânsito e direção defensiva'
    ];
  }
  
  return {
    riskScore: riskScore.toFixed(0),
    riskLevel,
    riskColor,
    suggestions,
    routeDistance,
    valueFactor,
    cargoFactor,
    contractFactor,
    distanceFactor,
    toolsFactor: Math.max(0, toolsFactor)
  };
};
