
import React from 'react';
import { cn } from '@/lib/utils';

interface CalculatorProps {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  children: React.ReactNode;
}

const Calculator = ({ id, title, description, isActive, children }: CalculatorProps) => {
  return (
    <section 
      id={id}
      className={cn(
        "tool-section py-10 px-6 sm:px-8 mb-10 glass-card",
        isActive ? "visible" : ""
      )}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 border-l-4 border-frete-500 pl-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 max-w-3xl text-base md:text-lg">{description}</p>
        </div>
        
        <div className="calculator-card relative">
          {/* Decorative elements */}
          <div className="absolute -top-1 -right-1 w-20 h-20 bg-frete-50 rounded-full blur-xl opacity-50"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-50 rounded-full blur-xl opacity-40"></div>
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
