
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface ContractData {
  contractorName: string;
  contractorDoc: string;
  contracteeName: string;
  contracteeDoc: string;
  cargoDescription: string;
  origin: string;
  destination: string;
  freightValue: number;
}

interface ContractPreviewProps {
  contractData: ContractData;
  contractNumber: string;
  onClose: () => void;
  formatDocument: (doc: string) => string;
}

const ContractPreview = ({ 
  contractData, 
  contractNumber, 
  onClose, 
  formatDocument 
}: ContractPreviewProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-bold text-gray-900">Preview do Contrato</h4>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
        <div className="space-y-4 text-sm">
          <div className="text-center">
            <h3 className="font-bold text-lg">CONTRATO DE TRANSPORTE RODOVIÁRIO DE CARGAS</h3>
            <p className="text-gray-600">Número: {contractNumber || 'CT-XXXXXX-XX'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700">CONTRATANTE:</h4>
            <p>{contractData.contractorName}</p>
            <p>CPF/CNPJ: {formatDocument(contractData.contractorDoc)}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-green-700">CONTRATADO:</h4>
            <p>{contractData.contracteeName}</p>
            <p>CPF/CNPJ: {formatDocument(contractData.contracteeDoc)}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-orange-700">OBJETO:</h4>
            <p>Carga: {contractData.cargoDescription}</p>
            <p>Rota: {contractData.origin} → {contractData.destination}</p>
            <p>Valor: {formatCurrency(contractData.freightValue)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPreview;
