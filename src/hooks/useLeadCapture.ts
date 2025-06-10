
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useCallback } from 'react';

interface DiagnosticData {
  toolType: string;
  inputData: any;
  results: any;
  riskLevel?: string;
  viability?: string;
  sessionId?: string;
}

export const useLeadCapture = () => {
  const { user } = useAuth();

  const saveDiagnostic = useCallback(async (data: DiagnosticData) => {
    if (!user) {
      console.log('User not authenticated - saving as anonymous session');
      return { error: 'Usuário não autenticado' };
    }

    try {
      // Registrar uso da ferramenta
      await supabase.from('tool_usage').insert({
        user_id: user.id,
        tool_type: data.toolType,
        session_id: data.sessionId,
        completed: true
      });

      // Salvar diagnóstico
      const { error } = await supabase.from('diagnostics').insert({
        user_id: user.id,
        tool_type: data.toolType,
        input_data: data.inputData,
        results: data.results,
        risk_level: data.riskLevel,
        viability: data.viability,
        session_id: data.sessionId
      });

      return { error };
    } catch (error) {
      console.error('Error saving diagnostic:', error);
      return { error };
    }
  }, [user]);

  const trackToolUsage = useCallback(async (toolType: string, sessionId?: string) => {
    try {
      await supabase.from('tool_usage').insert({
        user_id: user?.id || null,
        tool_type: toolType,
        session_id: sessionId,
        completed: false
      });
    } catch (error) {
      console.error('Error tracking tool usage:', error);
    }
  }, [user]);

  return {
    saveDiagnostic,
    trackToolUsage,
    isAuthenticated: !!user
  };
};
