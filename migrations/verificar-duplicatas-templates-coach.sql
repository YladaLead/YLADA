-- =====================================================
-- VERIFICAR DUPLICATAS E ESTADO DOS TEMPLATES COACH
-- =====================================================
-- Este script APENAS VERIFICA, não remove nada
-- Execute para ver o estado atual antes de limpar

-- =====================================================
-- 1. ESTATÍSTICAS GERAIS
-- =====================================================
SELECT 
  'Estatísticas Gerais' as info,
  COUNT(*) as total_templates,
  COUNT(*) FILTER (WHERE is_active = true) as ativos,
  COUNT(*) FILTER (WHERE is_active = false) as inativos,
  COUNT(DISTINCT name || '-' || type || '-' || language) as templates_unicos
FROM coach_templates_nutrition;

-- =====================================================
-- 2. IDENTIFICAR DUPLICATAS
-- =====================================================
SELECT 
  'Duplicatas Encontradas' as info,
  name,
  type,
  language,
  COUNT(*) as quantidade_duplicatas,
  COUNT(*) FILTER (WHERE is_active = true) as quantos_ativos,
  COUNT(*) FILTER (WHERE is_active = false) as quantos_inativos,
  STRING_AGG(id::text, ', ' ORDER BY is_active DESC, updated_at DESC) as ids_duplicados
FROM coach_templates_nutrition
GROUP BY name, type, language
HAVING COUNT(*) > 1
ORDER BY quantidade_duplicatas DESC, name;

-- =====================================================
-- 3. COMPARAR COM NUTRI (TEMPLATES ÚNICOS ATIVOS)
-- =====================================================
SELECT 
  'Comparação com Nutri' as info,
  (SELECT COUNT(DISTINCT name || '-' || type || '-' || language) 
   FROM templates_nutrition 
   WHERE is_active = true 
   AND language = 'pt'
   AND (profession = 'nutri' OR profession IS NULL OR profession = '')) as nutri_unicos_ativos,
  (SELECT COUNT(DISTINCT name || '-' || type || '-' || language) 
   FROM coach_templates_nutrition 
   WHERE is_active = true) as coach_unicos_ativos,
  (SELECT COUNT(*) 
   FROM coach_templates_nutrition 
   WHERE is_active = true) as coach_total_ativos,
  (SELECT COUNT(*) 
   FROM coach_templates_nutrition 
   WHERE is_active = false) as coach_total_inativos;

-- =====================================================
-- 4. TEMPLATES QUE SERIAM REMOVIDOS (SE EXECUTAR LIMPEZA)
-- =====================================================
-- Mostrar quais templates seriam removidos na limpeza
SELECT 
  'Templates que seriam removidos' as info,
  c.name,
  c.type,
  c.language,
  c.is_active,
  c.id,
  c.updated_at,
  'Será mantido o mais recente/ativo do grupo' as motivo
FROM coach_templates_nutrition c
WHERE c.id IN (
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
  WHERE rn > 1 -- Seriam removidos (não são o primeiro)
)
ORDER BY c.name, c.type, c.language, c.is_active DESC, c.updated_at DESC;

-- =====================================================
-- 5. RESUMO FINAL
-- =====================================================
SELECT 
  'RESUMO' as info,
  (SELECT COUNT(*) FROM coach_templates_nutrition) as total_atual,
  (SELECT COUNT(*) FROM coach_templates_nutrition WHERE is_active = true) as ativos_atual,
  (SELECT COUNT(*) FROM coach_templates_nutrition WHERE is_active = false) as inativos_atual,
  (SELECT COUNT(*) FROM (
    SELECT name, type, language
    FROM coach_templates_nutrition
    GROUP BY name, type, language
    HAVING COUNT(*) > 1
  ) dup) as grupos_com_duplicatas,
  (SELECT COUNT(*) - COUNT(DISTINCT name || '-' || type || '-' || language) 
   FROM coach_templates_nutrition) as total_duplicatas_para_remover,
  (SELECT COUNT(DISTINCT name || '-' || type || '-' || language) 
   FROM coach_templates_nutrition 
   WHERE is_active = true) as unicos_ativos_apos_limpeza;

