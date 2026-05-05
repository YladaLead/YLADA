-- Pro Líderes: substituir copy antiga (H-Líder / Herbalife no subtítulo público) por texto neutro para quem preenche /l/.
-- Idempotente: só corre em links ativos preset com menção a Herbalife ou H-Líder no subtítulo.

WITH src AS (
  SELECT
    y.id,
    trim(BOTH FROM COALESCE(y.config_json #>> '{page,subtitle}', '')) AS old_sub,
    y.config_json -> 'meta' ->> 'pro_lideres_kind' AS kind
  FROM ylada_links y
  WHERE
    y.status = 'active'
    AND y.template_id = 'a0000001-0001-4000-8000-000000000001'::uuid
    AND y.config_json -> 'meta' ->> 'pro_lideres_preset' = 'true'
    AND (
      COALESCE(y.config_json #>> '{page,subtitle}', '') ILIKE '%herbalife%'
      OR COALESCE(y.config_json #>> '{page,subtitle}', '') ILIKE '%h-líder%'
      OR COALESCE(y.config_json #>> '{page,subtitle}', '') ILIKE '%h-lider%'
      OR COALESCE(y.config_json #>> '{page,subtitle}', '') ILIKE '%consultor independente%'
    )
),
patched AS (
  SELECT
    s.id,
    trim(BOTH FROM regexp_replace(s.old_sub, E'\\n\\n+Área H-Líder.*$', '', 'i')) AS base_objetivo,
    s.kind
  FROM src s
),
final AS (
  SELECT
    p.id,
    trim(
      BOTH FROM concat_ws(
        E'\n\n',
        NULLIF(p.base_objetivo, ''),
        CASE
          WHEN p.kind = 'recruitment' THEN
            'O próximo passo é continuar no WhatsApp com quem te enviou este link.'
          ELSE
            'O próximo passo é conversar com quem te enviou este link — hábitos, nutrição e bem-estar.'
        END
      )
    ) AS new_text
  FROM patched p
)
UPDATE ylada_links AS y
SET
  config_json =
    jsonb_set(
      jsonb_set(y.config_json, '{page,subtitle}', to_jsonb(f.new_text), TRUE),
      '{page,when_to_use}',
      to_jsonb(f.new_text),
      TRUE
    ),
  updated_at = NOW()
FROM final f
WHERE y.id = f.id
  AND length(f.new_text) > 0
  AND f.new_text IS DISTINCT FROM trim(BOTH FROM COALESCE(y.config_json #>> '{page,subtitle}', ''));
