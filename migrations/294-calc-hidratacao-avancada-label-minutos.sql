-- Rótulo do campo de treino: "(min)" foi confundido com "mínimo"; deixa explícito que
-- 0 é válido para quem não treina.
UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(
    schema_json,
    '{fields,1,label}',
    '"Treino diário (minutos) — use 0 se não treinar"'::jsonb,
    true
  ),
  updated_at = NOW()
WHERE id = 'b1000031-0031-4000-8000-000000000031'
  AND name = 'calc_hidratacao_avancada';
