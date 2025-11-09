-- ============================================
-- VERIFICAR E DESATIVAR TEMPLATES FALTANTES
-- Verifica se existem (ativos ou inativos) e desativa
-- Templates: Guia Nutracêutico, Guia Proteico, Mini E-book, Quiz Perfil Nutricional
-- ============================================

-- 1. VERIFICAR SE EXISTEM (ATIVOS OU INATIVOS)
SELECT 
  'VERIFICAÇÃO' as etapa,
  name as nome,
  type as tipo,
  is_active,
  slug,
  created_at,
  CASE 
    WHEN is_active = true THEN '⚠️ Está ativo - será desativado'
    WHEN is_active = false THEN '✅ Já está inativo'
    ELSE '❓ Não existe'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    (name = 'Guia Nutracêutico' AND type = 'guia')
    OR (name = 'Guia Proteico' AND type = 'guia')
    OR (name = 'Mini E-book' AND type = 'guia')
    OR (name = 'Quiz Perfil Nutricional' AND type = 'quiz')
  )
ORDER BY is_active DESC, type, name;

-- 2. DESATIVAR SE EXISTIREM E ESTIVEREM ATIVOS
UPDATE templates_nutrition
SET 
  is_active = false,
  updated_at = NOW()
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true
  AND (
    (name = 'Guia Nutracêutico' AND type = 'guia')
    OR (name = 'Guia Proteico' AND type = 'guia')
    OR (name = 'Mini E-book' AND type = 'guia')
    OR (name = 'Quiz Perfil Nutricional' AND type = 'quiz')
  );

-- 3. VERIFICAR DEPOIS
SELECT 
  'DEPOIS' as etapa,
  name as nome,
  type as tipo,
  is_active,
  updated_at,
  CASE 
    WHEN is_active = false THEN '✅ Desativado'
    ELSE '⚠️ Ainda ativo'
  END as status
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND (
    (name = 'Guia Nutracêutico' AND type = 'guia')
    OR (name = 'Guia Proteico' AND type = 'guia')
    OR (name = 'Mini E-book' AND type = 'guia')
    OR (name = 'Quiz Perfil Nutricional' AND type = 'quiz')
  )
ORDER BY type, name;

-- 4. CONTAGEM FINAL
SELECT 
  '📊 RESUMO FINAL' as info,
  COUNT(*) as total_ativos,
  COUNT(CASE WHEN type = 'calculadora' THEN 1 END) as calculadoras,
  COUNT(CASE WHEN type = 'planilha' THEN 1 END) as planilhas,
  COUNT(CASE WHEN type = 'guia' THEN 1 END) as guias,
  COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizzes
FROM templates_nutrition
WHERE profession = 'wellness'
  AND language = 'pt'
  AND is_active = true;


