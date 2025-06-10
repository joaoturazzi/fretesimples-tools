
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAdvancedMetrics } from '../hooks/useAdvancedMetrics';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdvancedDashboard = () => {
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });

  const { detailedMetrics, usageTrends, advancedStats, loading } = useAdvancedMetrics(dateRange);

  const exportToPDF = () => {
    // Implementação de exportação será feita posteriormente
    console.log('Exportando relatório em PDF...');
  };

  const exportToExcel = () => {
    // Implementação de exportação será feita posteriormente
    console.log('Exportando relatório em Excel...');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard Avançado</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando métricas avançadas...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981'];

  const riskData = advancedStats ? [
    { name: 'Baixo', value: advancedStats.riskDistribution.low, color: '#10B981' },
    { name: 'Médio', value: advancedStats.riskDistribution.medium, color: '#F59E0B' },
    { name: 'Alto', value: advancedStats.riskDistribution.high, color: '#EF4444' },
    { name: 'Crítico', value: advancedStats.riskDistribution.critical, color: '#DC2626' }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Avançado</h2>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(dateRange.start, 'dd/MM/yyyy', { locale: ptBR })} - {format(dateRange.end, 'dd/MM/yyyy', { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.start, to: dateRange.end }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ start: range.from, end: range.to });
                  }
                }}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* KPIs Avançados */}
      {advancedStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Estimada</p>
                  <p className="text-2xl font-bold">R$ {advancedStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+{advancedStats.growthRate.toFixed(1)}% vs mês anterior</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Conversão</p>
                  <p className="text-2xl font-bold">{advancedStats.conversionRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">Leads → Diagnósticos</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Duração Média</p>
                  <p className="text-2xl font-bold">{advancedStats.avgSessionDuration} min</p>
                  <p className="text-xs text-gray-600">Por sessão</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ferramenta Top</p>
                  <p className="text-lg font-bold">{advancedStats.topPerformingTool}</p>
                  <p className="text-xs text-gray-600">Mais utilizada</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de Uso */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Uso Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageTrends.slice(0, 15).reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
                  formatter={(value, name) => [
                    value,
                    name === 'daily_usage' ? 'Uso Diário' : 'Usuários Únicos'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="daily_usage" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="daily_usage"
                />
                <Line 
                  type="monotone" 
                  dataKey="daily_users" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="daily_users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Risco */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Uso por Ferramenta */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Uso por Ferramenta (Últimos 30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={detailedMetrics.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="tool_type" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [
                    value,
                    name === 'usage_count' ? 'Total de Usos' : 'Usuários Únicos'
                  ]}
                />
                <Bar dataKey="usage_count" fill="#3B82F6" name="usage_count" />
                <Bar dataKey="unique_users" fill="#10B981" name="unique_users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
