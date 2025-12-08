-- ============================================
-- TABELA: Treinos Wellness (1, 3, 5 minutos)
-- Armazena os treinos micro de 1, 3 e 5 minutos
-- ============================================

CREATE TABLE IF NOT EXISTS wellness_treinos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL, -- Ex: 'treino-1min-01', 'treino-3min-05'
  tipo TEXT NOT NULL CHECK (tipo IN ('1min', '3min', '5min')),
  titulo TEXT NOT NULL,
  conceito TEXT NOT NULL, -- Explicação do conceito
  exemplo_pratico TEXT, -- Exemplo prático
  acao_diaria TEXT, -- Ação diária sugerida
  gatilho_noel TEXT, -- Quando NOEL deve sugerir este treino
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_wellness_treinos_tipo ON wellness_treinos(tipo);
CREATE INDEX IF NOT EXISTS idx_wellness_treinos_ativo ON wellness_treinos(ativo);

-- Comentários
COMMENT ON TABLE wellness_treinos IS 'Treinos micro de 1, 3 e 5 minutos para distribuidores';
COMMENT ON COLUMN wellness_treinos.gatilho_noel IS 'Descrição de quando NOEL deve sugerir este treino';
