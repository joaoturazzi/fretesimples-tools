
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  Fuel, 
  CheckCircle, 
  ClipboardCheck,
  Package,
  BarChart,
  Shield,
  Info,
  Menu,
  X,
  Linkedin,
  FileText
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ResponsiveSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ 
  activeSection, 
  setActiveSection 
}) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  
  const sidebarItems = [
    { id: 'calculadora-frete', label: 'Calculadora de Frete', icon: <Calculator size={20} />, category: 'calculadoras' },
    { id: 'simulador-lucro', label: 'Simulador de Lucro', icon: <TrendingUp size={20} />, category: 'calculadoras' },
    { id: 'calculadora-risco', label: 'Análise de Risco', icon: <AlertTriangle size={20} />, category: 'calculadoras' },
    { id: 'calculadora-combustivel', label: 'Calculadora de Combustível', icon: <Fuel size={20} />, category: 'calculadoras' },
    { id: 'checklist-viagem', label: 'Checklist de Viagem', icon: <ClipboardCheck size={20} />, category: 'ferramentas' },
    { id: 'dimensionamento-veiculo', label: 'Dimensionamento de Veículo', icon: <Package size={20} />, category: 'ferramentas' },
    { id: 'diagnostico-logistica', label: 'Diagnóstico Logístico', icon: <BarChart size={20} />, category: 'diagnosticos' },
    { id: 'diagnostico-risco', label: 'Diagnóstico de Risco', icon: <Shield size={20} />, category: 'diagnosticos' },
    { id: 'gerador-posts', label: 'Gerador de Posts', icon: <Linkedin size={20} />, category: 'geradores' },
    { id: 'gerador-contratos', label: 'Gerador de Contratos', icon: <FileText size={20} />, category: 'geradores' },
    { id: 'sobre', label: 'Sobre', icon: <Info size={20} />, category: 'info' },
  ];

  const groupedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof sidebarItems>);

  const categoryLabels = {
    calculadoras: 'Calculadoras',
    ferramentas: 'Ferramentas',
    diagnosticos: 'Diagnósticos',
    geradores: 'Geradores',
    info: 'Informações'
  };
  
  return (
    <>
      {/* Mobile Toggle Button - Posicionamento otimizado */}
      {isMobile && (
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      )}
    
      {/* Sidebar - Ajustes de responsividade */}
      <div 
        className={cn(
          "fixed left-0 bg-white/95 backdrop-blur-md border-r border-orange-100 shadow-lg transition-all duration-300 ease-in-out z-40 overflow-y-auto",
          "top-16", // Ajustado para header unificado
          isMobile ? "w-80" : "w-72", // Largura otimizada para mobile
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          !isMobile && "md:translate-x-0",
          isMobile ? "bottom-0" : "bottom-0"
        )}
      >
        <div className="p-4 sm:p-6">
          {/* Informações da Ferramenta - Texto otimizado */}
          <div className="mb-6 pb-4 border-b border-orange-100">
            <p className="text-xs text-gray-500 mb-3">
              Ferramentas gratuitas para transportadores
            </p>
            <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl p-3 border border-orange-100">
              <p className="text-xs text-gray-600 mb-2">
                ✨ Todas as ferramentas são <strong>100% gratuitas</strong>
              </p>
              <p className="text-xs text-gray-500">
                Desenvolvido pela equipe CCI para profissionais de logística
              </p>
            </div>
          </div>

          {/* Navegação - Espaçamento otimizado para mobile */}
          <nav className="space-y-4 sm:space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 sm:mb-3 px-2 sm:px-3">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className={cn(
                        "w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm group relative",
                        activeSection === item.id 
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-md" 
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
                      )}
                    >
                      <span className={cn(
                        "transition-all duration-200 flex-shrink-0",
                        activeSection === item.id ? "text-white" : "text-gray-500 group-hover:text-orange-500"
                      )}>
                        {item.icon}
                      </span>
                      <span className="font-medium leading-tight text-xs sm:text-sm">{item.label}</span>
                      {activeSection === item.id && (
                        <div className="ml-auto flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* CTA de Consultoria - Ajustado para mobile */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-orange-100">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Precisa de mais?
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Consultoria personalizada em logística e gestão de risco
              </p>
              <Button 
                size="sm" 
                className="w-full text-xs"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay - Ajuste de z-index */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
          style={{ top: '64px' }}
        />
      )}
    </>
  );
};

export default ResponsiveSidebar;
