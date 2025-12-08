-- ============================================
-- TABELA: Links Wellness (Catálogo Oficial)
-- Armazena os 37 Links Wellness oficiais para referência do NOEL e usuários
-- ============================================

CREATE TABLE IF NOT EXISTS wellness_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL, -- Ex: 'calculadora-agua', 'quiz-bem-estar'
  nome TEXT NOT NULL, -- Ex: 'Calculadora de Água'
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
  publico_alvo TEXT, -- Descrição do público-alvo
  quando_usar TEXT, -- Quando usar este link
  script_curto TEXT, -- Script curto para NOEL sugerir
  url_template TEXT, -- Template da URL (se aplicável)
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_wellness_links_categoria ON wellness_links(categoria);
CREATE INDEX IF NOT EXISTS idx_wellness_links_objetivo ON wellness_links(objetivo);
CREATE INDEX IF NOT EXISTS idx_wellness_links_ativo ON wellness_links(ativo);

-- Comentários
COMMENT ON TABLE wellness_links IS 'Catálogo oficial dos 37 Links Wellness do sistema';
COMMENT ON COLUMN wellness_links.codigo IS 'Código único do link (slug)';
COMMENT ON COLUMN wellness_links.script_curto IS 'Script curto para NOEL usar ao sugerir o link';
