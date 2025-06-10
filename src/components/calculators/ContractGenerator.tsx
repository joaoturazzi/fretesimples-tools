
import React, { useState } from 'react';
import { FileText, Download, User, Truck, Package, Save, RefreshCw, Eye, Check, AlertCircle } from 'lucide-react';
import CalculatorSection from '../Calculator';
import { formatCurrency } from '@/lib/utils';
import jsPDF from 'jspdf';
import { validateDocuments } from './vehicle/vehicleCalculations';

interface ContractData {
  // Dados do contratante
  contractorName: string;
  contractorDoc: string;
  contractorAddress: string;
  contractorPhone: string;
  contractorEmail: string;
  
  // Dados do contratado
  contracteeName: string;
  contracteeDoc: string;
  contracteeAddress: string;
  contracteePhone: string;
  contracteeEmail: string;
  
  // Dados da carga
  cargoDescription: string;
  cargoWeight: number;
  cargoValue: number;
  origin: string;
  destination: string;
  
  // Dados financeiros
  freightValue: number;
  paymentTerms: string;
  deliveryDays: number;
  
  // Observações
  observations: string;
  contractType: string;
}

interface ValidationErrors {
  [key: string]: string;
}

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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
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
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateContractNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `CT-${timestamp}-${random}`;
  };

  const formatDocument = (doc: string) => {
    const numbers = doc.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const generateContractPDF = () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const newContractNumber = generateContractNumber();
      setContractNumber(newContractNumber);
      
      // Header with Logo space
      doc.setFillColor(23, 37, 42);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTRATO DE TRANSPORTE RODOVIÁRIO', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('DE CARGAS', 105, 30, { align: 'center' });
      
      // Contract info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      const currentDate = new Date().toLocaleDateString('pt-BR');
      doc.text(`Contrato Nº: ${newContractNumber}`, 20, 50);
      doc.text(`Data: ${currentDate}`, 150, 50);
      
      let yPos = 70;
      
      // Contratante section with background
      doc.setFillColor(59, 130, 246, 0.1);
      doc.rect(15, yPos - 5, 180, 35, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTRATANTE (Embarcador):', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nome/Razão Social: ${contractData.contractorName}`, 20, yPos);
      yPos += 6;
      doc.text(`CPF/CNPJ: ${formatDocument(contractData.contractorDoc)}`, 20, yPos);
      yPos += 6;
      doc.text(`Endereço: ${contractData.contractorAddress}`, 20, yPos);
      yPos += 6;
      doc.text(`Telefone: ${contractData.contractorPhone}`, 20, yPos);
      if (contractData.contractorEmail) {
        doc.text(`E-mail: ${contractData.contractorEmail}`, 110, yPos);
      }
      yPos += 15;
      
      // Contratado section
      doc.setFillColor(34, 197, 94, 0.1);
      doc.rect(15, yPos - 5, 180, 35, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTRATADO (Transportador):', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nome/Razão Social: ${contractData.contracteeName}`, 20, yPos);
      yPos += 6;
      doc.text(`CPF/CNPJ: ${formatDocument(contractData.contracteeDoc)}`, 20, yPos);
      yPos += 6;
      doc.text(`Endereço: ${contractData.contracteeAddress}`, 20, yPos);
      yPos += 6;
      doc.text(`Telefone: ${contractData.contracteePhone}`, 20, yPos);
      if (contractData.contracteeEmail) {
        doc.text(`E-mail: ${contractData.contracteeEmail}`, 110, yPos);
      }
      yPos += 15;
      
      // Dados da carga section
      doc.setFillColor(251, 146, 60, 0.1);
      doc.rect(15, yPos - 5, 180, 30, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DADOS DA CARGA E TRANSPORTE:', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Descrição: ${contractData.cargoDescription}`, 20, yPos);
      yPos += 6;
      doc.text(`Peso: ${contractData.cargoWeight} kg`, 20, yPos);
      if (contractData.cargoValue > 0) {
        doc.text(`Valor da Carga: ${formatCurrency(contractData.cargoValue)}`, 110, yPos);
      }
      yPos += 6;
      doc.text(`Origem: ${contractData.origin}`, 20, yPos);
      yPos += 6;
      doc.text(`Destino: ${contractData.destination}`, 20, yPos);
      yPos += 15;
      
      // Condições financeiras
      doc.setFillColor(168, 85, 247, 0.1);
      doc.rect(15, yPos - 5, 180, 25, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CONDIÇÕES FINANCEIRAS:', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Valor do Frete: ${formatCurrency(contractData.freightValue)}`, 20, yPos);
      yPos += 6;
      doc.text(`Forma de Pagamento: ${contractData.paymentTerms}`, 20, yPos);
      doc.text(`Prazo de Entrega: ${contractData.deliveryDays} dia(s)`, 110, yPos);
      yPos += 15;
      
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 30;
      }
      
      // Cláusulas
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CLÁUSULAS CONTRATUAIS:', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const clauses = [
        '1. RESPONSABILIDADES: O transportador assume total responsabilidade pela integridade da carga desde o momento do carregamento até a entrega no destino.',
        '2. PAGAMENTO: O pagamento do frete será realizado conforme condições acordadas. Atraso superior a 30 dias implicará multa de 2% a.m.',
        '3. SEGURO: Em caso de avaria, perda ou roubo, o transportador indenizará o valor da carga, conforme documentação apresentada.',
        '4. PRAZO: O descumprimento do prazo de entrega implicará multa de 0,5% do valor do frete por dia de atraso.',
        '5. LEGISLAÇÃO: O presente contrato é regido pela Lei 11.442/07 e demais legislações aplicáveis ao transporte rodoviário.',
        '6. DOCUMENTAÇÃO: Toda documentação fiscal e de transporte deve estar em conformidade com a legislação vigente.',
        '7. FORO: Fica eleito o foro da comarca do contratante para dirimir questões oriundas deste contrato.'
      ];
      
      clauses.forEach(clause => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 30;
        }
        doc.text(clause, 20, yPos, { maxWidth: 170 });
        yPos += 14;
      });
      
      if (contractData.observations) {
        yPos += 5;
        if (yPos > 260) {
          doc.addPage();
          yPos = 30;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVAÇÕES ESPECIAIS:', 20, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(contractData.observations, 20, yPos, { maxWidth: 170 });
        yPos += 15;
      }
      
      // Ensure we have space for signatures
      if (yPos > 240) {
        doc.addPage();
        yPos = 30;
      }
      
      // Signatures section with date
      yPos = Math.max(yPos, 250);
      doc.text(`Local e Data: _________________________, ${currentDate}`, 20, yPos);
      yPos += 20;
      
      doc.setFont('helvetica', 'bold');
      doc.text('_____________________________', 30, yPos);
      doc.text('_____________________________', 130, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.text('CONTRATANTE', 55, yPos);
      doc.text('CONTRATADO', 155, yPos);
      yPos += 5;
      doc.setFontSize(8);
      doc.text('(Assinatura)', 70, yPos);
      doc.text('(Assinatura)', 170, yPos);
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('Documento gerado pelo sistema FreteDigital - www.fretesimples.com', 105, 285, { align: 'center' });
      
      doc.save(`contrato-transporte-${newContractNumber}.pdf`);
      
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

  const getFieldError = (field: string) => validationErrors[field];
  const hasFieldError = (field: string) => !!validationErrors[field];

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
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User size={20} className="mr-2 text-blue-500" />
                Dados do Contratante (Embarcador)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="calculator-input-group">
                  <label className="calculator-label">Nome/Razão Social *</label>
                  <input
                    type="text"
                    className={`input-field ${hasFieldError('contractorName') ? 'border-red-300' : ''}`}
                    value={contractData.contractorName}
                    onChange={(e) => handleInputChange('contractorName', e.target.value)}
                    placeholder="Nome completo ou razão social"
                  />
                  {hasFieldError('contractorName') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('contractorName')}</p>
                  )}
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">CPF/CNPJ *</label>
                  <input
                    type="text"
                    className={`input-field ${hasFieldError('contractorDoc') ? 'border-red-300' : ''}`}
                    value={contractData.contractorDoc}
                    onChange={(e) => handleInputChange('contractorDoc', formatDocument(e.target.value))}
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    maxLength={18}
                  />
                  {hasFieldError('contractorDoc') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('contractorDoc')}</p>
                  )}
                </div>
                
                <div className="calculator-input-group col-span-full">
                  <label className="calculator-label">Endereço completo</label>
                  <input
                    type="text"
                    className="input-field"
                    value={contractData.contractorAddress}
                    onChange={(e) => handleInputChange('contractorAddress', e.target.value)}
                    placeholder="Rua, número, bairro, cidade, estado, CEP"
                  />
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">Telefone</label>
                  <input
                    type="text"
                    className="input-field"
                    value={contractData.contractorPhone}
                    onChange={(e) => handleInputChange('contractorPhone', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">E-mail</label>
                  <input
                    type="email"
                    className={`input-field ${hasFieldError('contractorEmail') ? 'border-red-300' : ''}`}
                    value={contractData.contractorEmail}
                    onChange={(e) => handleInputChange('contractorEmail', e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                  {hasFieldError('contractorEmail') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('contractorEmail')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dados do Contratado */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Truck size={20} className="mr-2 text-green-500" />
                Dados do Contratado (Transportador)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="calculator-input-group">
                  <label className="calculator-label">Nome/Razão Social *</label>
                  <input
                    type="text"
                    className={`input-field ${hasFieldError('contracteeName') ? 'border-red-300' : ''}`}
                    value={contractData.contracteeName}
                    onChange={(e) => handleInputChange('contracteeName', e.target.value)}
                    placeholder="Nome completo ou razão social"
                  />
                  {hasFieldError('contracteeName') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('contracteeName')}</p>
                  )}
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">CPF/CNPJ *</label>
                  <input
                    type="text"
                    className={`input-field ${hasFieldError('contracteeDoc') ? 'border-red-300' : ''}`}
                    value={contractData.contracteeDoc}
                    onChange={(e) => handleInputChange('contracteeDoc', formatDocument(e.target.value))}
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    maxLength={18}
                  />
                  {hasFieldError('contracteeDoc') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('contracteeDoc')}</p>
                  )}
                </div>
                
                <div className="calculator-input-group col-span-full">
                  <label className="calculator-label">Endereço completo</label>
                  <input
                    type="text"
                    className="input-field"
                    value={contractData.contracteeAddress}
                    onChange={(e) => handleInputChange('contracteeAddress', e.target.value)}
                    placeholder="Rua, número, bairro, cidade, estado, CEP"
                  />
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">Telefone</label>
                  <input
                    type="text"
                    className="input-field"
                    value={contractData.contracteePhone}
                    onChange={(e) => handleInputChange('contracteePhone', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">E-mail</label>
                  <input
                    type="email"
                    className={`input-field ${hasFieldError('contracteeEmail') ? 'border-red-300' : ''}`}
                    value={contractData.contracteeEmail}
                    onChange={(e) => handleInputChange('contracteeEmail', e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                  {hasFieldError('contracteeEmail') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('contracteeEmail')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dados da Carga */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Package size={20} className="mr-2 text-orange-500" />
                Dados da Carga e Transporte
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="calculator-input-group col-span-full">
                  <label className="calculator-label">Descrição da carga *</label>
                  <input
                    type="text"
                    className={`input-field ${hasFieldError('cargoDescription') ? 'border-red-300' : ''}`}
                    value={contractData.cargoDescription}
                    onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
                    placeholder="Ex: Eletrônicos, móveis, alimentos..."
                  />
                  {hasFieldError('cargoDescription') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('cargoDescription')}</p>
                  )}
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">Peso (kg)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={contractData.cargoWeight || ''}
                    onChange={(e) => handleInputChange('cargoWeight', parseFloat(e.target.value) || 0)}
                    placeholder="1000"
                    min="0"
                  />
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">Valor da carga (R$)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={contractData.cargoValue || ''}
                    onChange={(e) => handleInputChange('cargoValue', parseFloat(e.target.value) || 0)}
                    placeholder="10000"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">Origem *</label>
                  <input
                    type="text"
                    className={`input-field ${hasFieldError('origin') ? 'border-red-300' : ''}`}
                    value={contractData.origin}
                    onChange={(e) => handleInputChange('origin', e.target.value)}
                    placeholder="São Paulo, SP"
                  />
                  {hasFieldError('origin') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('origin')}</p>
                  )}
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">Destino *</label>
                  <input
                    type="text"
                    className={`input-field ${hasFieldError('destination') ? 'border-red-300' : ''}`}
                    value={contractData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    placeholder="Rio de Janeiro, RJ"
                  />
                  {hasFieldError('destination') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('destination')}</p>
                  )}
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">Valor do frete (R$) *</label>
                  <input
                    type="number"
                    className={`input-field ${hasFieldError('freightValue') ? 'border-red-300' : ''}`}
                    value={contractData.freightValue || ''}
                    onChange={(e) => handleInputChange('freightValue', parseFloat(e.target.value) || 0)}
                    placeholder="1500"
                    min="0"
                    step="0.01"
                  />
                  {hasFieldError('freightValue') && (
                    <p className="text-red-600 text-xs mt-1">{getFieldError('freightValue')}</p>
                  )}
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">Forma de pagamento</label>
                  <select
                    className="select-field"
                    value={contractData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  >
                    <option value="A vista">À vista</option>
                    <option value="30 dias">30 dias</option>
                    <option value="60 dias">60 dias</option>
                    <option value="Na entrega">Na entrega</option>
                    <option value="Parcelado">Parcelado</option>
                  </select>
                </div>
                
                <div className="calculator-input-group">
                  <label className="calculator-label">Prazo de entrega (dias)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={contractData.deliveryDays || ''}
                    onChange={(e) => handleInputChange('deliveryDays', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    min="1"
                  />
                </div>
                
                <div className="calculator-input-group col-span-full">
                  <label className="calculator-label">Observações adicionais</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={contractData.observations}
                    onChange={(e) => handleInputChange('observations', e.target.value)}
                    placeholder="Informações adicionais, restrições, requisitos especiais..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Actions */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4">Ações</h4>
              
              <div className="space-y-3">
                <button
                  onClick={togglePreview}
                  className="btn btn-secondary w-full"
                  disabled={Object.keys(validationErrors).length > 0}
                >
                  <Eye size={18} />
                  {showPreview ? 'Ocultar Preview' : 'Visualizar Preview'}
                </button>
                
                <button
                  onClick={generateContractPDF}
                  className={`btn btn-primary w-full ${isGenerating ? 'btn-loading' : ''}`}
                  disabled={isGenerating || Object.keys(validationErrors).length > 0}
                >
                  {!isGenerating && <Download size={18} />}
                  {isGenerating ? 'Gerando...' : 'Gerar Contrato PDF'}
                </button>
                
                <button
                  onClick={resetForm}
                  className="btn btn-secondary w-full"
                  disabled={isGenerating}
                >
                  <RefreshCw size={18} />
                  Limpar Formulário
                </button>
              </div>
            </div>

            {/* Validation Status */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4">Status de Validação</h4>
              
              <div className="space-y-2">
                {Object.keys(validationErrors).length === 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check size={16} />
                    <span className="text-sm font-medium">Formulário válido</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle size={16} />
                      <span className="text-sm font-medium">
                        {Object.keys(validationErrors).length} erro(s) encontrado(s)
                      </span>
                    </div>
                    <ul className="text-xs text-red-600 space-y-1 ml-6">
                      {Object.entries(validationErrors).map(([field, error]) => (
                        <li key={field}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <h4 className="font-bold text-gray-900 mb-4">Recursos Incluídos</h4>
              
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  Validação automática de CPF/CNPJ
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  Templates jurídicos atualizados
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  Numeração automática
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  PDF profissional com design
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  Conformidade com Lei 11.442/07
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-gray-900">Preview do Contrato</h4>
              <button 
                onClick={togglePreview}
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
