
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
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Painel Administrativo CCI</h1>
        <Button onClick={() => navigate('/')}>Voltar ao Site</Button>
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
