-- =====================================================
-- LIMPAR DUPLICATAS E MANTER APENAS TEMPLATES ATIVOS
-- =====================================================
-- Este script remove duplicatas e mantém apenas templates ativos
-- na tabela coach_templates_nutrition

-- =====================================================
-- 1. VERIFICAR ESTADO ATUAL
-- =====================================================
SELECT 
  'ANTES DA LIMPEZA' as etapa,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos,
  COUNT(DISTINCT name || '-' || type || '-' || language) as unicos_por_nome_tipo_idioma
FROM coach_templates_nutrition;

-- =====================================================
-- 2. IDENTIFICAR DUPLICATAS
-- =====================================================
-- Mostrar templates duplicados (mesmo name + type + language)
SELECT 
  name,
  type,
  language,
  COUNT(*) as quantidade,
  STRING_AGG(id::text, ', ') as ids
FROM coach_templates_nutrition
GROUP BY name, type, language
HAVING COUNT(*) > 1
ORDER BY quantidade DESC, name;

-- =====================================================
-- 3. REMOVER DUPLICATAS (MANTER APENAS O MAIS RECENTE E ATIVO)
-- =====================================================
-- Estratégia: Para cada grupo de duplicatas, manter apenas:
-- 1. O que está ativo (is_active = true)
-- 2. Se todos estão ativos ou inativos, manter o mais recente (updated_at mais recente)
-- 3. Se empate, manter o com ID menor (mais antigo na criação)

DELETE FROM coach_templates_nutrition
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY name, type, language
        ORDER BY 
          is_active DESC, -- Ativos primeiro
          updated_at DESC, -- Mais recente primeiro
          id ASC -- Em caso de empate, manter o mais antigo
      ) as rn
    FROM coach_templates_nutrition
  ) ranked
  WHERE rn > 1 -- Manter apenas o primeiro (rn = 1)
);

-- =====================================================
-- 4. REMOVER TEMPLATES INATIVOS
-- =====================================================
-- Remover todos os templates inativos (manter apenas ativos)
DELETE FROM coach_templates_nutrition
WHERE is_active = false;

-- =====================================================
-- 5. VERIFICAR ESTADO DEPOIS DA LIMPEZA
-- =====================================================
SELECT 
  'DEPOIS DA LIMPEZA' as etapa,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos,
  COUNT(DISTINCT name || '-' || type || '-' || language) as unicos_por_nome_tipo_idioma
FROM coach_templates_nutrition;

-- =====================================================
-- 6. COMPARAR COM NUTRI (TEMPLATES ÚNICOS ATIVOS)
-- =====================================================
SELECT 
  'Comparação Final' as info,
  (SELECT COUNT(DISTINCT name || '-' || type || '-' || language) 
   FROM templates_nutrition 
   WHERE is_active = true 
   AND language = 'pt'
   AND (profession = 'nutri' OR profession IS NULL OR profession = '')) as nutri_unicos_ativos,
  (SELECT COUNT(*) 
   FROM coach_templates_nutrition 
   WHERE is_active = true) as coach_unicos_ativos,
  (SELECT COUNT(DISTINCT name || '-' || type || '-' || language) 
   FROM templates_nutrition 
   WHERE is_active = true 
   AND language = 'pt'
   AND (profession = 'nutri' OR profession IS NULL OR profession = '')) - 
  (SELECT COUNT(*) 
   FROM coach_templates_nutrition 
   WHERE is_active = true) as diferenca;

-- =====================================================
-- 7. LISTAR TEMPLATES FINAIS (PARA VERIFICAÇÃO)
-- =====================================================
SELECT 
  name,
  type,
  language,
  is_active,
  slug,
  created_at
FROM coach_templates_nutrition
ORDER BY name, type, language;

