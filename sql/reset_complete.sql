-- ========================================
-- RESET COMPLETO DO SUPABASE
-- ========================================
-- Este script remove TUDO e recria do zero

-- 1. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE IF EXISTS public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.professional_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assessment_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lead_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.system_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS AS POLÍTICAS RLS
DROP POLICY IF EXISTS "Allow public read access" ON public.professionals;
DROP POLICY IF EXISTS "Allow individual insert access" ON public.professionals;
DROP POLICY IF EXISTS "Allow individual update access" ON public.professionals;
DROP POLICY IF EXISTS "Allow individual delete access" ON public.professionals;

DROP POLICY IF EXISTS "Professionals can view their own leads" ON public.leads;
DROP POLICY IF EXISTS "Professionals can insert their own leads" ON public.leads;
DROP POLICY IF EXISTS "Professionals can update their own leads" ON public.leads;
DROP POLICY IF EXISTS "Professionals can delete their own leads" ON public.leads;

DROP POLICY IF EXISTS "Professionals can view their own links" ON public.professional_links;
DROP POLICY IF EXISTS "Professionals can insert their own links" ON public.professional_links;
DROP POLICY IF EXISTS "Professionals can update their own links" ON public.professional_links;
DROP POLICY IF EXISTS "Professionals can delete their own links" ON public.professional_links;

-- 3. REMOVER TODOS OS TRIGGERS
DROP TRIGGER IF EXISTS update_professionals_updated_at ON public.professionals;
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
DROP TRIGGER IF EXISTS update_professional_links_updated_at ON public.professional_links;
DROP TRIGGER IF EXISTS update_assessment_history_updated_at ON public.assessment_history;
DROP TRIGGER IF EXISTS update_lead_notes_updated_at ON public.lead_notes;
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;

-- 4. REMOVER TODAS AS TABELAS (ORDEM IMPORTANTE POR FOREIGN KEYS)
DROP TABLE IF EXISTS public.professional_links CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.assessment_history CASCADE;
DROP TABLE IF EXISTS public.lead_notes CASCADE;
DROP TABLE IF EXISTS public.professionals CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 5. REMOVER FUNÇÃO DE TRIGGER
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 6. HABILITAR EXTENSÃO UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 7. RECRIAR TABELA PROFESSIONALS (PRINCIPAL)
CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialty TEXT,
  company TEXT,
  bio TEXT,
  profile_image TEXT,
  whatsapp_link TEXT,
  website_link TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. RECRIAR TABELA LEADS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'new',
  tool_used TEXT,
  results JSONB,
  recommendations JSONB,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. RECRIAR TABELA PROFESSIONAL_LINKS
CREATE TABLE public.professional_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  tool_name TEXT NOT NULL,
  custom_url TEXT UNIQUE NOT NULL,
  cta_text TEXT DEFAULT 'Falar com Especialista',
  redirect_url TEXT NOT NULL,
  custom_message TEXT, -- Mensagem personalizada antes do botão
  redirect_type TEXT DEFAULT 'whatsapp', -- whatsapp, website, instagram, etc.
  secure_id TEXT UNIQUE NOT NULL, -- ID único para proteção
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE,
  custom_styles JSONB,
  custom_logo_url TEXT,
  custom_header_text TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. RECRIAR FUNÇÃO DE TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. RECRIAR TRIGGERS
CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON public.professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_links_updated_at
  BEFORE UPDATE ON public.professional_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 12. HABILITAR RLS APENAS PARA PROFESSIONALS
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- 13. CRIAR POLÍTICAS RLS SIMPLES
CREATE POLICY "Allow public read access" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "Allow individual insert access" ON public.professionals FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow individual update access" ON public.professionals FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow individual delete access" ON public.professionals FOR DELETE USING (auth.uid() = id);

-- 14. INSERIR DADOS DE TESTE (OPCIONAL)
-- INSERT INTO public.professionals (id, name, email, phone, specialty, company) 
-- VALUES (
--   '1f3cad50-5f2d-4ab8-919c-465e09b83b03',
--   'Andre Faula',
--   'faulaandre@gmail.com',
--   '+5511999999999',
--   'Nutricionista',
--   'Clínica Vida Saudável'
-- );

-- ========================================
-- RESET COMPLETO FINALIZADO!
-- ========================================
-- Agora você pode:
-- 1. Fazer novo cadastro
-- 2. Fazer login
-- 3. Acessar dashboard
-- ========================================
