
export interface VehicleType {
  name: string;
  weightCapacity: number;
  volumeCapacity: number;
  liquidCapacity?: number;
}

export interface CargoPreset {
  name: string;
  density: number; // kg/m³
  stackable: boolean;
  fragile: boolean;
  description: string;
}

export const vehicleTypes: VehicleType[] = [
  { name: 'Fiorino', weightCapacity: 600, volumeCapacity: 3 },
  { name: 'VUC', weightCapacity: 1500, volumeCapacity: 6 },
  { name: '3/4', weightCapacity: 3000, volumeCapacity: 15 },
  { name: 'Toco', weightCapacity: 6000, volumeCapacity: 30 },
  { name: 'Truck', weightCapacity: 14000, volumeCapacity: 45 },
  { name: 'Carreta', weightCapacity: 25000, volumeCapacity: 90 },
  { name: 'Tanque 15m³', weightCapacity: 15000, volumeCapacity: 0, liquidCapacity: 15000 },
  { name: 'Tanque 30m³', weightCapacity: 30000, volumeCapacity: 0, liquidCapacity: 30000 },
];

export const cargoPresets: CargoPreset[] = [
  { name: 'Eletrônicos', density: 200, stackable: true, fragile: true, description: 'TVs, computadores, celulares' },
  { name: 'Móveis', density: 150, stackable: false, fragile: true, description: 'Sofás, camas, armários' },
  { name: 'Roupas', density: 100, stackable: true, fragile: false, description: 'Vestuário em geral' },
  { name: 'Alimentos secos', density: 400, stackable: true, fragile: false, description: 'Grãos, farinhas, conservas' },
  { name: 'Bebidas', density: 800, stackable: true, fragile: true, description: 'Refrigerantes, cervejas, águas' },
  { name: 'Materiais de construção', density: 800, stackable: true, fragile: false, description: 'Cimento, tijolos, telhas' },
  { name: 'Automóveis', density: 1200, stackable: false, fragile: true, description: 'Carros, motos' },
  { name: 'Maquinário', density: 2000, stackable: false, fragile: true, description: 'Equipamentos industriais' },
  { name: 'Líquidos', density: 1000, stackable: false, fragile: false, description: 'Combustíveis, químicos, água' },
  { name: 'Personalizado', density: 0, stackable: true, fragile: false, description: 'Definir manualmente' }
];
