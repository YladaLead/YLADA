-- Calculadoras HYPE (consumo-cafeina, custo-energia): mesmo padrão PROJECTION que wellness básicas.
DELETE FROM ylada_diagnosis_cache c
USING ylada_links l
WHERE c.link_id = l.id
  AND (l.config_json->'meta'->>'pro_lideres_preset') = 'true'
  AND (l.config_json->'meta'->>'pro_lideres_fluxo_id') IN ('consumo-cafeina', 'custo-energia');
