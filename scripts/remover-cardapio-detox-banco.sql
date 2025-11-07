-- =====================================================
-- REMOVER TEMPLATE "CARDÁPIO DETOX" DO BANCO DE DADOS
-- =====================================================

-- ⚠️ ATENÇÃO: Este script remove o template "Cardápio Detox" do banco
-- Execute apenas se tiver certeza que quer remover permanentemente

-- 1. Desativar template "Cardápio Detox" (método seguro - não remove, apenas desativa)
UPDATE templates_nutrition
SET is_active = false
WHERE name = 'Cardápio Detox' 
  AND profession = 'wellness'
  AND language = 'pt';

-- 2. Verificar quantos registros foram afetados
SELECT 
  COUNT(*) as total_desativados,
  name,
  profession,
  language,
  is_active
FROM templates_nutrition
WHERE name = 'Cardápio Detox'
GROUP BY name, profession, language, is_active;

-- 3. (OPCIONAL) Remover permanentemente do banco
-- ⚠️ CUIDADO: Isso remove permanentemente. Use apenas se tiver certeza!
-- DELETE FROM templates_nutrition
-- WHERE name = 'Cardápio Detox' 
--   AND profession = 'wellness'
--   AND language = 'pt';

-- 4. Verificar se há ferramentas criadas a partir deste template
SELECT 
  ut.id,
  ut.slug,
  ut.title,
  ut.user_id,
  t.name as template_name
FROM user_templates ut
JOIN templates_nutrition t ON ut.template_id = t.id
WHERE t.name = 'Cardápio Detox'
  AND t.profession = 'wellness';

-- NOTA: Se houver ferramentas criadas, você pode:
-- - Deixá-las (continuarão funcionando)
-- - Ou desativá-las também:
-- UPDATE user_templates
-- SET status = 'inactive'
-- WHERE template_id IN (
--   SELECT id FROM templates_nutrition 
--   WHERE name = 'Cardápio Detox' AND profession = 'wellness'
-- );

