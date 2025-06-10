
export interface VehicleType {
  name: string;
  weightCapacity: number;
  volumeCapacity: number;
  liquidCapacity?: number;
  fuelConsumption: number; // km/l
  operationalCost: number; // R$/km
  refrigerated?: boolean;
  dangerous?: boolean;
  description: string;
}

export interface CargoPreset {
  name: string;
  density: number; // kg/m³
  stackable: boolean;
  fragile: boolean;
  perishable?: boolean;
  dangerous?: boolean;
  refrigerated?: boolean;
  description: string;
  specialRequirements?: string[];
}

export const vehicleTypes: VehicleType[] = [
  { 
    name: 'Fiorino', 
    weightCapacity: 600, 
    volumeCapacity: 3, 
    fuelConsumption: 12, 
    operationalCost: 0.8,
    description: 'Ideal para pequenas entregas urbanas'
  },
  { 
    name: 'VUC', 
    weightCapacity: 1500, 
    volumeCapacity: 6, 
    fuelConsumption: 10, 
    operationalCost: 1.2,
    description: 'Veículo urbano de carga para cidade'
  },
  { 
    name: '3/4', 
    weightCapacity: 3000, 
    volumeCapacity: 15, 
    fuelConsumption: 8, 
    operationalCost: 1.8,
    description: 'Caminhão leve para cargas médias'
  },
  { 
    name: 'Toco', 
    weightCapacity: 6000, 
    volumeCapacity: 30, 
    fuelConsumption: 6, 
    operationalCost: 2.5,
    description: 'Caminhão médio, versatilidade urbana'
  },
  { 
    name: 'Truck', 
    weightCapacity: 14000, 
    volumeCapacity: 45, 
    fuelConsumption: 4, 
    operationalCost: 3.2,
    description: 'Caminhão pesado para longas distâncias'
  },
  { 
    name: 'Carreta', 
    weightCapacity: 25000, 
    volumeCapacity: 90, 
    fuelConsumption: 3.5, 
    operationalCost: 4.0,
    description: 'Máxima capacidade para grandes volumes'
  },
  { 
    name: 'Baú Refrigerado', 
    weightCapacity: 12000, 
    volumeCapacity: 40, 
    fuelConsumption: 3.8, 
    operationalCost: 4.5,
    refrigerated: true,
    description: 'Para cargas que necessitam refrigeração'
  },
  { 
    name: 'Tanque 15m³', 
    weightCapacity: 15000, 
    volumeCapacity: 0, 
    liquidCapacity: 15000, 
    fuelConsumption: 4.5, 
    operationalCost: 3.8,
    description: 'Transporte de líquidos médio porte'
  },
  { 
    name: 'Tanque 30m³', 
    weightCapacity: 30000, 
    volumeCapacity: 0, 
    liquidCapacity: 30000, 
    fuelConsumption: 3.2, 
    operationalCost: 4.2,
    description: 'Transporte de líquidos grande porte'
  },
  { 
    name: 'Prancha', 
    weightCapacity: 20000, 
    volumeCapacity: 0, 
    fuelConsumption: 3.5, 
    operationalCost: 3.8,
    description: 'Para cargas especiais e maquinário'
  },
  { 
    name: 'Container 20"', 
    weightCapacity: 21000, 
    volumeCapacity: 33, 
    fuelConsumption: 3.8, 
    operationalCost: 3.5,
    description: 'Container padrão internacional'
  },
  { 
    name: 'Container 40"', 
    weightCapacity: 26000, 
    volumeCapacity: 67, 
    fuelConsumption: 3.2, 
    operationalCost: 4.0,
    description: 'Container de alta capacidade'
  }
];

