
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  Truck, 
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

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);
  
  useEffect(() => {
    const handleNavigateSection = (e: CustomEvent) => {
      setActiveSection(e.detail);
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('navigate-section', handleNavigateSection as EventListener);
    return () => {
      document.removeEventListener('navigate-section', handleNavigateSection as EventListener);
    };
  }, [setActiveSection, isMobile]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
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
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-xl"
          aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
    
      <div 
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-white/95 backdrop-blur-md border-r border-orange-100 shadow-lg transition-all duration-300 ease-in-out z-40 overflow-y-auto w-72",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          !isMobile && "md:translate-x-0"
        )}
      >
        <div className="p-6">
          <div className="mb-6 pb-4 border-b border-orange-100">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src="https://i.postimg.cc/C5bzFpj8/Logo-CCI.png" 
                alt="CCI Logo" 
                className="h-8 w-auto object-contain"
              />
              <div>
                <h2 className="text-sm font-bold text-orange-600 uppercase tracking-wider">
                  FreteDigital
                </h2>
                <p className="text-xs text-gray-500">BY CCI</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Ferramentas gratuitas para transportadores
            </p>
          </div>

          <nav className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm group relative",
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
                      <span className="font-medium leading-tight">{item.label}</span>
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

          <div className="mt-8 p-4 bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Truck size={16} className="text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">CCI Gestão</h4>
                <p className="text-xs text-gray-600">Soluções completas</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Precisa de consultoria em logística ou gestão de risco?
            </p>
            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:shadow-md transition-all duration-200">
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>

      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
