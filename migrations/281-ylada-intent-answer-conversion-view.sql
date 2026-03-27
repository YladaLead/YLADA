-- =====================================================
-- Intenção × conversão (clique WhatsApp) por resposta.
-- Base para valuation: quais respostas correlacionam com CTA.
-- @see docs/PLANO-IMPLANTACAO-VALUATION-DADOS-INTENCAO.md
-- =====================================================

CREATE OR REPLACE VIEW v_intent_answer_conversion AS
SELECT
  a.segment,
  a.intent_category,
  a.question_id,
  COALESCE(a.answer_text, a.answer_value::text) AS answer_display,
  COUNT(*)::bigint AS answer_rows,
  COUNT(DISTINCT a.metrics_id)::bigint AS diagnoses,
  COUNT(DISTINCT a.metrics_id) FILTER (WHERE m.clicked_whatsapp)::bigint AS diagnoses_clicked,
  ROUND(
    100.0 * COUNT(DISTINCT a.metrics_id) FILTER (WHERE m.clicked_whatsapp)
    / NULLIF(COUNT(DISTINCT a.metrics_id), 0),
    2
  ) AS conversion_pct
FROM ylada_diagnosis_answers a
INNER JOIN ylada_diagnosis_metrics m ON m.id = a.metrics_id
WHERE a.segment IS NOT NULL
  AND a.intent_category IS NOT NULL
  AND a.intent_category != 'outro'
  AND (a.answer_text IS NOT NULL OR a.answer_value IS NOT NULL)
GROUP BY
  a.segment,
  a.intent_category,
  a.question_id,
  COALESCE(a.answer_text, a.answer_value::text);

COMMENT ON VIEW v_intent_answer_conversion IS
  'Taxa de clique WhatsApp por segmento, categoria de intenção e resposta (via metrics_id). Amostras pequenas: interpretar conversion_pct com cautela.';
