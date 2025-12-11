-- ============================================
-- CRIAR TEMPLATE BASE "perfil-intestino" PARA WELLNESS
-- Este template será disponível para TODOS os usuários
-- ============================================

-- Verificar se já existe e remover se tiver slug/nome diferente
DELETE FROM templates_nutrition 
WHERE (slug = 'perfil-intestino' OR name ILIKE '%perfil%intestino%')
  AND profession = 'wellness';

-- Inserir template base "perfil-intestino"
INSERT INTO templates_nutrition (
  name,
  type,
  language,
  objective,
  title,
  description,
  profession,
  is_active,
  slug,
  icon,
  content
) VALUES (
  'Qual é seu perfil de intestino?',
  'quiz',
  'pt',
  'Identificar o tipo de funcionamento intestinal e saúde digestiva',
  'Qual é seu perfil de intestino?',
  'Identifique o tipo de funcionamento intestinal e saúde digestiva',
  'wellness',
  true,
  'perfil-intestino', -- ✅ Slug correto e padrão
  '💩',
  '{
    "template_type": "quiz",
    "profession": "wellness",
    "questions": [
      {
        "id": 1,
        "question": "Como é a frequência das suas evacuações?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Diariamente, de forma regular"},
          {"id": "b", "label": "A cada 2-3 dias"},
          {"id": "c", "label": "Menos de 3 vezes por semana"},
          {"id": "d", "label": "Muito irregular, varia muito"}
        ]
      },
      {
        "id": 2,
        "question": "Você costuma sentir desconforto digestivo após refeições?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ]
      },
      {
        "id": 3,
        "question": "Você sente gases, inchaço ou distensão abdominal?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ]
      },
      {
        "id": 4,
        "question": "Consome alimentos probióticos ou fermentados regularmente?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Nunca"},
          {"id": "b", "label": "Raramente"},
          {"id": "c", "label": "Às vezes"},
          {"id": "d", "label": "Frequentemente"},
          {"id": "e", "label": "Sempre"}
        ]
      },
      {
        "id": 5,
        "question": "Como é sua ingestão de fibras no dia a dia?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Consumo muitas fibras (frutas, verduras, grãos integrais)"},
          {"id": "b", "label": "Consumo uma quantidade moderada"},
          {"id": "c", "label": "Consumo pouco"},
          {"id": "d", "label": "Quase não consumo fibras"}
        ]
      },
      {
        "id": 6,
        "question": "Você sente que absorve bem os nutrientes (sem sintomas de deficiência)?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sim, absorvo bem"},
          {"id": "b", "label": "Às vezes sinto que não absorvo bem"},
          {"id": "c", "label": "Não, tenho sinais de deficiências"},
          {"id": "d", "label": "Não sei avaliar"}
        ]
      },
      {
        "id": 7,
        "question": "Você tem histórico de uso de antibióticos ou medicamentos que afetam o intestino?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Nunca usei"},
          {"id": "b", "label": "Usei raramente"},
          {"id": "c", "label": "Usei algumas vezes"},
          {"id": "d", "label": "Uso com frequência"}
        ]
      },
      {
        "id": 8,
        "question": "Como é sua hidratação diária?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Bebo muita água (mais de 2 litros/dia)"},
          {"id": "b", "label": "Bebo uma quantidade adequada (1,5-2 litros/dia)"},
          {"id": "c", "label": "Bebo pouco (menos de 1 litro/dia)"},
          {"id": "d", "label": "Quase não bebo água"}
        ]
      },
      {
        "id": 9,
        "question": "Você sente que sua digestão está comprometida ou lenta?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Não, minha digestão é rápida e eficiente"},
          {"id": "b", "label": "Às vezes sinto que está lenta"},
          {"id": "c", "label": "Sim, frequentemente sinto digestão lenta"},
          {"id": "d", "label": "Sempre sinto que está muito lenta"}
        ]
      },
      {
        "id": 10,
        "question": "Você tem sinais de inflamação ou sensibilidade intestinal?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Não, não tenho esses sinais"},
          {"id": "b", "label": "Às vezes sinto algum desconforto"},
          {"id": "c", "label": "Sim, tenho sinais frequentes"},
          {"id": "d", "label": "Sim, tenho sinais constantes"}
        ]
      }
    ]
  }'::jsonb
)
ON CONFLICT (slug, profession) 
DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  is_active = true,
  updated_at = NOW();

-- Verificar se foi criado corretamente
SELECT 
  id,
  name,
  slug,
  profession,
  is_active,
  CASE 
    WHEN slug = 'perfil-intestino' THEN '✅ Slug correto'
    ELSE '❌ Slug incorreto: ' || slug
  END as diagnostico_slug,
  CASE 
    WHEN content IS NOT NULL AND content::text != '{}' THEN '✅ Tem content'
    ELSE '❌ Sem content'
  END as diagnostico_content
FROM templates_nutrition
WHERE slug = 'perfil-intestino'
  AND profession = 'wellness';
