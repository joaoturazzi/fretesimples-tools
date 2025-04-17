
import React from 'react';
import { Question } from './types';
import { RefreshCw } from 'lucide-react';

interface QuestionnaireFormProps {
  profile: string;
  questions: Question[];
  answers: Record<number, number>;
  onAnswerChange: (questionId: number, value: number) => void;
  onCalculateResults: () => void;
  onReset: () => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  profile,
  questions,
  answers,
  onAnswerChange,
  onCalculateResults,
  onReset,
}) => {
  return (
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
                    onClick={() => onAnswerChange(question.id, value)}
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
          onClick={onCalculateResults}
          disabled={Object.keys(answers).length !== questions.length}
        >
          Finalizar diagnóstico
        </button>
        <button 
          className="btn btn-secondary"
          onClick={onReset}
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
  );
};

export default QuestionnaireForm;
