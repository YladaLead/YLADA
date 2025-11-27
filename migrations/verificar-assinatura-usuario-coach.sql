-- =====================================================
-- VERIFICAR ASSINATURA: Usuário Coach
-- Verificar se o usuário "andre" tem assinatura ativa para Coach
-- =====================================================

-- Buscar user_id pelo user_slug
SELECT 
  '🔍 BUSCAR USER_ID' as info,
  id as user_id,
  user_slug,
  nome_completo,
  email
FROM user_profiles
WHERE user_slug = 'andre';

-- Verificar assinaturas do usuário (substitua USER_ID_AQUI pelo user_id encontrado acima)
-- Exemplo: WHERE user_id = 'USER_ID_AQUI'
SELECT 
  '📊 ASSINATURAS DO USUÁRIO' as info,
  id,
  user_id,
  area,
  plan_type,
  status,
  current_period_end,
  CASE 
    WHEN status = 'active' AND current_period_end > NOW() THEN '✅ ATIVA'
    WHEN status = 'active' AND current_period_end <= NOW() THEN '❌ EXPIRADA'
    ELSE '❌ INATIVA'
  END as status_detalhado,
  features,
  created_at
FROM subscriptions
WHERE user_id IN (SELECT id FROM user_profiles WHERE user_slug = 'andre')
ORDER BY created_at DESC;

-- Verificar ferramenta criada
SELECT 
  '🔧 FERRAMENTA CRIADA' as info,
  id,
  user_id,
  title,
  slug,
  template_slug,
  status,
  profession,
  created_at
FROM coach_user_templates
WHERE slug = 'calculadora-de-proteina'
  AND user_id IN (SELECT id FROM user_profiles WHERE user_slug = 'andre')
ORDER BY created_at DESC;

-- Verificar se há assinatura ativa para Coach
SELECT 
  '✅ VERIFICAR ASSINATURA ATIVA COACH' as info,
  COUNT(*) as total_assinaturas_ativas,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ TEM ASSINATURA ATIVA'
    ELSE '❌ NÃO TEM ASSINATURA ATIVA'
  END as status
FROM subscriptions
WHERE user_id IN (SELECT id FROM user_profiles WHERE user_slug = 'andre')
  AND area = 'coach'
  AND status = 'active'
  AND current_period_end > NOW();

