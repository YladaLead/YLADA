-- =====================================================
-- EXCLUIR TEMPLATE "SEU CORPO ESTÁ PEDINDO DETOX" (WELLNESS)
-- =====================================================

-- ⚠️ ATENÇÃO: Este script remove permanentemente o template
-- "Seu corpo está pedindo Detox?" da área Wellness
-- Execute apenas se tiver certeza que quer remover permanentemente

-- =====================================================
-- 1. VERIFICAR TEMPLATE ANTES DE EXCLUIR
-- =====================================================
SELECT 
  id,
  name,
  slug,
  type,
  profession,
  language,
  is_active,
  created_at
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    LOWER(name) LIKE '%seu corpo está pedindo detox%' OR
    LOWER(name) LIKE '%seu corpo esta pedindo detox%' OR
    LOWER(name) LIKE '%pedindo detox%' OR
    slug = 'quiz-pedindo-detox' OR
    slug = 'seu-corpo-esta-pedindo-detox' OR
    slug = 'seu-corpo-está-pedindo-detox'
  )
ORDER BY name;

-- =====================================================
-- 2. VERIFICAR FERRAMENTAS CRIADAS A PARTIR DESTE TEMPLATE
-- =====================================================
SELECT 
  ut.id,
  ut.slug,
  ut.title,
  ut.user_id,
  ut.status,
  t.name as template_name
FROM user_templates ut
JOIN templates_nutrition t ON ut.template_id = t.id
WHERE t.profession = 'wellness'
  AND (
    LOWER(t.name) LIKE '%seu corpo está pedindo detox%' OR
    LOWER(t.name) LIKE '%seu corpo esta pedindo detox%' OR
    LOWER(t.name) LIKE '%pedindo detox%' OR
    t.slug = 'quiz-pedindo-detox' OR
    t.slug = 'seu-corpo-esta-pedindo-detox' OR
    t.slug = 'seu-corpo-está-pedindo-detox'
  );

-- =====================================================
-- 3. EXCLUIR TEMPLATE DEFINITIVAMENTE
-- =====================================================
-- ⚠️ CUIDADO: Esta operação é IRREVERSÍVEL!
-- Descomente as linhas abaixo para executar a exclusão

BEGIN;

-- Primeiro, excluir ferramentas criadas a partir deste template (se houver)
DELETE FROM user_templates
WHERE template_id IN (
  SELECT id
  FROM templates_nutrition
  WHERE profession = 'wellness'
    AND language = 'pt'
    AND (
      LOWER(name) LIKE '%seu corpo está pedindo detox%' OR
      LOWER(name) LIKE '%seu corpo esta pedindo detox%' OR
      LOWER(name) LIKE '%pedindo detox%' OR
      slug = 'quiz-pedindo-detox' OR
      slug = 'seu-corpo-esta-pedindo-detox' OR
      slug = 'seu-corpo-está-pedindo-detox'
    )
);

-- Depois, excluir o template
DELETE FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    LOWER(name) LIKE '%seu corpo está pedindo detox%' OR
    LOWER(name) LIKE '%seu corpo esta pedindo detox%' OR
    LOWER(name) LIKE '%pedindo detox%' OR
    slug = 'quiz-pedindo-detox' OR
    slug = 'seu-corpo-esta-pedindo-detox' OR
    slug = 'seu-corpo-está-pedindo-detox'
  );

COMMIT;

-- =====================================================
-- 4. VERIFICAR RESULTADO (APÓS EXCLUSÃO)
-- =====================================================
SELECT 
  COUNT(*) as total_restante,
  'Templates "Seu corpo está pedindo Detox" restantes' as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    LOWER(name) LIKE '%seu corpo está pedindo detox%' OR
    LOWER(name) LIKE '%seu corpo esta pedindo detox%' OR
    LOWER(name) LIKE '%pedindo detox%' OR
    slug = 'quiz-pedindo-detox' OR
    slug = 'seu-corpo-esta-pedindo-detox' OR
    slug = 'seu-corpo-está-pedindo-detox'
  );

-- Verificar se o "Quiz Detox" (correto) ainda existe
SELECT 
  id,
  name,
  slug,
  type,
  is_active
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND slug = 'quiz-detox'
  AND LOWER(name) NOT LIKE '%pedindo%';
