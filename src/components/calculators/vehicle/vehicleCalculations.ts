
import { vehicleTypes, cargoPresets, getEfficiencyScore, type VehicleType } from './vehicleData';

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
  efficiencyScore: number;
  operationalCost: number;
  fuelConsumption: number;
  specialRequirements: string[];
}

export const validateDocuments = (doc: string): { isValid: boolean; type: 'CPF' | 'CNPJ' | null } => {
  const cleanDoc = doc.replace(/\D/g, '');
  
  if (cleanDoc.length === 11) {
    // Validação CPF
    if (/^(\d)\1{10}$/.test(cleanDoc)) return { isValid: false, type: null };
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanDoc.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanDoc.charAt(9))) return { isValid: false, type: null };
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanDoc.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanDoc.charAt(10))) return { isValid: false, type: null };
    
    return { isValid: true, type: 'CPF' };
  }
  
  if (cleanDoc.length === 14) {
    // Validação CNPJ
    if (/^(\d)\1{13}$/.test(cleanDoc)) return { isValid: false, type: null };
    
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanDoc.charAt(i)) * weights1[i];
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (digit1 !== parseInt(cleanDoc.charAt(12))) return { isValid: false, type: null };
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanDoc.charAt(i)) * weights2[i];
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    if (digit2 !== parseInt(cleanDoc.charAt(13))) return { isValid: false, type: null };
    
    return { isValid: true, type: 'CNPJ' };
  }
  
  return { isValid: false, type: null };
};

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
  
  // Apply stacking and fragility factors
  if (preset) {
    if (!preset.stackable && volume.quantity > 1) {
      volumePerUnit *= 1.4; // 40% additional space for non-stackable items
    }
    if (preset.fragile) {
      volumePerUnit *= 1.2; // 20% additional space for fragile items
    }
  }
  
  return volume.quantity * volumePerUnit;
};

export const calculateOperationalCosts = (distance: number, vehicle: VehicleType): { 
  operationalCost: number; 
  fuelCost: number; 
  totalCost: number; 
} => {
  const operationalCost = distance * vehicle.operationalCost;
  const fuelCost = (distance / vehicle.fuelConsumption) * 6.0; // Assuming R$ 6.00 per liter
  const totalCost = operationalCost + fuelCost;
  
  return { operationalCost, fuelCost, totalCost };
};

export const findRecommendedVehicle = (
  totalWeight: number, 
  totalVolume: number, 
  isLiquid: boolean,
  cargoType: string,
  distance: number = 100
): {
  vehicle: string;
  utilization: number;
  alternatives: string[];
  warnings: string[];
  efficiencyScore: number;
  operationalCost: number;
  fuelConsumption: number;
  specialRequirements: string[];
} => {
  const warnings: string[] = [];
  const alternatives: string[] = [];
  const specialRequirements: string[] = [];
  
  // Get cargo preset for special requirements
  const preset = cargoPresets.find(p => p.name.toLowerCase().includes(cargoType.toLowerCase()));
  if (preset?.specialRequirements) {
    specialRequirements.push(...preset.specialRequirements);
  }
  
  // Filter vehicles based on cargo type
  let availableVehicles = vehicleTypes;
  if (isLiquid) {
    availableVehicles = vehicleTypes.filter(v => v.liquidCapacity);
  }
  if (preset?.refrigerated) {
    availableVehicles = availableVehicles.filter(v => v.refrigerated || v.name.includes('Refrigerado'));
    if (availableVehicles.length === 0) {
      warnings.push('Carga necessita refrigeração - considere veículo baú refrigerado');
      availableVehicles = vehicleTypes.filter(v => v.liquidCapacity ? false : true);
    }
  }
  if (preset?.dangerous) {
    warnings.push('Carga perigosa: MOPP obrigatório, documentação especial necessária');
  }
  
  let bestVehicle: VehicleType | null = null;
  let bestScore = 0;
  
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
      const efficiencyScore = getEfficiencyScore(vehicle, totalWeight, totalVolume);
      const costs = calculateOperationalCosts(distance, vehicle);
      
      // Score considera eficiência e custo
      const totalScore = efficiencyScore - (costs.totalCost / 100); // Penaliza custos altos
      
      if (utilization >= 50 && utilization <= 95) {
        const altText = `${vehicle.name} (${utilization.toFixed(1)}% utilização, R$${costs.totalCost.toFixed(2)})`;
        alternatives.push(altText);
      }
      
      if (totalScore > bestScore || !bestVehicle) {
        bestScore = totalScore;
        bestVehicle = vehicle;
      }
    }
  }
  
  if (!bestVehicle) {
    return {
      vehicle: 'Nenhum veículo adequado encontrado',
      utilization: 0,
      alternatives: [],
      warnings: ['Carga excede capacidades disponíveis - consulte especialista'],
      efficiencyScore: 0,
      operationalCost: 0,
      fuelConsumption: 0,
      specialRequirements
    };
  }
  
  const costs = calculateOperationalCosts(distance, bestVehicle);
  const efficiencyScore = getEfficiencyScore(bestVehicle, totalWeight, totalVolume);
  
  let utilization = 0;
  if (isLiquid && bestVehicle.liquidCapacity) {
    utilization = Math.max(
      (totalWeight / bestVehicle.weightCapacity) * 100,
      ((totalVolume * 1000) / bestVehicle.liquidCapacity) * 100
    );
  } else if (!isLiquid) {
    utilization = Math.max(
      (totalWeight / bestVehicle.weightCapacity) * 100,
      (totalVolume / bestVehicle.volumeCapacity) * 100
    );
  }
  
  // Add performance warnings
  if (preset?.fragile) {
    warnings.push('Carga frágil: manuseio cuidadoso e motorista experiente');
  }
  if (preset?.perishable) {
    warnings.push('Carga perecível: entrega rápida necessária');
  }
  if (efficiencyScore < 70) {
    warnings.push('Baixa eficiência: considere consolidar cargas ou veículo menor');
  }
  
  return {
    vehicle: bestVehicle.name,
    utilization,
    alternatives: alternatives.slice(0, 3),
    warnings,
    efficiencyScore,
    operationalCost: costs.operationalCost,
    fuelConsumption: bestVehicle.fuelConsumption,
    specialRequirements
  };
};
