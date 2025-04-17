
import { DiagnosticResults } from './types';

export const calculateDiagnosticResults = (answers: Record<number, number>, profile: string): DiagnosticResults => {
  const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
  
  let level = '';
  if (totalScore <= 20) {
    level = 'Nível iniciante';
  } else if (totalScore <= 35) {
    level = 'Nível intermediário';
  } else if (totalScore <= 45) {
    level = 'Nível avançado';
  } else {
    level = 'Nível de excelência';
  }
  
  const recommendations: string[] = [];
  
  if (profile === 'transporter') {
    if (totalScore <= 20) {
      recommendations.push('Implemente um sistema básico de rastreamento de entregas');
      recommendations.push('Padronize a comunicação com motoristas (WhatsApp Business ou app)');
      recommendations.push('Comece a medir e registrar os principais indicadores (OTIF, ocorrências)');
    } else if (totalScore <= 35) {
      recommendations.push('Automatize a roteirização para otimizar rotas e reduzir custos');
      recommendations.push('Implemente um dashboard de KPIs logísticos atualizado semanalmente');
      recommendations.push('Crie uma política de gerenciamento de ocorrências com fluxos definidos');
    } else {
      recommendations.push('Integre todos os sistemas logísticos para visibilidade end-to-end');
      recommendations.push('Implemente telemetria avançada para monitoramento de comportamento de motoristas');
      recommendations.push('Desenvolva um programa de melhoria contínua com metas trimestrais');
    }
  } else {
    if (totalScore <= 20) {
      recommendations.push('Implemente uma rotina básica de auditoria de faturas de frete');
      recommendations.push('Exija rastreabilidade mínima das transportadoras contratadas');
      recommendations.push('Defina KPIs básicos para avaliar a performance das entregas');
    } else if (totalScore <= 35) {
      recommendations.push('Automatize a auditoria de faturas de frete');
      recommendations.push('Desenvolva contratos baseados em SLA e performance');
      recommendations.push('Integre logística com áreas como atendimento e vendas');
    } else {
      recommendations.push('Implemente um TMS (Transportation Management System) integrado');
      recommendations.push('Desenvolva um scorecard de transportadoras com critérios objetivos');
      recommendations.push('Crie um comitê de performance logística com reuniões periódicas');
    }
  }
  
  return {
    score: totalScore,
    level,
    recommendations
  };
};
