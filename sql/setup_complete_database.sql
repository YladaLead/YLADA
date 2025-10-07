-- SQL para criar todas as tabelas necessárias no Supabase
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. Criar tabela de profissionais
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

-- 2. Criar tabela de leads
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

-- 3. Criar tabela de links personalizados
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

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_links ENABLE ROW LEVEL SECURITY;

-- 5. Políticas para profissionais
CREATE POLICY "Professionals can manage their own data" ON professionals
  FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "Professionals can manage their own leads" ON leads
  FOR ALL USING (auth.uid()::text = professional_id::text);

CREATE POLICY "Professionals can manage their own links" ON professional_links
  FOR ALL USING (auth.uid()::text = professional_id::text);

-- 6. Política para inserção de leads (público pode criar leads)
CREATE POLICY "Anyone can create leads" ON leads
  FOR INSERT WITH CHECK (true);

-- 7. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_professionals_email ON professionals(email);
CREATE INDEX IF NOT EXISTS idx_leads_professional_id ON leads(professional_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_professional_links_professional_id ON professional_links(professional_id);

-- 8. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Triggers para atualizar updated_at
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

