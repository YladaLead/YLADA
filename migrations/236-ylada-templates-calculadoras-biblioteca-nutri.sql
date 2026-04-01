-- =====================================================
-- Bloco 3: Calculadoras da biblioteca Nutri.
-- type: calculator, schema com fields, formula, resultLabel.
-- Cada calculadora encaixa em segmentos diferentes (nutrition, fitness, etc.).
-- =====================================================

-- b1000025 = calc_agua, b1000026 = calc_calorias, b1000027 = calc_imc, b1000028 = calc_proteina
INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'b1000025-0025-4000-8000-000000000025',
    'calc_agua',
    'calculator',
    '{
      "title": "Calculadora de Água",
      "fields": [
        {"id": "peso", "label": "Peso atual (kg)", "type": "number", "min": 1, "max": 300},
        {"id": "atividade", "label": "Nível de atividade física (rotina + treinos)", "type": "select", "options": [{"value": 0, "label": "Sedentário (pouco ou nenhum exercício)"}, {"value": 300, "label": "Leve (caminhadas regulares)"}, {"value": 600, "label": "Moderado (1-3x/semana)"}, {"value": 1000, "label": "Intenso (4-6x/semana)"}, {"value": 1500, "label": "Muito intenso (atleta ou trabalho físico)"}]},
        {"id": "clima", "label": "Clima onde você vive", "type": "select", "options": [{"value": 0, "label": "Temperado"}, {"value": 500, "label": "Quente"}, {"value": 1000, "label": "Muito quente"}]}
      ],
      "formula": "Math.round((peso * 35 + atividade + clima) / 250)",
      "resultLabel": "Sua necessidade diária de água:",
      "resultPrefix": "",
      "resultSuffix": " copos de 250ml",
      "resultIntro": "Com base no que você informou:",
      "ctaDefault": "Quero falar no WhatsApp"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000026-0026-4000-8000-000000000026',
    'calc_calorias',
    'calculator',
    '{
      "title": "Calculadora de Calorias",
      "fields": [
        {"id": "peso", "label": "Peso atual (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "altura", "label": "Altura (cm) — em pé", "type": "number", "min": 100, "max": 250},
        {"id": "idade", "label": "Idade (anos completos)", "type": "number", "min": 10, "max": 120},
        {"id": "genero", "label": "Sexo biológico (para fórmula de gasto calórico)", "type": "select", "options": [{"value": 5, "label": "Masculino"}, {"value": -161, "label": "Feminino"}]},
        {"id": "atividade", "label": "Nível de atividade física (rotina + treinos)", "type": "select", "options": [{"value": 1.2, "label": "Sedentário (pouco ou nenhum exercício)"}, {"value": 1.375, "label": "Leve (1-3 dias/semana)"}, {"value": 1.55, "label": "Moderado (3-5 dias/semana)"}, {"value": 1.725, "label": "Intenso (6-7 dias/semana)"}, {"value": 1.9, "label": "Muito intenso (atleta ou trabalho físico)"}]},
        {"id": "objetivo", "label": "Objetivo de peso (ajuste calórico)", "type": "select", "options": [{"value": 0.85, "label": "Perder peso"}, {"value": 1, "label": "Manter peso"}, {"value": 1.15, "label": "Ganhar peso/massa muscular"}]}
      ],
      "formula": "Math.round((10 * peso + 6.25 * altura - 5 * idade + genero) * atividade * objetivo)",
      "resultLabel": "Calorias diárias recomendadas:",
      "resultPrefix": "",
      "resultSuffix": " kcal",
      "resultIntro": "Com base no que você informou (fórmula Mifflin-St Jeor):",
      "ctaDefault": "Quero falar no WhatsApp"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000027-0027-4000-8000-000000000027',
    'calc_imc',
    'calculator',
    '{
      "title": "Calculadora de IMC",
      "fields": [
        {"id": "peso", "label": "Peso atual (kg)", "type": "number", "min": 20, "max": 300},
        {"id": "altura", "label": "Altura (cm) — em pé, sem sapatos", "type": "number", "min": 100, "max": 250}
      ],
      "formula": "Math.round((peso / ((altura / 100) * (altura / 100))) * 100) / 100",
      "resultLabel": "Seu IMC:",
      "resultPrefix": "",
      "resultSuffix": "",
      "resultIntro": "Com base no que você informou:",
      "ctaDefault": "Quero falar no WhatsApp"
    }'::jsonb,
    '["title", "resultIntro", "resultLabel", "ctaText", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'b1000028-0028-4000-8000-000000000028',
    'calc_proteina',
    'calculator',
    '{
      "title": "Calculadora de Proteína",
      "fields": [
        {"id": "peso", "label": "Peso atual (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "objetivo", "label": "Objetivo principal", "type": "select", "options": [{"value": 1.8, "label": "Manter peso"}, {"value": 2.2, "label": "Perder peso"}, {"value": 2.5, "label": "Ganhar massa muscular"}]},
        {"id": "atividade", "label": "Nível de treino e movimento na semana", "type": "select", "options": [{"value": 0, "label": "Sedentário (pouco ou nenhum exercício)"}, {"value": 0.1, "label": "Leve (1-3 dias/semana)"}, {"value": 0.2, "label": "Moderado (3-5 dias/semana)"}, {"value": 0.4, "label": "Intenso (6-7 dias/semana)"}, {"value": 0.6, "label": "Muito intenso (atleta ou trabalho físico)"}]}
      ],
      "formula": "Math.round(peso * (objetivo + atividade))",
      "resultLabel": "Proteína diária recomendada:",
      "resultPrefix": "",
      "resultSuffix": " g",
      "resultIntro": "Com base no que você informou:",
      "ctaDefault": "Quero falar no WhatsApp"
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

-- Biblioteca: cada calculadora com segmentos específicos
-- Água: nutrition, fitness, medicine (hidratação)
-- Calorias: nutrition, fitness, medicine (peso)
-- IMC: nutrition, fitness, medicine, aesthetics (peso)
-- Proteína: nutrition, fitness (alimentação)
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
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'hidratacao', 'habitos', 'Calculadora de Água', 'Descubra quanta água você precisa beber por dia. O resultado se adapta ao seu perfil.', 'custom', NULL, 'b1000025-0025-4000-8000-000000000025', NULL, NULL, '{"nomenclatura": "calc_agua"}'::jsonb, 70, true),
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'peso_gordura', 'metabolismo', 'Calculadora de Calorias', 'Calcule suas calorias diárias com a fórmula Mifflin-St Jeor. Ideal para quem quer perder, manter ou ganhar peso.', 'custom', NULL, 'b1000026-0026-4000-8000-000000000026', NULL, NULL, '{"nomenclatura": "calc_calorias"}'::jsonb, 71, true),
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness', 'aesthetics'], 'peso_gordura', 'metabolismo', 'Calculadora de IMC', 'Descubra seu Índice de Massa Corporal em segundos. Orientação para peso ideal.', 'custom', NULL, 'b1000027-0027-4000-8000-000000000027', NULL, NULL, '{"nomenclatura": "calc_imc"}'::jsonb, 72, true),
  ('calculadora', ARRAY['nutrition', 'nutrition_vendedor', 'medicine', 'fitness'], 'alimentacao', 'habitos', 'Calculadora de Proteína', 'Calcule sua necessidade diária de proteína conforme objetivo e nível de atividade.', 'custom', NULL, 'b1000028-0028-4000-8000-000000000028', NULL, NULL, '{"nomenclatura": "calc_proteina"}'::jsonb, 73, true)
;
