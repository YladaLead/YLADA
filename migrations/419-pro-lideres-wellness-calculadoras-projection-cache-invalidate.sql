-- Presets Pro Líderes: água / hidratação / calorias / proteína passam a usar PROJECTION_CALCULATOR (config via código).
-- Remove entradas antigas de cache para não servir diagnóstico RISK com respostas novas (q1–q4 numéricos).
DELETE FROM ylada_diagnosis_cache c
USING ylada_links l
WHERE c.link_id = l.id
  AND (l.config_json->'meta'->>'pro_lideres_preset') = 'true'
  AND (l.config_json->'meta'->>'pro_lideres_fluxo_id') IN (
    'agua',
    'calc-hidratacao',
    'calc-calorias',
    'calc-proteina'
  );
