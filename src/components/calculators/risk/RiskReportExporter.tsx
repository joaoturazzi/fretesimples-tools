
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { IntelligentRiskResult, RiskFactors } from './intelligentRiskCalculations';
import { ExportService } from '@/services/exportService';

interface RiskReportExporterProps {
  result: IntelligentRiskResult;
  factors: RiskFactors;
}

const RiskReportExporter: React.FC<RiskReportExporterProps> = ({ result, factors }) => {
  
  const generateReport = () => {
    const reportData = {
      title: 'Análise de Risco de Transporte - Frete.Digital',
      subtitle: `Avaliação Inteligente de Segurança`,
      data: {
        origem: factors.origin,
        destino: factors.destination,
        distancia: factors.routeDistance ? `${factors.routeDistance} km` : 'Não calculada',
        tipoCarga: getCargoTypeLabel(factors.cargoType),
        valorCarga: formatCurrency(factors.cargoValue),
        tipoContratacao: getContractTypeLabel(factors.contractType),
        horarioViagem: getTravelTimeLabel(factors.travelTime),
        ferramentasSeguranca: factors.securityTools.join(', ') || 'Nenhuma'
      },
      results: {
        nivelRisco: result.riskLevel,
        pontuacaoTotal: `${result.totalScore} pontos`,
        indiceSeguranca: `${result.safetyScore}%`,
        fatoresRegionais: `${result.regionalScore} pontos`,
        riscoRota: `${result.routeScore} pontos`,
        riscoCarga: `${result.cargoScore} pontos`,
        riscoHorario: `${result.timeScore} pontos`,
        riscoContratacao: `${result.contractScore} pontos`,
        mitigacaoAplicada: `${result.mitigationReduction} pontos de redução`,
        recomendacoes: result.recommendations.join('\n'),
        fatoresCriticos: result.criticalFactors.length > 0 ? result.criticalFactors.join('\n') : 'Nenhum fator crítico identificado'
      },
      timestamp: new Date()
    };

    ExportService.exportToPDF(reportData);
  };

  const generateSummaryReport = () => {
    const summaryData = {
      title: 'Resumo Executivo - Análise de Risco',
      subtitle: `${factors.origin} → ${factors.destination}`,
      data: {
        risco: result.riskLevel,
        pontuacao: result.totalScore,
        seguranca: `${result.safetyScore}%`,
        valor: formatCurrency(factors.cargoValue)
      },
      results: {
        status: result.riskLevel === 'Baixo' || result.riskLevel === 'Médio' ? 'Operação Autorizada' : 'Requer Atenção Especial',
        principais_riscos: result.criticalFactors.slice(0, 3).join('; '),
        acao_recomendada: result.recommendations[0] || 'Seguir protocolos padrão'
      },
      timestamp: new Date()
    };

    ExportService.exportToPDF(summaryData);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCargoTypeLabel = (type: string): string => {
    const labels = {
      'eletronicos': 'Eletrônicos',
      'medicamentos': 'Medicamentos',
      'combustivel': 'Combustível',
      'alimentos': 'Alimentos',
      'bebidas': 'Bebidas',
      'automoveis': 'Automóveis/Peças',
      'vestuario': 'Vestuário',
      'moveis': 'Móveis',
      'outros': 'Outros'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getContractTypeLabel = (type: string): string => {
    const labels = {
      'frota_propria': 'Frota Própria',
      'agregado': 'Motorista Agregado',
      'terceiro': 'Terceiro/Aplicativo'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTravelTimeLabel = (time: string): string => {
    const labels = {
      'manha': 'Manhã (6h-12h)',
      'tarde': 'Tarde (12h-18h)',
      'noite': 'Noite (18h-24h)',
      'madrugada': 'Madrugada (0h-6h)'
    };
    return labels[time as keyof typeof labels] || time;
  };

  return (
    <div className="flex gap-3">
      <button 
        onClick={generateReport}
        className="btn btn-secondary flex items-center gap-2"
      >
        <FileText size={18} />
        Relatório Completo
      </button>
      
      <button 
        onClick={generateSummaryReport}
        className="btn btn-ghost flex items-center gap-2"
      >
        <Download size={18} />
        Resumo Executivo
      </button>
    </div>
  );
};

export default RiskReportExporter;
