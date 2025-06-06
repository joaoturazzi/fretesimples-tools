
import { vehicleTypes, cargoPresets, type VehicleType } from './vehicleData';

export interface Volume {
  quantity: number;
  weight: number;
  height: number;
  width: number;
  length: number;
}

export interface VehicleResult {
  totalWeight: number;
  totalVolume: number;
  recommendedVehicle: string;
  utilizationPercentage: number;
  alternativeVehicles: string[];
  warnings: string[];
}

export const calculateTotalWeight = (volume: Volume, isLiquid: boolean, liquidVolume: number): number => {
  if (isLiquid) {
    return liquidVolume * 1000; // Assuming 1L = 1kg for most liquids
  }
  return volume.quantity * volume.weight;
};

export const calculateTotalVolume = (volume: Volume, cargoType: string, isLiquid: boolean, liquidVolume: number): number => {
  if (isLiquid) {
    return liquidVolume / 1000; // Convert liters to m³
  }
  
  const preset = cargoPresets.find(p => p.name.toLowerCase().includes(cargoType.toLowerCase()));
  let volumePerUnit = volume.height * volume.width * volume.length;
  
  // Apply stacking factor for non-stackable items
  if (preset && !preset.stackable && volume.quantity > 1) {
    volumePerUnit *= 1.3; // 30% additional space for non-stackable items
  }
  
  return volume.quantity * volumePerUnit;
};

export const findRecommendedVehicle = (
  totalWeight: number, 
  totalVolume: number, 
  isLiquid: boolean,
  cargoType: string
): {
  vehicle: string;
  utilization: number;
  alternatives: string[];
  warnings: string[];
} => {
  const warnings: string[] = [];
  const alternatives: string[] = [];
  
  // Filter vehicles based on cargo type
  let availableVehicles = vehicleTypes;
  if (isLiquid) {
    availableVehicles = vehicleTypes.filter(v => v.liquidCapacity);
  }
  
  for (const vehicle of availableVehicles) {
    let fits = false;
    let utilization = 0;
    
    if (isLiquid && vehicle.liquidCapacity) {
      fits = totalWeight <= vehicle.weightCapacity && (totalVolume * 1000) <= vehicle.liquidCapacity;
      utilization = Math.max(
        (totalWeight / vehicle.weightCapacity) * 100,
        ((totalVolume * 1000) / vehicle.liquidCapacity) * 100
      );
    } else if (!isLiquid) {
      fits = totalWeight <= vehicle.weightCapacity && totalVolume <= vehicle.volumeCapacity;
      utilization = Math.max(
        (totalWeight / vehicle.weightCapacity) * 100,
        (totalVolume / vehicle.volumeCapacity) * 100
      );
    }
    
    if (fits) {
      // Add to alternatives if utilization is reasonable
      if (utilization >= 60 && utilization <= 95) {
        alternatives.push(`${vehicle.name} (${utilization.toFixed(1)}% utilização)`);
      }
      
      return {
        vehicle: vehicle.name,
        utilization,
        alternatives: alternatives.slice(0, 3), // Limit to 3 alternatives
        warnings
      };
    }
  }
  
  // Add warnings for special cargo types
  const preset = cargoPresets.find(p => p.name.toLowerCase().includes(cargoType.toLowerCase()));
  if (preset?.fragile) {
    warnings.push('Carga frágil: considere proteções especiais e motorista experiente');
  }
  if (preset && !preset.stackable) {
    warnings.push('Carga não empilhável: pode necessitar veículo maior que o calculado');
  }
  
  return {
    vehicle: 'Carreta (carga excede limites padrão)',
    utilization: 100,
    alternatives: [],
    warnings: ['Carga excede capacidades padrão - consulte especialista em transporte especial']
  };
};
