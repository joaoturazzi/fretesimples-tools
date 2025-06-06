
import React from 'react';
import { MapProviderProvider } from '@/components/map/UniversalMapProvider';
import EnhancedFreightCalculator from './freight/EnhancedFreightCalculator';

const FreightCalculator = ({ isActive }: { isActive: boolean }) => {
  return (
    <MapProviderProvider preferredProvider="here">
      <EnhancedFreightCalculator isActive={isActive} />
    </MapProviderProvider>
  );
};

export default FreightCalculator;
