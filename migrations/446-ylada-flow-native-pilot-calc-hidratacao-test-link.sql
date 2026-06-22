-- Piloto YladaFlow nativo: calculadora calc-hidratacao (conta determinística, sem LLM).
-- Ativa SOMENTE links de teste cujo slug termina em -ylada-native-pilot-calc-hidratacao.
-- Não liga YLADA_FLOW_NATIVE_PILOT global.
-- (renumerado de 427 → 446: o 427 já existia — colisão de número.)

UPDATE ylada_links
SET
  template_id = 'b1000025-0025-4000-8000-000000000025'::uuid,
  config_json = jsonb_set(
    jsonb_set(
      jsonb_set(
        COALESCE(config_json, '{}'::jsonb),
        '{meta,use_ylada_flow_native}',
        'true'::jsonb,
        TRUE
      ),
      '{meta,pro_lideres_fluxo_id}',
      '"calc-hidratacao"'::jsonb,
      TRUE
    ),
    '{meta,pro_lideres_preset}',
    'true'::jsonb,
    TRUE
  ),
  updated_at = NOW()
WHERE
  status = 'active'
  AND slug LIKE '%-ylada-native-pilot-calc-hidratacao';
