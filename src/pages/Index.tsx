
import React, { useState, useEffect } from 'react';
import ResponsiveSidebar from '@/components/ResponsiveSidebar';
import UnifiedHeader from '@/components/UnifiedHeader';
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
import TestingUtils from '@/components/TestingUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSEO } from '@/hooks/useSEO';
import { useAnalytics } from '@/hooks/useAnalytics';
import AboutSection from '@/components/AboutSection';
import CciLogo from '@/components/ui/CciLogo';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeSection, setActiveSection] = useState('calculadora-frete');
  const [showTestingUtils, setShowTestingUtils] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { trackPageView, trackCalculatorStart, trackUserInteraction } = useAnalytics();
  
  // Update SEO based on active section
  useSEO(activeSection);
  
  console.log('Index - activeSection:', activeSection);
  
  // Initialize sidebar state based on device
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
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

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    trackUserInteraction('sidebar_toggle', 'mobile_menu', isSidebarOpen ? 'close' : 'open');
  };

  // Show testing utils in development
  useEffect(() => {
    const showTests = localStorage.getItem('show-testing-utils') === 'true' ||
                     window.location.search.includes('debug=true');
    setShowTestingUtils(showTests);
  }, []);

  // Listen for custom events to change section (for the "Simular Lucro" button)
  useEffect(() => {
    const handleChangeSection = (event: CustomEvent) => {
      const newSection = event.detail;
      if (newSection) {
        handleSectionChange(newSection);
      }
    };

    window.addEventListener('changeActiveSection', handleChangeSection as EventListener);
    
    return () => {
      window.removeEventListener('changeActiveSection', handleChangeSection as EventListener);
    };
  }, []);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Unificado com Menu Toggle */}
      <UnifiedHeader onMenuToggle={isMobile ? handleSidebarToggle : undefined} />
      
      {/* Sidebar Responsivo */}
      <ResponsiveSidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange}
        isOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
      />
      
      <main 
        className={cn(
          "pt-20 pb-16 transition-all duration-300",
          // Desktop: sempre com margem para sidebar
          // Mobile: sem margem, overlay do sidebar
          isMobile ? "ml-0" : (isSidebarOpen ? "ml-72" : "ml-0")
        )}
      >
        <div className="content-container px-3 sm:px-4 lg:px-6">
          {/* Testing Utils (Development Only) */}
          {showTestingUtils && (
            <div className="mb-6 sm:mb-8">
              <TestingUtils />
            </div>
          )}

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
          
          <footer id="footer" className="text-center text-gray-500 text-sm py-6 sm:py-8 border-t border-gray-100 mt-8 sm:mt-12">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
                <CciLogo size="sm" showText={false} />
              </div>
              <div className="text-left">
                <span className="font-semibold text-gray-700 block text-sm sm:text-base">FreteDigital BY CCI</span>
                <span className="text-xs text-gray-500">Soluções em Logística</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm">© {new Date().getFullYear()} - Todas as ferramentas gratuitas para sempre.</p>
            <p className="mt-1 text-xs sm:text-sm">
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
