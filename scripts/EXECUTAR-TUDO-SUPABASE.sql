-- ============================================
-- SCRIPT CONSOLIDADO PARA EXECUTAR NO SUPABASE
-- Execute este arquivo completo no Supabase SQL Editor
-- ============================================

-- ============================================
-- PARTE 1: MIGRATIONS (Criar Tabelas)
-- ============================================

-- Migration 013: Tabela wellness_links
CREATE TABLE IF NOT EXISTS wellness_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN (
    'saude-bem-estar',
    'diagnostico-profundo',
    'transformacao-desafios',
    'oportunidade-negocio'
  )),
  objetivo TEXT NOT NULL CHECK (objetivo IN (
    'captacao',
    'diagnostico',
    'engajamento',
    'recrutamento'
  )),
  publico_alvo TEXT,
  quando_usar TEXT,
  script_curto TEXT,
  url_template TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_links_categoria ON wellness_links(categoria);
CREATE INDEX IF NOT EXISTS idx_wellness_links_objetivo ON wellness_links(objetivo);
CREATE INDEX IF NOT EXISTS idx_wellness_links_ativo ON wellness_links(ativo);

-- Migration 014: Tabela wellness_treinos
CREATE TABLE IF NOT EXISTS wellness_treinos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('1min', '3min', '5min')),
  titulo TEXT NOT NULL,
  conceito TEXT NOT NULL,
  exemplo_pratico TEXT,
  acao_diaria TEXT,
  gatilho_noel TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_treinos_tipo ON wellness_treinos(tipo);
CREATE INDEX IF NOT EXISTS idx_wellness_treinos_ativo ON wellness_treinos(ativo);

-- ============================================
-- PARTE 2: SEEDS (Popular Dados)
-- ============================================

-- IMPORTANTE: Os seeds completos estão nos arquivos separados:
-- - scripts/seed-wellness-links-completo.sql
-- - scripts/seed-wellness-treinos-completo.sql
-- - scripts/seed-wellness-scripts-completo.sql
-- - scripts/seed-wellness-fluxos-completo.sql
--
-- Execute cada um deles após executar este arquivo.

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar se as tabelas foram criadas
SELECT 
  'wellness_links' as tabela,
  COUNT(*) as total_registros
FROM wellness_links
UNION ALL
SELECT 
  'wellness_treinos' as tabela,
  COUNT(*) as total_registros
FROM wellness_treinos;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Migrations executadas com sucesso!';
  RAISE NOTICE '📋 Próximo passo: Execute os seeds nos arquivos separados.';
END $$;
