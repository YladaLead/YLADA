-- =====================================================
-- REVERTER WHATSAPP DE NAYARA E CLAUDINEI
-- =====================================================
-- Este script reverte o whatsapp para NULL
-- OU você pode colocar os números corretos
-- =====================================================

-- 1. VER NÚMEROS ATUAIS (ERRADOS)
SELECT 
  au.email,
  up.nome_completo,
  up.whatsapp as numero_atual,
  up.updated_at
FROM auth.users au
JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'naytenutri@gmail.com',
  'claubemestar@gmail.com'
);

-- 2. REVERTER PARA NULL (remover os números errados)
UPDATE user_profiles
SET 
  whatsapp = NULL,
  updated_at = NOW()
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN (
    'naytenutri@gmail.com',
    'claubemestar@gmail.com'
  )
);

-- 3. VERIFICAR SE FOI REVERTIDO
SELECT 
  au.email,
  up.nome_completo,
  up.whatsapp,
  CASE 
    WHEN up.whatsapp IS NULL THEN '✅ Revertido para NULL'
    ELSE '⚠️ Ainda tem número'
  END as status
FROM auth.users au
JOIN user_profiles up ON au.id = up.user_id
WHERE au.email IN (
  'naytenutri@gmail.com',
  'claubemestar@gmail.com'
);

-- =====================================================
-- OBSERVAÇÃO:
-- Após reverter, quando eles preencherem o cadastro
-- novamente, o número correto será salvo automaticamente
-- =====================================================

