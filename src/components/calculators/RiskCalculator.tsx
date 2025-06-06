import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import MapComponent from '@/components/MapComponent';
import { RefreshCw, AlertCircle, CheckCircle, Info, MessageCircle, MapPin, Download, FileText } from 'lucide-react';
import { HereMapsService } from '@/services/hereMapsService';
import jsPDF from 'jspdf';

interface RiskCalculatorProps {
  isActive: boolean;
}

const RiskCalculator = ({ isActive }: RiskCalculatorProps) => {
  const [cargoType, setCargoType] = useState('alimentos');
  const [cargoValue, setCargoValue] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [contractType, setContractType] = useState('frota_propria');
  const [currentTools, setCurrentTools] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  useEffect(() => {
    const autoCalculateRoute = async () => {
      if (origin.trim() && destination.trim() && origin !== destination) {
        setIsCalculatingRoute(true);
        
        try {
          const route = await HereMapsService.calculateRoute(origin, destination);
          if (route) {
            setRouteDistance(route.distance);
            setShowMap(true);
            console.log('Risk calculator - Auto-calculated distance:', route.distance, 'km');
          } else {
            console.log('Risk calculator - Could not auto-calculate distance for:', origin, 'to', destination);
          }
        } catch (error) {
          console.error('Risk calculator - Error auto-calculating distance:', error);
        } finally {
          setIsCalculatingRoute(false);
        }
      }
    };

    const timeoutId = setTimeout(autoCalculateRoute, 1000);
    return () => clearTimeout(timeoutId);
  }, [origin, destination]);
  
  const calculateRisk = () => {
    if (!cargoValue || !origin || !destination) return;
    
    const value = parseFloat(cargoValue);
    
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

    const distanceRisk = routeDistance ? Math.min(10, Math.floor(routeDistance / 200)) : 5;
    
    let riskScore = 0;
    
    let valueFactor = 0;
    if (value <= 10000) valueFactor = 5;
    else if (value <= 50000) valueFactor = 15;
    else if (value <= 100000) valueFactor = 25;
    else valueFactor = 35;
    
    const cargoFactor = (cargoRisk[cargoType as keyof typeof cargoRisk] || 5) * 2.5;
    
    const contractFactor = contractRisk[contractType as keyof typeof contractRisk] * 3.33;
    
    const distanceFactor = distanceRisk;
    
    let toolsFactor = 10;
    const tools = currentTools.toLowerCase();
    if (tools.includes('rastreamento') || tools.includes('gps')) toolsFactor -= 3;
    if (tools.includes('seguro')) toolsFactor -= 3;
    if (tools.includes('escolta')) toolsFactor -= 4;
    if (tools.includes('lacre') || tools.includes('isca')) toolsFactor -= 2;
    
    riskScore = valueFactor + cargoFactor + contractFactor + distanceFactor + Math.max(0, toolsFactor);
    
    let riskLevel = 'Baixo';
    let riskColor = 'green';
    let suggestions = [];
    
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
    
    setResult({
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
    });
    
    setShowMap(true);
  };

  const exportRiskPDF = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('RELATÓRIO DE ANÁLISE DE RISCO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('DADOS DA OPERAÇÃO', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const details = [
      `Origem: ${origin}`,
      `Destino: ${destination}`,
      `Distância: ${routeDistance ? routeDistance + ' km' : 'Não calculada'}`,
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
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('ANÁLISE DE RISCO', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Nível de Risco: ${result.riskLevel}`, 20, yPosition);
    doc.text(`Pontuação: ${result.riskScore}/100`, 120, yPosition);
    yPosition += 15;
    
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
    if (!result) return;
    
    const exportData = {
      empresa: 'Nome da Empresa',
      origem: origin,
      destino: destination,
      distanciaRota: routeDistance,
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
      `• Distância: ${routeDistance ? routeDistance + ' km' : 'Não calculada'}%0A` +
      `• Tipo de carga: ${cargoType}%0A` +
      `• Valor da carga: R$ ${cargoValue}%0A` +
      `• Tipo de contratação: ${contractType}%0A` +
      `• Nível de risco identificado: ${result?.riskLevel || 'Não calculado'}`;
    
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
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
            <label htmlFor="origin" className="calculator-label flex items-center gap-1.5">
              <MapPin size={16} className="text-frete-500" />
              Origem {isCalculatingRoute && <span className="text-sm text-gray-500">- Calculando rota...</span>}
            </label>
            <input
              id="origin"
              type="text"
              className="input-field"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Ex: São Paulo, SP"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="destination" className="calculator-label flex items-center gap-1.5">
              <MapPin size={16} className="text-frete-500" />
              Destino
            </label>
            <input
              id="destination"
              type="text"
              className="input-field"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ex: Rio de Janeiro, RJ"
            />
            {origin && destination && routeDistance && (
              <p className="text-xs text-gray-500 mt-1">
                Distância da rota: {routeDistance} km (calculada automaticamente)
              </p>
            )}
          </div>

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
              <option value="combustivel">Combustível</option>
              <option value="quimicos">Químicos</option>
              <option value="joias">Joias/Valores</option>
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
            <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de contratação
            </label>
            <select
              id="contractType"
              className="select-field"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
            >
              <option value="frota_propria">Frota própria</option>
              <option value="agregado">Agregado</option>
              <option value="terceiro">Terceiro</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="currentTools" className="block text-sm font-medium text-gray-700 mb-1">
              Ferramentas que utiliza hoje
            </label>
            <textarea
              id="currentTools"
              className="input-field"
              value={currentTools}
              onChange={(e) => setCurrentTools(e.target.value)}
              placeholder="Ex: rastreamento, seguro, escolta, lacres..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {showMap && origin && destination && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Rota da operação {routeDistance && `(${routeDistance} km)`}
          </h4>
          <MapComponent 
            origin={origin} 
            destination={destination}
            className="h-48 w-full rounded-lg border border-gray-200"
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={calculateRisk}
        >
          Calcular risco
        </button>

        {result && (
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
        )}
        
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setCargoType('alimentos');
            setCargoValue('');
            setOrigin('');
            setDestination('');
            setContractType('frota_propria');
            setCurrentTools('');
            setResult(null);
            setShowMap(false);
            setRouteDistance(null);
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
                  {routeDistance && (
                    <>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-gray-600">{routeDistance} km</span>
                    </>
                  )}
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
          
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 mb-4">
            <Info className="text-blue-500 mt-0.5" size={20} />
            <p className="text-sm">
              Esta avaliação de risco é uma estimativa baseada nas informações fornecidas. 
              Sempre consulte profissionais de segurança e sua seguradora para uma análise completa.
            </p>
          </div>

          <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start gap-3">
            <MessageCircle className="text-green-500 mt-0.5" size={20} />
            <div>
              <p className="font-medium mb-1">Quer uma análise de risco completa?</p>
              <p className="text-sm mb-3">
                Nossos especialistas podem fazer uma análise detalhada da sua operação e sugerir as melhores práticas de segurança.
              </p>
              <button 
                className="btn btn-sm"
                onClick={openWhatsApp}
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                <MessageCircle size={16} className="mr-2" />
                Falar com especialista
              </button>
            </div>
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default RiskCalculator;
