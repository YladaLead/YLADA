-- =====================================================
-- Bloco: Novas calculadoras da biblioteca YLADA (fase 2)
-- Mantém o padrão type=calculator com schema_json (fields + formula).
-- =====================================================

-- b1000029 = calc_meta_peso_prazo
-- b1000030 = calc_calorias_alvo
-- b1000031 = calc_hidratacao_avancada
-- b1000032 = calc_projecao_peso_deficit
-- b1000033 = calc_tmb_tdee
-- b1000034 = calc_macros_objetivo
-- b1000035 = calc_passos_meta
INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000029-0029-4000-8000-000000000029',
    'calc_meta_peso_prazo',
    'calculator',
    '{
      "title": "Calculadora de Meta de Peso por Prazo",
      "fields": [
        {"id": "peso_atual", "label": "Peso atual (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "peso_meta", "label": "Peso meta (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "prazo_semanas", "label": "Prazo (semanas)", "type": "number", "min": 1, "max": 104}
      ],
      "formula": "Math.round((Math.abs(peso_atual - peso_meta) / prazo_semanas) * 100) / 100",
      "resultLabel": "Variação semanal necessária:",
      "resultPrefix": "",
      "resultSuffix": " kg/semana",
      "resultIntro": "Com base no peso atual, meta e prazo:",
      "ctaDefault": "Quero falar com um profissional"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000030-0030-4000-8000-000000000030',
    'calc_calorias_alvo',
    'calculator',
    '{
      "title": "Calculadora de Calorias Alvo",
      "fields": [
        {"id": "tdee", "label": "Gasto diário estimado (kcal)", "type": "number", "min": 900, "max": 6000},
        {"id": "ajuste", "label": "Estratégia de ajuste", "type": "select", "options": [{"value": -500, "label": "Déficit agressivo (-500 kcal)"}, {"value": -300, "label": "Déficit moderado (-300 kcal)"}, {"value": 0, "label": "Manutenção (0 kcal)"}, {"value": 250, "label": "Superávit moderado (+250 kcal)"}, {"value": 400, "label": "Superávit alto (+400 kcal)"}]}
      ],
      "formula": "Math.round(tdee + ajuste)",
      "resultLabel": "Calorias alvo por dia:",
      "resultPrefix": "",
      "resultSuffix": " kcal",
      "resultIntro": "Com base no seu gasto diário e estratégia:",
      "ctaDefault": "Quero falar com um profissional"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000031-0031-4000-8000-000000000031',
    'calc_hidratacao_avancada',
    'calculator',
    '{
      "title": "Calculadora de Hidratação Avançada",
      "fields": [
        {"id": "peso", "label": "Peso (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "minutos_treino", "label": "Treino diário (min)", "type": "number", "min": 0, "max": 300},
        {"id": "clima", "label": "Clima onde você vive", "type": "select", "options": [{"value": 0, "label": "Temperado"}, {"value": 400, "label": "Quente"}, {"value": 800, "label": "Muito quente"}]}
      ],
      "formula": "Math.round((peso * 35 + minutos_treino * 8 + clima) / 250)",
      "resultLabel": "Meta diária de água:",
      "resultPrefix": "",
      "resultSuffix": " copos de 250ml",
      "resultIntro": "Com base em peso, treino e clima:",
      "ctaDefault": "Quero falar com um profissional"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000032-0032-4000-8000-000000000032',
    'calc_projecao_peso_deficit',
    'calculator',
    '{
      "title": "Calculadora de Projeção de Peso por Déficit",
      "fields": [
        {"id": "deficit_diario", "label": "Déficit calórico diário (kcal)", "type": "number", "min": 100, "max": 1200},
        {"id": "semanas", "label": "Prazo (semanas)", "type": "number", "min": 1, "max": 52}
      ],
      "formula": "Math.round(((deficit_diario * 7 * semanas) / 7700) * 10) / 10",
      "resultLabel": "Perda de peso estimada no período:",
      "resultPrefix": "",
      "resultSuffix": " kg",
      "resultIntro": "Estimativa com base no déficit informado:",
      "ctaDefault": "Quero falar com um profissional"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000033-0033-4000-8000-000000000033',
    'calc_tmb_tdee',
    'calculator',
    '{
      "title": "Calculadora de TMB e Gasto Total",
      "fields": [
        {"id": "peso", "label": "Peso (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "altura", "label": "Altura (cm)", "type": "number", "min": 120, "max": 230},
        {"id": "idade", "label": "Idade (anos)", "type": "number", "min": 14, "max": 100},
        {"id": "sexo", "label": "Sexo biológico", "type": "select", "options": [{"value": 5, "label": "Masculino"}, {"value": -161, "label": "Feminino"}]},
        {"id": "atividade", "label": "Nível de atividade física", "type": "select", "options": [{"value": 1.2, "label": "Sedentário"}, {"value": 1.375, "label": "Leve (1-3x/semana)"}, {"value": 1.55, "label": "Moderado (3-5x/semana)"}, {"value": 1.725, "label": "Intenso (6-7x/semana)"}, {"value": 1.9, "label": "Muito intenso"}]}
      ],
      "formula": "Math.round((10 * peso + 6.25 * altura - 5 * idade + sexo) * atividade)",
      "resultLabel": "Gasto calórico diário estimado (TDEE):",
      "resultPrefix": "",
      "resultSuffix": " kcal",
      "resultIntro": "Estimativa com base na fórmula Mifflin-St Jeor + nível de atividade:",
      "ctaDefault": "Quero falar com um profissional"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000034-0034-4000-8000-000000000034',
    'calc_macros_objetivo',
    'calculator',
    '{
      "title": "Calculadora de Macronutrientes por Objetivo",
      "fields": [
        {"id": "calorias", "label": "Meta calórica diária (kcal)", "type": "number", "min": 1000, "max": 6000},
        {"id": "proteina_pct", "label": "Proteína (% das calorias)", "type": "select", "options": [{"value": 25, "label": "25%"}, {"value": 30, "label": "30%"}, {"value": 35, "label": "35%"}]}
      ],
      "formula": "Math.round((calorias * (proteina_pct / 100)) / 4)",
      "resultLabel": "Proteína recomendada no plano:",
      "resultPrefix": "",
      "resultSuffix": " g/dia",
      "resultIntro": "Com base na meta calórica e distribuição escolhida:",
      "ctaDefault": "Quero falar com um profissional"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000035-0035-4000-8000-000000000035',
    'calc_passos_meta',
    'calculator',
    '{
      "title": "Calculadora de Meta de Passos",
      "fields": [
        {"id": "passos_atuais", "label": "Média atual de passos por dia", "type": "number", "min": 500, "max": 30000},
        {"id": "objetivo", "label": "Objetivo principal", "type": "select", "options": [{"value": 1500, "label": "Perder peso"}, {"value": 1000, "label": "Melhorar condicionamento"}, {"value": 800, "label": "Saúde e manutenção"}]}
      ],
      "formula": "Math.round(passos_atuais + objetivo)",
      "resultLabel": "Meta sugerida de passos por dia:",
      "resultPrefix": "",
      "resultSuffix": " passos",
      "resultIntro": "Meta progressiva para aumentar gasto e consistência:",
      "ctaDefault": "Quero falar com um profissional"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  schema_json = EXCLUDED.schema_json,
  allowed_vars_json = EXCLUDED.allowed_vars_json,
  version = EXCLUDED.version,
  active = EXCLUDED.active,
  updated_at = NOW();

INSERT INTO ylada_biblioteca_itens (
  tipo,
  segment_codes,
  tema,
  pilar,
  titulo,
  description,
  source_type,
  source_id,
  template_id,
  flow_id,
  architecture,
  meta,
  sort_order,
  active
) VALUES
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'peso_gordura', 'metabolismo', 'Calculadora de Meta de Peso por Prazo', 'Descubra quanto precisa variar por semana para bater sua meta no prazo escolhido.', 'custom', NULL, 'b1000029-0029-4000-8000-000000000029', NULL, NULL, '{"nomenclatura":"calc_meta_peso_prazo"}'::jsonb, 74, true),
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'metabolismo', 'metabolismo', 'Calculadora de Calorias Alvo', 'Defina uma meta calórica diária com base no gasto total e no ajuste desejado.', 'custom', NULL, 'b1000030-0030-4000-8000-000000000030', NULL, NULL, '{"nomenclatura":"calc_calorias_alvo"}'::jsonb, 75, true),
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'hidratacao', 'habitos', 'Calculadora de Hidratação Avançada', 'Ajuste sua meta de hidratação diária considerando peso, treino e clima.', 'custom', NULL, 'b1000031-0031-4000-8000-000000000031', NULL, NULL, '{"nomenclatura":"calc_hidratacao_avancada"}'::jsonb, 76, true),
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'peso_gordura', 'metabolismo', 'Calculadora de Projeção de Peso por Déficit', 'Projete perda estimada no período com base no déficit calórico diário informado.', 'custom', NULL, 'b1000032-0032-4000-8000-000000000032', NULL, NULL, '{"nomenclatura":"calc_projecao_peso_deficit"}'::jsonb, 77, true),
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'metabolismo', 'metabolismo', 'Calculadora de TMB e Gasto Total', 'Estime seu gasto calórico diário total com base em dados corporais e rotina.', 'custom', NULL, 'b1000033-0033-4000-8000-000000000033', NULL, NULL, '{"nomenclatura":"calc_tmb_tdee"}'::jsonb, 78, true),
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'alimentacao', 'habitos', 'Calculadora de Macronutrientes por Objetivo', 'Converta meta calórica em proteína diária para organizar seu plano alimentar.', 'custom', NULL, 'b1000034-0034-4000-8000-000000000034', NULL, NULL, '{"nomenclatura":"calc_macros_objetivo"}'::jsonb, 79, true),
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'habitos', 'habitos', 'Calculadora de Meta de Passos', 'Projete uma meta diária de passos para acelerar resultados com consistência.', 'custom', NULL, 'b1000035-0035-4000-8000-000000000035', NULL, NULL, '{"nomenclatura":"calc_passos_meta"}'::jsonb, 80, true)
ON CONFLICT DO NOTHING;
