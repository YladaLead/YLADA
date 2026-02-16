-- =====================================================
-- Seed dos 2 templates universais (MVP).
-- @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md (Etapa 1.3)
-- =====================================================

INSERT INTO ylada_link_templates (id, name, type, schema_json, allowed_vars_json, version, active)
VALUES
  (
    'a0000001-0001-4000-8000-000000000001',
    'diagnostico_agenda',
    'diagnostico',
    '{
      "title": "Diagnóstico: sua agenda",
      "questions": [
        { "id": "q1", "text": "Quantos atendimentos você gostaria de ter por semana?", "type": "single", "options": ["até 5", "5 a 10", "10 a 20", "20 ou mais"] },
        { "id": "q2", "text": "Hoje, quantos você consegue preencher em média?", "type": "single", "options": ["nenhum ou quase nenhum", "1 a 3", "4 a 7", "8 ou mais"] },
        { "id": "q3", "text": "Onde você mais divulga hoje?", "type": "single", "options": ["Instagram", "WhatsApp / indicação", "Ambos", "Quase não divulgo"] }
      ],
      "results": [
        { "id": "r1", "label": "Grande potencial", "minScore": 0, "headline": "Sua agenda pode crescer", "description": "Você tem espaço e disposição. O próximo passo é ter um link que qualifique e direcione quem já demonstra interesse." },
        { "id": "r2", "label": "Em construção", "minScore": 3, "headline": "Sua base está se formando", "description": "Com um link de valor e uma rotina de divulgação, você tende a preencher melhor a agenda nos próximos 30 dias." },
        { "id": "r3", "label": "Primeiro passo", "minScore": 6, "headline": "O melhor momento para começar", "description": "Um link simples que gera curiosidade e leva para o WhatsApp pode ser o ponto de partida para preencher sua agenda." }
      ],
      "ctaDefault": "Quero falar no WhatsApp",
      "resultIntro": "Seu resultado:"
    }'::jsonb,
    '["title", "headline", "description", "ctaText", "resultIntro", "nomeProfissional"]'::jsonb,
    1,
    true
  ),
  (
    'a0000002-0002-4000-8000-000000000002',
    'calculadora_perda',
    'calculator',
    '{
      "title": "Quanto você está deixando de faturar?",
      "fields": [
        { "id": "f1", "label": "Quantos atendimentos você poderia fazer por semana?", "type": "number", "min": 1, "max": 50, "default": 15 },
        { "id": "f2", "label": "Quantos você faz hoje em média?", "type": "number", "min": 0, "max": 50, "default": 5 },
        { "id": "f3", "label": "Qual seu ticket médio (R$)?", "type": "number", "min": 50, "max": 5000, "default": 200 }
      ],
      "formula": "(f1 - f2) * f3 * 4",
      "resultLabel": "Potencial perdido por mês (aprox.):",
      "resultPrefix": "R$",
      "resultSuffix": "",
      "ctaDefault": "Quero destravar minha agenda",
      "resultIntro": "Com base no que você informou:"
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
