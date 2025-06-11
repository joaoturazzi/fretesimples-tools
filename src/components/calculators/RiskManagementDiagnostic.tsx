import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import { Shield, RefreshCw, CheckCircle, AlertTriangle, Truck, Package } from 'lucide-react';

interface RiskManagementDiagnosticProps {
  isActive: boolean;
  onBackToHome?: () => void;
}

interface Question {
  id: number;
  text: string;
  value: number;
}

const RiskManagementDiagnostic = ({ isActive, onBackToHome }: RiskManagementDiagnosticProps) => {
  const [profile, setProfile] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<{
    score: number;
    level: string;
    recommendations: string[];
  } | null>(null);
  
  const transporterQuestions = [
    { id: 1, text: "Você possui um plano de gerenciamento de risco estruturado e atualizado?", value: 3 },
    { id: 2, text: "Seus motoristas recebem treinamentos recorrentes sobre segurança e prevenção de sinistros?", value: 3 },
    { id: 3, text: "Existe controle sobre rotas críticas e áreas de risco?", value: 3 },
    { id: 4, text: "O uso de tecnologia (telemetria, bloqueadores, rastreadores) está bem implementado?", value: 3 },
    { id: 5, text: "Há políticas de controle de jornada, velocidade e comportamento de motoristas?", value: 3 },
    { id: 6, text: "Você tem processos claros para comunicação e resposta a sinistros?", value: 3 },
    { id: 7, text: "Existe análise recorrente de ocorrências para prevenção futura?", value: 3 },
    { id: 8, text: "Seu seguro cobre as principais ameaças e está atualizado?", value: 3 },
    { id: 9, text: "Os dados de risco são integrados à operação (ex: decisão de rota, tipo de veículo, horário)?", value: 3 },
    { id: 10, text: "O cliente percebe sua operação como segura e confiável?", value: 3 },
  ];
  
  const shipperQuestions = [
    { id: 1, text: "Você avalia o risco logístico por tipo de carga, rota e transportadora?", value: 3 },
    { id: 2, text: "Os contratos com transportadoras exigem políticas claras de gerenciamento de risco?", value: 3 },
    { id: 3, text: "Você possui protocolos para escolha de transportadoras com base em histórico de sinistros?", value: 3 },
    { id: 4, text: "Sua empresa utiliza tecnologia para monitorar riscos em tempo real (rastreio, geofencing)?", value: 3 },
    { id: 5, text: "Em caso de sinistro, há um processo estruturado de comunicação e contenção?", value: 3 },
    { id: 6, text: "Existe controle e visibilidade sobre rotas críticas e horários de maior risco?", value: 3 },
    { id: 7, text: "Você analisa indicadores de risco e segurança com frequência?", value: 3 },
    { id: 8, text: "Seus processos incluem dupla checagem documental e de carga?", value: 3 },
    { id: 9, text: "Há auditoria periódica dos procedimentos de transporte com foco em risco?", value: 3 },
    { id: 10, text: "A gestão de risco está integrada ao planejamento logístico da empresa?", value: 3 },
  ];
  
  const handleSelectProfile = (selectedProfile: string) => {
    setProfile(selectedProfile);
    setQuestions(selectedProfile === 'transporter' ? transporterQuestions : shipperQuestions);
    setAnswers({});
    setResults(null);
  };
  
  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const calculateResults = () => {
    // Calculate total score
    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions < questions.length) {
      return; // Not all questions are answered
    }
    
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    
    // Determine maturity level
    let level = '';
    if (totalScore <= 20) {
      level = 'Nível Crítico';
    } else if (totalScore <= 35) {
      level = 'Nível Básico';
    } else if (totalScore <= 45) {
      level = 'Nível Estruturado';
    } else {
      level = 'Nível de Excelência';
    }
    
    // Generate recommendations based on profile and score
    const recommendations: string[] = [];
    
    if (profile === 'transporter') {
      if (totalScore <= 20) {
        recommendations.push('Estruture um plano formal de gerenciamento de risco');
        recommendations.push('Implemente tecnologia de rastreio com alertas em tempo real');
        recommendations.push('Faça análise mensal de sinistros para ações preventivas');
      } else if (totalScore <= 35) {
        recommendations.push('Implemente treinamentos regulares para motoristas sobre segurança');
        recommendations.push('Estabeleça políticas de controle de jornada e velocidade');
        recommendations.push('Avalie e atualize sua cobertura de seguro conforme operação atual');
      } else {
        recommendations.push('Integre dados de risco às decisões operacionais (roteirização, horários)');
        recommendations.push('Implemente sistemas avançados de telemetria para monitoramento de comportamento');
        recommendations.push('Automatize alertas de desvio de rota e análise preditiva de riscos');
      }
    } else {
      if (totalScore <= 20) {
        recommendations.push('Desenvolva critérios básicos para avaliação de transportadoras');
        recommendations.push('Implemente checklist de verificação documental e de segurança');
        recommendations.push('Mapeie rotas críticas e horários de maior risco');
      } else if (totalScore <= 35) {
        recommendations.push('Atualize contratos incluindo exigências de GR e penalidades');
        recommendations.push('Estabeleça processo de comunicação imediata em caso de sinistros');
        recommendations.push('Implemente auditoria periódica das transportadoras parceiras');
      } else {
        recommendations.push('Desenvolva um sistema de classificação de risco por rota e transportadora');
        recommendations.push('Implemente tecnologia para visibilidade em tempo real de todas as cargas');
        recommendations.push('Integre gestão de risco com planejamento estratégico logístico');
      }
    }
    
    setResults({
      score: totalScore,
      level,
      recommendations
    });
  };
  
  const resetDiagnostic = () => {
    setProfile(null);
    setQuestions([]);
    setAnswers({});
    setResults(null);
  };
  
  return (
    <Calculator
      id="diagnostico-risco"
      title="Diagnóstico de Gerenciamento de Risco"
      description="Avalie o nível de maturidade da sua gestão de risco logístico e receba recomendações práticas."
      isActive={isActive}
      onBackToHome={onBackToHome}
    >
      {!profile ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Selecione seu perfil:</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSelectProfile('transporter')}
              className="btn-large bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-3 shadow-md transition-transform hover:scale-105"
            >
              <Truck size={24} />
              <div className="text-left">
                <div className="font-medium">Transportador</div>
                <div className="text-sm text-orange-100">Você realiza entregas para clientes</div>
              </div>
            </button>
            
            <button
              onClick={() => handleSelectProfile('shipper')}
              className="btn-large bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-3 shadow-md transition-transform hover:scale-105"
            >
              <Package size={24} />
              <div className="text-left">
                <div className="font-medium">Embarcador</div>
                <div className="text-sm text-blue-100">Você contrata transportadoras</div>
              </div>
            </button>
          </div>
        </div>
      ) : results ? (
        <div className="py-4 animate-fade-in">
          <div className="mb-6 text-center">
            <div className={`inline-flex items-center justify-center p-3 rounded-full mb-3 ${
              results.score <= 20
                ? 'bg-gradient-to-br from-red-500 to-red-600'
                : results.score <= 35
                ? 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                : results.score <= 45
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-green-500 to-green-600'
            }`}>
              {results.score <= 20 ? (
                <AlertTriangle size={28} className="text-white" />
              ) : (
                <Shield size={28} className="text-white" />
              )}
            </div>
            <h3 className="text-xl font-medium text-gray-900">Diagnóstico Concluído</h3>
            <p className="text-gray-500 mt-1">
              Perfil: {profile === 'transporter' ? 'Transportador' : 'Embarcador'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <div className="text-gray-500 text-sm mb-1">Pontuação</div>
                  <div className="text-2xl font-bold text-gray-900">{results.score} <span className="text-gray-500 text-lg font-normal">de 50 pontos</span></div>
                </div>
                
                <div className="mb-6">
                  <div className="text-gray-500 text-sm mb-1">Nível de maturidade</div>
                  <div className={`text-xl font-medium ${
                    results.score <= 20
                      ? 'text-red-600'
                      : results.score <= 35
                      ? 'text-yellow-600'
                      : results.score <= 45
                      ? 'text-blue-600'
                      : 'text-green-600'
                  }`}>{results.level}</div>
                </div>
                
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100">
                        Maturidade
                      </span>
                    </div>
                  </div>
                  <div className="flex h-2 mb-4 overflow-hidden bg-gray-200 rounded">
                    <div
                      style={{ width: `${(results.score / 50) * 100}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        results.score <= 20
                          ? 'bg-red-500'
                          : results.score <= 35
                          ? 'bg-yellow-500'
                          : results.score <= 45
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Crítico</span>
                    <span>Básico</span>
                    <span>Estruturado</span>
                    <span>Excelência</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-gray-500 text-sm mb-3">Recomendações</div>
                <ul className="space-y-3">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex">
                      <span className="text-orange-500 mr-2 flex-shrink-0 mt-0.5">{index + 1}.</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button
              onClick={resetDiagnostic}
              className="btn btn-secondary"
            >
              <RefreshCw size={18} className="mr-2" />
              Realizar novo diagnóstico
            </button>
          </div>
        </div>
      ) : (
        <div className="py-4 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {profile === 'transporter' ? 'Diagnóstico para Transportadores' : 'Diagnóstico para Embarcadores'}
            </h3>
            <div className="text-sm text-gray-500 flex items-center">
              <span className="mr-1 font-medium">1</span> = Muito fraco / <span className="mx-1 font-medium">5</span> = Excelente
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`px-4 py-4 ${index > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                  <div className="flex-1">
                    <div className="text-gray-700 font-medium">{index + 1}. {question.text}</div>
                  </div>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswerChange(question.id, value)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          answers[question.id] === value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <button 
              className="btn btn-primary"
              onClick={calculateResults}
              disabled={Object.keys(answers).length !== questions.length}
            >
              Finalizar diagnóstico
            </button>
            <button 
              className="btn btn-secondary"
              onClick={resetDiagnostic}
            >
              <RefreshCw size={18} className="mr-2" />
              Reiniciar
            </button>
          </div>
          
          {Object.keys(answers).length !== questions.length && (
            <div className="text-center text-sm text-orange-500 mt-3">
              Por favor, responda todas as {questions.length} perguntas para finalizar o diagnóstico.
            </div>
          )}
        </div>
      )}
    </Calculator>
  );
};

export default RiskManagementDiagnostic;
