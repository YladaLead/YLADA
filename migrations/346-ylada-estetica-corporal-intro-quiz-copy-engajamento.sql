-- Intro dos quizzes corporais: copy mais curta na primeira tela, sem aviso clínico na abertura.
-- Idempotente (sobrescreve chaves conhecidas no JSON do template).

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(
    jsonb_set(schema_json::jsonb, '{introSubtitle}', to_jsonb(
      'Em cinco perguntas você mapeia travas, urgência e a vitória que mais importa. No final, um perfil claro para abrir a conversa com a sua esteticista.'::text
    )),
    '{introBullets}',
    '[]'::jsonb
  ),
  updated_at = NOW()
WHERE id = 'b1000119-0119-4000-8000-000000000119';

UPDATE ylada_link_templates
SET
  schema_json = jsonb_set(
    jsonb_set(schema_json::jsonb, '{introSubtitle}', to_jsonb(
      'Responda cinco perguntas sobre sensação, objetivo, frequência e preferências. No final recebe um perfil (relaxamento, drenagem, modeladora ou combinação) e um próximo passo para combinar com a sua esteticista.'::text
    )),
    '{introBullets}',
    '[]'::jsonb
  ),
  updated_at = NOW()
WHERE id = 'b1000127-0127-4000-8000-000000000127';
