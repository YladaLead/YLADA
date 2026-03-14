-- =====================================================
-- Camada semântica de intenção em ylada_diagnosis_answers.
-- Classifica cada resposta por tipo de intenção (dificuldade, objetivo, sintoma, etc.).
-- @see docs/DADOS-INTENCAO-YLADA.md
-- =====================================================

ALTER TABLE ylada_diagnosis_answers
  ADD COLUMN IF NOT EXISTS intent_category TEXT;

CREATE INDEX IF NOT EXISTS idx_ylada_diag_answers_intent ON ylada_diagnosis_answers(intent_category);
CREATE INDEX IF NOT EXISTS idx_ylada_diag_answers_segment_intent ON ylada_diagnosis_answers(segment, intent_category);

COMMENT ON COLUMN ylada_diagnosis_answers.intent_category IS 'Tipo de intenção: dificuldade, objetivo, sintoma, barreira, tentativa, causa, contexto, preferencia.';
