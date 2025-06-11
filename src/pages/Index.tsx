
import React, { useState, useEffect } from 'react';
import ResponsiveSidebar from '@/components/ResponsiveSidebar';
import UnifiedHeader from '@/components/UnifiedHeader';
import ToolsOverview from '@/components/ToolsOverview';
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
  const [activeSection, setActiveSection] = useState('home');
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
    if (activeSection !== 'sobre' && activeSection !== 'home') {
      trackCalculatorStart(activeSection);
    }
  }, [activeSection, trackCalculatorStart]);

  // Handle section change with analytics
  const handleSectionChange = (section: string) => {
    console.log('HandleSectionChange called with:', section);
    trackUserInteraction('section_change', 'sidebar_menu', section);
    setActiveSection(section);
  };

  // Handle tool selection from overview
  const handleToolSelect = (toolId: string) => {
    console.log('HandleToolSelect called with:', toolId);
    trackUserInteraction('tool_select', 'overview_card', toolId);
    setActiveSection(toolId);
  };

  // Handle back to home
  const handleBackToHome = () => {
    console.log('HandleBackToHome called');
    trackUserInteraction('back_to_home', 'tool_header', activeSection);
    setActiveSection('home');
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

  // Listen for custom events to change section
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

          {/* Tools Overview - Home Screen */}
          {activeSection === 'home' && (
            <ToolsOverview onToolSelect={handleToolSelect} />
          )}

          {/* Individual Tools */}
          <div className="tools-container">
            <FreightCalculator 
              isActive={activeSection === 'calculadora-frete'} 
              onBackToHome={handleBackToHome}
            />
            <ProfitSimulator 
              isActive={activeSection === 'simulador-lucro'} 
              onBackToHome={handleBackToHome}
            />
            <RiskCalculator 
              isActive={activeSection === 'calculadora-risco'} 
              onBackToHome={handleBackToHome}
            />
            <EnhancedRiskCalculator 
              isActive={activeSection === 'calculadora-risco-inteligente'} 
              onBackToHome={handleBackToHome}
            />
            <FuelCalculator 
              isActive={activeSection === 'calculadora-combustivel'} 
              onBackToHome={handleBackToHome}
            />
            <TripChecklist 
              isActive={activeSection === 'checklist-viagem'} 
              onBackToHome={handleBackToHome}
            />
            <VehicleSizingTool 
              isActive={activeSection === 'dimensionamento-veiculo'} 
              onBackToHome={handleBackToHome}
            />
            <LogisticsManagementDiagnostic 
              isActive={activeSection === 'diagnostico-logistica'} 
              onBackToHome={handleBackToHome}
            />
            <RiskManagementDiagnostic 
              isActive={activeSection === 'diagnostico-risco'} 
              onBackToHome={handleBackToHome}
            />
            <LogisticsPostGenerator 
              isActive={activeSection === 'gerador-posts'} 
              onBackToHome={handleBackToHome}
            />
            <ContractGenerator 
              isActive={activeSection === 'gerador-contratos'} 
              onBackToHome={handleBackToHome}
            />
          </div>
          
          {activeSection === 'sobre' && <AboutSection />}
          
          {/* Footer - Only show on individual tools, not on home */}
          {activeSection !== 'home' && (
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
          )}
        </div>
      </main>
      
      <ChatAssistant />
    </div>
  );
};

export default Index;
