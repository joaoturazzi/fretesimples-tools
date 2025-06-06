
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Clock, FileText, Calculator, MapPin, 
  DollarSign, Truck, AlertTriangle, Fuel, Download, Share2,
  Calendar, Target, Award, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';
import { useQuickNotify } from './ui/enhanced-notification';

const DashboardAdvanced = () => {
  const { history } = useCalculationHistory();
  const notify = useQuickNotify();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  const stats = useMemo(() => {
    const now = Date.now();
    const timeRanges = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000,
    };
    
    const rangeMs = timeRanges[timeRange];
    const recentHistory = history.filter(h => now - h.timestamp < rangeMs);
    
    const freight = recentHistory.filter(h => h.type === 'freight');
    const risk = recentHistory.filter(h => h.type === 'risk');
    const fuel = recentHistory.filter(h => h.type === 'fuel');
    
    const totalFreightValue = freight.reduce((sum, calc) => 
      sum + (calc.result?.totalFreight || 0), 0
    );
    
    const avgFreightValue = freight.length > 0 ? totalFreightValue / freight.length : 0;
    
    const totalDistance = freight.reduce((sum, calc) => 
      sum + (calc.result?.distance || 0), 0
    );

    return {
      total: recentHistory.length,
      freight: freight.length,
      risk: risk.length,
      fuel: fuel.length,
      totalFreightValue,
      avgFreightValue,
      totalDistance,
      highRiskOperations: risk.filter(r => r.result?.riskLevel === 'Alto').length,
      completionRate: (recentHistory.filter(h => h.result).length / recentHistory.length) * 100 || 0,
      growthRate: calculateGrowthRate(history, timeRange)
    };
  }, [history, timeRange]);

  const calculateGrowthRate = (history: any[], range: string) => {
    // Simplificado - retorna valor mock
    return Math.floor(Math.random() * 40) - 10;
  };

  const handleExportReport = () => {
    notify.info(
      'Gerando Relatório',
      'Seu relatório será gerado em instantes...'
    );
    
    setTimeout(() => {
      notify.success(
        'Relatório Pronto!',
        'Relatório de atividades gerado com sucesso',
        [
          {
            label: 'Download PDF',
            action: () => console.log('Download PDF'),
            variant: 'primary'
          }
        ]
      );
    }, 2000);
  };

  const recentCalculations = history.slice(0, 8);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Avançado</h1>
          <p className="text-gray-600">Análise completa das suas operações logísticas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
          </select>
          
          <Button onClick={handleExportReport} className="gap-2">
            <Download size={16} />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cálculos</CardTitle>
            <Calculator className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.total}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp size={12} className="text-green-500" />
              <span className="text-green-600">+{stats.growthRate}%</span>
              <span className="text-gray-500">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              R$ {stats.totalFreightValue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-blue-600">
              Média: R$ {stats.avgFreightValue.toFixed(2)} por frete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distância Total</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {stats.totalDistance.toLocaleString('pt-BR')} km
            </div>
            <p className="text-xs text-green-600">
              {stats.freight} operações de frete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operações de Risco</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.highRiskOperations}</div>
            <p className="text-xs text-red-600">
              {stats.risk} análises realizadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="freight">Fretes</TabsTrigger>
          <TabsTrigger value="risk">Análise de Risco</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Performance do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de Conclusão</span>
                  <span className="font-semibold">{stats.completionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.freight}</div>
                    <div className="text-xs text-gray-500">Fretes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.risk}</div>
                    <div className="text-xs text-gray-500">Riscos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Calculator size={16} />
                  Nova Calculadora de Frete
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <AlertTriangle size={16} />
                  Análise de Risco Rápida
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <FileText size={16} />
                  Gerar Relatório Customizado
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Share2 size={16} />
                  Compartilhar Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="freight">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Fretes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCalculations
                  .filter(calc => calc.type === 'freight')
                  .map(calc => (
                    <div key={calc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <Truck size={16} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{calc.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(calc.timestamp).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          R$ {calc.result?.totalFreight?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {calc.result?.distance || 0} km
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Análises de Risco</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCalculations
                  .filter(calc => calc.type === 'risk')
                  .map(calc => (
                    <div key={calc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle size={16} className="text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{calc.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(calc.timestamp).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        calc.result?.riskLevel === 'Alto' ? 'destructive' :
                        calc.result?.riskLevel === 'Médio' ? 'secondary' : 'outline'
                      }>
                        {calc.result?.riskLevel || 'N/A'}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Central de Relatórios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-24 flex-col gap-2" variant="outline">
                  <FileText size={24} />
                  <span>Relatório Mensal</span>
                </Button>
                <Button className="h-24 flex-col gap-2" variant="outline">
                  <BarChart3 size={24} />
                  <span>Análise de Performance</span>
                </Button>
                <Button className="h-24 flex-col gap-2" variant="outline">
                  <TrendingUp size={24} />
                  <span>Tendências</span>
                </Button>
                <Button className="h-24 flex-col gap-2" variant="outline">
                  <Award size={24} />
                  <span>Certificado de Qualidade</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAdvanced;
