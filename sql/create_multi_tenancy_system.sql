-- Script para criar sistema multi-tenancy de projetos
-- Execute este script no Supabase SQL Editor

-- 1. Criar tabela de projetos
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  domain VARCHAR(100) UNIQUE NOT NULL, -- ex: fitlead, nutri, beauty
  full_domain VARCHAR(200) NOT NULL, -- ex: fitlead.ylada.com
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_type VARCHAR(50) DEFAULT 'fitness',
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Adicionar campo project_id na tabela professionals
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE CASCADE;

-- 3. Adicionar campo project_id na tabela professional_links
ALTER TABLE public.professional_links
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE CASCADE;

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_projects_domain ON projects(domain);
CREATE INDEX IF NOT EXISTS idx_projects_full_domain ON projects(full_domain);
CREATE INDEX IF NOT EXISTS idx_professionals_project_id ON professionals(project_id);
CREATE INDEX IF NOT EXISTS idx_professional_links_project_id ON professional_links(project_id);

-- 5. Habilitar RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS para projetos
CREATE POLICY "Projects are viewable by owner" ON projects
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Projects are manageable by owner" ON projects
  FOR ALL USING (auth.uid() = owner_id);

-- 7. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Trigger para updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- 9. Inserir projeto padrão (FitLead)
INSERT INTO projects (name, domain, full_domain, description, business_type, owner_id)
VALUES (
  'FitLead - Herbalife',
  'fitlead',
  'fitlead.ylada.com',
  'Projeto FitLead para distribuidores Herbalife',
  'fitness',
  (SELECT id FROM auth.users LIMIT 1) -- Substitua pelo ID do admin
) ON CONFLICT (domain) DO NOTHING;

-- 10. Comentários para documentação
COMMENT ON TABLE projects IS 'Tabela de projetos administrativos (multi-tenancy)';
COMMENT ON COLUMN projects.domain IS 'Subdomínio do projeto (ex: fitlead, nutri, beauty)';
COMMENT ON COLUMN projects.full_domain IS 'Domínio completo do projeto (ex: fitlead.ylada.com)';
COMMENT ON COLUMN projects.business_type IS 'Tipo de negócio principal do projeto';
COMMENT ON COLUMN projects.settings IS 'Configurações específicas do projeto em JSON';
