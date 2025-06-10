
import React from 'react';
import { Users, Clock } from 'lucide-react';

interface OperationalConfigStepProps {
  contractType: string;
  setContractType: (value: string) => void;
  travelTime: string;
  setTravelTime: (value: string) => void;
}

const OperationalConfigStep: React.FC<OperationalConfigStepProps> = ({
  contractType,
  setContractType,
  travelTime,
  setTravelTime
}) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <Users size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Configuração Operacional</h3>
          <p className="text-sm text-gray-600">Tipo de contratação e horário da viagem</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="calculator-label">
            <Users size={16} className="calculator-label-icon" />
            Tipo de Contratação
          </label>
          <select
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            className="select-field"
          >
            <option value="frota_propria">Frota Própria</option>
            <option value="agregado">Motorista Agregado</option>
            <option value="terceiro">Terceiro/Aplicativo</option>
          </select>
          <p className="form-helper">
            {contractType === 'frota_propria' && 'Menor risco - Controle total'}
            {contractType === 'agregado' && 'Risco moderado - Motorista conhecido'}
            {contractType === 'terceiro' && 'Maior risco - Motorista desconhecido'}
          </p>
        </div>

        <div>
          <label className="calculator-label">
            <Clock size={16} className="calculator-label-icon" />
            Horário Previsto da Viagem
          </label>
          <select
            value={travelTime}
            onChange={(e) => setTravelTime(e.target.value)}
            className="select-field"
          >
            <option value="manha">Manhã (6h - 12h)</option>
            <option value="tarde">Tarde (12h - 18h)</option>
            <option value="noite">Noite (18h - 24h)</option>
            <option value="madrugada">Madrugada (0h - 6h)</option>
          </select>
          <p className="form-helper">
            {travelTime === 'manha' && 'Horário ideal - Menor risco'}
            {travelTime === 'tarde' && 'Horário seguro - Baixo risco'}
            {travelTime === 'noite' && 'Atenção - Risco moderado'}
            {travelTime === 'madrugada' && 'Alto risco - Não recomendado'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OperationalConfigStep;
