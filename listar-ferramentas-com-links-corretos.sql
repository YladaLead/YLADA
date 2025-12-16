-- ============================================
-- LISTAR TODAS AS FERRAMENTAS COM LINKS CORRETOS
-- ============================================
-- Este SQL mostra TODAS as ferramentas do usuário "andre"
-- e o link correto que deve ser gerado para cada uma
-- ============================================

SELECT 
  ut.id,
  ut.slug as tool_slug,
  ut.template_slug,
  ut.title,
  ut.status,
  up.user_slug,
  -- Link correto que deve ser gerado: /pt/wellness/[user_slug]/[tool_slug]
  CONCAT('https://www.ylada.com/pt/wellness/', up.user_slug, '/', ut.slug) as link_correto,
  -- Link que NÃO deve ser usado (template_slug)
  CONCAT('https://www.ylada.com/pt/wellness/', up.user_slug, '/', ut.template_slug) as link_errado_exemplo,
  ut.created_at
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'andre'
  AND ut.profession = 'wellness'
  AND ut.status = 'active'
ORDER BY 
  ut.template_slug,
  LENGTH(ut.slug) ASC,  -- Ordenar por slug mais curto primeiro
  ut.slug;

-- ============================================
-- RESUMO POR TEMPLATE_SLUG (TODAS AS FERRAMENTAS)
-- ============================================
-- Mostra quantas ferramentas existem para cada template
-- e qual é o slug mais curto (que deve ser priorizado)
-- SEM LIMITAÇÕES - TODAS AS FERRAMENTAS
-- ============================================

SELECT 
  ut.template_slug,
  COUNT(*) as total_ferramentas,
  STRING_AGG(ut.slug, ', ' ORDER BY LENGTH(ut.slug) ASC) as slugs_disponiveis,
  MIN(LENGTH(ut.slug)) as tamanho_slug_mais_curto,
  (
    SELECT ut2.slug 
    FROM user_templates ut2
    WHERE ut2.template_slug = ut.template_slug
      AND ut2.user_id = ut.user_id
      AND ut2.profession = 'wellness'
      AND ut2.status = 'active'
    ORDER BY LENGTH(ut2.slug) ASC, ut2.created_at DESC
    LIMIT 1
  ) as slug_recomendado,
  CONCAT('https://www.ylada.com/pt/wellness/andre/', 
    (
      SELECT ut2.slug 
      FROM user_templates ut2
      WHERE ut2.template_slug = ut.template_slug
        AND ut2.user_id = ut.user_id
        AND ut2.profession = 'wellness'
        AND ut2.status = 'active'
      ORDER BY LENGTH(ut2.slug) ASC, ut2.created_at DESC
      LIMIT 1
    )
  ) as link_recomendado
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'andre'
  AND ut.profession = 'wellness'
  AND ut.status = 'active'
GROUP BY ut.template_slug, ut.user_id
ORDER BY ut.template_slug;

-- ============================================
-- CONTAGEM TOTAL DE FERRAMENTAS
-- ============================================

SELECT 
  COUNT(*) as total_ferramentas_ativas,
  COUNT(DISTINCT ut.template_slug) as total_templates_diferentes
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'andre'
  AND ut.profession = 'wellness'
  AND ut.status = 'active';











