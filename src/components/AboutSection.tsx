
import React from 'react';

const AboutSection = () => {
  return (
    <section id="sobre" className="tool-section py-10 px-6 sm:px-8 mt-8 mb-8 glass-card visible">
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
  );
};

export default AboutSection;
