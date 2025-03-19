
import React from 'react';
import { Truck, Star, Shield, Clock, Award, CheckCircle } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="sobre" className="tool-section py-12 px-6 sm:px-8 my-8 bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm visible">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-orange-50 rounded-full mb-3">
            <Truck size={28} className="text-orange-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Sobre o Frete Simples</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-base lg:text-lg">
            Ferramentas gratuitas para profissionais do transporte e logística, ajudando a calcular custos,
            otimizar rotas e aumentar a eficiência das operações.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <Award className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Nossa missão</h3>
                <p className="text-gray-700">
                  Facilitar o dia a dia dos transportadores com ferramentas simples, práticas e gratuitas que ajudem 
                  na tomada de decisões e na gestão eficiente do negócio.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Shield className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Por que usar?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-orange-500 mr-2 flex-shrink-0" /> 
                    Ferramentas 100% gratuitas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-orange-500 mr-2 flex-shrink-0" /> 
                    Cálculos rápidos e precisos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-orange-500 mr-2 flex-shrink-0" /> 
                    Interface simples e intuitiva
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-orange-500 mr-2 flex-shrink-0" /> 
                    Sem necessidade de cadastro
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-orange-500 mr-2 flex-shrink-0" /> 
                    Assistente de IA para dúvidas
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-3 rounded-full mb-4">
                <Star className="text-orange-500" size={20} />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Qualidade</h4>
              <p className="text-gray-600 text-sm">Ferramentas desenvolvidas por especialistas em logística e transporte</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Clock className="text-blue-500" size={20} />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Agilidade</h4>
              <p className="text-gray-600 text-sm">Economize tempo com nossas calculadoras rápidas e eficientes</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-3 rounded-full mb-4">
                <Truck className="text-orange-500" size={20} />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Especialidade</h4>
              <p className="text-gray-600 text-sm">Focado nas necessidades específicas do setor de transportes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
