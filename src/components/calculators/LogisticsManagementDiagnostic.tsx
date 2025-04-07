
import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import { BarChart, RefreshCw, CheckCircle } from 'lucide-react';

interface LogisticsManagementDiagnosticProps {
  isActive: boolean;
}

interface Question {
  id: number;
  text: string;
  value: number;
}

const LogisticsManagementDiagnostic = ({ isActive }: LogisticsManagementDiagnosticProps) => {
  const [profile, setProfile] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<{
    score: number;
    level: string;
    recommendations: string[];
  } | null>(null);
  
  const transporterQuestions = [
    { id: 1, text: "Qual o nível de rastreabilidade que você oferece aos clientes?", value: 3 },
    { id: 2, text: "Com que frequência você atualiza o status dos envios em tempo real?", value: 3 },
    { id: 3, text: "Seu índice de entregas no prazo (OTIF) é monitorado e confiável?", value: 3 },
    { id: 4, text: "A roteirização é feita de forma automatizada e eficiente?", value: 3 },
    { id: 5, text: "Qual o nível de controle sobre custos operacionais e de combustível?", value: 3 },
    { id: 6, text: "Sua comunicação com os motoristas é clara e estruturada?", value: 3 },
    { id: 7, text: "Os indicadores de performance são acompanhados com frequência?", value: 3 },
    { id: 8, text: "Os processos de conferência de faturas e ocorrências são padronizados?", value: 3 },
    { id: 9, text: "Há uso de tecnologia para gestão de frota e logística?", value: 3 },
    { id: 10, text: "Você tem uma estratégia de melhoria contínua e satisfação do cliente?", value: 3 },
  ];
  
  const shipperQuestions = [
    { id: 1, text: "Qual o nível de controle sobre os custos logísticos da sua empresa?", value: 3 },
    { id: 2, text: "Você rastreia as entregas feitas por transportadoras em tempo real?", value: 3 },
    { id: 3, text: "Com que frequência audita faturas de frete?", value: 3 },
    { id: 4, text: "Sua roteirização é otimizada ou feita de forma manual?", value: 3 },
    { id: 5, text: "Os contratos com transportadoras são baseados em desempenho (SLA, OTIF)?", value: 3 },
    { id: 6, text: "Você tem visibilidade sobre atrasos e ocorrências de entrega?", value: 3 },
    { id: 7, text: "Há integração entre logística, vendas, financeiro e atendimento?", value: 3 },
    { id: 8, text: "Você acompanha indicadores logísticos com frequência?", value: 3 },
    { id: 9, text: "Existe uma política de escolha de transportadoras baseada em performance?", value: 3 },
    { id: 10, text: "Qual seu nível de satisfação com a performance logística atual?", value: 3 },
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
      level = 'Nível iniciante';
    } else if (totalScore <= 35) {
      level = 'Nível intermediário';
    } else if (totalScore <= 45) {
      level = 'Nível avançado';
    } else {
      level = 'Nível de excelência';
    }
    
    // Generate recommendations based on profile and score
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
      id="diagnostico-logistica"
      title="Diagnóstico de Maturidade Logística"
      description="Avalie o nível de maturidade da sua gestão logística e receba recomendações práticas."
      isActive={isActive}
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
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-3">
              <CheckCircle size={28} className="text-white" />
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
                  <div className="text-xl font-medium text-gray-900">{results.level}</div>
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
                    <span>Iniciante</span>
                    <span>Intermediário</span>
                    <span>Avançado</span>
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

export default LogisticsManagementDiagnostic;
