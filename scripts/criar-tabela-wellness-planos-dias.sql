-- ============================================
-- TABELA: wellness_planos_dias
-- Descrição: Armazena os 90 dias do plano NOEL Wellness
-- ============================================

CREATE TABLE IF NOT EXISTS wellness_planos_dias (
  id                  BIGSERIAL PRIMARY KEY,
  dia                 INTEGER NOT NULL,
  fase                INTEGER NOT NULL CHECK (fase IN (1, 2, 3, 4)),
  titulo              TEXT NOT NULL,
  foco                TEXT NOT NULL,
  microtarefas        JSONB NOT NULL,       -- Array de strings simples
  scripts_sugeridos   JSONB NOT NULL,       -- Array de strings (slugs)
  notificacoes_do_dia JSONB NOT NULL,       -- Array de strings (slugs)
  mensagem_noel       TEXT NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_wellness_planos_dias_dia ON wellness_planos_dias(dia);
CREATE INDEX IF NOT EXISTS idx_wellness_planos_dias_fase ON wellness_planos_dias(fase);
CREATE INDEX IF NOT EXISTS idx_wellness_planos_dias_dia_fase ON wellness_planos_dias(dia, fase);

-- Comentários
COMMENT ON TABLE wellness_planos_dias IS 'Plano completo de 90 dias do sistema NOEL Wellness';
COMMENT ON COLUMN wellness_planos_dias.dia IS 'Número do dia (1 a 90)';
COMMENT ON COLUMN wellness_planos_dias.fase IS 'Fase do plano: 1=Fundamentos, 2=Ritmo, 3=Consistência, 4=Liderança';
COMMENT ON COLUMN wellness_planos_dias.microtarefas IS 'Array JSON de strings com as microtarefas do dia';
COMMENT ON COLUMN wellness_planos_dias.scripts_sugeridos IS 'Array JSON de strings com slugs dos scripts sugeridos';
COMMENT ON COLUMN wellness_planos_dias.notificacoes_do_dia IS 'Array JSON de strings com slugs das notificações do dia';

