
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
        "tool-section py-6 px-4 sm:px-6 md:px-8 mb-6 glass-card",
        isActive ? "visible" : ""
      )}
    >
      <div className="max-w-5xl mx-auto">
        <div className="section-heading mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 max-w-3xl text-sm md:text-base">{description}</p>
        </div>
        
        <div className="calculator-card relative">
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-frete-50 rounded-full blur-xl opacity-30"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-50 rounded-full blur-xl opacity-30"></div>
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
