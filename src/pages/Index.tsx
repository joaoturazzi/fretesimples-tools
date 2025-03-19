
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
        className={`pt-24 pb-20 transition-all duration-300 ${
          isMobile ? 'ml-0' : 'ml-64'
        }`}
      >
        <div className="content-container">
          <div className="mb-10 text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Ferramentas gratuitas para transportadores
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Calcule custos, simule lucros e otimize suas operações de transporte 
              com nossas ferramentas simples e eficientes.
            </p>
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
          
          <section id="sobre" className="tool-section py-10 px-6 sm:px-8 mt-12 mb-8 glass-card visible">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Sobre o FreteSimples</h2>
              <p className="text-gray-600 mb-8 text-base lg:text-lg">
                O FreteSimples é um projeto que oferece ferramentas gratuitas para profissionais do transporte e logística, 
                ajudando a calcular custos, otimizar rotas e aumentar a eficiência das operações.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Nossa missão</h3>
                  <p className="text-gray-700">
                    Facilitar o dia a dia dos transportadores com ferramentas simples, práticas e gratuitas que ajudem 
                    na tomada de decisões e na gestão eficiente do negócio.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Por que usar?</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="text-frete-500 mr-2">✓</span> 
                      Ferramentas 100% gratuitas
                    </li>
                    <li className="flex items-center">
                      <span className="text-frete-500 mr-2">✓</span> 
                      Cálculos rápidos e precisos
                    </li>
                    <li className="flex items-center">
                      <span className="text-frete-500 mr-2">✓</span> 
                      Interface simples e intuitiva
                    </li>
                    <li className="flex items-center">
                      <span className="text-frete-500 mr-2">✓</span> 
                      Sem necessidade de cadastro
                    </li>
                    <li className="flex items-center">
                      <span className="text-frete-500 mr-2">✓</span> 
                      Assistente de IA para dúvidas
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <footer id="footer" className="text-center text-gray-500 text-sm py-8 border-t border-gray-100 mt-12">
            <p>© {new Date().getFullYear()} FreteSimples - Todas as ferramentas gratuitas para sempre.</p>
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
