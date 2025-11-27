-- =====================================================
-- DIAGNOSTICAR ERRO 403: Calculadora de Proteína
-- Verificar se ferramenta existe e se usuário tem assinatura
-- =====================================================

-- 1. Buscar informações do usuário "andre"
WITH usuario_info AS (
  SELECT 
    id as user_id,
    user_slug,
    nome_completo,
    email
  FROM user_profiles
  WHERE user_slug = 'andre'
)
-- 2. Verificar ferramenta criada
SELECT 
  '🔧 FERRAMENTA CRIADA' as tipo_info,
  ct.id as ferramenta_id,
  ct.user_id,
  ct.title,
  ct.slug,
  ct.template_slug,
  ct.status,
  ct.profession,
  ct.created_at,
  up.user_slug,
  CASE 
    WHEN ct.status = 'active' THEN '✅ ATIVA'
    ELSE '❌ INATIVA'
  END as status_ferramenta
FROM coach_user_templates ct
JOIN user_profiles up ON ct.user_id = up.id
WHERE up.user_slug = 'andre'
  AND ct.slug = 'calculadora-de-proteina'
ORDER BY ct.created_at DESC;

-- 3. Verificar assinaturas do usuário
SELECT 
  '📊 ASSINATURAS' as tipo_info,
  s.id,
  s.area,
  s.plan_type,
  s.status,
  s.current_period_end,
  s.features,
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > NOW() THEN '✅ ATIVA E VÁLIDA'
    WHEN s.status = 'active' AND s.current_period_end <= NOW() THEN '❌ ATIVA MAS EXPIRADA'
    WHEN s.status = 'active' THEN '⚠️ ATIVA MAS PERÍODO INVÁLIDO'
    ELSE '❌ INATIVA'
  END as status_detalhado,
  s.created_at
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.id
WHERE up.user_slug = 'andre'
ORDER BY s.created_at DESC;

-- 4. Verificar especificamente assinatura Coach
SELECT 
  '✅ ASSINATURA COACH ATIVA?' as tipo_info,
  COUNT(*) as total_assinaturas_ativas,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ SIM - TEM ASSINATURA ATIVA'
    ELSE '❌ NÃO - NÃO TEM ASSINATURA ATIVA'
  END as resultado,
  MAX(s.current_period_end) as periodo_fim_mais_recente
FROM subscriptions s
JOIN user_profiles up ON s.user_id = up.id
WHERE up.user_slug = 'andre'
  AND s.area = 'coach'
  AND s.status = 'active'
  AND s.current_period_end > NOW();

-- 5. Verificar se ferramenta pode ser acessada (simulação da query da API)
SELECT 
  '🔍 SIMULAÇÃO QUERY API' as tipo_info,
  ct.id as ferramenta_id,
  ct.slug,
  ct.status,
  ct.profession,
  up.user_slug,
  up.id as user_id,
  CASE 
    WHEN ct.status = 'active' AND ct.profession = 'coach' AND up.user_slug = 'andre' THEN '✅ DEVERIA SER ENCONTRADA'
    ELSE '❌ NÃO SERIA ENCONTRADA'
  END as status_busca
FROM coach_user_templates ct
JOIN user_profiles up ON ct.user_id = up.id
WHERE up.user_slug = 'andre'
  AND ct.slug = 'calculadora-de-proteina'
  AND ct.profession = 'coach'
  AND ct.status = 'active';

