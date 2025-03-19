
import React from 'react';
import { Truck } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-frete-500 text-white p-2.5 rounded-lg shadow-md animate-fade-in">
            <Truck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              FreteSimples
            </h1>
            <p className="text-sm text-gray-500 animate-fade-in">
              Ferramentas gratuitas para transportadores
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a 
            href="#ferramentas" 
            className="text-gray-600 hover:text-frete-600 transition-colors duration-200"
          >
            Ferramentas
          </a>
          <a 
            href="#assistente" 
            className="text-gray-600 hover:text-frete-600 transition-colors duration-200"
          >
            Assistente IA
          </a>
          <a 
            href="#sobre" 
            className="text-gray-600 hover:text-frete-600 transition-colors duration-200"
          >
            Sobre
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
