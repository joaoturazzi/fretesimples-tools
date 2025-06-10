
import jsPDF from 'jspdf';
import { formatCurrency } from '@/lib/utils';
import { ContractData, formatDocument } from './contractValidation';

export const generateContractPDF = (contractData: ContractData, contractNumber: string): void => {
  try {
    const doc = new jsPDF();
    
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
    doc.text(`Contrato Nº: ${contractNumber}`, 20, 50);
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
    
    doc.save(`contrato-transporte-${contractNumber}.pdf`);
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Erro ao gerar o contrato. Tente novamente.');
  }
};
