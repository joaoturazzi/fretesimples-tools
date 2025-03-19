
import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ResultBoxProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
  tooltip?: string;
}

const ResultBox = ({ label, value, unit = '', className = '', tooltip = '' }: ResultBoxProps) => {
  return (
    <div className={`result-box ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-500">{label}</span>
        {tooltip && (
          <div className="has-tooltip">
            <HelpCircle size={16} className="text-gray-400" />
            <span className="tooltip">{tooltip}</span>
          </div>
        )}
      </div>
      <div className="text-xl font-medium text-gray-900">
        {value} {unit && <span className="text-gray-500 text-sm">{unit}</span>}
      </div>
    </div>
  );
};

export default ResultBox;
