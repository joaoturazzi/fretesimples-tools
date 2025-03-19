
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultBoxProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
  tooltip?: string;
}

const ResultBox = ({ label, value, unit = '', className = '', tooltip = '' }: ResultBoxProps) => {
  return (
    <div className={cn(
      "result-box bg-white border border-gray-100 rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {tooltip && (
          <div className="has-tooltip">
            <HelpCircle size={16} className="text-gray-400 hover:text-frete-500 transition-colors" />
            <span className="tooltip rounded bg-gray-800 text-white text-xs py-1 px-2 -mt-12 whitespace-nowrap max-w-xs z-10">
              {tooltip}
            </span>
          </div>
        )}
      </div>
      <div className="text-xl font-semibold text-gray-900">
        {value} {unit && <span className="text-gray-500 text-sm font-normal">{unit}</span>}
      </div>
    </div>
  );
};

export default ResultBox;
