
export interface RegionalRiskData {
  state: string;
  baseScore: number;
  criticalCities: string[];
}

export interface HighwayRiskData {
  highway: string;
  riskScore: number;
  description: string;
}

export interface CargoRiskData {
  type: string;
  riskScore: number;
  description: string;
}

export interface RiskFactors {
  origin: string;
  destination: string;
  cargoType: string;
  cargoValue: number;
  contractType: string;
  travelTime: string;
  securityTools: string[];
  routeDistance?: number;
}

export interface IntelligentRiskResult {
  totalScore: number;
  riskLevel: string;
  riskColor: string;
  regionalScore: number;
  routeScore: number;
  cargoScore: number;
  timeScore: number;
  contractScore: number;
  mitigationReduction: number;
  recommendations: string[];
  criticalFactors: string[];
  safetyScore: number;
  percentageByCategory: {
    regional: number;
    route: number;
    cargo: number;
    time: number;
    contract: number;
    mitigation: number;
  };
}

// Base de dados de risco regional
export const REGIONAL_RISK_DATA: RegionalRiskData[] = [
  { state: 'SP', baseScore: 5, criticalCities: ['Campinas', 'Jundiaí', 'Guarujá', 'Cubatão'] },
  { state: 'RJ', baseScore: 5, criticalCities: ['Duque de Caxias', 'São Gonçalo', 'Nova Iguaçu'] },
  { state: 'MG', baseScore: 3, criticalCities: ['Betim', 'Contagem'] },
  { state: 'PR', baseScore: 3, criticalCities: ['Paranaguá'] },
  { state: 'RS', baseScore: 3, criticalCities: ['Rio Grande'] },
  { state: 'SC', baseScore: 2, criticalCities: ['Itajaí'] },
  { state: 'BA', baseScore: 3, criticalCities: ['Salvador', 'Feira de Santana'] },
  { state: 'PE', baseScore: 3, criticalCities: ['Recife', 'Jaboatão'] },
  { state: 'CE', baseScore: 2, criticalCities: ['Fortaleza'] },
  { state: 'GO', baseScore: 2, criticalCities: ['Aparecida de Goiânia'] },
  { state: 'MT', baseScore: 2, criticalCities: [] },
  { state: 'DF', baseScore: 2, criticalCities: [] },
];

// Rodovias críticas
export const CRITICAL_HIGHWAYS: HighwayRiskData[] = [
  { highway: 'BR-116', riskScore: 2, description: 'Via Dutra - Alto índice de roubos' },
  { highway: 'SP-330', riskScore: 2, description: 'Anhanguera - Região crítica' },
  { highway: 'SP-348', riskScore: 2, description: 'Bandeirantes - Risco elevado' },
  { highway: 'BR-493', riskScore: 2, description: 'Arco Metropolitano - Zona crítica' },
  { highway: 'BR-101', riskScore: 1, description: 'Litoral - Risco moderado' },
  { highway: 'BR-040', riskScore: 1, description: 'Rio-Brasília - Atenção' },
  { highway: 'BR-277', riskScore: 1, description: 'Curitiba-Paranaguá' },
  { highway: 'BR-290', riskScore: 1, description: 'Freeway - RS' },
];

// Tipos de carga e seus riscos
export const CARGO_RISK_DATA: CargoRiskData[] = [
  { type: 'eletronicos', riskScore: 5, description: 'Alto valor agregado - Alvo preferencial' },
  { type: 'medicamentos', riskScore: 5, description: 'Mercado negro ativo' },
  { type: 'combustivel', riskScore: 5, description: 'Risco de roubo e vazamento' },
  { type: 'alimentos', riskScore: 3, description: 'Perecibilidade e valor' },
  { type: 'bebidas', riskScore: 3, description: 'Facilidade de revenda' },
  { type: 'automoveis', riskScore: 3, description: 'Peças valiosas' },
  { type: 'vestuario', riskScore: 1, description: 'Baixo risco' },
  { type: 'moveis', riskScore: 1, description: 'Dificuldade de revenda' },
  { type: 'outros', riskScore: 2, description: 'Risco padrão' },
];

