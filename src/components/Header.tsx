
import React from 'react';
import { Truck } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-2.5 rounded-lg shadow-md animate-fade-in flex items-center justify-center transition-transform hover:scale-105">
            <Truck size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center">
              Frete Simples 
              <span className="ml-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-0.5 rounded-md font-medium shadow-sm">BY CCI</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
