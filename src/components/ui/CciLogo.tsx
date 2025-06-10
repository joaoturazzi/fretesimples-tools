
import React from 'react';
import { cn } from '@/lib/utils';

interface CciLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CciLogo: React.FC<CciLogoProps> = ({ 
  className, 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img 
        src="https://i.postimg.cc/C5bzFpj8/Logo-CCI.png" 
        alt="CCI Logo" 
        className={cn("w-auto object-contain", sizeClasses[size])}
      />
      {showText && (
        <div>
          <h2 className={cn(
            "font-bold text-orange-600 uppercase tracking-wider",
            textSizeClasses[size]
          )}>
            FreteDigital
          </h2>
          <p className={cn(
            "text-gray-500",
            size === 'sm' ? 'text-xs' : 'text-xs'
          )}>
            BY CCI
          </p>
        </div>
      )}
    </div>
  );
};

export default CciLogo;
