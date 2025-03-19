
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  Truck, 
  Fuel, 
  CheckCircle, 
  ClipboardCheck,
  Users,
  Info,
  Menu,
  X
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
    setIsSidebarOpen(!isMobile);
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
    { id: 'marketplace', label: 'Marketplace', icon: <Users size={18} /> },
    { id: 'sobre', label: 'Sobre', icon: <Info size={18} /> },
  ];
  
  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 active:scale-95"
          aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
    
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-white border-r border-orange-100 shadow-sm transition-all duration-300 ease-in-out z-40 overflow-y-auto w-64",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
    </>
  );
};

export default Sidebar;
