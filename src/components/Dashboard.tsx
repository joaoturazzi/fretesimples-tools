
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';
import CalculationHistory from './CalculationHistory';

const Dashboard = () => {
  const { history } = useCalculationHistory();

  const stats = {
    total: history.length,
    freight: history.filter(h => h.type === 'freight').length,
    risk: history.filter(h => h.type === 'risk').length,
    fuel: history.filter(h => h.type === 'fuel').length,
    vehicle: history.filter(h => h.type === 'vehicle').length,
    thisWeek: history.filter(h => {
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return h.timestamp > weekAgo;
    }).length
  };

  const recentCalculations = history.slice(0, 5);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Acompanhe seus cálculos e relatórios</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cálculos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisWeek} esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cálculos de Frete</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.freight}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.freight / stats.total) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cálculos de Risco</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.risk}</div>
            <p className="text-xs text-muted-foreground">
              {stats.fuel + stats.vehicle} outros tipos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Novos cálculos realizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="history">Histórico Completo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cálculos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentCalculations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Nenhum cálculo realizado ainda</p>
                  <p className="text-sm">Use as calculadoras para ver os resultados aqui</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCalculations.map(calc => (
                    <div key={calc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {calc.type === 'freight' ? 'Frete' : 
                           calc.type === 'risk' ? 'Risco' :
                           calc.type === 'fuel' ? 'Combustível' : 'Veículo'}
                        </Badge>
                        <div>
                          <p className="font-medium">{calc.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(calc.timestamp).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {calc.type === 'freight' && calc.result?.totalFreight && (
                          <p className="font-semibold text-green-600">
                            R$ {calc.result.totalFreight.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <CalculationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
