-- Preset Pro Líderes "Calculadora de IMC" (slug …-v-calc-imc): era link de diagnóstico (quiz)
-- sem fórmula de IMC. Passa a usar o template de calculadora YLADA (peso, altura, idade, sexo → IMC).

UPDATE ylada_links y
SET
  template_id = 'b1000027-0027-4000-8000-000000000027'::uuid,
  config_json =
    t.schema_json
    || jsonb_build_object(
      'meta',
      (COALESCE(y.config_json->'meta', '{}'::jsonb) - 'architecture' - 'flow_id')
    )
    || jsonb_build_object('title', to_jsonb(COALESCE(NULLIF(trim(y.title), ''), 'Calculadora de IMC'))),
  updated_at = NOW()
FROM ylada_link_templates t
WHERE t.id = 'b1000027-0027-4000-8000-000000000027'::uuid
  AND y.template_id = 'a0000001-0001-4000-8000-000000000001'::uuid
  AND y.slug ~ '-v-calc-imc$';
