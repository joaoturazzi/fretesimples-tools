
import React, { useState } from 'react';
import { FileText, Download, User, Truck, Package, Save, RefreshCw } from 'lucide-react';
import CalculatorSection from '../Calculator';
import { formatCurrency } from '@/lib/utils';
import jsPDF from 'jspdf';

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
    observations: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof ContractData, value: string | number) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateContractPDF = () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTRATO DE TRANSPORTE RODOVIÁRIO DE CARGAS', 105, 30, { align: 'center' });
      
      // Contract number and date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const contractNumber = `CT-${Date.now().toString().slice(-6)}`;
      const currentDate = new Date().toLocaleDateString('pt-BR');
      doc.text(`Contrato Nº: ${contractNumber}`, 20, 50);
      doc.text(`Data: ${currentDate}`, 150, 50);
      
      let yPos = 70;
      
      // Contratante
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTRATANTE (Embarcador):', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nome/Razão Social: ${contractData.contractorName}`, 20, yPos);
      yPos += 7;
      doc.text(`CPF/CNPJ: ${contractData.contractorDoc}`, 20, yPos);
      yPos += 7;
      doc.text(`Endereço: ${contractData.contractorAddress}`, 20, yPos);
      yPos += 7;
      doc.text(`Telefone: ${contractData.contractorPhone}`, 20, yPos);
      doc.text(`E-mail: ${contractData.contractorEmail}`, 110, yPos);
      yPos += 15;
      
      // Contratado
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTRATADO (Transportador):', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nome/Razão Social: ${contractData.contracteeName}`, 20, yPos);
      yPos += 7;
      doc.text(`CPF/CNPJ: ${contractData.contracteeDoc}`, 20, yPos);
      yPos += 7;
      doc.text(`Endereço: ${contractData.contracteeAddress}`, 20, yPos);
      yPos += 7;
      doc.text(`Telefone: ${contractData.contracteePhone}`, 20, yPos);
      doc.text(`E-mail: ${contractData.contracteeEmail}`, 110, yPos);
      yPos += 15;
      
      // Dados da carga
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DADOS DA CARGA:', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Descrição: ${contractData.cargoDescription}`, 20, yPos);
      yPos += 7;
      doc.text(`Peso: ${contractData.cargoWeight} kg`, 20, yPos);
      doc.text(`Valor da Carga: ${formatCurrency(contractData.cargoValue)}`, 110, yPos);
      yPos += 7;
      doc.text(`Origem: ${contractData.origin}`, 20, yPos);
      yPos += 7;
      doc.text(`Destino: ${contractData.destination}`, 20, yPos);
      yPos += 15;
      
      // Condições financeiras
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CONDIÇÕES FINANCEIRAS:', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Valor do Frete: ${formatCurrency(contractData.freightValue)}`, 20, yPos);
      yPos += 7;
      doc.text(`Forma de Pagamento: ${contractData.paymentTerms}`, 20, yPos);
      yPos += 7;
      doc.text(`Prazo de Entrega: ${contractData.deliveryDays} dia(s)`, 20, yPos);
      yPos += 15;
      
      // Cláusulas
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CLÁUSULAS GERAIS:', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const clauses = [
        '1. O transportador se responsabiliza pela integridade da carga durante o transporte.',
        '2. O pagamento do frete será realizado conforme condições acordadas.',
        '3. Em caso de avaria ou perda, o transportador indenizará o valor da carga.',
        '4. O presente contrato é regido pela Lei 11.442/07 e legislação correlata.',
        '5. Foro competente: Comarca do contratante para dirimir questões.'
      ];
      
      clauses.forEach(clause => {
        doc.text(clause, 20, yPos, { maxWidth: 170 });
        yPos += 12;
      });
      
      if (contractData.observations) {
        yPos += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVAÇÕES:', 20, yPos);
        yPos += 7;
        doc.setFont('helvetica', 'normal');
        doc.text(contractData.observations, 20, yPos, { maxWidth: 170 });
      }
      
      // Assinaturas
      yPos = 250;
      doc.setFontSize(10);
      doc.text('_________________________', 30, yPos);
      doc.text('_________________________', 130, yPos);
      yPos += 7;
      doc.text('Contratante', 50, yPos);
      doc.text('Contratado', 150, yPos);
      
      doc.save(`contrato-transporte-${contractNumber}.pdf`);
      
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
      observations: ''
    });
  };

  return (
    <CalculatorSection
      id="gerador-contratos"
      title="Gerador de Contratos"
      description="Gere contratos de transporte profissionais com todos os dados necessários."
      isActive={isActive}
    >
      <div className="space-y-8">
        {/* Dados do Contratante */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User size={20} className="mr-2 text-blue-500" />
            Dados do Contratante (Embarcador)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="calculator-input-group">
              <label className="calculator-label">Nome/Razão Social</label>
              <input
                type="text"
                className="input-field"
                value={contractData.contractorName}
                onChange={(e) => handleInputChange('contractorName', e.target.value)}
                placeholder="Nome completo ou razão social"
              />
            </div>
            
            <div className="calculator-input-group">
              <label className="calculator-label">CPF/CNPJ</label>
              <input
                type="text"
                className="input-field"
                value={contractData.contractorDoc}
                onChange={(e) => handleInputChange('contractorDoc', e.target.value)}
                placeholder="000.000.000-00 ou 00.000.000/0001-00"
              />
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
                className="input-field"
                value={contractData.contractorEmail}
                onChange={(e) => handleInputChange('contractorEmail', e.target.value)}
                placeholder="email@exemplo.com"
              />
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
              <label className="calculator-label">Nome/Razão Social</label>
              <input
                type="text"
                className="input-field"
                value={contractData.contracteeName}
                onChange={(e) => handleInputChange('contracteeName', e.target.value)}
                placeholder="Nome completo ou razão social"
              />
            </div>
            
            <div className="calculator-input-group">
              <label className="calculator-label">CPF/CNPJ</label>
              <input
                type="text"
                className="input-field"
                value={contractData.contracteeDoc}
                onChange={(e) => handleInputChange('contracteeDoc', e.target.value)}
                placeholder="000.000.000-00 ou 00.000.000/0001-00"
              />
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
                className="input-field"
                value={contractData.contracteeEmail}
                onChange={(e) => handleInputChange('contracteeEmail', e.target.value)}
                placeholder="email@exemplo.com"
              />
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
              <label className="calculator-label">Descrição da carga</label>
              <input
                type="text"
                className="input-field"
                value={contractData.cargoDescription}
                onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
                placeholder="Ex: Eletrônicos, móveis, alimentos..."
              />
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
              <label className="calculator-label">Origem</label>
              <input
                type="text"
                className="input-field"
                value={contractData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                placeholder="São Paulo, SP"
              />
            </div>
            
            <div className="calculator-input-group">
              <label className="calculator-label">Destino</label>
              <input
                type="text"
                className="input-field"
                value={contractData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder="Rio de Janeiro, RJ"
              />
            </div>
            
            <div className="calculator-input-group">
              <label className="calculator-label">Valor do frete (R$)</label>
              <input
                type="number"
                className="input-field"
                value={contractData.freightValue || ''}
                onChange={(e) => handleInputChange('freightValue', parseFloat(e.target.value) || 0)}
                placeholder="1500"
                min="0"
                step="0.01"
              />
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

        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateContractPDF}
            className={`btn btn-primary ${isGenerating ? 'btn-loading' : ''}`}
            disabled={isGenerating || !contractData.contractorName || !contractData.contracteeName}
          >
            {!isGenerating && <Download size={18} />}
            {isGenerating ? 'Gerando...' : 'Gerar Contrato PDF'}
          </button>
          
          <button
            onClick={resetForm}
            className="btn btn-secondary"
            disabled={isGenerating}
          >
            <RefreshCw size={18} />
            Limpar Formulário
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
          <div className="flex items-start gap-2">
            <FileText className="shrink-0 mt-0.5 text-blue-500" size={16} />
            <div>
              <p className="font-medium mb-1">Sobre os contratos gerados:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>O contrato segue as normas da Lei 11.442/07</li>
                <li>Inclui cláusulas básicas de responsabilidade</li>
                <li>Para uso comercial, recomenda-se revisão jurídica</li>
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
