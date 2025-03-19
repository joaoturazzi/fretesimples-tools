
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResultBoxProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
  tooltip?: string;
  icon?: React.ReactNode;
}

const ResultBox = ({ label, value, unit = '', className = '', tooltip = '', icon }: ResultBoxProps) => {
  return (
    <div className={cn(
      "result-box bg-white border border-gray-100 rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-md",
      "animate-fade-slide-up",
      className
    )}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
          {icon && icon}
          {label}
        </span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="focus:outline-none" aria-label="Mais informações">
                  <HelpCircle size={16} className="text-gray-400 hover:text-frete-500 transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="text-xl font-semibold text-gray-900 flex items-baseline">
        <span className="truncate">{value}</span>
        {unit && <span className="text-gray-500 text-sm font-normal ml-1">{unit}</span>}
      </div>
    </div>
  );
};

export default ResultBox;
