-- ============================================
-- LISTAR TODAS AS 7 FERRAMENTAS ATIVAS
-- ============================================
-- Este SQL mostra TODAS as 7 ferramentas do usuário "andre"
-- com o link correto que DEVE ser gerado
-- ============================================

SELECT 
  ut.id,
  ut.slug as tool_slug,
  ut.template_slug,
  ut.title,
  ut.status,
  up.user_slug,
  -- Link correto que DEVE ser gerado: /pt/wellness/[user_slug]/[tool_slug]
  CONCAT('https://www.ylada.com/pt/wellness/', up.user_slug, '/', ut.slug) as link_correto,
  ut.created_at
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'andre'
  AND ut.profession = 'wellness'
  AND ut.status = 'active'
ORDER BY 
  ut.template_slug,
  LENGTH(ut.slug) ASC,
  ut.slug;



















