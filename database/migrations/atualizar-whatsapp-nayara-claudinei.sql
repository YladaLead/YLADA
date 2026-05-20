-- =====================================================
-- ATUALIZAR WHATSAPP DE NAYARA E CLAUDINEI
-- =====================================================
-- Execute este script APÓS eles preencherem o cadastro novamente
-- OU atualize manualmente com os números corretos
-- =====================================================

-- 1. VER DADOS ATUAIS
SELECT 
  au.email,
  up.nome_completo,
  up.whatsapp,
  up.updated_at
FROM auth.users au
JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'naytenutri@gmail.com',
  'claubemestar@gmail.com'
);

-- 2. ATUALIZAR WHATSAPP (SUBSTITUA PELOS NÚMEROS REAIS)
-- Descomente e ajuste os números antes de executar:

/*
UPDATE user_profiles
SET 
  whatsapp = '5519981385563',  -- SUBSTITUA PELO NÚMERO DA NAYARA
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'naytenutri@gmail.com'
);

UPDATE user_profiles
SET 
  whatsapp = '5519981868000',  -- SUBSTITUA PELO NÚMERO DO CLAUDINEI
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'claubemestar@gmail.com'
);
*/

-- 3. VERIFICAR SE FOI ATUALIZADO
SELECT 
  au.email,
  up.nome_completo,
  up.whatsapp,
  up.updated_at,
  CASE 
    WHEN up.whatsapp IS NOT NULL THEN '✅ WhatsApp preenchido'
    ELSE '❌ WhatsApp ainda NULL'
  END as status
FROM auth.users au
JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'naytenutri@gmail.com',
  'claubemestar@gmail.com'
);

