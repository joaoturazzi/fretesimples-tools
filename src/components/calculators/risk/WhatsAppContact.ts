
import { RiskFactors } from './intelligentRiskCalculations';

export const generateWhatsAppMessage = (
  factors: RiskFactors,
  result: any
): string => {
  const message = `Olá! Preciso de uma análise completa de risco para transporte.%0A%0A` +
    `📍 *Dados da Operação:*%0A` +
    `• Origem: ${factors.origin}%0A` +
    `• Destino: ${factors.destination}%0A` +
    `• Distância: ${factors.routeDistance ? factors.routeDistance + ' km' : 'Não calculada'}%0A` +
    `• Tipo de carga: ${factors.cargoType}%0A` +
    `• Valor da carga: R$ ${factors.cargoValue.toLocaleString('pt-BR')}%0A` +
    `• Contratação: ${factors.contractType}%0A` +
    `• Horário: ${factors.travelTime}%0A%0A` +
    `⚠️ *Resultado da Análise:*%0A` +
    `• Nível de risco: ${result?.riskLevel || 'Não calculado'}%0A` +
    `• Pontuação: ${result?.totalScore || 0} pontos%0A` +
    `• Índice de segurança: ${result?.safetyScore || 0}%%0A%0A` +
    `Gostaria de uma consulta especializada para otimizar a segurança desta operação.`;
  
  return message;
};

export const openWhatsAppContact = (message: string): void => {
  window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
};
