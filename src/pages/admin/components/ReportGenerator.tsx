
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, FileSpreadsheet, CalendarIcon, Filter } from 'lucide-react';
import { format, subDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAdvancedMetrics } from '../hooks/useAdvancedMetrics';
import { supabase } from '@/integrations/supabase/client';

interface ReportConfig {
  format: 'pdf' | 'excel';
  dateRange: { start: Date; end: Date };
  includeMetrics: boolean;
  includeLeads: boolean;
  includeDiagnostics: boolean;
  includeCharts: boolean;
  filterByTool?: string;
  filterByRisk?: string;
}

const ReportGenerator = () => {
  const [config, setConfig] = useState<ReportConfig>({
    format: 'pdf',
    dateRange: { start: subDays(new Date(), 30), end: new Date() },
    includeMetrics: true,
    includeLeads: true,
    includeDiagnostics: true,
    includeCharts: true
  });

  const [generating, setGenerating] = useState(false);
  const { advancedStats } = useAdvancedMetrics(config.dateRange);

  const presetDateRanges = [
    {
      label: 'Últimos 7 dias',
      range: { start: subDays(new Date(), 7), end: new Date() }
    },
    {
      label: 'Últimos 30 dias',
      range: { start: subDays(new Date(), 30), end: new Date() }
    },
    {
      label: 'Últimos 3 meses',
      range: { start: subMonths(new Date(), 3), end: new Date() }
    },
    {
      label: 'Este ano',
      range: { start: new Date(new Date().getFullYear(), 0, 1), end: new Date() }
    }
  ];

  const generateReport = async () => {
    setGenerating(true);
    
    try {
      // Buscar dados necessários
      const queries = [];
      
      if (config.includeLeads) {
        queries.push(
          supabase
            .from('profiles')
            .select('*')
            .gte('created_at', config.dateRange.start.toISOString())
            .lte('created_at', config.dateRange.end.toISOString())
        );
      }
      
      if (config.includeDiagnostics) {
        let query = supabase
          .from('diagnostics')
          .select('*, profiles!inner(*)')
          .gte('created_at', config.dateRange.start.toISOString())
          .lte('created_at', config.dateRange.end.toISOString());
          
        if (config.filterByTool) {
          query = query.eq('tool_type', config.filterByTool);
        }
        
        if (config.filterByRisk) {
          query = query.eq('risk_level', config.filterByRisk);
        }
        
        queries.push(query);
      }

      const results = await Promise.all(queries);
      
      // Simular geração do relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (config.format === 'pdf') {
        // Aqui você implementaria a geração de PDF usando jsPDF
        console.log('Gerando relatório PDF com dados:', results);
        
        // Simulação de download
        const blob = new Blob(['Relatório PDF simulado'], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        
      } else {
        // Aqui você implementaria a geração de Excel
        console.log('Gerando relatório Excel com dados:', results);
        
        // Simulação de download
        const blob = new Blob(['Relatório Excel simulado'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      }
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gerador de Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formato do Relatório */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Formato do Relatório</label>
          <Select
            value={config.format}
            onValueChange={(value: 'pdf' | 'excel') => 
              setConfig(prev => ({ ...prev, format: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Período */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Período</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {presetDateRanges.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => setConfig(prev => ({ ...prev, dateRange: preset.range }))}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(config.dateRange.start, 'dd/MM/yyyy', { locale: ptBR })} - {format(config.dateRange.end, 'dd/MM/yyyy', { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{ from: config.dateRange.start, to: config.dateRange.end }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setConfig(prev => ({ 
                      ...prev, 
                      dateRange: { start: range.from, end: range.to } 
                    }));
                  }
                }}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Seções do Relatório */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Seções do Relatório</label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="metrics"
                checked={config.includeMetrics}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ ...prev, includeMetrics: !!checked }))
                }
              />
              <label htmlFor="metrics" className="text-sm">Métricas e KPIs</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="leads"
                checked={config.includeLeads}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ ...prev, includeLeads: !!checked }))
                }
              />
              <label htmlFor="leads" className="text-sm">Lista de Leads</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diagnostics"
                checked={config.includeDiagnostics}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ ...prev, includeDiagnostics: !!checked }))
                }
              />
              <label htmlFor="diagnostics" className="text-sm">Diagnósticos</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="charts"
                checked={config.includeCharts}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ ...prev, includeCharts: !!checked }))
                }
              />
              <label htmlFor="charts" className="text-sm">Gráficos e Visualizações</label>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600">Ferramenta</label>
              <Select
                value={config.filterByTool || ''}
                onValueChange={(value) => 
                  setConfig(prev => ({ ...prev, filterByTool: value || undefined }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as ferramentas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as ferramentas</SelectItem>
                  <SelectItem value="freight">Calculadora de Frete</SelectItem>
                  <SelectItem value="risk">Análise de Risco</SelectItem>
                  <SelectItem value="profit">Simulador de Lucro</SelectItem>
                  <SelectItem value="fuel">Calculadora de Combustível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-gray-600">Nível de Risco</label>
              <Select
                value={config.filterByRisk || ''}
                onValueChange={(value) => 
                  setConfig(prev => ({ ...prev, filterByRisk: value || undefined }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os níveis</SelectItem>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Botão de Geração */}
        <Button
          onClick={generateReport}
          disabled={generating}
          className="w-full"
          size="lg"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Gerando Relatório...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Gerar Relatório {config.format.toUpperCase()}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
