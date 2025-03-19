
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
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 mb-8 text-lg max-w-3xl">{description}</p>
        <div className="calculator-card">
          {children}
        </div>
      </div>
    </section>
  );
};

export default Calculator;
