-- Migration: Criar estrutura de banco de dados para Trilha de Aprendizado Wellness
-- Data: 2025-01-XX
-- Descrição: Estrutura completa para trilha de aprendizado de distribuidores iniciantes

-- =====================================================
-- 1. TABELA: wellness_trilhas
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_trilhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  ordem INTEGER DEFAULT 0,
  is_ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_trilhas_slug ON wellness_trilhas(slug);
CREATE INDEX IF NOT EXISTS idx_wellness_trilhas_ordem ON wellness_trilhas(ordem);

COMMENT ON TABLE wellness_trilhas IS 'Trilhas de aprendizado disponíveis no Wellness System';
COMMENT ON COLUMN wellness_trilhas.slug IS 'Slug único da trilha (ex: distribuidor-iniciante)';

-- =====================================================
-- 2. TABELA: wellness_modulos
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_modulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id UUID NOT NULL REFERENCES wellness_trilhas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  icone VARCHAR(50), -- Emoji ou nome do ícone
  is_ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_modulos_trilha_id ON wellness_modulos(trilha_id);
CREATE INDEX IF NOT EXISTS idx_wellness_modulos_ordem ON wellness_modulos(ordem);

COMMENT ON TABLE wellness_modulos IS 'Módulos dentro de cada trilha de aprendizado';
COMMENT ON COLUMN wellness_modulos.ordem IS 'Ordem de exibição do módulo dentro da trilha';

-- =====================================================
-- 3. TABELA: wellness_aulas
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id UUID NOT NULL REFERENCES wellness_modulos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL, -- Conteúdo em markdown ou HTML
  tipo VARCHAR(50) DEFAULT 'texto', -- 'texto', 'video', 'checklist', 'script', 'pratica'
  ordem INTEGER NOT NULL DEFAULT 0,
  duracao_minutos INTEGER, -- Duração estimada em minutos
  is_ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_aulas_modulo_id ON wellness_aulas(modulo_id);
CREATE INDEX IF NOT EXISTS idx_wellness_aulas_ordem ON wellness_aulas(ordem);

COMMENT ON TABLE wellness_aulas IS 'Aulas/conteúdos dentro de cada módulo';
COMMENT ON COLUMN wellness_aulas.tipo IS 'Tipo de conteúdo: texto, video, checklist, script, pratica';

