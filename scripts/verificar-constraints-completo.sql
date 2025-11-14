-- =====================================================
-- VERIFICAÇÃO COMPLETA DAS CONSTRAINTS
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. Verificar todas as constraints UNIQUE em user_templates
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as columns,
  CASE 
    WHEN tc.constraint_name = 'user_templates_slug_user_id_unique' THEN '✅ CORRETO - Permite mesmo slug para diferentes usuários'
    WHEN tc.constraint_name LIKE '%slug%' AND tc.constraint_name != 'user_templates_slug_user_id_unique' THEN '⚠️ PROBLEMA - Constraint apenas no slug'
    ELSE 'ℹ️ Outra constraint'
  END as status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'user_templates'
  AND tc.constraint_type = 'UNIQUE'
GROUP BY tc.table_name, tc.constraint_name, tc.constraint_type
ORDER BY tc.constraint_name;

-- 2. Verificar se existe constraint problemática (UNIQUE apenas no slug)
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '⚠️ ATENÇÃO: Existe constraint UNIQUE apenas no slug!'
    ELSE '✅ OK: Não existe constraint UNIQUE apenas no slug'
  END as status,
  COUNT(*) as constraints_problematicas
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND table_name = 'user_templates'
  AND constraint_type = 'UNIQUE'
  AND constraint_name IN ('user_templates_slug_key', 'user_templates_slug_unique')
  AND constraint_name != 'user_templates_slug_user_id_unique';

-- 3. Confirmar que a constraint composta existe
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PERFEITO: Constraint UNIQUE composta (slug + user_id) existe!'
    ELSE '❌ PROBLEMA: Constraint UNIQUE composta (slug + user_id) NÃO existe!'
  END as status,
  COUNT(*) as constraint_composta_existe
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND table_name = 'user_templates'
  AND constraint_type = 'UNIQUE'
  AND constraint_name = 'user_templates_slug_user_id_unique';

-- 4. Resumo final
SELECT 
  '📊 RESUMO FINAL' as titulo,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'user_templates'
        AND constraint_type = 'UNIQUE'
        AND constraint_name = 'user_templates_slug_user_id_unique'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'user_templates'
        AND constraint_type = 'UNIQUE'
        AND constraint_name IN ('user_templates_slug_key', 'user_templates_slug_unique')
    ) THEN '✅ TUDO CORRETO! O banco está configurado perfeitamente para permitir mesmo slug para diferentes usuários.'
    WHEN EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'user_templates'
        AND constraint_type = 'UNIQUE'
        AND constraint_name IN ('user_templates_slug_key', 'user_templates_slug_unique')
    ) THEN '⚠️ PRECISA CORRIGIR: Execute o script fix-slug-unique-constraints.sql'
    ELSE '❌ PRECISA CRIAR: Execute o script fix-slug-unique-constraints.sql'
  END as resultado;

