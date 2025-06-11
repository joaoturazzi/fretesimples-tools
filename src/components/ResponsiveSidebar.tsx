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
  X,
  Linkedin,
  FileText,
  Home,
  ArrowLeft
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ResponsiveSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ 
  activeSection, 
  setActiveSection,
  isOpen,
  onToggle
}) => {
  const isMobile = useIsMobile();
  
  const handleSectionClick = (section: string) => {
    console.log('ResponsiveSidebar - Button clicked for section:', section);
    console.log('ResponsiveSidebar - Current activeSection:', activeSection);
    console.log('ResponsiveSidebar - setActiveSection function type:', typeof setActiveSection);
    
    // Call the function directly
    setActiveSection(section);
    
    console.log('ResponsiveSidebar - After setActiveSection call');
    
    // Em mobile, não fechamos automaticamente - usuário decide quando fechar
  };
  
  const sidebarItems = [
    { id: 'home', label: 'Início', icon: <Home size={20} />, category: 'principal' },
    { id: 'calculadora-frete', label: 'Calculadora de Frete', icon: <Calculator size={20} />, category: 'calculadoras' },
    { id: 'simulador-lucro', label: 'Simulador de Lucro', icon: <TrendingUp size={20} />, category: 'calculadoras' },
    { id: 'calculadora-risco', label: 'Análise de Risco', icon: <AlertTriangle size={20} />, category: 'calculadoras' },
    { id: 'calculadora-risco-inteligente', label: 'Análise Inteligente de Risco', icon: <Shield size={20} />, category: 'calculadoras' },
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
    principal: 'Navegação',
    calculadoras: 'Calculadoras',
    ferramentas: 'Ferramentas',
    diagnosticos: 'Diagnósticos',
    geradores: 'Geradores',
    info: 'Informações'
  };
  
  return (
    <>
      {/* Sidebar - Comportamento otimizado para mobile */}
      <div 
        className={cn(
          "fixed left-0 bg-white/98 backdrop-blur-md border-r border-orange-100 shadow-xl transition-all duration-300 ease-in-out z-40 overflow-y-auto",
          "top-16", // Ajustado para header unificado
          isMobile ? "w-80 max-w-[85vw]" : "w-72", // Largura responsiva
          isOpen ? "translate-x-0" : "-translate-x-full",
          !isMobile && "md:translate-x-0", // Desktop sempre visível
          "bottom-0"
        )}
      >
        {/* Header do Sidebar Mobile - Melhor contraste */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-orange-200 bg-gradient-to-r from-gray-900 to-gray-800">
            <h2 className="text-lg font-bold text-white">Ferramentas</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 touch-friendly hover:bg-white/20 text-white"
            >
              <X size={18} />
            </Button>
          </div>
        )}

        <div className="p-4 sm:p-6">
          {/* Back to Home button - Show only when not on home */}
          {activeSection !== 'home' && (
            <div className="mb-4 pb-4 border-b border-orange-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('Back to home button clicked');
                  handleSectionClick('home');
                }}
                className="w-full flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50 font-medium"
              >
                <ArrowLeft size={16} />
                Voltar ao Início
              </Button>
            </div>
          )}

          {/* Informações da Ferramenta - Mobile otimizado */}
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

          {/* Navegação - Melhor contraste para mobile */}
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
                      onClick={() => {
                        console.log('Sidebar menu item clicked:', item.id, item.label);
                        handleSectionClick(item.id);
                      }}
                      className={cn(
                        "w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm group relative touch-friendly",
                        "min-h-[48px]", // Touch target mínimo
                        activeSection === item.id 
                          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white font-medium shadow-lg scale-[1.02] border border-gray-700" 
                          : "text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:scale-[1.01] border border-transparent hover:border-orange-200"
                      )}
                    >
                      <span className={cn(
                        "transition-all duration-200 flex-shrink-0",
                        activeSection === item.id ? "text-white" : "text-gray-600 group-hover:text-orange-600"
                      )}>
                        {item.icon}
                      </span>
                      <span className="font-medium leading-tight text-xs sm:text-sm">{item.label}</span>
                      {activeSection === item.id && (
                        <div className="ml-auto flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white/90 animate-pulse"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* CTA de Consultoria - Mobile otimizado */}
          <div className="mt-6 sm:mt-8 p-4 bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-orange-100">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Precisa de mais?
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Consultoria personalizada em logística e gestão de risco
              </p>
              <Button 
                size="sm" 
                className="w-full text-xs touch-friendly min-h-[44px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay - Melhorado com melhor contraste */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={onToggle}
          style={{ top: '64px' }}
        />
      )}
    </>
  );
};

export default ResponsiveSidebar;
