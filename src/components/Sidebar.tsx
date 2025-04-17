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
  Linkedin
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
    { id: 'calculadora-frete', label: 'Calculadora de Frete', icon: <Calculator size={18} /> },
    { id: 'simulador-lucro', label: 'Simulador de Lucro', icon: <TrendingUp size={18} /> },
    { id: 'calculadora-risco', label: 'Calculadora de Risco', icon: <AlertTriangle size={18} /> },
    { id: 'simulador-custos', label: 'Simulador de Custos', icon: <Truck size={18} /> },
    { id: 'calculadora-combustivel', label: 'Calculadora de Combustível', icon: <Fuel size={18} /> },
    { id: 'verificador-viabilidade', label: 'Verificador de Viabilidade', icon: <CheckCircle size={18} /> },
    { id: 'checklist-viagem', label: 'Checklist de Viagem', icon: <ClipboardCheck size={18} /> },
    { id: 'dimensionamento-veiculo', label: 'Dimensionamento de Veículo', icon: <Package size={18} /> },
    { id: 'diagnostico-logistica', label: 'Diagnóstico Logístico', icon: <BarChart size={18} /> },
    { id: 'diagnostico-risco', label: 'Diagnóstico de Risco', icon: <Shield size={18} /> },
    { id: 'gerador-posts', label: 'Gerador de Posts', icon: <Linkedin size={18} /> },
    { id: 'sobre', label: 'Sobre', icon: <Info size={18} /> },
  ];
  
  return (
    <>
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 active:scale-95"
          aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
    
      <div 
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-white border-r border-orange-100 shadow-sm transition-all duration-300 ease-in-out z-40 overflow-y-auto w-64",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          !isMobile && "md:translate-x-0"
        )}
      >
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            Ferramentas
          </h2>
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 text-sm",
                  activeSection === item.id 
                    ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-medium" 
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  activeSection === item.id ? "text-orange-500" : "text-gray-500"
                )}>
                  {item.icon}
                </span>
                {item.label}
                {activeSection === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                )}
              </button>
            ))}
          </nav>
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
