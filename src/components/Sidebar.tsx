
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
  Menu,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
  ];
  
  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 z-50 bg-frete-500 text-white p-3 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 active:scale-95"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
    
      {/* Sidebar */}
      <div 
        className={`fixed top-[72px] bottom-0 bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out z-40 overflow-y-auto
          ${isSidebarOpen ? 'left-0' : '-left-full md:left-0'} 
          ${isMobile ? 'w-64' : 'w-64'}`}
      >
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Ferramentas
          </h2>
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`sidebar-link w-full text-left ${activeSection === item.id ? 'active' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
