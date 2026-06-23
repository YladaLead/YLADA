-- Piloto YladaFlow nativo: quiz bloco Energia & Foco (energia-foco).
-- Ativa SOMENTE links de teste cujo slug termina em -energia-native-test.
-- Não liga YLADA_FLOW_NATIVE_PILOT global.
-- Pré-requisito: migration 449 (devolutiva afiada) + FLUXOS_VENDAS_POR_ID no registry.

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
      '"energia-foco"'::jsonb,
      TRUE
    ),
    '{meta,pro_lideres_kind}',
    '"sales"'::jsonb,
    TRUE
  ),
  updated_at = NOW()
WHERE
  status = 'active'
  AND slug LIKE '%-energia-native-test';
