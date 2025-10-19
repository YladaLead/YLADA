-- ========================================
-- CRIAR USUÁRIO DE TESTE NO SUPABASE
-- ========================================

-- Inserir usuário de teste
INSERT INTO users (id, email, name, subscription_tier, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'maria@teste.com', 'Maria Silva', 'pro', true);

-- Inserir perfil de teste (usando nomes em inglês que já existem)
INSERT INTO user_profiles (
    user_id, 
    profession, 
    specialization, 
    target_audience, 
    main_objective,
    preferred_tool_type,
    ai_personality,
    use_emojis
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'nutricionista',
    'emagrecimento', 
    'iniciantes',
    'capturar-leads',
    'quiz',
    'profissional',
    true
);

-- ========================================
-- VERIFICAR SE FOI CRIADO CORRETAMENTE
-- ========================================

-- Verificar usuário criado
SELECT 
    'USUÁRIO CRIADO:' as info,
    id,
    email,
    name,
    subscription_tier,
    is_active
FROM users 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Verificar perfil criado
SELECT 
    'PERFIL CRIADO:' as info,
    user_id,
    profession,
    specialization,
    target_audience,
    main_objective,
    preferred_tool_type
FROM user_profiles 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- ========================================
-- VER TEMPLATES DISPONÍVEIS PARA NUTRICIONISTA
-- ========================================

SELECT 
    'TEMPLATES DISPONÍVEIS:' as info,
    id,
    name,
    type,
    profession,
    specialization,
    objective,
    description
FROM templates_base 
WHERE profession = 'nutricionista' 
AND is_active = true
ORDER BY type;
