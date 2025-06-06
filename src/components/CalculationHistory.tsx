
import React, { useState } from 'react';
import { History, Trash2, Download, Calendar, FileText } from 'lucide-react';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';
import { ExportService } from '@/services/exportService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CalculationHistory = () => {
  const { history, removeCalculation, clearHistory } = useCalculationHistory();
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredHistory = selectedType === 'all' 
    ? history 
    : history.filter(entry => entry.type === selectedType);

  const handleExport = (entry: any) => {
    ExportService.exportToPDF({
      title: entry.title,
      subtitle: `Cálculo realizado em ${new Date(entry.timestamp).toLocaleString('pt-BR')}`,
      data: entry.data,
      results: entry.result,
      timestamp: new Date(entry.timestamp)
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      freight: 'Frete',
      risk: 'Risco',
      fuel: 'Combustível',
      vehicle: 'Veículo'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      freight: 'bg-orange-100 text-orange-700',
      risk: 'bg-red-100 text-red-700',
      fuel: 'bg-blue-100 text-blue-700',
      vehicle: 'bg-green-100 text-green-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History size={20} />
          Histórico de Cálculos
        </CardTitle>
        
        <div className="flex gap-2 mt-4">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            Todos ({history.length})
          </Button>
          {['freight', 'risk', 'fuel', 'vehicle'].map(type => {
            const count = history.filter(entry => entry.type === type).length;
            return count > 0 ? (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {getTypeLabel(type)} ({count})
              </Button>
            ) : null;
          })}
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum cálculo encontrado</p>
            <p className="text-sm">Realize um cálculo para ver o histórico aqui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map(entry => (
              <div
                key={entry.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(entry.type)}>
                        {getTypeLabel(entry.type)}
                      </Badge>
                      <span className="text-sm font-medium">{entry.title}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar size={14} />
                      {new Date(entry.timestamp).toLocaleString('pt-BR')}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {entry.type === 'freight' && entry.result?.totalFreight && (
                        <span>Valor: R$ {entry.result.totalFreight.toFixed(2)}</span>
                      )}
                      {entry.type === 'fuel' && entry.result?.cost && (
                        <span>Custo: R$ {entry.result.cost}</span>
                      )}
                      {entry.type === 'vehicle' && entry.result?.recommendedVehicle && (
                        <span>Veículo: {entry.result.recommendedVehicle}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(entry)}
                    >
                      <Download size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCalculation(entry.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {history.length > 0 && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={clearHistory}
                  className="w-full"
                >
                  <Trash2 size={16} className="mr-2" />
                  Limpar Histórico
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculationHistory;