const getStateFromLocation = (location: string): string => {
  const statePatterns = [
    { pattern: /(SP|São Paulo)/i, state: 'SP' },
    { pattern: /(RJ|Rio de Janeiro)/i, state: 'RJ' },
    { pattern: /(MG|Minas Gerais)/i, state: 'MG' },
    { pattern: /(PR|Paraná)/i, state: 'PR' },
    { pattern: /(RS|Rio Grande do Sul)/i, state: 'RS' },
    { pattern: /(SC|Santa Catarina)/i, state: 'SC' },
    { pattern: /(BA|Bahia)/i, state: 'BA' },
    { pattern: /(PE|Pernambuco)/i, state: 'PE' },
    { pattern: /(CE|Ceará)/i, state: 'CE' },
    { pattern: /(GO|Goiás)/i, state: 'GO' },
    { pattern: /(MT|Mato Grosso)/i, state: 'MT' },
    { pattern: /(DF|Distrito Federal|Brasília)/i, state: 'DF' },
  ];

  for (const { pattern, state } of statePatterns) {
    if (pattern.test(location)) {
      return state;
    }
  }
  return 'OUTROS';
};

const getCriticalCityBonus = (location: string): number => {
  const criticalCities = [
    'Duque de Caxias', 'São Gonçalo', 'Nova Iguaçu',
    'Cubatão', 'Guarujá', 'Campinas', 'Jundiaí',
    'Betim', 'Contagem', 'Paranaguá', 'Rio Grande'
  ];

  return criticalCities.some(city => 
    location.toLowerCase().includes(city.toLowerCase())
  ) ? 1 : 0;
};

const getRouteHighwayRisk = (origin: string, destination: string): number => {
  // Simulação de análise de rota baseada em padrões conhecidos
  const routeText = `${origin} ${destination}`.toLowerCase();
  
  let totalRisk = 0;
  
  CRITICAL_HIGHWAYS.forEach(highway => {
    if (routeText.includes(highway.highway.toLowerCase()) ||
        (highway.highway === 'BR-116' && (routeText.includes('são paulo') && routeText.includes('rio'))) ||
        (highway.highway === 'SP-330' && routeText.includes('campinas')) ||
        (highway.highway === 'BR-101' && routeText.includes('santos'))) {
      totalRisk += highway.riskScore;
    }
  });

  return Math.min(totalRisk, 4); // Máximo 4 pontos por rodovias
};

export const calculateIntelligentRisk = (factors: RiskFactors): IntelligentRiskResult => {
  const { origin, destination, cargoType, cargoValue, contractType, travelTime, securityTools } = factors;

  // 1. Pontuação regional (origem + destino)
  const originState = getStateFromLocation(origin);
  const destinationState = getStateFromLocation(destination);
  
  const originRisk = REGIONAL_RISK_DATA.find(r => r.state === originState)?.baseScore || 1;
  const destinationRisk = REGIONAL_RISK_DATA.find(r => r.state === destinationState)?.baseScore || 1;
  
  const regionalScore = originRisk + destinationRisk + 
    getCriticalCityBonus(origin) + getCriticalCityBonus(destination);

  // 2. Pontuação de rota (rodovias críticas)
  const routeScore = getRouteHighwayRisk(origin, destination);

  // 3. Pontuação por tipo de carga + valor
  const cargoRiskData = CARGO_RISK_DATA.find(c => c.type === cargoType);
  let cargoScore = cargoRiskData?.riskScore || 2;
  
  // Ajuste por valor da carga
  if (cargoValue > 500000) cargoScore += 2;
  else if (cargoValue > 100000) cargoScore += 1;

  // 4. Pontuação por horário
  const timeScores = {
    'madrugada': 2,
    'noite': 1,
    'tarde': 0,
    'manha': 0
  };
  const timeScore = timeScores[travelTime as keyof typeof timeScores] || 0;

  // 5. Pontuação por tipo de contratação
  const contractScores = {
    'frota_propria': 0,
    'agregado': 1,
    'terceiro': 2
  };
  const contractScore = contractScores[contractType as keyof typeof contractScores] || 1;

  // 6. Redução por ferramentas de mitigação
  let mitigationReduction = 0;
  const mitigationValues = {
    'rastreamento': 1,
    'lacre': 1,
    'isca': 1,
    'seguro': 1,
    'escolta': 2
  };

  securityTools.forEach(tool => {
    mitigationReduction += mitigationValues[tool as keyof typeof mitigationValues] || 0;
  });

  // Cálculo final
  const baseScore = regionalScore + routeScore + cargoScore + timeScore + contractScore;
  const totalScore = Math.max(0, baseScore - mitigationReduction);

  // Classificação do risco
  let riskLevel = 'Baixo';
  let riskColor = 'green';

  if (totalScore >= 11) {
    riskLevel = 'Crítico';
    riskColor = 'red';
  } else if (totalScore >= 8) {
    riskLevel = 'Alto';
    riskColor = 'red';
  } else if (totalScore >= 5) {
    riskLevel = 'Médio';
    riskColor = 'yellow';
  }

  // Recomendações baseadas no nível
  const recommendations = generateRecommendations(riskLevel, totalScore, factors);
  const criticalFactors = identifyCriticalFactors(factors, {
    regionalScore,
    routeScore,
    cargoScore,
    timeScore,
    contractScore
  });

  const safetyScore = Math.max(0, 100 - (totalScore * 10));

  const percentageByCategory = {
    regional: Math.round((regionalScore / Math.max(baseScore, 1)) * 100),
    route: Math.round((routeScore / Math.max(baseScore, 1)) * 100),
    cargo: Math.round((cargoScore / Math.max(baseScore, 1)) * 100),
    time: Math.round((timeScore / Math.max(baseScore, 1)) * 100),
    contract: Math.round((contractScore / Math.max(baseScore, 1)) * 100),
    mitigation: Math.round((mitigationReduction / Math.max(baseScore, 1)) * 100)
  };

  return {
    totalScore,
    riskLevel,
    riskColor,
    regionalScore,
    routeScore,
    cargoScore,
    timeScore,
    contractScore,
    mitigationReduction,
    recommendations,
    criticalFactors,
    safetyScore,
    percentageByCategory
  };
};

