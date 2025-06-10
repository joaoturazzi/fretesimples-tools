
-- Criar tabela de notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'new_lead', 'high_risk', 'follow_up', 'system'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Criar índices para performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Ativar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Admins can view all notifications" 
  ON public.notifications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%@cci.com.br'
    )
  );

CREATE POLICY "Admins can create notifications" 
  ON public.notifications FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%@cci.com.br'
    )
  );

CREATE POLICY "Admins can update notifications" 
  ON public.notifications FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%@cci.com.br'
    )
  );

-- Criar tabela de configurações de alerta
CREATE TABLE public.alert_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  new_leads_enabled BOOLEAN DEFAULT true,
  high_risk_enabled BOOLEAN DEFAULT true,
  follow_up_enabled BOOLEAN DEFAULT true,
  email_frequency TEXT DEFAULT 'immediate', -- 'immediate', 'hourly', 'daily'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage alert settings" 
  ON public.alert_settings FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email LIKE '%@cci.com.br'
    )
  );

-- Criar view para métricas detalhadas
CREATE OR REPLACE VIEW public.detailed_metrics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  tool_type,
  COUNT(*) as usage_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(CASE WHEN completed THEN 1.0 ELSE 0.0 END) as completion_rate
FROM public.tool_usage
GROUP BY DATE_TRUNC('day', created_at), tool_type
ORDER BY date DESC;

-- Criar view para tendências
CREATE OR REPLACE VIEW public.usage_trends AS
WITH daily_stats AS (
  SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as daily_usage,
    COUNT(DISTINCT user_id) as daily_users
  FROM public.tool_usage
  GROUP BY DATE_TRUNC('day', created_at)
),
trend_calc AS (
  SELECT 
    date,
    daily_usage,
    daily_users,
    LAG(daily_usage) OVER (ORDER BY date) as prev_usage,
    LAG(daily_users) OVER (ORDER BY date) as prev_users
  FROM daily_stats
)
SELECT 
  date,
  daily_usage,
  daily_users,
  CASE 
    WHEN prev_usage IS NULL THEN 0
    ELSE ROUND(((daily_usage - prev_usage) * 100.0 / NULLIF(prev_usage, 0))::numeric, 2)
  END as usage_growth_percent,
  CASE 
    WHEN prev_users IS NULL THEN 0
    ELSE ROUND(((daily_users - prev_users) * 100.0 / NULLIF(prev_users, 0))::numeric, 2)
  END as users_growth_percent
FROM trend_calc
ORDER BY date DESC;

-- Função para criar notificação automática
CREATE OR REPLACE FUNCTION public.create_notification(
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (type, title, message, data)
  VALUES (p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Trigger para notificar sobre novos leads
CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Criar notificação para novo lead
  PERFORM public.create_notification(
    'new_lead',
    'Novo Lead Cadastrado',
    'Um novo usuário se cadastrou: ' || NEW.full_name || ' (' || NEW.email || ')',
    jsonb_build_object('user_id', NEW.id, 'email', NEW.email, 'name', NEW.full_name)
  );
  
  RETURN NEW;
END;
$$;

-- Trigger para notificar sobre diagnósticos de alto risco
CREATE OR REPLACE FUNCTION public.notify_high_risk()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile RECORD;
BEGIN
  -- Verificar se é alto risco
  IF NEW.risk_level = 'Alto' THEN
    -- Buscar dados do usuário
    SELECT * INTO user_profile 
    FROM public.profiles 
    WHERE id = NEW.user_id;
    
    -- Criar notificação
    PERFORM public.create_notification(
      'high_risk',
      'Diagnóstico de Alto Risco',
      'Lead ' || COALESCE(user_profile.full_name, 'Desconhecido') || ' tem diagnóstico de alto risco na ferramenta ' || NEW.tool_type,
      jsonb_build_object(
        'user_id', NEW.user_id, 
        'tool_type', NEW.tool_type,
        'risk_level', NEW.risk_level,
        'diagnostic_id', NEW.id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar triggers
DROP TRIGGER IF EXISTS trigger_notify_new_lead ON public.profiles;
CREATE TRIGGER trigger_notify_new_lead
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_lead();

DROP TRIGGER IF EXISTS trigger_notify_high_risk ON public.diagnostics;
CREATE TRIGGER trigger_notify_high_risk
  AFTER INSERT ON public.diagnostics
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_high_risk();
