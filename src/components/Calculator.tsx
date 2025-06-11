
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatorProps {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  children: React.ReactNode;
  onBackToHome?: () => void;
}

const Calculator = ({ id, title, description, isActive, children, onBackToHome }: CalculatorProps) => {
  console.log(`Calculator ${id} - isActive:`, isActive);
  
  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      // Fallback - disparar evento customizado
      window.dispatchEvent(new CustomEvent('changeActiveSection', { detail: 'home' }));
    }
  };
  
  if (!isActive) return null;
  
  return (
    <section 
      id={id}
      className="tool-section py-8 px-4 sm:px-6 md:px-8 mb-8 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header com botão Voltar */}
        <div className="flex items-center justify-between mb-6">
          <div className="section-heading flex-1">
            <div className="flex items-center mb-3">
              <div className="w-1.5 h-10 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full mr-4"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            <p className="text-gray-600 max-w-3xl text-sm md:text-base ml-6">{description}</p>
          </div>
          
          {/* Botão Voltar ao Início */}
          <div className="flex-shrink-0 ml-4">
            <Button
              onClick={handleBackToHome}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 touch-friendly min-h-[44px]"
            >
              <Home size={16} className="flex-shrink-0" />
              <span className="hidden sm:inline">Voltar ao Início</span>
              <ArrowLeft size={14} className="sm:hidden" />
            </Button>
          </div>
        </div>
        
        <div className="calculator-card relative bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-24 h-24 bg-orange-50 rounded-full blur-xl opacity-30"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-50 rounded-full blur-xl opacity-30"></div>
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
