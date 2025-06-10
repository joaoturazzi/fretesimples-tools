
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Diagnostic, AdminStats } from '../types';

export const useAdminData = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchData();
  }, []);

  const stats: AdminStats = {
    totalUsers: profiles.length,
    activeToday: profiles.filter(p => {
      const today = new Date().toDateString();
      return new Date(p.last_activity).toDateString() === today;
    }).length,
    totalCalculations: diagnostics.length,
    highRiskLeads: diagnostics.filter(d => d.risk_level === 'Alto').length
  };

  return {
    profiles,
    diagnostics,
    stats,
    loading,
    refetch: fetchData
  };
};
