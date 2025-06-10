
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DetailedMetric {
  date: string;
  tool_type: string;
  usage_count: number;
  unique_users: number;
  completion_rate: number;
}

export interface UsageTrend {
  date: string;
  daily_usage: number;
  daily_users: number;
  usage_growth_percent: number;
  users_growth_percent: number;
}

export interface AdvancedStats {
  totalRevenue: number;
  conversionRate: number;
  avgSessionDuration: number;
  topPerformingTool: string;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  leadsThisMonth: number;
  leadsLastMonth: number;
  growthRate: number;
}

export const useAdvancedMetrics = (dateRange: { start: Date; end: Date }) => {
  const [detailedMetrics, setDetailedMetrics] = useState<DetailedMetric[]>([]);
  const [usageTrends, setUsageTrends] = useState<UsageTrend[]>([]);
  const [advancedStats, setAdvancedStats] = useState<AdvancedStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetailedMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('detailed_metrics')
        .select('*')
        .gte('date', dateRange.start.toISOString())
        .lte('date', dateRange.end.toISOString())
        .order('date', { ascending: false });

      if (error) throw error;
      setDetailedMetrics(data || []);
    } catch (error) {
      console.error('Error fetching detailed metrics:', error);
    }
  };

  const fetchUsageTrends = async () => {
    try {
      const { data, error } = await supabase
        .from('usage_trends')
        .select('*')
        .gte('date', dateRange.start.toISOString())
        .lte('date', dateRange.end.toISOString())
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setUsageTrends(data || []);
    } catch (error) {
      console.error('Error fetching usage trends:', error);
    }
  };

  const fetchAdvancedStats = async () => {
    try {
      // Buscar dados para estatísticas avançadas
      const [profilesData, diagnosticsData, toolUsageData] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('diagnostics').select('*'),
        supabase.from('tool_usage').select('*')
      ]);

      const profiles = profilesData.data || [];
      const diagnostics = diagnosticsData.data || [];
      const toolUsage = toolUsageData.data || [];

      // Calcular distribuição de risco
      const riskCounts = diagnostics.reduce((acc, d) => {
        const level = d.risk_level?.toLowerCase() || 'low';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      // Calcular leads deste mês e do mês passado
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const leadsThisMonth = profiles.filter(p => 
        new Date(p.created_at) >= thisMonth
      ).length;

      const leadsLastMonth = profiles.filter(p => {
        const created = new Date(p.created_at);
        return created >= lastMonth && created < thisMonth;
      }).length;

      // Calcular ferramenta mais usada
      const toolCounts = toolUsage.reduce((acc, t) => {
        acc[t.tool_type] = (acc[t.tool_type] || 0) + 1;
        return acc;
      }, {});

      const topPerformingTool = Object.entries(toolCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A';

      const stats: AdvancedStats = {
        totalRevenue: profiles.length * 100, // Estimativa simples
        conversionRate: profiles.length > 0 ? (diagnostics.length / profiles.length) * 100 : 0,
        avgSessionDuration: 8.5, // Estimativa
        topPerformingTool,
        riskDistribution: {
          low: riskCounts.baixo || 0,
          medium: riskCounts.médio || 0,
          high: riskCounts.alto || 0,
          critical: riskCounts.crítico || 0
        },
        leadsThisMonth,
        leadsLastMonth,
        growthRate: leadsLastMonth > 0 ? 
          ((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100 : 0
      };

      setAdvancedStats(stats);
    } catch (error) {
      console.error('Error fetching advanced stats:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchDetailedMetrics(),
      fetchUsageTrends(),
      fetchAdvancedStats()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  return {
    detailedMetrics,
    usageTrends,
    advancedStats,
    loading,
    refetch: fetchAllData
  };
};