-- =====================================================
-- 4. TABELA: wellness_checklists
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id UUID REFERENCES wellness_modulos(id) ON DELETE CASCADE,
  aula_id UUID REFERENCES wellness_aulas(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  is_ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_checklists_modulo_id ON wellness_checklists(modulo_id);
CREATE INDEX IF NOT EXISTS idx_wellness_checklists_aula_id ON wellness_checklists(aula_id);
CREATE INDEX IF NOT EXISTS idx_wellness_checklists_ordem ON wellness_checklists(ordem);

COMMENT ON TABLE wellness_checklists IS 'Itens de checklist associados a módulos ou aulas';

-- =====================================================
-- 5. TABELA: wellness_scripts
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id UUID REFERENCES wellness_modulos(id) ON DELETE CASCADE,
  aula_id UUID REFERENCES wellness_aulas(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL, -- Script completo para copiar
  categoria VARCHAR(100), -- 'abertura', 'diagnostico', 'oferta', 'fechamento', 'objecao', etc
  ordem INTEGER NOT NULL DEFAULT 0,
  is_ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_scripts_modulo_id ON wellness_scripts(modulo_id);
CREATE INDEX IF NOT EXISTS idx_wellness_scripts_aula_id ON wellness_scripts(aula_id);
CREATE INDEX IF NOT EXISTS idx_wellness_scripts_categoria ON wellness_scripts(categoria);

COMMENT ON TABLE wellness_scripts IS 'Scripts prontos para copiar e colar, associados a módulos ou aulas';

-- =====================================================
-- 6. TABELA: wellness_progresso
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trilha_id UUID NOT NULL REFERENCES wellness_trilhas(id) ON DELETE CASCADE,
  modulo_id UUID REFERENCES wellness_modulos(id) ON DELETE CASCADE,
  aula_id UUID REFERENCES wellness_aulas(id) ON DELETE CASCADE,
  checklist_item_id UUID REFERENCES wellness_checklists(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'trilha', 'modulo', 'aula', 'checklist'
  concluido BOOLEAN DEFAULT false,
  progresso_percentual INTEGER DEFAULT 0, -- 0-100
  ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, trilha_id, modulo_id, aula_id, checklist_item_id, tipo)
);

CREATE INDEX IF NOT EXISTS idx_wellness_progresso_user_id ON wellness_progresso(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_progresso_trilha_id ON wellness_progresso(trilha_id);
CREATE INDEX IF NOT EXISTS idx_wellness_progresso_modulo_id ON wellness_progresso(modulo_id);
CREATE INDEX IF NOT EXISTS idx_wellness_progresso_aula_id ON wellness_progresso(aula_id);

COMMENT ON TABLE wellness_progresso IS 'Progresso do usuário na trilha de aprendizado';
COMMENT ON COLUMN wellness_progresso.tipo IS 'Tipo de item: trilha, modulo, aula, checklist';

-- =====================================================
-- 7. TABELA: wellness_anotacoes
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_anotacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trilha_id UUID REFERENCES wellness_trilhas(id) ON DELETE CASCADE,
  modulo_id UUID REFERENCES wellness_modulos(id) ON DELETE CASCADE,
  aula_id UUID REFERENCES wellness_aulas(id) ON DELETE CASCADE,
  titulo VARCHAR(255),
  conteudo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_anotacoes_user_id ON wellness_anotacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_anotacoes_trilha_id ON wellness_anotacoes(trilha_id);
CREATE INDEX IF NOT EXISTS idx_wellness_anotacoes_modulo_id ON wellness_anotacoes(modulo_id);
CREATE INDEX IF NOT EXISTS idx_wellness_anotacoes_aula_id ON wellness_anotacoes(aula_id);

COMMENT ON TABLE wellness_anotacoes IS 'Anotações pessoais do usuário sobre a trilha';

-- =====================================================
-- 8. TABELA: wellness_passo_a_passo_diario
-- =====================================================
CREATE TABLE IF NOT EXISTS wellness_passo_a_passo_diario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id UUID NOT NULL REFERENCES wellness_trilhas(id) ON DELETE CASCADE,
  dia INTEGER NOT NULL, -- Dia da trilha (1, 2, 3, ...)
  modulo_id UUID REFERENCES wellness_modulos(id) ON DELETE CASCADE,
  aula_id UUID REFERENCES wellness_aulas(id) ON DELETE CASCADE,
  tarefa TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  is_ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trilha_id, dia, ordem)
);

CREATE INDEX IF NOT EXISTS idx_wellness_passo_diario_trilha_id ON wellness_passo_a_passo_diario(trilha_id);
CREATE INDEX IF NOT EXISTS idx_wellness_passo_diario_dia ON wellness_passo_a_passo_diario(dia);

COMMENT ON TABLE wellness_passo_a_passo_diario IS 'Tarefas diárias do modo Passo a Passo para cada trilha';

-- =====================================================
-- 9. INSERIR TRILHA INICIAL
-- =====================================================
INSERT INTO wellness_trilhas (nome, descricao, slug, ordem, is_ativo)
VALUES (
  'Distribuidor Iniciante',
  'Trilha completa para novos distribuidores Herbalife, com foco em vender ENERGY (NRG) + ACELERA (Herbal Concentrate), garantindo consumo médio de 50 PV por cliente.',
  'distribuidor-iniciante',
  1,
  true
)
ON CONFLICT (slug) DO NOTHING;

