
import React, { useState, useRef } from 'react';
import Calculator from '@/components/Calculator';
import { RefreshCw, HelpCircle, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2pdf from 'html2pdf.js';

interface TripChecklistProps {
  isActive: boolean;
}

const TripChecklist = ({ isActive }: TripChecklistProps) => {
  const [cargoType, setCargoType] = useState('normal');
  const [distance, setDistance] = useState('curta');
  const [vehicleType, setVehicleType] = useState('van');
  const [checklist, setChecklist] = useState<Record<string, string[]> | null>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Generate checklist based on selections
  const generateChecklist = () => {
    // Common items for all trips
    const commonItems = [
      { item: 'Documento do veículo (CRLV)', category: 'Documentação' },
      { item: 'Carteira de habilitação', category: 'Documentação' },
      { item: 'Documentação da carga/Nota fiscal', category: 'Documentação' },
      { item: 'Verificar nível de combustível', category: 'Veículo' },
      { item: 'Verificar nível de óleo', category: 'Veículo' },
      { item: 'Verificar pressão dos pneus', category: 'Veículo' },
      { item: 'Verificar faróis, lanternas e setas', category: 'Veículo' },
      { item: 'Água para radiador e limpador', category: 'Veículo' },
      { item: 'Kit de ferramentas básicas', category: 'Emergência' },
      { item: 'Triângulo de sinalização', category: 'Emergência' },
    ];
    
    // Distance-specific items
    const distanceItems = {
      'curta': [
        { item: 'Rota planejada', category: 'Planejamento' },
        { item: 'Contato do destinatário', category: 'Contatos' },
      ],
      'media': [
        { item: 'Rota planejada com pontos de parada', category: 'Planejamento' },
        { item: 'Contato de emergência da empresa', category: 'Contatos' },
        { item: 'Dinheiro para pedágios', category: 'Financeiro' },
        { item: 'Água e lanche', category: 'Pessoal' },
        { item: 'Verificar estepe', category: 'Veículo' },
      ],
      'longa': [
        { item: 'Rota completa com alternativas', category: 'Planejamento' },
        { item: 'Planejamento de paradas para descanso', category: 'Planejamento' },
        { item: 'Contatos de emergência ao longo da rota', category: 'Contatos' },
        { item: 'Dinheiro para pedágios e emergências', category: 'Financeiro' },
        { item: 'Cartão de crédito/débito', category: 'Financeiro' },
        { item: 'Kit de primeiros socorros', category: 'Emergência' },
        { item: 'Lanterna', category: 'Emergência' },
        { item: 'Cobertor', category: 'Pessoal' },
        { item: 'Roupas extras', category: 'Pessoal' },
        { item: 'Produtos de higiene pessoal', category: 'Pessoal' },
        { item: 'Verificar suspensão e freios', category: 'Veículo' },
        { item: 'Reserva de óleo do motor', category: 'Veículo' },
      ],
    };
    
    // Vehicle-specific items
    const vehicleItems = {
      'moto': [
        { item: 'Capacete', category: 'Equipamento' },
        { item: 'Luvas', category: 'Equipamento' },
        { item: 'Jaqueta de proteção', category: 'Equipamento' },
        { item: 'Capa de chuva', category: 'Equipamento' },
        { item: 'Verificar corrente', category: 'Veículo' },
      ],
      'van': [
        { item: 'Verificar portas de carga', category: 'Veículo' },
        { item: 'Cintas/cordas para fixação', category: 'Equipamento' },
        { item: 'Lonas/coberturas para carga', category: 'Equipamento' },
      ],
      'caminhao': [
        { item: 'Verificar freio de ar', category: 'Veículo' },
        { item: 'Tacógrafo calibrado', category: 'Veículo' },
        { item: 'Cintas/amarrações para carga', category: 'Equipamento' },
        { item: 'Lonas/coberturas para carga', category: 'Equipamento' },
        { item: 'Calços para rodas', category: 'Equipamento' },
        { item: 'Cabos de aço/correntes', category: 'Equipamento' },
      ],
      'carreta': [
        { item: 'Verificar freio de ar', category: 'Veículo' },
        { item: 'Tacógrafo calibrado', category: 'Veículo' },
        { item: 'Verificar engate/quinta roda', category: 'Veículo' },
        { item: 'Cintas/amarrações para carga', category: 'Equipamento' },
        { item: 'Lonas/coberturas para carga', category: 'Equipamento' },
        { item: 'Calços para rodas', category: 'Equipamento' },
        { item: 'Cabos de aço/correntes', category: 'Equipamento' },
        { item: 'Extintor especial', category: 'Emergência' },
      ],
    };
    
    // Cargo-specific items
    const cargoItems = {
      'normal': [
        { item: 'Verificar embalagem', category: 'Carga' },
      ],
      'perecivel': [
        { item: 'Verificar sistema de refrigeração', category: 'Veículo' },
        { item: 'Verificar termômetro', category: 'Equipamento' },
        { item: 'Registro de temperatura', category: 'Documentação' },
        { item: 'Certificado sanitário', category: 'Documentação' },
      ],
      'perigosa': [
        { item: 'Ficha de emergência', category: 'Documentação' },
        { item: 'Envelope para transporte', category: 'Documentação' },
        { item: 'Sinalização específica do produto', category: 'Equipamento' },
        { item: 'EPIs específicos', category: 'Equipamento' },
        { item: 'Curso MOPP atualizado', category: 'Documentação' },
        { item: 'Kit de contenção de vazamento', category: 'Emergência' },
        { item: 'Extintores específicos', category: 'Emergência' },
      ],
      'fragil': [
        { item: 'Material de proteção adicional', category: 'Equipamento' },
        { item: 'Verificar sistema de amortecimento', category: 'Veículo' },
        { item: 'Etiquetas de "Frágil"', category: 'Equipamento' },
      ],
      'valiosa': [
        { item: 'Seguro específico', category: 'Documentação' },
        { item: 'Sistema de rastreamento ativo', category: 'Equipamento' },
        { item: 'Trava adicional', category: 'Equipamento' },
        { item: 'Plano de rota segura', category: 'Planejamento' },
      ],
    };
    
    // Combine all relevant items
    let allItems = [...commonItems];
    
    if (distanceItems[distance as keyof typeof distanceItems]) {
      allItems = [...allItems, ...distanceItems[distance as keyof typeof distanceItems]];
    }
    
    if (vehicleItems[vehicleType as keyof typeof vehicleItems]) {
      allItems = [...allItems, ...vehicleItems[vehicleType as keyof typeof vehicleItems]];
    }
    
    if (cargoItems[cargoType as keyof typeof cargoItems]) {
      allItems = [...allItems, ...cargoItems[cargoType as keyof typeof cargoItems]];
    }
    
    // Group by category
    const groupedItems = allItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item.item);
      return acc;
    }, {} as Record<string, string[]>);
    
    setChecklist(groupedItems);
  };
  
  const exportToPDF = () => {
    if (!checklistRef.current) {
      toast({
        title: "Erro ao exportar",
        description: "Gere um checklist antes de exportar para PDF.",
        variant: "destructive",
      });
      return;
    }

    const element = checklistRef.current;
    const opt = {
      margin: 1,
      filename: `checklist-viagem-${vehicleType}-${distance}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    toast({
      title: "Gerando PDF",
      description: "Seu PDF está sendo gerado...",
    });

    // Slight delay to allow toast to show
    setTimeout(() => {
      html2pdf().set(opt).from(element).save().then(() => {
        toast({
          title: "PDF Gerado com Sucesso",
          description: "Seu checklist foi exportado para PDF.",
          variant: "default",
        });
      }).catch(() => {
        toast({
          title: "Erro ao gerar PDF",
          description: "Ocorreu um erro ao exportar o checklist.",
          variant: "destructive",
        });
      });
    }, 500);
  };
  
  return (
    <Calculator
      id="checklist-viagem"
      title="Checklist de Viagem para Transportadores"
      description="Gere um checklist personalizado para sua viagem com base no tipo de carga e distância."
      isActive={isActive}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de carga
            </label>
            <select
              id="cargoType"
              className="select-field"
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
            >
              <option value="normal">Normal/Geral</option>
              <option value="perecivel">Perecível</option>
              <option value="perigosa">Perigosa</option>
              <option value="fragil">Frágil</option>
              <option value="valiosa">Valiosa</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distância
            </label>
            <select
              id="distance"
              className="select-field"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              <option value="curta">Curta (até 100km)</option>
              <option value="media">Média (100-500km)</option>
              <option value="longa">Longa (acima de 500km)</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de veículo
            </label>
            <select
              id="vehicleType"
              className="select-field"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="moto">Moto</option>
              <option value="van">Van</option>
              <option value="caminhao">Caminhão</option>
              <option value="carreta">Carreta</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        <button 
          className="btn btn-primary"
          onClick={generateChecklist}
        >
          Gerar checklist
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setCargoType('normal');
            setDistance('curta');
            setVehicleType('van');
            setChecklist(null);
          }}
        >
          <RefreshCw size={18} className="mr-2" />
          Limpar
        </button>
      </div>
      
      {checklist && (
        <div className="mt-8 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Checklist de viagem</h3>
            <div className="flex gap-2">
              <button 
                className="btn btn-small bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => window.print()}
              >
                <FileText size={16} className="mr-1" />
                Imprimir
              </button>
              <button 
                className="btn btn-small bg-blue-100 hover:bg-blue-200 text-blue-700"
                onClick={exportToPDF}
              >
                <Download size={16} className="mr-1" />
                Exportar PDF
              </button>
            </div>
          </div>
          
          <div ref={checklistRef} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {Object.keys(checklist).map((category, index) => (
              <div 
                key={category}
                className={`${index > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div className="bg-gray-50 px-4 py-2 font-medium text-gray-700">
                  {category}
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {checklist[category].map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start p-2 border border-gray-100 rounded"
                      >
                        <input 
                          type="checkbox" 
                          id={`item-${index}-${idx}`}
                          className="mt-0.5 mr-3 h-4 w-4 text-frete-500 rounded border-gray-300 focus:ring-frete-400"
                        />
                        <label 
                          htmlFor={`item-${index}-${idx}`}
                          className="text-gray-700"
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-gray-500 text-sm italic">
            Este checklist foi gerado com base nos parâmetros selecionados. Certifique-se de adicionar itens específicos para sua operação se necessário.
          </div>
        </div>
      )}
    </Calculator>
  );
};

export default TripChecklist;
