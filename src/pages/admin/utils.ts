
export const getLeadStatusColor = (status: string) => {
  switch (status) {
    case 'interessante': return 'bg-green-100 text-green-800';
    case 'ligar': return 'bg-yellow-100 text-yellow-800';
    case 'proposta': return 'bg-blue-100 text-blue-800';
    case 'sem_perfil': return 'bg-gray-100 text-gray-800';
    default: return 'bg-orange-100 text-orange-800';
  }
};

export const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Alto': return 'bg-red-100 text-red-800';
    case 'Médio': return 'bg-yellow-100 text-yellow-800';
    case 'Baixo': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
