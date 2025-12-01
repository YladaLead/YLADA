-- Script para verificar se usuária está cadastrada na área Coach
-- Email: deise paulo@gmail.com (pode ter variações no formato)

-- Verificar usuário por email (com variações possíveis)
SELECT 
    u.id as user_id,
    u.email,
    up.nome_completo,
    up.perfil as perfil_usuario,
    s.area as area_assinatura,
    s.status as status_assinatura,
    s.current_period_end as vencimento_assinatura,
    u.created_at as data_criacao_conta
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
WHERE LOWER(TRIM(u.email)) LIKE '%deise%paulo%'
   OR LOWER(TRIM(u.email)) = 'deise paulo@gmail.com'
   OR LOWER(TRIM(u.email)) = 'deisepaulo@gmail.com'
   OR LOWER(TRIM(u.email)) = 'deise.paulo@gmail.com'
ORDER BY u.created_at DESC;

-- Verificar especificamente na área Coach
SELECT 
    u.id as user_id,
    u.email,
    up.nome_completo,
    up.perfil as perfil_usuario,
    s.area as area_assinatura,
    s.status as status_assinatura,
    s.current_period_end as vencimento_assinatura,
    CASE 
        WHEN up.perfil = 'coach' THEN '✅ Cadastrada na área Coach (perfil)'
        WHEN s.area = 'coach' THEN '✅ Tem assinatura ativa na área Coach'
        ELSE '❌ NÃO está na área Coach'
    END as status_coach
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
WHERE (LOWER(TRIM(u.email)) LIKE '%deise%paulo%'
   OR LOWER(TRIM(u.email)) = 'deise paulo@gmail.com'
   OR LOWER(TRIM(u.email)) = 'deisepaulo@gmail.com'
   OR LOWER(TRIM(u.email)) = 'deise.paulo@gmail.com')
  AND (up.perfil = 'coach' OR s.area = 'coach')
ORDER BY u.created_at DESC;

-- Verificar todas as áreas da usuária (se existir)
SELECT 
    u.id as user_id,
    u.email,
    up.nome_completo,
    up.perfil as perfil_usuario,
    s.area as assinatura_area,
    s.status as assinatura_status,
    s.current_period_end as vencimento,
    s.plan_type as tipo_plano
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id
WHERE LOWER(TRIM(u.email)) LIKE '%deise%paulo%'
   OR LOWER(TRIM(u.email)) = 'deise paulo@gmail.com'
   OR LOWER(TRIM(u.email)) = 'deisepaulo@gmail.com'
   OR LOWER(TRIM(u.email)) = 'deise.paulo@gmail.com'
ORDER BY s.created_at DESC;

