
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { 
  FreightCalculator,
  ProfitSimulator,
  RiskCalculator,
  TransportCostSimulator,
  FuelCalculator,
  FreightViabilityChecker,
  TripChecklist,
  JobMarketplace
} from '@/components/Tools';
import ChatAssistant from '@/components/ChatAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import AboutSection from '@/components/AboutSection';
import { Truck } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('calculadora-frete');
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      
      <main 
        className={`pt-20 pb-16 transition-all duration-300 ${
          isMobile ? 'ml-0' : 'ml-64'
        }`}
      >
        <div className="content-container px-4 sm:px-6">
          <div className="tools-container">
            <FreightCalculator isActive={activeSection === 'calculadora-frete'} />
            <ProfitSimulator isActive={activeSection === 'simulador-lucro'} />
            <RiskCalculator isActive={activeSection === 'calculadora-risco'} />
            <TransportCostSimulator isActive={activeSection === 'simulador-custos'} />
            <FuelCalculator isActive={activeSection === 'calculadora-combustivel'} />
            <FreightViabilityChecker isActive={activeSection === 'verificador-viabilidade'} />
            <TripChecklist isActive={activeSection === 'checklist-viagem'} />
            <JobMarketplace isActive={activeSection === 'marketplace'} />
          </div>
          
          {activeSection === 'sobre' && <AboutSection />}
          
          <footer id="footer" className="text-center text-gray-500 text-sm py-8 border-t border-gray-100 mt-12">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-orange-100 p-2 rounded-full mr-2">
                <Truck size={16} className="text-orange-500" />
              </div>
              <span className="font-semibold text-gray-700">Frete Simples BY CCI</span>
            </div>
            <p>© {new Date().getFullYear()} - Todas as ferramentas gratuitas para sempre.</p>
            <p className="mt-1">
              Desenvolvido para auxiliar transportadores e profissionais de logística.
            </p>
          </footer>
        </div>
      </main>
      
      <ChatAssistant />
    </div>
  );
};

export default Index;
