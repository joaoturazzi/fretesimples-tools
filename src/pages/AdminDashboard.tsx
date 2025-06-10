
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from './admin/hooks/useAdminData';
import StatsCards from './admin/components/StatsCards';
import LeadsList from './admin/components/LeadsList';
import DiagnosticsList from './admin/components/DiagnosticsList';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profiles, diagnostics, stats, loading } = useAdminData();

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="https://i.postimg.cc/C5bzFpj8/Logo-CCI.png" 
            alt="CCI Logo" 
            className="h-10 w-auto object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600">FreteDigital BY CCI</p>
          </div>
        </div>
        <Button onClick={() => navigate('/')} variant="outline">
          Voltar ao Site
        </Button>
      </div>

      <StatsCards stats={stats} />

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnósticos</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <LeadsList profiles={profiles} />
        </TabsContent>

        <TabsContent value="diagnostics">
          <DiagnosticsList diagnostics={diagnostics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
