-- =====================================================
-- ENCONTRAR: "Descubra seu Perfil de Bem-Estar"
-- Este template pode estar com slug diferente
-- =====================================================

-- Buscar por nome similar
SELECT 
  '🔍 BUSCAR POR NOME' as tipo_busca,
  id,
  name as nome,
  slug,
  type as tipo,
  is_active,
  profession,
  language
FROM coach_templates_nutrition
WHERE (
  name ILIKE '%Descubra%Perfil%Bem-Estar%' OR
  name ILIKE '%Descubra%Perfil%' OR
  name ILIKE '%Perfil de Bem-Estar%' OR
  name ILIKE '%perfil bem-estar%'
)
ORDER BY is_active DESC, name;

-- Buscar por slug similar
SELECT 
  '🔍 BUSCAR POR SLUG' as tipo_busca,
  id,
  name as nome,
  slug,
  type as tipo,
  is_active,
  profession,
  language
FROM coach_templates_nutrition
WHERE (
  slug ILIKE '%descubra%' OR
  slug ILIKE '%perfil-bem-estar%' OR
  slug ILIKE '%wellness-profile%'
)
ORDER BY is_active DESC, slug;

-- Listar TODOS os templates relacionados a "bem-estar"
SELECT 
  '🔍 TODOS RELACIONADOS A BEM-ESTAR' as tipo_busca,
  id,
  name as nome,
  slug,
  type as tipo,
  is_active,
  profession,
  language
FROM coach_templates_nutrition
WHERE (
  name ILIKE '%bem-estar%' OR
  name ILIKE '%wellness%' OR
  slug ILIKE '%bem-estar%' OR
  slug ILIKE '%wellness%'
)
AND profession = 'coach'
AND language = 'pt'
ORDER BY is_active DESC, name;

-- Verificar se há templates inativos que podem ser o "Descubra seu Perfil de Bem-Estar"
SELECT 
  '🔍 TEMPLATES INATIVOS RELACIONADOS' as tipo_busca,
  id,
  name as nome,
  slug,
  type as tipo,
  is_active,
  profession,
  language
FROM coach_templates_nutrition
WHERE (
  name ILIKE '%Descubra%' OR
  name ILIKE '%Perfil%' OR
  slug ILIKE '%descubra%' OR
  slug ILIKE '%perfil%'
)
AND profession = 'coach'
AND language = 'pt'
AND is_active = false
ORDER BY name;

