
import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';

interface LazyComponentProps {
  importFn: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ 
  importFn, 
  fallback = <LoadingSpinner />, 
  ...props 
}) => {
  const Component = lazy(importFn);
  
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyComponent;
