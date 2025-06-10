
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { 
  FreightCalculator,
  ProfitSimulator,
  RiskCalculator,
  EnhancedRiskCalculator,
  FuelCalculator,
  TripChecklist,
  VehicleSizingTool,
  LogisticsManagementDiagnostic,
  RiskManagementDiagnostic,
  LogisticsPostGenerator,
  ContractGenerator
} from '@/components/Tools';
import ChatAssistant from '@/components/ChatAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSEO } from '@/hooks/useSEO';
import { useAnalytics } from '@/hooks/useAnalytics';
import AboutSection from '@/components/AboutSection';
import LazyImage from '@/components/ui/LazyImage';

const Index = () => {
  const [activeSection, setActiveSection] = useState('calculadora-frete');
  const isMobile = useIsMobile();
  const { trackPageView, trackCalculatorStart, trackUserInteraction } = useAnalytics();
  
  // Update SEO based on active section
  useSEO(activeSection);
  
  console.log('Index - activeSection:', activeSection);
  
  // Track page view and section changes
  useEffect(() => {
    trackPageView(`/${activeSection}`, `Frete Simples - ${activeSection}`);
  }, [activeSection, trackPageView]);

  // Track when user starts using a calculator
  useEffect(() => {
    if (activeSection !== 'sobre') {
      trackCalculatorStart(activeSection);
    }
  }, [activeSection, trackCalculatorStart]);

  // Handle section change with analytics
  const handleSectionChange = (section: string) => {
    trackUserInteraction('section_change', 'sidebar_menu', section);
    setActiveSection(section);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange} 
      />
      
      <main 
        className={`pt-4 pb-16 transition-all duration-300 ${
          isMobile ? 'ml-0' : 'ml-72'
        }`}
      >
        <div className="content-container px-4 sm:px-6">
          <div className="tools-container">
            <FreightCalculator isActive={activeSection === 'calculadora-frete'} />
            <ProfitSimulator isActive={activeSection === 'simulador-lucro'} />
            <RiskCalculator isActive={activeSection === 'calculadora-risco'} />
            <EnhancedRiskCalculator isActive={activeSection === 'calculadora-risco-inteligente'} />
            <FuelCalculator isActive={activeSection === 'calculadora-combustivel'} />
            <TripChecklist isActive={activeSection === 'checklist-viagem'} />
            <VehicleSizingTool isActive={activeSection === 'dimensionamento-veiculo'} />
            <LogisticsManagementDiagnostic isActive={activeSection === 'diagnostico-logistica'} />
            <RiskManagementDiagnostic isActive={activeSection === 'diagnostico-risco'} />
            <LogisticsPostGenerator isActive={activeSection === 'gerador-posts'} />
            <ContractGenerator isActive={activeSection === 'gerador-contratos'} />
          </div>
          
          {activeSection === 'sobre' && <AboutSection />}
          
          <footer id="footer" className="text-center text-gray-500 text-sm py-8 border-t border-gray-100 mt-12">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
                <LazyImage 
                  src="https://i.postimg.cc/C5bzFpj8/Logo-CCI.png" 
                  alt="CCI Logo" 
                  className="h-8 w-auto object-contain" 
                  skeleton={true}
                />
              </div>
              <div className="text-left">
                <span className="font-semibold text-gray-700 block">FreteDigital BY CCI</span>
                <span className="text-xs text-gray-500">Soluções em Logística</span>
              </div>
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
