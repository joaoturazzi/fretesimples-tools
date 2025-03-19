
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
        "tool-section py-8 px-4 sm:px-8 mb-8 glass-card",
        isActive ? "visible" : ""
      )}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {children}
      </div>
    </section>
  );
};

export default Calculator;
