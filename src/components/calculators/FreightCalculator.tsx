
import React from 'react';
import EnhancedFreightCalculator from './freight/EnhancedFreightCalculator';

const FreightCalculator = ({ isActive }: { isActive: boolean }) => {
  return <EnhancedFreightCalculator isActive={isActive} />;
};

export default FreightCalculator;
