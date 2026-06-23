-- Piloto YladaFlow nativo: quiz bloco Corpo & Metabolismo (barriga-pesada).
-- Ativa SOMENTE links de teste cujo slug termina em -corpo-native-test.
-- Não liga YLADA_FLOW_NATIVE_PILOT global.
-- Pré-requisito: migration 447 (devolutiva afiada) + código do registry de quiz mold.

UPDATE ylada_links
SET
  config_json = jsonb_set(
    jsonb_set(
      jsonb_set(
        COALESCE(config_json, '{}'::jsonb),
        '{meta,use_ylada_flow_native}',
        'true'::jsonb,
        TRUE
      ),
      '{meta,pro_lideres_fluxo_id}',
      '"barriga-pesada"'::jsonb,
      TRUE
    ),
    '{meta,pro_lideres_kind}',
    '"sales"'::jsonb,
    TRUE
  ),
  updated_at = NOW()
WHERE
  status = 'active'
  AND slug LIKE '%-corpo-native-test';
