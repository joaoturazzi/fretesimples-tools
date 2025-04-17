
import React from 'react';
import { Truck, Package } from 'lucide-react';

interface ProfileSelectionProps {
  onSelectProfile: (profile: string) => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ onSelectProfile }) => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Selecione seu perfil:</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onSelectProfile('transporter')}
          className="btn-large bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-3 shadow-md transition-transform hover:scale-105"
        >
          <Truck size={24} />
          <div className="text-left">
            <div className="font-medium">Transportador</div>
            <div className="text-sm text-orange-100">Você realiza entregas para clientes</div>
          </div>
        </button>
        
        <button
          onClick={() => onSelectProfile('shipper')}
          className="btn-large bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-3 shadow-md transition-transform hover:scale-105"
        >
          <Package size={24} />
          <div className="text-left">
            <div className="font-medium">Embarcador</div>
            <div className="text-sm text-blue-100">Você contrata transportadoras</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfileSelection;
