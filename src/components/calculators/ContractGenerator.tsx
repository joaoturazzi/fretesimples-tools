
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import CalculatorSection from '../Calculator';
import ContractorForm from './contract/ContractorForm';
import ContracteeForm from './contract/ContracteeForm';
import CargoForm from './contract/CargoForm';
import ContractActions from './contract/ContractActions';
import ValidationStatus from './contract/ValidationStatus';
import ContractPreview from './contract/ContractPreview';
import ContractFeatures from './contract/ContractFeatures';
import { 
  ContractData, 
  validateContractForm, 
  formatDocument, 
  generateContractNumber 
} from './contract/contractValidation';
import { generateContractPDF } from './contract/contractPDFGenerator';

const ContractGenerator = ({ isActive }: { isActive: boolean }) => {
  const [contractData, setContractData] = useState<ContractData>({
    contractorName: '',
    contractorDoc: '',
    contractorAddress: '',
    contractorPhone: '',
    contractorEmail: '',
    contracteeName: '',
    contracteeDoc: '',
    contracteeAddress: '',
    contracteePhone: '',
    contracteeEmail: '',
    cargoDescription: '',
    cargoWeight: 0,
    cargoValue: 0,
    origin: '',
    destination: '',
    freightValue: 0,
    paymentTerms: 'A vista',
    deliveryDays: 1,
    observations: '',
    contractType: 'transporte'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [contractNumber, setContractNumber] = useState('');

  const handleInputChange = (field: keyof ContractData, value: string | number) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors = validateContractForm(contractData);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGeneratePDF = () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      const newContractNumber = generateContractNumber();
      setContractNumber(newContractNumber);
      generateContractPDF(contractData, newContractNumber);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o contrato. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setContractData({
      contractorName: '',
      contractorDoc: '',
      contractorAddress: '',
      contractorPhone: '',
      contractorEmail: '',
      contracteeName: '',
      contracteeDoc: '',
      contracteeAddress: '',
      contracteePhone: '',
      contracteeEmail: '',
      cargoDescription: '',
      cargoWeight: 0,
      cargoValue: 0,
      origin: '',
      destination: '',
      freightValue: 0,
      paymentTerms: 'A vista',
      deliveryDays: 1,
      observations: '',
      contractType: 'transporte'
    });
    setValidationErrors({});
    setShowPreview(false);
    setContractNumber('');
  };

  const togglePreview = () => {
    if (validateForm()) {
      setShowPreview(!showPreview);
    }
  };

  return (
    <CalculatorSection
      id="gerador-contratos"
      title="Gerador Inteligente de Contratos"
      description="Sistema completo para geração de contratos de transporte com validação automática e templates profissionais."
      isActive={isActive}
    >
      <div className="space-y-8">
        {/* Header Progress */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FileText size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Gerador Profissional de Contratos</h3>
              <p className="text-indigo-100 text-lg">
                Validação automática, templates jurídicos e geração em PDF
              </p>
            </div>
          </div>
          
          {contractNumber && (
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-white font-medium">
                ✅ Último contrato gerado: <span className="font-bold">{contractNumber}</span>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Dados do Contratante */}
            <ContractorForm
              contractorName={contractData.contractorName}
              contractorDoc={contractData.contractorDoc}
              contractorAddress={contractData.contractorAddress}
              contractorPhone={contractData.contractorPhone}
              contractorEmail={contractData.contractorEmail}
              onInputChange={handleInputChange}
              validationErrors={validationErrors}
              formatDocument={formatDocument}
            />

            {/* Dados do Contratado */}
            <ContracteeForm
              contracteeName={contractData.contracteeName}
              contracteeDoc={contractData.contracteeDoc}
              contracteeAddress={contractData.contracteeAddress}
              contracteePhone={contractData.contracteePhone}
              contracteeEmail={contractData.contracteeEmail}
              onInputChange={handleInputChange}
              validationErrors={validationErrors}
              formatDocument={formatDocument}
            />

            {/* Dados da Carga */}
            <CargoForm
              cargoDescription={contractData.cargoDescription}
              cargoWeight={contractData.cargoWeight}
              cargoValue={contractData.cargoValue}
              origin={contractData.origin}
              destination={contractData.destination}
              freightValue={contractData.freightValue}
              paymentTerms={contractData.paymentTerms}
              deliveryDays={contractData.deliveryDays}
              observations={contractData.observations}
              onInputChange={handleInputChange}
              validationErrors={validationErrors}
            />
          </div>

          {/* Sidebar with Actions */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <ContractActions
              showPreview={showPreview}
              isGenerating={isGenerating}
              validationErrors={validationErrors}
              onTogglePreview={togglePreview}
              onGeneratePDF={handleGeneratePDF}
              onResetForm={resetForm}
            />

            {/* Validation Status */}
            <ValidationStatus validationErrors={validationErrors} />

            {/* Features */}
            <ContractFeatures />
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <ContractPreview
            contractData={contractData}
            contractNumber={contractNumber}
            onClose={togglePreview}
            formatDocument={formatDocument}
          />
        )}

        {/* Info Section */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
          <div className="flex items-start gap-2">
            <FileText className="shrink-0 mt-0.5 text-blue-500" size={16} />
            <div>
              <p className="font-medium mb-2">Sobre os contratos gerados:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Conformes com a Lei 11.442/07 do transporte rodoviário</li>
                <li>Validação automática de documentos CPF/CNPJ</li>
                <li>Templates jurídicos revisados e atualizados</li>
                <li>Numeração automática para controle</li>
                <li>Recomenda-se revisão jurídica para uso comercial</li>
                <li>Mantenha cópias assinadas por ambas as partes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CalculatorSection>
  );
};

export default ContractGenerator;
