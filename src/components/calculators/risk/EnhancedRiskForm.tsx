
import React, { useState } from 'react';
import ProgressIndicator from './components/ProgressIndicator';
import TripInformationStep from './components/TripInformationStep';
import OperationalConfigStep from './components/OperationalConfigStep';
import SecurityToolsStep from './components/SecurityToolsStep';
import FormStatus from './components/FormStatus';

interface EnhancedRiskFormProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  cargoType: string;
  setCargoType: (value: string) => void;
  cargoValue: string;
  setCargoValue: (value: string) => void;
  contractType: string;
  setContractType: (value: string) => void;
  travelTime: string;
  setTravelTime: (value: string) => void;
  securityTools: string[];
  setSecurityTools: (value: string[]) => void;
  routeDistance: number | null;
  isCalculatingRoute: boolean;
  isFormValid: boolean;
  validationErrors: Record<string, string>;
}

const EnhancedRiskForm: React.FC<EnhancedRiskFormProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  cargoType,
  setCargoType,
  cargoValue,
  setCargoValue,
  contractType,
  setContractType,
  travelTime,
  setTravelTime,
  securityTools,
  setSecurityTools,
  routeDistance,
  isCalculatingRoute,
  isFormValid,
  validationErrors
}) => {
  const [currentStep] = useState(1);
  const totalSteps = 3;

  return (
    <div className="space-y-6">
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />

      <TripInformationStep
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        cargoType={cargoType}
        setCargoType={setCargoType}
        cargoValue={cargoValue}
        setCargoValue={setCargoValue}
        routeDistance={routeDistance}
        isCalculatingRoute={isCalculatingRoute}
        validationErrors={validationErrors}
      />

      <OperationalConfigStep
        contractType={contractType}
        setContractType={setContractType}
        travelTime={travelTime}
        setTravelTime={setTravelTime}
      />

      <SecurityToolsStep
        securityTools={securityTools}
        setSecurityTools={setSecurityTools}
      />

      <FormStatus
        isFormValid={isFormValid}
        validationErrors={validationErrors}
      />
    </div>
  );
};

export default EnhancedRiskForm;
