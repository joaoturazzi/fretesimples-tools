
import { z } from 'zod';

// Freight calculation validation schema
export const freightCalculationSchema = z.object({
  origin: z.string().min(1, 'Origem é obrigatória'),
  destination: z.string().min(1, 'Destino é obrigatório'),
  distance: z.number().min(0.1, 'Distância deve ser maior que 0'),
  weight: z.number().min(0.1, 'Peso deve ser maior que 0'),
  vehicleType: z.string().min(1, 'Tipo de veículo é obrigatório'),
  costPerKm: z.number().min(0, 'Custo por km deve ser positivo').optional(),
  fuelPrice: z.number().min(0, 'Preço do combustível deve ser positivo').optional(),
  consumption: z.number().min(0, 'Consumo deve ser positivo').optional(),
  tollsCost: z.number().min(0, 'Custo de pedágios deve ser positivo').optional(),
});

// Vehicle sizing validation schema
export const vehicleSizingSchema = z.object({
  cargoType: z.string().min(1, 'Tipo de carga é obrigatório'),
  weight: z.number().min(0.1, 'Peso deve ser maior que 0'),
  volume: z.number().min(0.1, 'Volume deve ser maior que 0').optional(),
  liquidVolume: z.number().min(0, 'Volume líquido deve ser positivo').optional(),
  density: z.number().min(0.1, 'Densidade deve ser maior que 0').optional(),
  stackable: z.boolean().default(true),
  fragile: z.boolean().default(false),
});

// Risk calculation validation schema
export const riskCalculationSchema = z.object({
  origin: z.string().min(1, 'Origem é obrigatória'),
  destination: z.string().min(1, 'Destino é obrigatório'),
  cargoType: z.string().min(1, 'Tipo de carga é obrigatório'),
  cargoValue: z.number().min(0.01, 'Valor da carga deve ser maior que 0'),
  vehicleType: z.string().min(1, 'Tipo de veículo é obrigatório'),
  driverExperience: z.number().min(0, 'Experiência do motorista deve ser positiva'),
  transportDate: z.date().min(new Date(), 'Data não pode ser no passado'),
});

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Logradouro é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP deve ter formato válido (00000-000)'),
});

// Generic form validation helper
export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
};

export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join('.');
        errors[field] = issue.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Erro de validação desconhecido' } };
  }
};

export type FreightCalculationData = z.infer<typeof freightCalculationSchema>;
export type VehicleSizingData = z.infer<typeof vehicleSizingSchema>;
export type RiskCalculationData = z.infer<typeof riskCalculationSchema>;
export type AddressData = z.infer<typeof addressSchema>;
