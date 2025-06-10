
-- Criar tabela de perfis de usuário estendida
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  lead_status TEXT DEFAULT 'new'
);

-- Criar tabela para armazenar diagnósticos de todas as ferramentas
CREATE TABLE public.diagnostics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_type TEXT NOT NULL, -- 'freight', 'risk', 'profit', 'fuel', etc.
  input_data JSONB NOT NULL, -- dados de entrada da calculadora
  results JSONB NOT NULL, -- resultados calculados
  risk_level TEXT, -- 'Baixo', 'Médio', 'Alto', 'Crítico'
  viability TEXT, -- 'Viável', 'Inviável', 'Atenção'
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para qualificação comercial dos leads
CREATE TABLE public.lead_qualification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'novo', -- 'novo', 'interessante', 'ligar', 'proposta', 'sem_perfil'
  tags TEXT[],
  notes TEXT,
  assigned_to TEXT,
  priority INTEGER DEFAULT 3, -- 1=alta, 2=média, 3=baixa
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Criar tabela para registro de uso de ferramentas
CREATE TABLE public.tool_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_type TEXT NOT NULL,
  session_id TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_qualification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_usage ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para diagnostics
CREATE POLICY "Users can view own diagnostics" ON public.diagnostics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnostics" ON public.diagnostics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para tool_usage
CREATE POLICY "Users can view own tool usage" ON public.tool_usage
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert tool usage" ON public.tool_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Políticas administrativas para CCI (será refinada depois)
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email LIKE '%@cci.com.br'
    )
  );

CREATE POLICY "Admin can view all diagnostics" ON public.diagnostics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email LIKE '%@cci.com.br'
    )
  );

CREATE POLICY "Admin can manage lead qualification" ON public.lead_qualification
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email LIKE '%@cci.com.br'
    )
  );

-- Trigger para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  );
  
  -- Criar entrada inicial na qualificação de leads
  INSERT INTO public.lead_qualification (user_id, status)
  VALUES (NEW.id, 'novo');
  
  RETURN NEW;
END;
$$;

-- Trigger que executa a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar last_activity
CREATE OR REPLACE FUNCTION public.update_last_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles 
  SET last_activity = now() 
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Trigger para atualizar last_activity quando há nova atividade
CREATE TRIGGER on_diagnostic_created
  AFTER INSERT ON public.diagnostics
  FOR EACH ROW EXECUTE FUNCTION public.update_last_activity();

CREATE TRIGGER on_tool_usage_created
  AFTER INSERT ON public.tool_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_last_activity();
