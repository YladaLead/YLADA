-- Script para verificar se todas as colunas necessárias existem na tabela user_profiles

-- Verificar quais colunas existem
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Verificar constraints na tabela
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name = 'user_profiles';

-- Verificar se o perfil do usuário existe
SELECT 
    up.user_id,
    up.perfil,
    up.nome_completo,
    up.email,
    up.bio,
    up.user_slug,
    up.country_code,
    au.email as auth_email
FROM user_profiles up
LEFT JOIN auth.users au ON au.id = up.user_id
WHERE au.email = 'faulaandre@gmail.com';

