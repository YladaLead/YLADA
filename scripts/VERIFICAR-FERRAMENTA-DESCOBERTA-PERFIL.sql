-- =====================================================
-- VERIFICAR E CORRIGIR: Ferramenta "Descoberta Perfil Bem-Estar"
-- URL que não funciona: /pt/wellness/andre/descoberta-perfil-bem-estar
-- Tabela correta: templates_nutrition
-- =====================================================

-- 1. Verificar se existe template com esse slug EXATO
SELECT 
  id,
  name,
  slug,
  type,
  profession,
  is_active,
  created_at
FROM templates_nutrition
WHERE slug = 'descoberta-perfil-bem-estar';

-- 2. Buscar templates wellness parecidos (slug mais curto pode ser 'quiz-bem-estar')
SELECT 
  id,
  name,
  slug,
  type,
  profession,
  is_active
FROM templates_nutrition
WHERE 
  (profession = 'wellness' OR profession IS NULL)
  AND (
    name ILIKE '%descoberta%'
    OR name ILIKE '%perfil%bem%estar%'
    OR name ILIKE '%bem-estar%'
    OR slug ILIKE '%descoberta%'
    OR slug ILIKE '%perfil%'
    OR slug ILIKE '%bem-estar%'
  )
ORDER BY name;

-- 3. Ver TODOS os templates wellness ativos tipo QUIZ
SELECT 
  id,
  name,
  slug,
  type,
  is_active
FROM templates_nutrition
WHERE 
  (profession = 'wellness' OR profession IS NULL)
  AND is_active = true
  AND type = 'quiz'
ORDER BY name;

-- =====================================================
-- CORREÇÃO: Criar o template se não existir
-- =====================================================

-- Se a query 1 retornar vazio, execute isso para CRIAR o template:
INSERT INTO templates_nutrition (
  name,
  slug,
  type,
  profession,
  language,
  title,
  description,
  content,
  is_active,
  created_at,
  updated_at
)
SELECT 
  'Descubra seu Perfil de Bem-Estar',
  'perfil-bem-estar',
  'quiz',
  'wellness',
  'pt',
  'Qual é o seu Perfil de Bem-Estar?',
  'Identifique se seu perfil é Estético, Equilibrado ou Saúde/Performance',
  '{
    "template_type": "quiz",
    "profession": "wellness",
    "questions": [
      {
        "id": 1,
        "question": "Qual é seu principal objetivo de bem-estar?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Melhorar minha aparência e autoestima"},
          {"id": "b", "label": "Ter mais equilíbrio entre corpo e mente"},
          {"id": "c", "label": "Melhorar minha saúde e performance física"}
        ]
      },
      {
        "id": 2,
        "question": "Como você prefere cuidar da sua saúde?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Foco em tratamentos estéticos e cuidados com a pele"},
          {"id": "b", "label": "Equilíbrio entre alimentação, exercícios e autocuidado"},
          {"id": "c", "label": "Treinos intensos e suplementação para performance"}
        ]
      },
      {
        "id": 3,
        "question": "O que mais te motiva a buscar bem-estar?",
        "type": "multiple_choice",
        "options": [
          {"id": "a", "label": "Sentir-me bonita(o) e confiante"},
          {"id": "b", "label": "Ter qualidade de vida e paz interior"},
          {"id": "c", "label": "Alcançar metas de saúde e condicionamento"}
        ]
      }
    ]
  }'::jsonb,
  true,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM templates_nutrition WHERE slug = 'perfil-bem-estar' AND profession = 'wellness'
);

-- Verificar se foi criado
SELECT 
  id,
  name,
  slug,
  type,
  profession,
  is_active
FROM templates_nutrition
WHERE slug = 'perfil-bem-estar';

-- =====================================================
-- ALTERNATIVA: Ver todos os slugs disponíveis wellness
-- =====================================================
SELECT slug, name FROM templates_nutrition 
WHERE profession = 'wellness' AND is_active = true
ORDER BY slug;

