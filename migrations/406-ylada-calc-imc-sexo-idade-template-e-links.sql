-- Calculadora de IMC (b1000027): garantir idade + sexo no template e em links legados.
-- A fórmula do IMC continua só peso + altura; idade/sexo são contexto para o profissional.
-- Idempotente: só atualiza template se faltar campo `sexo`; links se tiverem < 4 campos em `fields`.

UPDATE ylada_link_templates
SET
  schema_json = '{
    "title": "Calculadora de IMC",
    "fields": [
      {"id": "peso", "label": "Peso atual (kg)", "type": "number", "min": 20, "max": 300},
      {"id": "altura", "label": "Altura (cm) — em pé, sem sapatos", "type": "number", "min": 100, "max": 250},
      {"id": "idade", "label": "Idade (anos completos)", "type": "number", "min": 10, "max": 120},
      {"id": "sexo", "label": "Sexo registrado ao nascer (opcional — não altera o IMC; ajuda na consulta)", "type": "select", "options": [{"value": 2, "label": "Prefiro não informar"}, {"value": 0, "label": "Masculino"}, {"value": 1, "label": "Feminino"}]}
    ],
    "formula": "Math.round((peso / ((altura / 100) * (altura / 100))) * 100) / 100",
    "resultLabel": "Seu IMC:",
    "resultPrefix": "",
    "resultSuffix": "",
    "resultIntro": "Com base no que você informou:",
    "ctaDefault": "Quero falar no WhatsApp"
  }'::jsonb,
  updated_at = NOW()
WHERE id = 'b1000027-0027-4000-8000-000000000027'
  AND NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(COALESCE(schema_json->'fields', '[]'::jsonb)) AS el
    WHERE el->>'id' = 'sexo'
  );

UPDATE ylada_links y
SET
  config_json = jsonb_set(
    COALESCE(y.config_json, '{}'::jsonb),
    '{fields}',
    (SELECT t.schema_json->'fields' FROM ylada_link_templates t WHERE t.id = 'b1000027-0027-4000-8000-000000000027'),
    true
  ),
  updated_at = NOW()
WHERE y.template_id = 'b1000027-0027-4000-8000-000000000027'
  AND jsonb_typeof(COALESCE(y.config_json->'fields', '[]'::jsonb)) = 'array'
  AND jsonb_array_length(COALESCE(y.config_json->'fields', '[]'::jsonb)) < 4;
