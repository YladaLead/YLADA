-- =====================================================
-- REMOVER PROFESSION='nutri' DOS TEMPLATES PT
-- Para restaurar o comportamento anterior
-- =====================================================

-- Atualizar templates PT que têm profession='nutri' para NULL
-- Isso faz com que a API retorne todos os templates PT (comportamento original)
UPDATE templates_nutrition 
SET profession = NULL
WHERE (language = 'pt' OR language LIKE 'pt%')
AND profession = 'nutri';

-- Verificar resultado
SELECT 
  COUNT(*) as total_sem_profession,
  'Templates PT sem profession' as info
FROM templates_nutrition
WHERE (language = 'pt' OR language LIKE 'pt%')
AND (profession IS NULL OR profession = '');

