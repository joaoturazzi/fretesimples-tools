
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
import { Truck, Calculator, TrendingUp } from 'lucide-react';

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
          {/* Hero Section */}
          <div className="mb-10 text-center animate-fade-in bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm py-8 px-4 sm:px-6 md:px-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-xl shadow-md">
                <Truck size={32} />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Ferramentas para transportadores
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Calcule custos, simule lucros e otimize suas operações de transporte 
              com nossas ferramentas simples e eficientes.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto mt-5 rounded-full"></div>
            
            <div className="flex flex-wrap justify-center mt-8 gap-3">
              <button 
                onClick={() => setActiveSection('calculadora-frete')}
                className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-transform hover:scale-105"
              >
                <Calculator size={18} />
                Calcular Frete
              </button>
              <button 
                onClick={() => setActiveSection('simulador-lucro')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-transform hover:scale-105"
              >
                <TrendingUp size={18} />
                Simular Lucro
              </button>
            </div>
          </div>
          
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
