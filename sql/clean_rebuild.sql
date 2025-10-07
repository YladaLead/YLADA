-- SOLUÇÃO DEFINITIVA: Limpar tudo e reconstruir
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. REMOVER TODAS AS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "Professionals can manage their own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can insert their own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can read their own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can update their own data" ON professionals;
DROP POLICY IF EXISTS "Professionals can delete their own data" ON professionals;

DROP POLICY IF EXISTS "Professionals can manage their own leads" ON leads;
DROP POLICY IF EXISTS "Professionals can read their own leads" ON leads;
DROP POLICY IF EXISTS "Professionals can update their own leads" ON leads;
DROP POLICY IF EXISTS "Anyone can create leads" ON leads;

DROP POLICY IF EXISTS "Professionals can manage their own links" ON professional_links;
DROP POLICY IF EXISTS "Professionals can insert their own links" ON professional_links;
DROP POLICY IF EXISTS "Professionals can read their own links" ON professional_links;
DROP POLICY IF EXISTS "Professionals can update their own links" ON professional_links;
DROP POLICY IF EXISTS "Professionals can delete their own links" ON professional_links;

-- 2. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE IF EXISTS professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS professional_links DISABLE ROW LEVEL SECURITY;

-- 3. REMOVER TRIGGERS EXISTENTES
DROP TRIGGER IF EXISTS update_professionals_updated_at ON professionals;
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
DROP TRIGGER IF EXISTS update_professional_links_updated_at ON professional_links;

-- 4. RECRIAR TABELAS (DROP E RECREATE)
DROP TABLE IF EXISTS professional_links CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS professionals CASCADE;

-- 5. CRIAR TABELAS NOVAS
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  specialty VARCHAR(255),
  company VARCHAR(255),
  bio TEXT,
  profile_image TEXT,
  whatsapp_link TEXT,
  website_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'new',
  tool_used VARCHAR(100),
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE professional_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  tool_name VARCHAR(100) NOT NULL,
  cta_text VARCHAR(200) DEFAULT 'Falar com Especialista',
  redirect_url TEXT NOT NULL,
  custom_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CRIAR ÍNDICES
CREATE INDEX idx_professionals_email ON professionals(email);
CREATE INDEX idx_leads_professional_id ON leads(professional_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_professional_links_professional_id ON professional_links(professional_id);

-- 7. CRIAR FUNÇÃO DE UPDATE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. CRIAR TRIGGERS
CREATE TRIGGER update_professionals_updated_at 
  BEFORE UPDATE ON professionals 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_links_updated_at 
  BEFORE UPDATE ON professional_links 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 9. MENSAGEM DE SUCESSO
SELECT 'Tabelas criadas com sucesso! RLS desabilitado para desenvolvimento.' as status;

