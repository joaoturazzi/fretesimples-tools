
import jsPDF from 'jspdf';
import { formatCurrency } from '@/lib/utils';

interface ExportData {
  title: string;
  subtitle?: string;
  data: Record<string, any>;
  results: Record<string, any>;
  timestamp: Date;
}

class ExportServiceClass {
  private addHeader(pdf: jsPDF, title: string, subtitle?: string) {
    // Logo and header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Sistema de Logística', 20, 20);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(title, 20, 35);
    
    if (subtitle) {
      pdf.setFontSize(12);
      pdf.text(subtitle, 20, 45);
    }
    
    // Date
    pdf.setFontSize(10);
    pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 55);
    
    // Line separator
    pdf.setLineWidth(0.5);
    pdf.line(20, 60, 190, 60);
    
    return 70; // Return Y position for next content
  }

  private addSection(pdf: jsPDF, title: string, data: Record<string, any>, yPos: number) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, 20, yPos);
    
    let currentY = yPos + 10;
    
    Object.entries(data).forEach(([key, value]) => {
      if (currentY > 270) { // Check if we need a new page
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const label = this.formatLabel(key);
      const formattedValue = this.formatValue(value);
      
      pdf.text(`${label}: ${formattedValue}`, 25, currentY);
      currentY += 6;
    });
    
    return currentY + 10;
  }

  private formatLabel(key: string): string {
    const labels: Record<string, string> = {
      origin: 'Origem',
      destination: 'Destino',
      distance: 'Distância',
      weight: 'Peso',
      vehicleType: 'Tipo de Veículo',
      totalFreight: 'Valor Total do Frete',
      fuelCost: 'Custo de Combustível',
      tollsCost: 'Custo de Pedágios',
      deliveryTime: 'Tempo de Entrega',
      costPerKm: 'Custo por Km'
    };
    
    return labels[key] || key;
  }

  private formatValue(value: any): string {
    if (typeof value === 'number') {
      if (value < 1000 && value % 1 !== 0) {
        return value.toFixed(2);
      }
      return value.toLocaleString('pt-BR');
    }
    
    if (typeof value === 'string' && value.startsWith('R$')) {
      return value;
    }
    
    return String(value);
  }

  exportToPDF(data: ExportData): void {
    const pdf = new jsPDF();
    
    let yPos = this.addHeader(pdf, data.title, data.subtitle);
    
    // Add input data section
    yPos = this.addSection(pdf, 'Dados de Entrada', data.data, yPos);
    
    // Add results section
    yPos = this.addSection(pdf, 'Resultados', data.results, yPos);
    
    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(`Página ${i} de ${pageCount}`, 170, 285);
    }
    
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${data.title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`;
    
    pdf.save(filename);
  }

  exportToJSON(data: ExportData): void {
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const ExportService = new ExportServiceClass();
export default ExportService;
