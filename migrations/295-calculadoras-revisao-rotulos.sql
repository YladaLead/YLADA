-- Revisão de rótulos em todas as calculadoras da biblioteca (unidades, quando usar 0, clareza de prazo/TDEE).
-- Alinha ylada_link_templates ao conteúdo atual de 236 + 293 (ambientes que já rodaram migrations anteriores).

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
  ),
  (
    'b1000029-0029-4000-8000-000000000029',
    'calc_meta_peso_prazo',
    'calculator',
    '{
      "title": "Calculadora de Meta de Peso por Prazo",
      "fields": [
        {"id": "peso_atual", "label": "Peso atual (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "peso_meta", "label": "Peso desejado (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "prazo_semanas", "label": "Prazo para atingir a meta (em semanas)", "type": "number", "min": 1, "max": 104}
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
        {"id": "tdee", "label": "Gasto calórico total por dia — TDEE (kcal/dia)", "type": "number", "min": 900, "max": 6000},
        {"id": "ajuste", "label": "Ajuste diário (déficit negativo ou superávit positivo)", "type": "select", "options": [{"value": -500, "label": "Déficit agressivo (-500 kcal/dia)"}, {"value": -300, "label": "Déficit moderado (-300 kcal/dia)"}, {"value": 0, "label": "Manutenção (sem ajuste)"}, {"value": 250, "label": "Superávit moderado (+250 kcal/dia)"}, {"value": 400, "label": "Superávit alto (+400 kcal/dia)"}]}
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
        {"id": "peso", "label": "Peso atual (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "minutos_treino", "label": "Treino diário (minutos) — use 0 se não treinar", "type": "number", "min": 0, "max": 300},
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
        {"id": "deficit_diario", "label": "Déficit calórico médio por dia (kcal/dia)", "type": "number", "min": 100, "max": 1200},
        {"id": "semanas", "label": "Duração do período (em semanas)", "type": "number", "min": 1, "max": 52}
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
        {"id": "peso", "label": "Peso atual (kg)", "type": "number", "min": 30, "max": 300},
        {"id": "altura", "label": "Altura (cm) — em pé", "type": "number", "min": 120, "max": 230},
        {"id": "idade", "label": "Idade (anos completos)", "type": "number", "min": 14, "max": 100},
        {"id": "sexo", "label": "Sexo biológico (para fórmula Mifflin-St Jeor)", "type": "select", "options": [{"value": 5, "label": "Masculino"}, {"value": -161, "label": "Feminino"}]},
        {"id": "atividade", "label": "Nível de atividade física (rotina + treinos)", "type": "select", "options": [{"value": 1.2, "label": "Sedentário"}, {"value": 1.375, "label": "Leve (1-3x/semana)"}, {"value": 1.55, "label": "Moderado (3-5x/semana)"}, {"value": 1.725, "label": "Intenso (6-7x/semana)"}, {"value": 1.9, "label": "Muito intenso"}]}
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
        {"id": "proteina_pct", "label": "Proteína (% do total de calorias do dia)", "type": "select", "options": [{"value": 25, "label": "25%"}, {"value": 30, "label": "30%"}, {"value": 35, "label": "35%"}]}
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
        {"id": "passos_atuais", "label": "Média de passos por dia (0 se não souber)", "type": "number", "min": 0, "max": 30000},
        {"id": "objetivo", "label": "Foco da meta de passos", "type": "select", "options": [{"value": 1500, "label": "Perder peso"}, {"value": 1000, "label": "Melhorar condicionamento"}, {"value": 800, "label": "Saúde e manutenção"}]}
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
