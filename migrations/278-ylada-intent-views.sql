-- =====================================================
-- Views para analytics de dados de intenção.
-- Facilita consultas: respostas mais frequentes, combinações, tendências.
-- @see docs/DADOS-INTENCAO-YLADA.md
-- =====================================================

-- Respostas mais frequentes por segmento e categoria de intenção
CREATE OR REPLACE VIEW v_intent_answers_by_segment AS
SELECT
  segment,
  intent_category,
  question_id,
  COALESCE(answer_text, answer_value::text) AS answer_display,
  count(*) AS answer_count,
  count(DISTINCT metrics_id) AS diagnosis_count
FROM ylada_diagnosis_answers
WHERE segment IS NOT NULL
  AND intent_category IS NOT NULL
  AND (answer_text IS NOT NULL OR answer_value IS NOT NULL)
GROUP BY segment, intent_category, question_id, COALESCE(answer_text, answer_value::text)
ORDER BY segment, intent_category, answer_count DESC;

COMMENT ON VIEW v_intent_answers_by_segment IS 'Respostas mais frequentes por segmento e tipo de intenção. Ex.: dificuldades mais comuns em emagrecimento.';

-- Top respostas por segmento (para Noel e relatórios)
CREATE OR REPLACE VIEW v_intent_top_by_segment AS
SELECT
  segment,
  intent_category,
  COALESCE(answer_text, answer_value::text) AS answer_display,
  count(*) AS cnt,
  row_number() OVER (PARTITION BY segment, intent_category ORDER BY count(*) DESC) AS rank
FROM ylada_diagnosis_answers
WHERE segment IS NOT NULL
  AND intent_category IS NOT NULL
  AND intent_category != 'outro'
  AND (answer_text IS NOT NULL OR answer_value IS NOT NULL)
GROUP BY segment, intent_category, COALESCE(answer_text, answer_value::text);

COMMENT ON VIEW v_intent_top_by_segment IS 'Ranking de respostas por segmento e categoria. Útil para insights do Noel.';

-- Evolução mensal de respostas por segmento
CREATE OR REPLACE VIEW v_intent_trends_monthly AS
SELECT
  date_trunc('month', created_at)::date AS month_ref,
  segment,
  intent_category,
  count(*) AS answer_count,
  count(DISTINCT metrics_id) AS diagnosis_count
FROM ylada_diagnosis_answers
WHERE segment IS NOT NULL
  AND intent_category IS NOT NULL
GROUP BY date_trunc('month', created_at), segment, intent_category
ORDER BY month_ref DESC, segment, intent_category;

COMMENT ON VIEW v_intent_trends_monthly IS 'Evolução mensal de intenções por segmento. Tendências de mercado.';
