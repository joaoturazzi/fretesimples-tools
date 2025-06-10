
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Diagnostic } from '../types';
import { getRiskColor } from '../utils';

interface DiagnosticsListProps {
  diagnostics: Diagnostic[];
}

const DiagnosticsList: React.FC<DiagnosticsListProps> = ({ diagnostics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnósticos Realizados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {diagnostics.map((diagnostic) => (
            <div key={diagnostic.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{diagnostic.profile?.full_name || 'Usuário Desconhecido'}</h3>
                <p className="text-sm text-gray-600">{diagnostic.profile?.email || 'Email não disponível'}</p>
                <p className="text-sm text-gray-500">
                  Ferramenta: {diagnostic.tool_type}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {diagnostic.risk_level && (
                  <Badge className={getRiskColor(diagnostic.risk_level)}>
                    {diagnostic.risk_level}
                  </Badge>
                )}
                {diagnostic.viability && (
                  <Badge variant="outline">
                    {diagnostic.viability}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticsList;
