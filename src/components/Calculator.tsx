
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
        "tool-section py-8 px-4 sm:px-6 md:px-8 mb-8 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300",
        isActive ? "visible" : ""
      )}
    >
      <div className="max-w-5xl mx-auto">
        <div className="section-heading mb-6">
          <div className="flex items-center mb-3">
            <div className="w-1.5 h-10 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full mr-4"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="text-gray-600 max-w-3xl text-sm md:text-base ml-6">{description}</p>
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
