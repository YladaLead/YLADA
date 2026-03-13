-- Tabela diagnosis_insights: alimenta o Noel Analista com dados agregados dos diagnósticos
-- Permite ao Noel falar com base em dados reais (ex.: "68% das pessoas que responderam dizem que não sabem iniciar conversas")
-- Ver: docs/NOEL-ARQUITETURA-IDEAL-YLADA.md

CREATE TABLE IF NOT EXISTS diagnosis_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id UUID NOT NULL,
  answers_count INTEGER NOT NULL DEFAULT 0,
  most_common_answer TEXT,
  conversion_rate NUMERIC(5,4),
  insight_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_insights_diagnostic_id ON diagnosis_insights(diagnostic_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_insights_updated_at ON diagnosis_insights(updated_at DESC);

COMMENT ON TABLE diagnosis_insights IS 'Insights agregados por diagnóstico para o Noel Analista (inteligência coletiva dos diagnósticos respondidos).';
COMMENT ON COLUMN diagnosis_insights.diagnostic_id IS 'ID do diagnóstico/quiz (referência à tabela de diagnósticos do sistema).';
COMMENT ON COLUMN diagnosis_insights.answers_count IS 'Total de respostas recebidas para este diagnóstico.';
COMMENT ON COLUMN diagnosis_insights.most_common_answer IS 'Resposta ou opção mais frequente (texto ou JSONB conforme modelo de respostas).';
COMMENT ON COLUMN diagnosis_insights.conversion_rate IS 'Taxa de conversão (ex.: lead que virou cliente), entre 0 e 1.';
COMMENT ON COLUMN diagnosis_insights.insight_text IS 'Texto de insight gerado para o Noel usar (ex.: "68% disseram que não sabem iniciar conversas com clientes").';