const generateRecommendations = (riskLevel: string, score: number, factors: RiskFactors): string[] => {
  switch (riskLevel) {
    case 'Baixo':
      return [
        'Risco controlado. Mantenha o rastreamento ativo durante toda a viagem.',
        'Evite paradas não planejadas e mantenha comunicação com a base.',
        'Verifique as condições do veículo antes da partida.',
        'Tenha documentação completa e organizada.',
        'Siga as normas de trânsito e pratique direção defensiva.'
      ];

    case 'Médio':
      return [
        'Evite trafegar durante horários noturnos (22h às 6h).',
        'Adote rastreamento em tempo real com alertas automáticos.',
        'Utilize lacres eletrônicos e verifique periodicamente.',
        'Planeje paradas apenas em locais seguros e movimentados.',
        'Mantenha contato regular com a central de monitoramento.',
        'Considere seguro adequado ao valor da carga transportada.'
      ];

    case 'Alto':
      return [
        'NÃO utilize motoristas de aplicativo ou terceiros desconhecidos.',
        'Implemente rastreamento avançado com isca eletrônica.',
        'Contrate seguro de carga com cobertura total.',
        'Considere escolta armada para trechos críticos.',
        'Evite completamente horários de madrugada.',
        'Estabeleça check-ins obrigatórios a cada 30 minutos.',
        'Tenha plano de rota alternativa pré-definido.'
      ];

    case 'Crítico':
      return [
        'OPERAÇÃO NÃO RECOMENDADA sem apoio profissional especializado.',
        'Contate imediatamente um especialista em gestão de riscos.',
        'Escolta armada obrigatória durante todo o trajeto.',
        'Rastreamento militar com central 24h dedicada.',
        'Seguro premium com cobertura total e valor agregado.',
        'Motorista certificado com experiência em cargas de alto risco.',
        'Plano de contingência detalhado com múltiplas rotas.',
        'Considere fracionamento da carga em múltiplos veículos.'
      ];

    default:
      return ['Avalie os fatores de risco e implemente medidas adequadas.'];
  }
};

const identifyCriticalFactors = (factors: RiskFactors, scores: any): string[] => {
  const criticalFactors: string[] = [];

  if (scores.regionalScore > 6) {
    criticalFactors.push('Região de origem/destino com alto índice de criminalidade');
  }

  if (scores.routeScore > 2) {
    criticalFactors.push('Rota inclui rodovias com histórico de roubos');
  }

  if (scores.cargoScore > 4) {
    criticalFactors.push('Tipo de carga é alvo preferencial de criminosos');
  }

  if (factors.cargoValue > 500000) {
    criticalFactors.push('Valor da carga acima de R$ 500.000');
  }

  if (factors.travelTime === 'madrugada') {
    criticalFactors.push('Viagem programada para horário de alto risco (madrugada)');
  }

  if (factors.contractType === 'terceiro') {
    criticalFactors.push('Uso de motorista terceirizado ou aplicativo');
  }

  if (factors.securityTools.length < 2) {
    criticalFactors.push('Ferramentas de segurança insuficientes para o risco identificado');
  }

  return criticalFactors;
};
