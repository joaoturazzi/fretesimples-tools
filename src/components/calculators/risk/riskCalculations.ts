
interface RiskFactors {
  cargoType: string;
  cargoValue: number;
  contractType: string;
  routeDistance: number | null;
  currentTools: string;
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
  'eletronicos': 8,
  'alimentos': 3,
  'carga_perigosa': 9,
  'medicamentos': 7,
  'vestuario': 4,
  'moveis': 3,
  'automoveis': 8,
  'combustivel': 9,
  'quimicos': 8,
  'joias': 10,
  'outros': 5
};

const contractRisk = {
  'frota_propria': 1,
  'agregado': 4,
  'terceiro': 6
};

export const calculateRisk = (factors: RiskFactors): RiskResult => {
  const { cargoType, cargoValue, contractType, routeDistance, currentTools } = factors;

  // Enhanced distance risk factor
  const distanceRisk = routeDistance ? Math.min(10, Math.floor(routeDistance / 200)) : 5;
  
  // Calculate enhanced risk score (0-100)
  let riskScore = 0;
  
  // Value factor (0-35 points) - progressive scale
  let valueFactor = 0;
  if (cargoValue <= 10000) valueFactor = 5;
  else if (cargoValue <= 50000) valueFactor = 15;
  else if (cargoValue <= 100000) valueFactor = 25;
  else valueFactor = 35;
  
  // Cargo type factor (0-25 points)
  const cargoFactor = (cargoRisk[cargoType as keyof typeof cargoRisk] || 5) * 2.5;
  
  // Contract type factor (0-20 points)
  const contractFactor = contractRisk[contractType as keyof typeof contractRisk] * 3.33;
  
  // Distance factor (0-10 points)
  const distanceFactor = distanceRisk;
  
  // Tools factor (0-10 points) - enhanced evaluation
  let toolsFactor = 10;
  const tools = currentTools.toLowerCase();
  if (tools.includes('rastreamento') || tools.includes('gps')) toolsFactor -= 3;
  if (tools.includes('seguro')) toolsFactor -= 3;
  if (tools.includes('escolta')) toolsFactor -= 4;
  if (tools.includes('lacre') || tools.includes('isca')) toolsFactor -= 2;
  
  riskScore = valueFactor + cargoFactor + contractFactor + distanceFactor + Math.max(0, toolsFactor);
  
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
      'Seguro de carga com cobertura total',
      'Motorista experiente e certificado',
      'Plano de contingência detalhado',
      'Comunicação constante com base operacional',
      'Isca eletrônica e lacres de segurança',
      'Evitar paradas não programadas',
      'Análise de inteligência da rota'
    ];
  } else if (riskScore > 50) {
    riskLevel = 'Alto';
    riskColor = 'red';
    suggestions = [
      'Escolta recomendada em trechos críticos',
      'Rastreamento ativo com alertas',
      'Seguro de carga adequado ao valor',
      'Motorista experiente para este tipo de carga',
      'Evitar trafegar à noite',
      'Pontos de parada seguros pré-definidos',
      'Lacres de segurança',
      'Check-ins regulares'
    ];
  } else if (riskScore > 30) {
    riskLevel = 'Médio';
    riskColor = 'yellow';
    suggestions = [
      'Rastreamento veicular básico',
      'Seguro proporcional ao valor da carga',
      'Planejamento de rota principal e alternativa',
      'Evitar áreas de risco conhecidas',
      'Check-ins em pontos estratégicos',
      'Documentação completa e organizada'
    ];
  } else {
    suggestions = [
      'Rastreamento básico recomendado',
      'Seguro padrão para transporte',
      'Planejar paradas em locais seguros',
      'Verificar condições da rota',
      'Documentação em ordem'
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
