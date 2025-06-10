
import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityToolsStepProps {
  securityTools: string[];
  setSecurityTools: (value: string[]) => void;
}

const securityToolOptions = [
  { id: 'rastreamento', label: 'Rastreamento GPS', description: 'Monitoramento em tempo real' },
  { id: 'isca', label: 'Isca Eletrônica', description: 'Dispositivo de segurança oculto' },
  { id: 'lacre', label: 'Lacre Eletrônico', description: 'Proteção contra violação' },
  { id: 'seguro', label: 'Seguro Especializado', description: 'Cobertura para transporte' },
  { id: 'escolta', label: 'Escolta Armada', description: 'Acompanhamento de segurança' },
  { id: 'comunicacao', label: 'Comunicação 24h', description: 'Central de monitoramento' }
];

const SecurityToolsStep: React.FC<SecurityToolsStepProps> = ({
  securityTools,
  setSecurityTools
}) => {
  const handleSecurityToolToggle = (tool: string) => {
    if (securityTools.includes(tool)) {
      setSecurityTools(securityTools.filter(t => t !== tool));
    } else {
      setSecurityTools([...securityTools, tool]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ferramentas de Segurança</h3>
          <p className="text-sm text-gray-600">Selecione as ferramentas que você utiliza ou pretende utilizar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {securityToolOptions.map((tool) => (
          <label key={tool.id} className={cn(
            "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
            securityTools.includes(tool.id) 
              ? "border-orange-300 bg-orange-50" 
              : "border-gray-200 bg-white hover:border-orange-200"
          )}>
            <input
              type="checkbox"
              checked={securityTools.includes(tool.id)}
              onChange={() => handleSecurityToolToggle(tool.id)}
              className="checkbox-field mt-1"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm">{tool.label}</div>
              <div className="text-xs text-gray-600 mt-1">{tool.description}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 p-3 bg-orange-100 rounded-lg">
        <p className="text-sm text-orange-700">
          <strong>Ferramentas selecionadas:</strong> {securityTools.length}/6
          {securityTools.length === 0 && ' - Recomendamos pelo menos 2 ferramentas'}
          {securityTools.length < 3 && securityTools.length > 0 && ' - Considere adicionar mais proteções'}
          {securityTools.length >= 3 && ' - Boa cobertura de segurança'}
        </p>
      </div>
    </div>
  );
};

export default SecurityToolsStep;
