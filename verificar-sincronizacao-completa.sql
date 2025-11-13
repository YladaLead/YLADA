-- =====================================================
-- VERIFICAR SINCRONIZAÇÃO COMPLETA DE PERFIL
-- =====================================================
-- Este script verifica se todos os campos editados
-- pelo usuário estão sendo sincronizados corretamente
-- =====================================================

-- 1. VERIFICAR SINCRONIZAÇÃO DE EMAIL E PROFESSION
SELECT 
  up.user_id,
  up.email as email_profile,
  au.email as email_auth,
  up.nome_completo,
  up.whatsapp,
  up.country_code,
  up.bio,
  up.user_slug,
  up.perfil,
  up.profession,
  up.updated_at,
  CASE 
    WHEN up.email = au.email OR up.email IS NULL THEN '✅ Email OK'
    ELSE '⚠️ Email diferente'
  END as status_email,
  CASE 
    WHEN up.profession = 'wellness' AND up.perfil = 'wellness' THEN '✅ Profession OK'
    WHEN up.profession IS NULL THEN '⚠️ Profession NULL'
    ELSE '⚠️ Profession diferente'
  END as status_profession
FROM user_profiles up
JOIN auth.users au ON up.user_id = au.id
WHERE up.perfil = 'wellness'
ORDER BY up.updated_at DESC
LIMIT 20;

-- 2. VERIFICAR CAMPOS QUE DEVEM ESTAR SINCRONIZADOS
SELECT 
  COUNT(*) as total_wellness,
  COUNT(nome_completo) as tem_nome,
  COUNT(email) as tem_email,
  COUNT(whatsapp) as tem_whatsapp,
  COUNT(country_code) as tem_country_code,
  COUNT(bio) as tem_bio,
  COUNT(user_slug) as tem_user_slug,
  COUNT(perfil) as tem_perfil,
  COUNT(profession) as tem_profession,
  COUNT(updated_at) as tem_updated_at
FROM user_profiles
WHERE perfil = 'wellness';

-- 3. VERIFICAR SE EMAIL ESTÁ SINCRONIZADO COM AUTH.USERS
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE up.email = au.email) as emails_sincronizados,
  COUNT(*) FILTER (WHERE up.email != au.email OR up.email IS NULL) as emails_diferentes
FROM user_profiles up
JOIN auth.users au ON up.user_id = au.id
WHERE up.perfil = 'wellness';

-- 4. VERIFICAR SE PROFESSION ESTÁ SINCRONIZADO
SELECT 
  perfil,
  profession,
  COUNT(*) as quantidade,
  CASE 
    WHEN perfil = 'wellness' AND profession = 'wellness' THEN '✅ Sincronizado'
    WHEN perfil = 'wellness' AND profession IS NULL THEN '⚠️ Profession NULL'
    WHEN perfil = 'wellness' AND profession != 'wellness' THEN '⚠️ Profession diferente'
    ELSE '❓ Outro'
  END as status
FROM user_profiles
WHERE perfil = 'wellness'
GROUP BY perfil, profession
ORDER BY quantidade DESC;

-- 5. VER ÚLTIMAS ATUALIZAÇÕES (verificar se dados foram salvos recentemente)
SELECT 
  up.email,
  up.nome_completo,
  up.whatsapp,
  up.country_code,
  up.perfil,
  up.profession,
  up.updated_at,
  EXTRACT(EPOCH FROM (NOW() - up.updated_at)) / 3600 as horas_atras,
  CASE 
    WHEN up.updated_at >= NOW() - INTERVAL '1 hour' THEN '🟢 Atualizado há menos de 1 hora'
    WHEN up.updated_at >= NOW() - INTERVAL '24 hours' THEN '🟡 Atualizado nas últimas 24h'
    ELSE '🔴 Atualizado há mais de 24h'
  END as status_atualizacao
FROM user_profiles up
WHERE up.perfil = 'wellness'
ORDER BY up.updated_at DESC
LIMIT 10;

-- 6. VERIFICAR CAMPOS FALTANDO (para identificar problemas)
SELECT 
  email,
  nome_completo,
  CASE 
    WHEN whatsapp IS NULL THEN '⚠️ Sem WhatsApp'
    ELSE '✅ Tem WhatsApp'
  END as status_whatsapp,
  CASE 
    WHEN country_code IS NULL THEN '⚠️ Sem Country Code'
    ELSE '✅ Tem Country Code'
  END as status_country_code,
  CASE 
    WHEN profession IS NULL THEN '⚠️ Sem Profession'
    ELSE '✅ Tem Profession'
  END as status_profession,
  updated_at
FROM user_profiles
WHERE perfil = 'wellness'
  AND (
    whatsapp IS NULL 
    OR country_code IS NULL 
    OR profession IS NULL
  )
ORDER BY updated_at DESC;

