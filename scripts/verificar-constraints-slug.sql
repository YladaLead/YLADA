-- =====================================================
-- VERIFICAR CONSTRAINTS DE SLUG NO BANCO
-- Execute este script no Supabase SQL Editor para verificar
-- =====================================================

-- Verificar constraints UNIQUE em user_templates
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'user_templates'
  AND tc.constraint_type = 'UNIQUE'
GROUP BY tc.table_name, tc.constraint_name, tc.constraint_type
ORDER BY tc.constraint_name;

-- Verificar se há constraint UNIQUE apenas no slug (PROBLEMA)
-- Se existir, precisa ser removida
SELECT 
  '⚠️ PROBLEMA ENCONTRADO' as status,
  constraint_name,
  'Constraint UNIQUE apenas no slug - precisa ser removida' as problema
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND table_name = 'user_templates'
  AND constraint_type = 'UNIQUE'
  AND constraint_name IN ('user_templates_slug_key', 'user_templates_slug_unique');

-- Verificar se há constraint UNIQUE composta (slug + user_id) (CORRETO)
SELECT 
  '✅ CORRETO' as status,
  constraint_name,
  'Constraint UNIQUE composta (slug + user_id) - permite mesmo slug para diferentes usuários' as status_desc
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND table_name = 'user_templates'
  AND constraint_type = 'UNIQUE'
  AND constraint_name = 'user_templates_slug_user_id_unique';

-- Verificar índices em user_templates
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'user_templates'
ORDER BY indexname;

