-- Calculadora de água / hidratação: volta a RISK_DIAGNOSIS + formulário peso/atividade/clima (não PROJECTION).
DELETE FROM ylada_diagnosis_cache c
USING ylada_links l
WHERE c.link_id = l.id
  AND (l.config_json->'meta'->>'pro_lideres_preset') = 'true'
  AND (l.config_json->'meta'->>'pro_lideres_fluxo_id') IN ('agua', 'calc-hidratacao');
