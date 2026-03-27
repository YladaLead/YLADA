-- =====================================================
-- Pares de intenções no mesmo diagnóstico (metrics_id).
-- Ex.: dificuldade X + objetivo Y no mesmo lead.
-- @see docs/PLANO-IMPLANTACAO-VALUATION-DADOS-INTENCAO.md
-- =====================================================

CREATE OR REPLACE VIEW v_intent_combinations AS
SELECT
  a1.segment,
  a1.intent_category AS intent_category_1,
  a1.question_id AS question_id_1,
  COALESCE(a1.answer_text, a1.answer_value::text) AS answer_display_1,
  a2.intent_category AS intent_category_2,
  a2.question_id AS question_id_2,
  COALESCE(a2.answer_text, a2.answer_value::text) AS answer_display_2,
  COUNT(DISTINCT a1.metrics_id)::bigint AS diagnosis_count
FROM ylada_diagnosis_answers a1
INNER JOIN ylada_diagnosis_answers a2
  ON a1.metrics_id = a2.metrics_id
 AND a1.id < a2.id
WHERE a1.segment IS NOT NULL
  AND a1.intent_category IS NOT NULL
  AND a2.intent_category IS NOT NULL
  AND a1.intent_category <> 'outro'
  AND a2.intent_category <> 'outro'
  AND (a1.answer_text IS NOT NULL OR a1.answer_value IS NOT NULL)
  AND (a2.answer_text IS NOT NULL OR a2.answer_value IS NOT NULL)
GROUP BY
  a1.segment,
  a1.intent_category,
  a1.question_id,
  COALESCE(a1.answer_text, a1.answer_value::text),
  a2.intent_category,
  a2.question_id,
  COALESCE(a2.answer_text, a2.answer_value::text);

COMMENT ON VIEW v_intent_combinations IS
  'Frequência de pares de respostas (duas perguntas distintas) no mesmo diagnóstico. Útil para padrões tipo dificuldade+objetivo.';
