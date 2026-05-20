-- =====================================================
-- VERIFICAR SINCRONIZAÇÃO DE PERFIL
-- =====================================================
-- Este script verifica se os dados editados na área
-- de configuração estão sendo salvos corretamente
-- =====================================================

-- 1. VER TODOS OS PERFIS WELLNESS COM DADOS COMPLETOS
SELECT 
  au.email,
  up.nome_completo,
  up.whatsapp,
  up.country_code,
  up.bio,
  up.user_slug,
  up.perfil,
  up.updated_at,
  CASE 
    WHEN up.whatsapp IS NOT NULL THEN '✅ Tem WhatsApp'
    ELSE '⚠️ Sem WhatsApp'
  END as status_whatsapp,
  CASE 
    WHEN up.updated_at >= NOW() - INTERVAL '24 hours' THEN '🟢 Atualizado recentemente'
    WHEN up.updated_at >= NOW() - INTERVAL '7 days' THEN '🟡 Atualizado esta semana'
    ELSE '🔴 Atualizado há mais de 7 dias'
  END as status_atualizacao
FROM auth.users au
JOIN user_profiles up ON au.id = up.user_id
WHERE up.perfil = 'wellness'
ORDER BY up.updated_at DESC;

-- 2. VER PERFIS COM WHATSAPP PREENCHIDO
SELECT 
  email,
  nome_completo,
  whatsapp,
  country_code,
  updated_at
FROM user_profiles
WHERE perfil = 'wellness'
  AND whatsapp IS NOT NULL
ORDER BY updated_at DESC;

-- 3. VER PERFIS SEM WHATSAPP (precisam preencher)
SELECT 
  email,
  nome_completo,
  whatsapp,
  updated_at
FROM user_profiles
WHERE perfil = 'wellness'
  AND whatsapp IS NULL
ORDER BY updated_at DESC;

-- 4. VER ÚLTIMAS 10 ATUALIZAÇÕES
SELECT 
  email,
  nome_completo,
  whatsapp,
  country_code,
  updated_at,
  EXTRACT(EPOCH FROM (NOW() - updated_at)) / 3600 as horas_atras
FROM user_profiles
WHERE perfil = 'wellness'
ORDER BY updated_at DESC
LIMIT 10;

-- 5. VERIFICAR SE TODOS OS CAMPOS ESTÃO SENDO SALVOS
SELECT 
  COUNT(*) as total_wellness,
  COUNT(nome_completo) as tem_nome,
  COUNT(whatsapp) as tem_whatsapp,
  COUNT(country_code) as tem_country_code,
  COUNT(bio) as tem_bio,
  COUNT(user_slug) as tem_user_slug,
  COUNT(updated_at) as tem_updated_at
FROM user_profiles
WHERE perfil = 'wellness';

-- 6. VER PERFIS DE USUÁRIOS MIGRADOS (verificar se dados foram salvos)
SELECT 
  au.email,
  up.nome_completo,
  up.whatsapp,
  up.country_code,
  up.updated_at,
  s.is_migrated,
  s.plan_type
FROM auth.users au
JOIN user_profiles up ON au.id = up.user_id
LEFT JOIN subscriptions s ON s.user_id = au.id
WHERE s.is_migrated = true
ORDER BY up.updated_at DESC;

