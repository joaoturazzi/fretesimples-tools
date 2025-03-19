
import React from 'react';
import { Truck } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-frete-500 to-frete-600 text-white p-2 rounded-lg shadow-sm animate-fade-in flex items-center justify-center">
            <Truck size={20} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              FreteSimples
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