export const cargoPresets: CargoPreset[] = [
  { 
    name: 'Eletrônicos', 
    density: 200, 
    stackable: true, 
    fragile: true, 
    description: 'TVs, computadores, celulares',
    specialRequirements: ['Embalagem anti-estática', 'Seguro obrigatório']
  },
  { 
    name: 'Móveis', 
    density: 150, 
    stackable: false, 
    fragile: true, 
    description: 'Sofás, camas, armários',
    specialRequirements: ['Proteção contra umidade', 'Manuseio cuidadoso']
  },
  { 
    name: 'Roupas', 
    density: 100, 
    stackable: true, 
    fragile: false, 
    description: 'Vestuário em geral' 
  },
  { 
    name: 'Alimentos secos', 
    density: 400, 
    stackable: true, 
    fragile: false, 
    description: 'Grãos, farinhas, conservas' 
  },
  { 
    name: 'Alimentos perecíveis', 
    density: 600, 
    stackable: true, 
    fragile: false, 
    perishable: true,
    refrigerated: true,
    description: 'Frutas, verduras, laticínios',
    specialRequirements: ['Temperatura controlada', 'Entrega rápida']
  },
  { 
    name: 'Bebidas', 
    density: 800, 
    stackable: true, 
    fragile: true, 
    description: 'Refrigerantes, cervejas, águas' 
  },
  { 
    name: 'Materiais de construção', 
    density: 800, 
    stackable: true, 
    fragile: false, 
    description: 'Cimento, tijolos, telhas' 
  },
  { 
    name: 'Automóveis', 
    density: 1200, 
    stackable: false, 
    fragile: true, 
    description: 'Carros, motos',
    specialRequirements: ['Cegonheiro especializado', 'Seguro total']
  },
  { 
    name: 'Maquinário', 
    density: 2000, 
    stackable: false, 
    fragile: true, 
    description: 'Equipamentos industriais',
    specialRequirements: ['Guindaste para carga/descarga', 'Projeto de transporte']
  },
  { 
    name: 'Produtos químicos', 
    density: 1100, 
    stackable: true, 
    fragile: false, 
    dangerous: true,
    description: 'Químicos industriais',
    specialRequirements: ['MOPP obrigatório', 'Documentação especial', 'Kit emergência']
  },
  { 
    name: 'Combustíveis', 
    density: 800, 
    stackable: false, 
    fragile: false, 
    dangerous: true,
    description: 'Gasolina, diesel, álcool',
    specialRequirements: ['MOPP obrigatório', 'Tanque certificado', 'Escolta']
  },
  { 
    name: 'Líquidos', 
    density: 1000, 
    stackable: false, 
    fragile: false, 
    description: 'Água, sucos, óleos' 
  },
  { 
    name: 'Medicamentos', 
    density: 300, 
    stackable: true, 
    fragile: true, 
    description: 'Remédios e produtos farmacêuticos',
    specialRequirements: ['Temperatura controlada', 'Rastreabilidade total']
  },
  { 
    name: 'Personalizado', 
    density: 0, 
    stackable: true, 
    fragile: false, 
    description: 'Definir manualmente' 
  }
];

export const getEfficiencyScore = (vehicle: VehicleType, totalWeight: number, totalVolume: number): number => {
  const weightUtil = (totalWeight / vehicle.weightCapacity) * 100;
  const volumeUtil = vehicle.liquidCapacity 
    ? ((totalVolume * 1000) / vehicle.liquidCapacity) * 100
    : (totalVolume / vehicle.volumeCapacity) * 100;
  
  const maxUtil = Math.max(weightUtil, volumeUtil);
  
  // Score baseado na utilização ótima (70-90%)
  if (maxUtil >= 70 && maxUtil <= 90) return 100;
  if (maxUtil >= 60 && maxUtil < 70) return 85;
  if (maxUtil >= 90 && maxUtil <= 95) return 85;
  if (maxUtil >= 50 && maxUtil < 60) return 70;
  if (maxUtil >= 95 && maxUtil <= 100) return 60;
  return Math.max(0, 50 - Math.abs(maxUtil - 75));
};
