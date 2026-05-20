-- =====================================================
-- CORREÇÃO: Foreign Key user_templates.user_id
-- =====================================================
-- PROBLEMA: user_templates.user_id está referenciando tabela 'users' customizada
-- SOLUÇÃO: Alterar para referenciar auth.users (Supabase Auth)

-- Verificar se a constraint existe e qual tabela referencia
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'user_templates'
  AND kcu.column_name = 'user_id';

-- Remover constraint antiga se existir
ALTER TABLE user_templates 
DROP CONSTRAINT IF EXISTS user_templates_user_id_fkey;

-- Adicionar nova constraint apontando para auth.users
ALTER TABLE user_templates
ADD CONSTRAINT user_templates_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Verificar se foi aplicado corretamente
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'user_templates'
  AND kcu.column_name = 'user_id';



