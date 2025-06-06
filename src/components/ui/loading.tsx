
import React from 'react';
import { Loader2, MapPin, Calculator, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-orange-500',
        sizeClasses[size],
        className
      )} 
    />
  );
};

interface LoadingStateProps {
  message?: string;
  icon?: 'map' | 'calculator' | 'truck' | 'default';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando...',
  icon = 'default',
  className
}) => {
  const icons = {
    map: MapPin,
    calculator: Calculator,
    truck: Truck,
    default: Loader2,
  };

  const Icon = icons[icon];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="relative mb-4">
        <Icon className="h-12 w-12 text-orange-500 animate-pulse" />
        <LoadingSpinner 
          size="sm" 
          className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" 
        />
      </div>
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Carregando...',
  children
}) => {
  return (
    <div className="relative">
      {children}
      {isVisible && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg border">
            <LoadingState message={message} />
          </div>
        </div>
      )}
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className,
  lines = 1 
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i} 
          className={cn(
            'bg-gray-200 rounded',
            i === 0 ? 'h-4' : 'h-3 mt-2',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
};

interface LoadingCardProps {
  title?: string;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  title = 'Processando...',
  className
}) => {
  return (
    <div className={cn(
      'bg-white rounded-lg border p-6 shadow-sm',
      className
    )}>
      <div className="flex items-center gap-3 mb-4">
        <LoadingSpinner size="sm" />
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <Skeleton lines={3} />
    </div>
  );
};
