-- Script para verificar problemas de validação de slugs
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a coluna custom_slug existe
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'professional_links' 
AND column_name = 'custom_slug';

-- 2. Verificar índices na tabela
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'professional_links';

-- 3. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'professional_links';

-- 4. Verificar se RLS está ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'professional_links';

-- 5. Testar consulta simples (deve funcionar sem erro 406)
SELECT id, custom_slug, project_name, tool_name 
FROM professional_links 
WHERE custom_slug = 'andre-faula-imc' 
LIMIT 1;

-- 6. Verificar links existentes com slug similar
SELECT id, custom_slug, project_name, tool_name, created_at
FROM professional_links 
WHERE custom_slug LIKE 'andre-faula-%'
ORDER BY created_at DESC;
