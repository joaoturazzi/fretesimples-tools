
import React, { useState, useEffect } from 'react';
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
  
  // Handle section visibility when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.tool-section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = (
          rect.top < window.innerHeight / 2 &&
          rect.bottom > window.innerHeight / 2
        );
        
        if (isVisible) {
          section.classList.add('visible');
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      
      <main 
        className={`pt-24 pb-16 transition-all duration-300 ${
          isMobile ? 'ml-0' : 'ml-64'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Ferramentas gratuitas para transportadores
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calcule custos, simule lucros e otimize suas operações de transporte com nossas ferramentas simples e eficientes.
            </p>
          </div>
          
          <FreightCalculator isActive={activeSection === 'calculadora-frete'} />
          <ProfitSimulator isActive={activeSection === 'simulador-lucro'} />
          <RiskCalculator isActive={activeSection === 'calculadora-risco'} />
          <TransportCostSimulator isActive={activeSection === 'simulador-custos'} />
          <FuelCalculator isActive={activeSection === 'calculadora-combustivel'} />
          <FreightViabilityChecker isActive={activeSection === 'verificador-viabilidade'} />
          <TripChecklist isActive={activeSection === 'checklist-viagem'} />
          <JobMarketplace isActive={activeSection === 'marketplace'} />
          
          <section id="sobre" className="tool-section py-8 px-4 sm:px-8 mb-8 glass-card visible">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sobre o FreteSimples</h2>
            <p className="text-gray-600 mb-6">
              O FreteSimples é um projeto que oferece ferramentas gratuitas para profissionais do transporte e logística, 
              ajudando a calcular custos, otimizar rotas e aumentar a eficiência das operações.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Nossa missão</h3>
                <p className="text-gray-700">
                  Facilitar o dia a dia dos transportadores com ferramentas simples, práticas e gratuitas que ajudem 
                  na tomada de decisões e na gestão eficiente do negócio.
                </p>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Por que usar?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Ferramentas 100% gratuitas</li>
                  <li>✓ Cálculos rápidos e precisos</li>
                  <li>✓ Interface simples e intuitiva</li>
                  <li>✓ Sem necessidade de cadastro</li>
                  <li>✓ Assistente de IA para dúvidas</li>
                </ul>
              </div>
            </div>
          </section>
          
          <footer id="footer" className="text-center text-gray-500 text-sm py-8">
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
