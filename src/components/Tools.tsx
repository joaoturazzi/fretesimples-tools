
import React, { lazy, Suspense } from 'react';
import CalculatorSkeleton from '@/components/ui/CalculatorSkeleton';

// Lazy load all calculators
const FreightCalculator = lazy(() => import('@/components/calculators/FreightCalculator'));
const ProfitSimulator = lazy(() => import('@/components/calculators/ProfitSimulator'));
const RiskCalculator = lazy(() => import('@/components/calculators/RiskCalculator'));
const EnhancedRiskCalculator = lazy(() => import('@/components/calculators/EnhancedRiskCalculator'));
const FuelCalculator = lazy(() => import('@/components/calculators/FuelCalculator'));
const TripChecklist = lazy(() => import('@/components/calculators/TripChecklist'));
const VehicleSizingTool = lazy(() => import('@/components/calculators/VehicleSizingTool'));
const LogisticsManagementDiagnostic = lazy(() => import('@/components/calculators/LogisticsManagementDiagnostic'));
const RiskManagementDiagnostic = lazy(() => import('@/components/calculators/RiskManagementDiagnostic'));
const LogisticsPostGenerator = lazy(() => import('@/components/calculators/LogisticsPostGenerator'));
const ContractGenerator = lazy(() => import('@/components/calculators/ContractGenerator'));

// Higher-order component for lazy loading with analytics
const withLazyLoading = (Component: React.LazyExoticComponent<any>, calculatorType: string) => {
  return (props: any) => (
    <Suspense fallback={<CalculatorSkeleton />}>
      <Component {...props} calculatorType={calculatorType} />
    </Suspense>
  );
};

// Export lazy-loaded components
export const LazyFreightCalculator = withLazyLoading(FreightCalculator, 'freight');
export const LazyProfitSimulator = withLazyLoading(ProfitSimulator, 'profit');
export const LazyRiskCalculator = withLazyLoading(RiskCalculator, 'risk');
export const LazyEnhancedRiskCalculator = withLazyLoading(EnhancedRiskCalculator, 'enhanced_risk');
export const LazyFuelCalculator = withLazyLoading(FuelCalculator, 'fuel');
export const LazyTripChecklist = withLazyLoading(TripChecklist, 'trip_checklist');
export const LazyVehicleSizingTool = withLazyLoading(VehicleSizingTool, 'vehicle_sizing');
export const LazyLogisticsManagementDiagnostic = withLazyLoading(LogisticsManagementDiagnostic, 'logistics_diagnostic');
export const LazyRiskManagementDiagnostic = withLazyLoading(RiskManagementDiagnostic, 'risk_diagnostic');
export const LazyLogisticsPostGenerator = withLazyLoading(LogisticsPostGenerator, 'post_generator');
export const LazyContractGenerator = withLazyLoading(ContractGenerator, 'contract_generator');

// Legacy exports for backward compatibility
export {
  LazyFreightCalculator as FreightCalculator,
  LazyProfitSimulator as ProfitSimulator,
  LazyRiskCalculator as RiskCalculator,
  LazyEnhancedRiskCalculator as EnhancedRiskCalculator,
  LazyFuelCalculator as FuelCalculator,
  LazyTripChecklist as TripChecklist,
  LazyVehicleSizingTool as VehicleSizingTool,
  LazyLogisticsManagementDiagnostic as LogisticsManagementDiagnostic,
  LazyRiskManagementDiagnostic as RiskManagementDiagnostic,
  LazyLogisticsPostGenerator as LogisticsPostGenerator,
  LazyContractGenerator as ContractGenerator
};
