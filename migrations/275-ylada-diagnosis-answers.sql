-- =====================================================
-- Camada 2 — Dados de Comportamento dos Leads (Diagnosis Data)
-- Armazena cada resposta por pergunta para análise de padrões comportamentais.
-- Base do dataset estratégico: dores mais comuns, perfis, tendências por nicho.
-- @see docs/ARQUITETURA-DADOS-COMPORTAMENTAIS-YLADA.md
-- =====================================================

CREATE TABLE IF NOT EXISTS ylada_diagnosis_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metrics_id UUID NOT NULL REFERENCES ylada_diagnosis_metrics(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES ylada_links(id) ON DELETE CASCADE,
  segment TEXT,
  architecture TEXT,
  -- Pergunta
  question_id TEXT NOT NULL,
  question_label TEXT,
  -- Resposta (anonimizada, sem dados pessoais)
  answer_value JSONB NOT NULL,
  answer_text TEXT,
  answer_index INTEGER,
  theme TEXT,
  objective TEXT
);

CREATE INDEX IF NOT EXISTS idx_ylada_diag_answers_metrics ON ylada_diagnosis_answers(metrics_id);
CREATE INDEX IF NOT EXISTS idx_ylada_diag_answers_link ON ylada_diagnosis_answers(link_id);
CREATE INDEX IF NOT EXISTS idx_ylada_diag_answers_segment ON ylada_diagnosis_answers(segment);
CREATE INDEX IF NOT EXISTS idx_ylada_diag_answers_question ON ylada_diagnosis_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_ylada_diag_answers_created ON ylada_diagnosis_answers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ylada_diag_answers_segment_question ON ylada_diagnosis_answers(segment, question_id);

COMMENT ON TABLE ylada_diagnosis_answers IS 'Respostas por pergunta de cada diagnóstico. Base para análise comportamental: padrões, dores comuns, perfis por nicho.';
COMMENT ON COLUMN ylada_diagnosis_answers.question_id IS 'ID da pergunta (q1, q2, symptoms, barriers, etc.).';
COMMENT ON COLUMN ylada_diagnosis_answers.answer_value IS 'Valor bruto: número, string ou array (ex.: [0,1,2] para multi-select).';
COMMENT ON COLUMN ylada_diagnosis_answers.answer_text IS 'Texto da opção escolhida quando disponível (ex.: ansiedade, dor).';
COMMENT ON COLUMN ylada_diagnosis_answers.answer_index IS 'Índice 0-based da opção em perguntas de múltipla escolha.';

-- RLS: leitura apenas pelo dono do link (via join)
ALTER TABLE ylada_diagnosis_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY ylada_diag_answers_select ON ylada_diagnosis_answers
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM ylada_links l WHERE l.id = link_id AND l.user_id = auth.uid()));
