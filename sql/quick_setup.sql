-- SCRIPT SIMPLES PARA CRIAR TABELAS SEM CONFLITOS
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE IF EXISTS professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS professional_links DISABLE ROW LEVEL SECURITY;

-- 2. CRIAR TABELAS SE NÃO EXISTIREM
CREATE TABLE IF NOT EXISTS professionals (
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

CREATE TABLE IF NOT EXISTS leads (
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

CREATE TABLE IF NOT EXISTS professional_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  tool_name VARCHAR(100) NOT NULL,
  cta_text VARCHAR(200) DEFAULT 'Falar com Especialista',
  redirect_url TEXT NOT NULL,
  custom_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_professionals_email ON professionals(email);
CREATE INDEX IF NOT EXISTS idx_leads_professional_id ON leads(professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_links_professional_id ON professional_links(professional_id);

-- 4. CRIAR FUNÇÃO DE UPDATE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. CRIAR TRIGGERS (apenas se não existirem)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_professionals_updated_at') THEN
        CREATE TRIGGER update_professionals_updated_at 
          BEFORE UPDATE ON professionals 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_leads_updated_at') THEN
        CREATE TRIGGER update_leads_updated_at 
          BEFORE UPDATE ON leads 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_professional_links_updated_at') THEN
        CREATE TRIGGER update_professional_links_updated_at 
          BEFORE UPDATE ON professional_links 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 6. MENSAGEM DE SUCESSO
SELECT 'Tabelas criadas com sucesso! RLS desabilitado para desenvolvimento.' as status;

