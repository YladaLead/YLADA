-- =====================================================
-- Migrar usuárias do plano Nutri para YLADA
-- =====================================================
-- Cria ylada_noel_profile (segment=ylada) para usuárias
-- que têm perfil=nutri em user_profiles.
-- Copia nome e whatsapp. NÃO preenche profile_type/profession
-- para que sejam redirecionadas a preencher o perfil ao acessar.
-- Execute no Supabase SQL Editor.
-- =====================================================

INSERT INTO ylada_noel_profile (user_id, segment, area_specific, created_at, updated_at)
SELECT 
  up.user_id,
  'ylada',
  jsonb_build_object(
    'nome', COALESCE(up.nome_completo, u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
    'whatsapp', COALESCE(up.whatsapp, ''),
    'countryCode', COALESCE(up.country_code, 'BR')
  ),
  NOW(),
  NOW()
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE up.perfil = 'nutri'
  AND NOT EXISTS (
    SELECT 1 FROM ylada_noel_profile ynp 
    WHERE ynp.user_id = up.user_id AND ynp.segment = 'ylada'
  );
