
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  schema?: any;
  canonical?: string;
}

export const seoConfig: Record<string, SEOConfig> = {
  'calculadora-frete': {
    title: 'Calculadora de Frete Grátis - Calcule Custos de Transporte',
    description: 'Calcule o valor do frete de forma precisa com nossa calculadora gratuita. Inclui combustível, pedágios, distância e custos operacionais.',
    keywords: 'calculadora frete, cálculo transporte, custo frete, valor frete, logística',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Calculadora de Frete",
      "description": "Ferramenta gratuita para calcular custos de frete e transporte",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL"
      }
    }
  },
  'simulador-lucro': {
    title: 'Simulador de Lucro para Transportadores - Análise Financeira',
    description: 'Simule o lucro de suas operações de transporte. Analise receitas, custos fixos e variáveis para maximizar seus resultados.',
    keywords: 'simulador lucro transporte, análise financeira logística, rentabilidade frete',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Simulador de Lucro",
      "description": "Ferramenta para análise de rentabilidade em transporte",
      "applicationCategory": "BusinessApplication"
    }
  },
  'calculadora-risco': {
    title: 'Calculadora de Risco de Carga - Avaliação de Segurança',
    description: 'Avalie o risco de suas cargas e rotas. Ferramenta completa para análise de segurança no transporte.',
    keywords: 'risco carga, segurança transporte, avaliação risco logística',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Calculadora de Risco",
      "description": "Avaliação de riscos para transporte de cargas",
      "applicationCategory": "BusinessApplication"
    }
  },
  'calculadora-combustivel': {
    title: 'Calculadora de Combustível - Consumo e Custos',
    description: 'Calcule o consumo e custo de combustível para suas viagens. Otimize seus gastos com combustível.',
    keywords: 'calculadora combustível, consumo diesel, custo combustível transporte',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Calculadora de Combustível",
      "description": "Cálculo de consumo e custos de combustível",
      "applicationCategory": "BusinessApplication"
    }
  },
  'dimensionamento-veiculo': {
    title: 'Dimensionamento de Veículo - Escolha o Veículo Ideal',
    description: 'Descubra qual veículo é ideal para sua carga. Ferramenta para dimensionamento correto de frota.',
    keywords: 'dimensionamento veículo, escolha caminhão, tipo veículo carga',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Dimensionamento de Veículo",
      "description": "Ferramenta para escolha do veículo adequado",
      "applicationCategory": "BusinessApplication"
    }
  },
  'diagnostico-logistica': {
    title: 'Diagnóstico de Gestão Logística - Avalie sua Operação',
    description: 'Avalie a maturidade da sua gestão logística. Diagnóstico completo com recomendações personalizadas.',
    keywords: 'diagnóstico logística, gestão transporte, avaliação operacional',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Diagnóstico de Gestão Logística",
      "description": "Avaliação da maturidade de gestão logística",
      "applicationCategory": "BusinessApplication"
    }
  },
  'default': {
    title: 'Frete Simples - Ferramentas Logísticas Gratuitas',
    description: 'Plataforma completa com ferramentas gratuitas para transportadores: calculadora de frete, simulador de lucro, análise de risco e muito mais.',
    keywords: 'frete, logística, transportador, calculadora, ferramentas gratuitas',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Frete Simples",
      "description": "Ferramentas gratuitas para profissionais de logística",
      "url": "https://frete-simples.com"
    }
  }
};

export const getSEOConfig = (section: string): SEOConfig => {
  return seoConfig[section] || seoConfig.default;
};
