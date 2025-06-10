
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calculator, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  company: string;
  created_at: string;
  last_activity: string;
  lead_status: string;
}

interface Diagnostic {
  id: string;
  tool_type: string;
  risk_level: string;
  viability: string;
  created_at: string;
  user_id: string;
  profile: Profile | null;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.email?.includes('@cci.com.br')) {
      navigate('/');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      // Buscar perfis
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Buscar diagnósticos
      const { data: diagnosticsData } = await supabase
        .from('diagnostics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Buscar perfis dos diagnósticos separadamente
      const diagnosticsWithProfiles = await Promise.all(
        (diagnosticsData || []).map(async (diagnostic) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', diagnostic.user_id)
            .single();

          return {
            ...diagnostic,
            profile: profileData || null
          };
        })
      );

      setProfiles(profilesData || []);
      setDiagnostics(diagnosticsWithProfiles);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'interessante': return 'bg-green-100 text-green-800';
      case 'ligar': return 'bg-yellow-100 text-yellow-800';
      case 'proposta': return 'bg-blue-100 text-blue-800';
      case 'sem_perfil': return 'bg-gray-100 text-gray-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Alto': return 'bg-red-100 text-red-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Baixo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  const stats = {
    totalUsers: profiles.length,
    activeToday: profiles.filter(p => {
      const today = new Date().toDateString();
      return new Date(p.last_activity).toDateString() === today;
    }).length,
    totalCalculations: diagnostics.length,
    highRiskLeads: diagnostics.filter(d => d.risk_level === 'Alto').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Painel Administrativo CCI</h1>
        <Button onClick={() => navigate('/')}>Voltar ao Site</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos Hoje</p>
                <p className="text-2xl font-bold">{stats.activeToday}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Cálculos</p>
                <p className="text-2xl font-bold">{stats.totalCalculations}</p>
              </div>
              <Calculator className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Alto Risco</p>
                <p className="text-2xl font-bold">{stats.highRiskLeads}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnósticos</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Leads Capturados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{profile.full_name}</h3>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                      {profile.company && (
                        <p className="text-sm text-gray-500">{profile.company}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Cadastrado: {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getLeadStatusColor(profile.lead_status)}>
                        {profile.lead_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
