-- =====================================================
-- Coach de bem-estar: backfill user_slug (contas sem link personalizado)
-- Migração 438 — gerado em 2026-05-25 após auditoria em produção
--
-- Antes de aplicar: rode o diagnóstico abaixo.
-- Slugs foram validados como únicos no user_profiles (mesma lógica do app).
-- Alternativa: npx tsx scripts/gerar-user-slug-coach-bem-estar-lote.ts --apply
-- =====================================================

-- 1) Diagnóstico: quem está em coach-bem-estar e ainda sem slug
SELECT
  user_id,
  email,
  nome_completo,
  user_slug,
  perfil,
  updated_at
FROM user_profiles
WHERE perfil = 'coach-bem-estar'
ORDER BY email;

SELECT COUNT(*) AS sem_slug
FROM user_profiles
WHERE perfil = 'coach-bem-estar'
  AND (user_slug IS NULL OR TRIM(user_slug) = '');

-- 2) Backfill (3 contas identificadas em 2026-05-25)
-- adenilson: slug base "adenilson" já ocupado → adenilson-m
UPDATE user_profiles
SET user_slug = 'adenilson-m', updated_at = NOW()
WHERE user_id = '5df62f07-744d-4d63-a20e-736cbc9d1cae'
  AND perfil = 'coach-bem-estar'
  AND (user_slug IS NULL OR TRIM(user_slug) = '');

-- Paulo (conta principal Coach de bem-estar)
UPDATE user_profiles
SET user_slug = 'paulo', updated_at = NOW()
WHERE user_id = '7832371a-6e25-4af4-986d-7f01a081fff0'
  AND perfil = 'coach-bem-estar'
  AND (user_slug IS NULL OR TRIM(user_slug) = '');

-- Zenaide
UPDATE user_profiles
SET user_slug = 'zenaide', updated_at = NOW()
WHERE user_id = 'eb2a1ee1-74eb-4a7a-bfe0-b16514d366fa'
  AND perfil = 'coach-bem-estar'
  AND (user_slug IS NULL OR TRIM(user_slug) = '');

-- 3) Conferência
SELECT email, nome_completo, user_slug,
  'https://www.ylada.com/pt/coach-bem-estar/' || user_slug || '/calc-imc' AS link_imc_exemplo
FROM user_profiles
WHERE perfil = 'coach-bem-estar'
ORDER BY email;
