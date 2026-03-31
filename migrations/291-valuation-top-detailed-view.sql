-- Top respostas com question_id (drill-down / valuation profundo).
-- Depende de v_intent_answers_by_segment (278).

CREATE OR REPLACE VIEW v_intent_top_ranked_detailed AS
SELECT
  segment,
  intent_category,
  question_id,
  answer_display,
  answer_count AS cnt,
  diagnosis_count,
  ROW_NUMBER() OVER (
    PARTITION BY segment, intent_category
    ORDER BY answer_count DESC
  ) AS rank
FROM v_intent_answers_by_segment
WHERE intent_category IS NOT NULL
  AND intent_category <> 'outro';

COMMENT ON VIEW v_intent_top_ranked_detailed IS
  'Ranking por segmento e categoria com question_id — para drill-down e cruzamento com templates.';
