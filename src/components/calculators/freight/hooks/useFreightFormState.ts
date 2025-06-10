
import { useState } from 'react';

export const useFreightFormState = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [vehicleType, setVehicleType] = useState('truck');
  const [costPerKm, setCostPerKm] = useState<number | ''>('');
  const [fuelPrice, setFuelPrice] = useState<number | ''>('');
  const [consumption, setConsumption] = useState<number | ''>('');
  const [tollsCost, setTollsCost] = useState<number | ''>('');
  
  // Cost simulation fields
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<number | ''>('');
  const [driverSalary, setDriverSalary] = useState<number | ''>('');
  const [monthlyDistance, setMonthlyDistance] = useState<number | ''>('');
  const [showCostSimulation, setShowCostSimulation] = useState(false);

  const convertValue = (value: string | number): number | '' => {
    if (typeof value === 'number') return value;
    if (value === '' || value === null || value === undefined) return '';
    const parsed = parseFloat(value.toString());
    return isNaN(parsed) ? '' : parsed;
  };

  const resetForm = () => {
    setOrigin('');
    setDestination('');
    setDistance('');
    setWeight('');
    setVehicleType('truck');
    setCostPerKm('');
    setFuelPrice('');
    setConsumption('');
    setTollsCost('');
    setMonthlyMaintenance('');
    setDriverSalary('');
    setMonthlyDistance('');
    setShowCostSimulation(false);
  };

  return {
    // Basic form fields
    origin, setOrigin,
    destination, setDestination,
    distance, setDistance: (value: number | string) => setDistance(convertValue(value)),
    weight, setWeight: (value: number | string) => setWeight(convertValue(value)),
    vehicleType, setVehicleType,
    costPerKm, setCostPerKm: (value: number | string) => setCostPerKm(convertValue(value)),
    fuelPrice, setFuelPrice: (value: number | string) => setFuelPrice(convertValue(value)),
    consumption, setConsumption: (value: number | string) => setConsumption(convertValue(value)),
    tollsCost, setTollsCost: (value: number | string) => setTollsCost(convertValue(value)),
    
    // Cost simulation fields
    monthlyMaintenance, setMonthlyMaintenance: (value: number | string) => setMonthlyMaintenance(convertValue(value)),
    driverSalary, setDriverSalary: (value: number | string) => setDriverSalary(convertValue(value)),
    monthlyDistance, setMonthlyDistance: (value: number | string) => setMonthlyDistance(convertValue(value)),
    showCostSimulation, setShowCostSimulation,
    
    // Utilities
    resetForm
  };
};
