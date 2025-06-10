
import React from 'react';
import { AlertTriangle, Shield, TrendingUp, AlertCircle, CheckCircle, Phone, FileText, Target } from 'lucide-react';
import { IntelligentRiskResult } from './intelligentRiskCalculations';
import { cn } from '@/lib/utils';

interface IntelligentRiskResultsProps {
  result: IntelligentRiskResult;
  onExportReport: () => void;
  onContactSpecialist: () => void;
}

const IntelligentRiskResults: React.FC<IntelligentRiskResultsProps> = ({
  result,
  onExportReport,
  onContactSpecialist
}) => {
  const getRiskIcon = () => {
    switch (result.riskLevel) {
      case 'Crítico': return <AlertTriangle size={32} className="text-white" />;
      case 'Alto': return <AlertCircle size={32} className="text-white" />;
      case 'Médio': return <Shield size={32} className="text-white" />;
      case 'Baixo': return <CheckCircle size={32} className="text-white" />;
      default: return <Shield size={32} className="text-white" />;
    }
  };

  const getRiskGradient = () => {
    switch (result.riskLevel) {
      case 'Crítico': return 'from-red-600 to-red-700';
      case 'Alto': return 'from-red-500 to-orange-600';
      case 'Médio': return 'from-yellow-500 to-orange-500';
      case 'Baixo': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Resultado Principal */}
      <div className={cn(
        "rounded-2xl p-8 text-white bg-gradient-to-br",
        getRiskGradient(),
        "shadow-xl border-0"
      )}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {getRiskIcon()}
            </div>
            <div>
              <h3 className="text-3xl font-bold">Risco {result.riskLevel}</h3>
              <p className="text-white/90 text-lg">
                Pontuação: {result.totalScore} pontos • Segurança: {result.safetyScore}%
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">{result.totalScore}</div>
            <div className="text-white/80 text-sm">Pontos de Risco</div>
          </div>
        </div>

        {/* Breakdown dos Fatores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{result.regionalScore}</div>
            <div className="text-white/80 text-xs">Regional</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{result.routeScore}</div>
            <div className="text-white/80 text-xs">Rota</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{result.cargoScore}</div>
            <div className="text-white/80 text-xs">Carga</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{result.timeScore}</div>
            <div className="text-white/80 text-xs">Horário</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{result.contractScore}</div>
            <div className="text-white/80 text-xs">Contrato</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-200">-{result.mitigationReduction}</div>
            <div className="text-white/80 text-xs">Mitigação</div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={onExportReport}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
          >
            <FileText size={18} />
            Exportar Relatório
          </button>
          
          {(result.riskLevel === 'Alto' || result.riskLevel === 'Crítico') && (
            <button 
              onClick={onContactSpecialist}
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
            >
              <Phone size={18} />
              Falar com Especialista
            </button>
          )}
        </div>
      </div>

      {/* Fatores Críticos */}
      {result.criticalFactors.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
          <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            <Target size={20} className="text-red-500" />
            Fatores Críticos Identificados
          </h4>
          
          <div className="space-y-3">
            {result.criticalFactors.map((factor, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{factor}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Análise Detalhada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição do Risco */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-orange-500" />
            Distribuição do Risco
          </h4>
          
          <div className="space-y-4">
            {[
              { label: 'Fatores Regionais', value: result.regionalScore, max: 10, color: 'bg-red-500' },
              { label: 'Risco de Rota', value: result.routeScore, max: 4, color: 'bg-orange-500' },
              { label: 'Tipo de Carga', value: result.cargoScore, max: 7, color: 'bg-yellow-500' },
              { label: 'Horário da Viagem', value: result.timeScore, max: 2, color: 'bg-blue-500' },
              { label: 'Tipo de Contratação', value: result.contractScore, max: 2, color: 'bg-purple-500' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-600">{item.value}/{item.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={cn("h-2 rounded-full transition-all duration-500", item.color)}
                    style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {result.mitigationReduction > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <CheckCircle size={16} />
                <strong>Redução por Mitigação:</strong> -{result.mitigationReduction} pontos
              </p>
            </div>
          )}
        </div>

        {/* Score de Segurança */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-green-500" />
            Índice de Segurança
          </h4>
          
          <div className="text-center mb-6">
            <div className={cn(
              "text-6xl font-bold mb-2",
              result.safetyScore >= 80 ? "text-green-500" :
              result.safetyScore >= 60 ? "text-yellow-500" :
              result.safetyScore >= 40 ? "text-orange-500" : "text-red-500"
            )}>
              {result.safetyScore}%
            </div>
            <p className="text-gray-600">
              {result.safetyScore >= 80 && "Operação Segura"}
              {result.safetyScore >= 60 && result.safetyScore < 80 && "Atenção Necessária"}
              {result.safetyScore >= 40 && result.safetyScore < 60 && "Riscos Elevados"}
              {result.safetyScore < 40 && "Operação Crítica"}
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={cn(
                "h-4 rounded-full transition-all duration-700",
                result.safetyScore >= 80 ? "bg-gradient-to-r from-green-400 to-green-600" :
                result.safetyScore >= 60 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                result.safetyScore >= 40 ? "bg-gradient-to-r from-orange-400 to-orange-600" :
                "bg-gradient-to-r from-red-400 to-red-600"
              )}
              style={{ width: `${result.safetyScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={20} className="text-orange-500" />
          Recomendações de Segurança Personalizadas
        </h4>
        
        <div className="space-y-3">
          {result.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Especialista */}
      {(result.riskLevel === 'Alto' || result.riskLevel === 'Crítico') && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold mb-2">
                Operação de {result.riskLevel} Risco Detectada
              </h4>
              <p className="text-orange-100 mb-4">
                Nossa equipe de especialistas pode desenvolver um plano de segurança personalizado para sua operação.
              </p>
              <ul className="text-orange-100 text-sm space-y-1">
                <li>• Análise detalhada da rota e perfil de risco</li>
                <li>• Recomendações de ferramentas específicas</li>
                <li>• Plano de contingência personalizado</li>
                <li>• Acompanhamento durante a operação</li>
              </ul>
            </div>
            <button 
              onClick={onContactSpecialist}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2 flex-shrink-0 ml-6"
            >
              <Phone size={20} />
              Falar com Especialista
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligentRiskResults;
