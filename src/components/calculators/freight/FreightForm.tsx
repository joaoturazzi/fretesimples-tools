
import React from 'react';
import LocationInputs from './components/LocationInputs';
import DistanceInput from './components/DistanceInput';
import CargoInputs from './components/CargoInputs';
import CostInputs from './components/CostInputs';

interface FreightFormProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  distance: number | '';
  setDistance: (value: number | string) => void;
  weight: number | '';
  setWeight: (value: number | string) => void;
  costPerKm: number | '';
  setCostPerKm: (value: number | string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
  fuelPrice: number | '';
  setFuelPrice: (value: number | string) => void;
  consumption: number | '';
  setConsumption: (value: number | string) => void;
  tollsCost: number | '';
  setTollsCost: (value: number | string) => void;
  isCalculatingRoute: boolean;
  getDefaultCostPerKm: () => number;
  hasError: boolean;
  errorMessage: string;
}

const FreightForm: React.FC<FreightFormProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  distance,
  setDistance,
  weight,
  setWeight,
  costPerKm,
  setCostPerKm,
  vehicleType,
  setVehicleType,
  fuelPrice,
  setFuelPrice,
  consumption,
  setConsumption,
  tollsCost,
  setTollsCost,
  isCalculatingRoute,
  getDefaultCostPerKm,
  hasError,
  errorMessage
}) => {
  return (
    <div className="space-y-6">
      <LocationInputs
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
      />

      <DistanceInput
        distance={distance}
        setDistance={setDistance}
        isCalculatingRoute={isCalculatingRoute}
        hasError={hasError}
        errorMessage={errorMessage}
      />

      <CargoInputs
        weight={weight}
        setWeight={setWeight}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
      />

      <CostInputs
        costPerKm={costPerKm}
        setCostPerKm={setCostPerKm}
        fuelPrice={fuelPrice}
        setFuelPrice={setFuelPrice}
        consumption={consumption}
        setConsumption={setConsumption}
        tollsCost={tollsCost}
        setTollsCost={setTollsCost}
        getDefaultCostPerKm={getDefaultCostPerKm}
      />
    </div>
  );
};

export default FreightForm;
