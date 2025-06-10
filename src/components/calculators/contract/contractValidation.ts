
import { validateDocuments } from '../vehicle/vehicleCalculations';

export interface ContractData {
  contractorName: string;
  contractorDoc: string;
  contractorAddress: string;
  contractorPhone: string;
  contractorEmail: string;
  contracteeName: string;
  contracteeDoc: string;
  contracteeAddress: string;
  contracteePhone: string;
  contracteeEmail: string;
  cargoDescription: string;
  cargoWeight: number;
  cargoValue: number;
  origin: string;
  destination: string;
  freightValue: number;
  paymentTerms: string;
  deliveryDays: number;
  observations: string;
  contractType: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateContractForm = (contractData: ContractData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Required fields validation
  if (!contractData.contractorName.trim()) errors.contractorName = 'Nome do contratante é obrigatório';
  if (!contractData.contractorDoc.trim()) errors.contractorDoc = 'CPF/CNPJ do contratante é obrigatório';
  if (!contractData.contracteeName.trim()) errors.contracteeName = 'Nome do contratado é obrigatório';
  if (!contractData.contracteeDoc.trim()) errors.contracteeDoc = 'CPF/CNPJ do contratado é obrigatório';
  if (!contractData.cargoDescription.trim()) errors.cargoDescription = 'Descrição da carga é obrigatória';
  if (!contractData.origin.trim()) errors.origin = 'Origem é obrigatória';
  if (!contractData.destination.trim()) errors.destination = 'Destino é obrigatório';
  if (contractData.freightValue <= 0) errors.freightValue = 'Valor do frete deve ser maior que zero';
  
  // Document validation
  if (contractData.contractorDoc) {
    const validation = validateDocuments(contractData.contractorDoc);
    if (!validation.isValid) {
      errors.contractorDoc = 'CPF/CNPJ do contratante inválido';
    }
  }
  
  if (contractData.contracteeDoc) {
    const validation = validateDocuments(contractData.contracteeDoc);
    if (!validation.isValid) {
      errors.contracteeDoc = 'CPF/CNPJ do contratado inválido';
    }
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (contractData.contractorEmail && !emailRegex.test(contractData.contractorEmail)) {
    errors.contractorEmail = 'E-mail do contratante inválido';
  }
  if (contractData.contracteeEmail && !emailRegex.test(contractData.contracteeEmail)) {
    errors.contracteeEmail = 'E-mail do contratado inválido';
  }
  
  return errors;
};

export const formatDocument = (doc: string): string => {
  const numbers = doc.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
};

export const generateContractNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `CT-${timestamp}-${random}`;
};
