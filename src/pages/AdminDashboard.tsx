
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from './admin/hooks/useAdminData';
import StatsCards from './admin/components/StatsCards';
import LeadsList from './admin/components/LeadsList';
import DiagnosticsList from './admin/components/DiagnosticsList';
import NotificationCenter from './admin/components/NotificationCenter';
import AdvancedDashboard from './admin/components/AdvancedDashboard';
import ReportGenerator from './admin/components/ReportGenerator';
import { Bell, BarChart3, FileText, Users, Calculator } from 'lucide-react';
import { useNotifications } from './admin/hooks/useNotifications';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profiles, diagnostics, stats, loading } = useAdminData();
  const { unreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user || !user.email?.includes('@cci.com.br')) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <img 
            src="https://i.postimg.cc/C5bzFpj8/Logo-CCI.png" 
            alt="CCI Logo" 
            className="h-12 w-auto object-contain mx-auto mb-4"
          />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="https://i.postimg.cc/C5bzFpj8/Logo-CCI.png" 
            alt="CCI Logo" 
            className="h-10 w-auto object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600">FreteDigital BY CCI - Sistema Avançado de Gestão</p>
          </div>
        </div>
        <Button onClick={() => navigate('/')} variant="outline">
          Voltar ao Site
        </Button>
      </div>

      <StatsCards stats={stats} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Diagnósticos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 relative">
            <Bell className="h-4 w-4" />
            Notificações
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AdvancedDashboard />
            </div>
            <div>
              <NotificationCenter />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leads">
          <LeadsList profiles={profiles} />
        </TabsContent>

        <TabsContent value="diagnostics">
          <DiagnosticsList diagnostics={diagnostics} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationCenter />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedDashboard />
        </TabsContent>

        <TabsContent value="reports">
          <ReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
