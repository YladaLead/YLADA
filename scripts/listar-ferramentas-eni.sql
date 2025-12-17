-- =====================================================
-- SCRIPT: Listar Todas as Ferramentas do Eni (Wellness)
-- =====================================================
-- Este script lista TODAS as ferramentas ativas do Eni
-- para verificar se o problema da seção Hero genérica
-- está ocorrendo em todas elas
-- =====================================================

-- 1. Primeiro, encontrar o user_slug do Eni
SELECT 
  up.user_slug,
  up.nome_completo,
  au.email,
  COUNT(ut.id) as total_ferramentas_ativas
FROM user_profiles up
INNER JOIN auth.users au ON au.id = up.user_id
LEFT JOIN user_templates ut ON ut.user_id = up.user_id 
  AND ut.profession = 'wellness' 
  AND ut.status = 'active'
WHERE 
  (up.nome_completo ILIKE '%eni%' 
   OR au.email ILIKE '%eni%'
   OR up.user_slug ILIKE '%eni%')
GROUP BY up.user_slug, up.nome_completo, au.email
ORDER BY total_ferramentas_ativas DESC;

-- =====================================================
-- 2. Listar TODAS as ferramentas do Eni com links
-- =====================================================
-- Substitua 'eni' pelo user_slug encontrado acima
-- =====================================================

SELECT 
  ut.id,
  ut.slug as tool_slug,
  ut.template_slug,
  ut.title,
  ut.description,
  ut.emoji,
  ut.status,
  up.user_slug,
  -- Link completo que será acessado pelo cliente
  CONCAT('https://www.ylada.com/pt/wellness/', up.user_slug, '/', ut.slug) as link_completo,
  ut.created_at,
  ut.views as visualizacoes,
  ut.leads_count as leads
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'eni'  -- ⚠️ SUBSTITUA pelo user_slug encontrado acima se for diferente
  AND ut.profession = 'wellness'
  AND ut.status = 'active'
ORDER BY 
  ut.template_slug,
  ut.created_at DESC;

-- =====================================================
-- 3. Resumo por template_slug
-- =====================================================
-- Mostra quantas ferramentas existem para cada template
-- =====================================================

SELECT 
  ut.template_slug,
  COUNT(*) as total_ferramentas,
  STRING_AGG(ut.slug, ', ' ORDER BY LENGTH(ut.slug) ASC) as slugs_disponiveis,
  (
    SELECT ut2.slug 
    FROM user_templates ut2
    WHERE ut2.template_slug = ut.template_slug
      AND ut2.user_id = ut.user_id
      AND ut2.profession = 'wellness'
      AND ut2.status = 'active'
    ORDER BY LENGTH(ut2.slug) ASC, ut2.created_at DESC
    LIMIT 1
  ) as slug_principal,
  CONCAT('https://www.ylada.com/pt/wellness/eni/', 
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
  ) as link_principal
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'eni'  -- ⚠️ SUBSTITUA pelo user_slug encontrado acima se for diferente
  AND ut.profession = 'wellness'
  AND ut.status = 'active'
GROUP BY ut.template_slug, ut.user_id
ORDER BY ut.template_slug;

-- =====================================================
-- 4. Contagem total
-- =====================================================

SELECT 
  COUNT(*) as total_ferramentas_ativas,
  COUNT(DISTINCT ut.template_slug) as total_templates_diferentes
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'eni'  -- ⚠️ SUBSTITUA pelo user_slug encontrado acima se for diferente
  AND ut.profession = 'wellness'
  AND ut.status = 'active';


