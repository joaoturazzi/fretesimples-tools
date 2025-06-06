
import React from 'react';
import { FileText, Download, MessageCircle } from 'lucide-react';
import jsPDF from 'jspdf';

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

interface RiskExportProps {
  result: RiskResult;
  origin: string;
  destination: string;
  cargoType: string;
  cargoValue: string;
  contractType: string;
  currentTools: string;
}

const RiskExport = ({ 
  result, 
  origin, 
  destination, 
  cargoType, 
  cargoValue, 
  contractType, 
  currentTools 
}: RiskExportProps) => {
  const exportRiskPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('RELATÓRIO DE ANÁLISE DE RISCO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Operation details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('DADOS DA OPERAÇÃO', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const details = [
      `Origem: ${origin}`,
      `Destino: ${destination}`,
      `Distância: ${result.routeDistance ? result.routeDistance + ' km' : 'Não calculada'}`,
      `Tipo de Carga: ${cargoType}`,
      `Valor da Carga: R$ ${parseFloat(cargoValue).toLocaleString('pt-BR')}`,
      `Tipo de Contratação: ${contractType}`,
      `Ferramentas Atuais: ${currentTools || 'Não informado'}`
    ];
    
    details.forEach(detail => {
      doc.text(detail, 20, yPosition);
      yPosition += 7;
    });
    
    yPosition += 10;
    
    // Risk analysis
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('ANÁLISE DE RISCO', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Nível de Risco: ${result.riskLevel}`, 20, yPosition);
    doc.text(`Pontuação: ${result.riskScore}/100`, 120, yPosition);
    yPosition += 15;
    
    // Risk breakdown
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Breakdown da Pontuação:', 20, yPosition);
    yPosition += 7;
    
    const breakdown = [
      `• Valor da Carga: ${result.valueFactor?.toFixed(1) || 0} pontos`,
      `• Tipo de Carga: ${result.cargoFactor?.toFixed(1) || 0} pontos`,
      `• Contratação: ${result.contractFactor?.toFixed(1) || 0} pontos`,
      `• Distância: ${result.distanceFactor?.toFixed(1) || 0} pontos`,
      `• Ferramentas: ${result.toolsFactor?.toFixed(1) || 0} pontos`
    ];
    
    breakdown.forEach(item => {
      doc.text(item, 25, yPosition);
      yPosition += 6;
    });
    
    yPosition += 10;
    
    // Recommendations
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('RECOMENDAÇÕES DE SEGURANÇA', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    result.suggestions.forEach((suggestion: string, index: number) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      const lines = doc.splitTextToSize(`${index + 1}. ${suggestion}`, pageWidth - 40);
      lines.forEach((line: string) => {
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 2;
    });
    
    // Footer
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    
    yPosition = pageHeight - 30;
    doc.setFontSize(9);
    doc.setFont(undefined, 'italic');
    doc.text('Este relatório é uma análise preliminar. Consulte especialistas em segurança para avaliação completa.', pageWidth / 2, yPosition, { align: 'center' });
    doc.text('Gerado por: Frete Simples BY CCI', pageWidth / 2, yPosition + 7, { align: 'center' });
    
    doc.save(`analise-risco-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportRiskData = () => {
    const exportData = {
      empresa: 'Nome da Empresa',
      origem: origin,
      destino: destination,
      distanciaRota: result.routeDistance,
      tipoCarga: cargoType,
      valorCarga: cargoValue,
      tipoContratacao: contractType,
      ferramentasAtuais: currentTools,
      nivelRisco: result.riskLevel,
      pontuacaoRisco: result.riskScore,
      recomendacoes: result.suggestions,
      dataAnalise: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-risco-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openWhatsApp = () => {
    const message = `Olá! Gostaria de uma análise completa de risco para transporte.%0A%0A` +
      `Dados da operação:%0A` +
      `• Origem: ${origin}%0A` +
      `• Destino: ${destination}%0A` +
      `• Distância: ${result.routeDistance ? result.routeDistance + ' km' : 'Não calculada'}%0A` +
      `• Tipo de carga: ${cargoType}%0A` +
      `• Valor da carga: R$ ${cargoValue}%0A` +
      `• Tipo de contratação: ${contractType}%0A` +
      `• Nível de risco identificado: ${result?.riskLevel || 'Não calculado'}`;
    
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <>
      <button 
        className="btn btn-success"
        onClick={exportRiskPDF}
      >
        <FileText size={18} className="mr-2" />
        Exportar PDF
      </button>

      <button 
        className="btn btn-success"
        onClick={exportRiskData}
      >
        <Download size={18} className="mr-2" />
        Exportar JSON
      </button>
      
      <button 
        className="btn"
        onClick={openWhatsApp}
        style={{ backgroundColor: '#25D366', color: 'white' }}
      >
        <MessageCircle size={18} className="mr-2" />
        Análise completa no WhatsApp
      </button>
    </>
  );
};

export default RiskExport;
