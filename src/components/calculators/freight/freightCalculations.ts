
export interface FreightCalculationResult {
  distanceCost: number;
  weightCost: number;
  fuelCost: number;
  tollsCost: number;
  totalFreight: number;
  costPerKm: number;
  deliveryTime: string;
  breakdown: {
    distance: number;
    weight: number;
    fuelPrice: number;
    consumption: number;
  };
}

export interface CostSimulationResult {
  totalMonthlyCost: number;
  costPerKmCalculated: number;
  fuelPercent: number;
  maintenancePercent: number;
  salaryPercent: number;
  tollsPercent: number;
}

export const getDefaultCostPerKm = (vehicleType: string): number => {
  switch (vehicleType) {
    case 'truck': return 2.5;
    case 'van': return 1.8;
    case 'motorcycle': return 1.2;
    default: return 2.0;
  }
};

export const getWeightMultiplier = (vehicleType: string): number => {
  switch (vehicleType) {
    case 'truck': return 0.15;
    case 'van': return 0.1;
    case 'motorcycle': return 0.05;
    default: return 0.1;
  }
};

export const calculateEstimatedTime = (distance: number, vehicleType: string): string => {
  let speedPerHour;
  
  switch (vehicleType) {
    case 'truck': speedPerHour = 70; break;
    case 'van': speedPerHour = 80; break;
    case 'motorcycle': speedPerHour = 90; break;
    default: speedPerHour = 60;
  }
  
  const timeInHours = distance / speedPerHour;
  const restTime = Math.floor(distance / 250) * 0.5;
  const totalTime = timeInHours + restTime;
  
  const hours = Math.floor(totalTime);
  const minutes = Math.round((totalTime - hours) * 60);
  
  return `${hours}h ${minutes}min`;
};

export const calculateFreight = (
  distance: number,
  weight: number,
  vehicleType: string,
  costPerKm: number,
  fuelPrice: number,
  consumption: number,
  tollsCost: number
): FreightCalculationResult => {
  // Calculate costs
  let fuelCost = 0;
  if (fuelPrice > 0 && consumption > 0) {
    const litersNeeded = distance / consumption;
    fuelCost = litersNeeded * fuelPrice;
  }

  const distanceCost = distance * costPerKm;
  const weightCost = weight * getWeightMultiplier(vehicleType);
  const totalFreight = distanceCost + weightCost + fuelCost + tollsCost;
  const finalCostPerKm = totalFreight / distance;
  
  return {
    distanceCost,
    weightCost,
    fuelCost,
    tollsCost,
    totalFreight,
    costPerKm: finalCostPerKm,
    deliveryTime: calculateEstimatedTime(distance, vehicleType),
    breakdown: {
      distance,
      weight,
      fuelPrice,
      consumption
    }
  };
};

export const calculateCostSimulation = (
  monthlyMaintenance: number,
  driverSalary: number,
  monthlyDistance: number,
  fuelPrice: number,
  consumption: number,
  tollsCost: number,
  distance: number
): CostSimulationResult | null => {
  if (!monthlyMaintenance || !driverSalary || !monthlyDistance || !fuelPrice || !consumption) {
    return null;
  }

  const monthlyFuelCost = monthlyDistance / consumption * fuelPrice;
  const monthlyTollsCost = tollsCost * (distance / 100); // Estimativa baseada na viagem atual
  
  const totalMonthlyCost = monthlyFuelCost + monthlyMaintenance + driverSalary + monthlyTollsCost;
  const costPerKmCalculated = totalMonthlyCost / monthlyDistance;
  
  const fuelPercent = (monthlyFuelCost / totalMonthlyCost) * 100;
  const maintenancePercent = (monthlyMaintenance / totalMonthlyCost) * 100;
  const salaryPercent = (driverSalary / totalMonthlyCost) * 100;
  const tollsPercent = (monthlyTollsCost / totalMonthlyCost) * 100;

  return {
    totalMonthlyCost,
    costPerKmCalculated,
    fuelPercent,
    maintenancePercent,
    salaryPercent,
    tollsPercent
  };
};
