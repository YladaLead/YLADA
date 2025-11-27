-- =====================================================
-- VERIFICAR TODAS AS ASSINATURAS: Usuário "andre"
-- Verificar assinaturas em todas as áreas
-- =====================================================

-- Buscar user_id
SELECT 
  '👤 USUÁRIO' as tipo_info,
  id as user_id,
  user_slug,
  nome_completo,
  email
FROM user_profiles
WHERE user_slug = 'andre';

-- Verificar TODAS as assinaturas (todas as áreas)
SELECT 
  '📊 TODAS AS ASSINATURAS' as tipo_info,
  s.id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  s.features,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ ATIVA E VÁLIDA'
    WHEN s.status = 'active' AND s.current_period_end <= NOW() THEN '❌ ATIVA MAS EXPIRADA'
    ELSE '❌ INATIVA'
  END as status_detalhado,
  s.created_at,
  s.updated_at
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.id
WHERE up.user_slug = 'andre'
ORDER BY s.area, s.created_at DESC;

-- Verificar se tem assinatura em outras áreas que pode ser copiada
SELECT 
  '🔄 ASSINATURAS PARA COPIAR' as tipo_info,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  s.features,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ PODE SER USADA COMO REFERÊNCIA'
    ELSE '❌ NÃO PODE SER USADA'
  END as pode_copiar
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.id
WHERE up.user_slug = 'andre'
  AND s.status = 'active'
  AND s.current_period_end > NOW()
ORDER BY s.area;

