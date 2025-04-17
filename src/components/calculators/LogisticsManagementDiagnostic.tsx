
import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import { Question, DiagnosticResults } from './logistics-diagnostic/types';
import { transporterQuestions, shipperQuestions } from './logistics-diagnostic/questions';
import { calculateDiagnosticResults } from './logistics-diagnostic/utils';
import ProfileSelection from './logistics-diagnostic/ProfileSelection';
import QuestionnaireForm from './logistics-diagnostic/QuestionnaireForm';
import DiagnosticResultsComponent from './logistics-diagnostic/DiagnosticResults';

interface LogisticsManagementDiagnosticProps {
  isActive: boolean;
}

const LogisticsManagementDiagnostic = ({ isActive }: LogisticsManagementDiagnosticProps) => {
  const [profile, setProfile] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<DiagnosticResults | null>(null);
  
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
  
  const handleCalculateResults = () => {
    if (!profile || Object.keys(answers).length !== questions.length) return;
    const calculatedResults = calculateDiagnosticResults(answers, profile);
    setResults(calculatedResults);
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
        <ProfileSelection onSelectProfile={handleSelectProfile} />
      ) : results ? (
        <DiagnosticResultsComponent 
          profile={profile} 
          results={results} 
          onReset={resetDiagnostic} 
        />
      ) : (
        <QuestionnaireForm
          profile={profile}
          questions={questions}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onCalculateResults={handleCalculateResults}
          onReset={resetDiagnostic}
        />
      )}
    </Calculator>
  );
};

export default LogisticsManagementDiagnostic;
