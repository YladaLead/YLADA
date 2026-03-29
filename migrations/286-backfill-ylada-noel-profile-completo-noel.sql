-- =====================================================
-- Backfill perfil empresarial (ylada_noel_profile) para o gate do Noel
-- Requisito API: area_specific.nome (>=2 chars), whatsapp (>=10 dígitos),
-- profile_type e profession preenchidos.
-- @see src/app/api/ylada/noel/route.ts (profile_required)
-- Execute no Supabase SQL Editor ou: npx tsx scripts/run-migration.ts 286-backfill-ylada-noel-profile-completo-noel.sql
-- =====================================================

-- 1) Quem usa /pt/home (segment ylada) mas ainda não tem linha — cria perfil completo mínimo
INSERT INTO ylada_noel_profile (
  user_id,
  segment,
  profile_type,
  profession,
  dor_principal,
  fase_negocio,
  metas_principais,
  area_specific,
  created_at,
  updated_at
)
SELECT
  up.user_id,
  'ylada',
  CASE
    WHEN up.perfil IN ('seller', 'perfumaria') THEN 'vendas'
    ELSE 'liberal'
  END,
  CASE COALESCE(NULLIF(trim(up.perfil::text), ''), 'nutri')
    WHEN 'nutri' THEN 'nutricionista'
    WHEN 'med' THEN 'medico'
    WHEN 'psi' THEN 'psi'
    WHEN 'psicanalise' THEN 'psicanalise'
    WHEN 'odonto' THEN 'odonto'
    WHEN 'nutra' THEN 'nutricionista'
    WHEN 'coach' THEN 'coach'
    WHEN 'seller' THEN 'vendedor'
    WHEN 'perfumaria' THEN 'vendedor_perfumes'
    WHEN 'estetica' THEN 'estetica'
    WHEN 'fitness' THEN 'fitness'
    WHEN 'ylada' THEN 'nutricionista'
    ELSE 'nutricionista'
  END,
  'agenda_vazia',
  'em_crescimento',
  'Perfil criado automaticamente (backfill).',
  jsonb_build_object(
    'nome', COALESCE(
      NULLIF(trim(up.nome_completo::text), ''),
      NULLIF(trim(u.raw_user_meta_data->>'full_name'), ''),
      initcap(split_part(u.email, '@', 1)),
      'Profissional YLADA'
    ),
    'whatsapp', CASE
      WHEN length(regexp_replace(COALESCE(up.whatsapp::text, ''), '\D', '', 'g')) >= 10
        THEN up.whatsapp::text
      ELSE '11999999999'
    END,
    'countryCode', COALESCE(NULLIF(trim(up.country_code::text), ''), 'BR')
  ),
  NOW(),
  NOW()
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE up.perfil IN (
  'nutri', 'coach', 'nutra', 'med', 'psi', 'psicanalise', 'odonto',
  'estetica', 'fitness', 'perfumaria', 'ylada', 'seller'
)
  AND NOT EXISTS (
    SELECT 1 FROM ylada_noel_profile y
    WHERE y.user_id = up.user_id AND y.segment = 'ylada'
  );

-- 2) Completa linhas existentes ainda vazias ou com WhatsApp/nome inválidos para o gate
UPDATE ylada_noel_profile y
SET
  profile_type = COALESCE(
    NULLIF(trim(y.profile_type::text), ''),
    CASE
      WHEN y.segment IN ('seller', 'perfumaria') THEN 'vendas'
      ELSE 'liberal'
    END
  ),
  profession = COALESCE(
    NULLIF(trim(y.profession::text), ''),
    CASE y.segment
      WHEN 'med' THEN 'medico'
      WHEN 'psi' THEN 'psi'
      WHEN 'psicanalise' THEN 'psicanalise'
      WHEN 'odonto' THEN 'odonto'
      WHEN 'nutra' THEN 'nutricionista'
      WHEN 'coach' THEN 'coach'
      WHEN 'seller' THEN 'vendedor'
      WHEN 'perfumaria' THEN 'vendedor_perfumes'
      WHEN 'estetica' THEN 'estetica'
      WHEN 'fitness' THEN 'fitness'
      WHEN 'ylada' THEN
        CASE COALESCE(NULLIF(trim(up.perfil::text), ''), 'nutri')
          WHEN 'nutri' THEN 'nutricionista'
          WHEN 'med' THEN 'medico'
          WHEN 'psi' THEN 'psi'
          WHEN 'psicanalise' THEN 'psicanalise'
          WHEN 'odonto' THEN 'odonto'
          WHEN 'nutra' THEN 'nutricionista'
          WHEN 'coach' THEN 'coach'
          WHEN 'seller' THEN 'vendedor'
          WHEN 'perfumaria' THEN 'vendedor_perfumes'
          WHEN 'estetica' THEN 'estetica'
          WHEN 'fitness' THEN 'fitness'
          WHEN 'ylada' THEN 'nutricionista'
          ELSE 'nutricionista'
        END
      ELSE 'nutricionista'
    END
  ),
  area_specific =
    COALESCE(y.area_specific, '{}'::jsonb)
    || jsonb_build_object(
      'nome',
        CASE
          WHEN length(trim(COALESCE(y.area_specific->>'nome', ''))) >= 2
            THEN trim(y.area_specific->>'nome')
          ELSE COALESCE(
            NULLIF(trim(up.nome_completo::text), ''),
            NULLIF(trim(u.raw_user_meta_data->>'full_name'), ''),
            initcap(split_part(u.email, '@', 1)),
            'Profissional YLADA'
          )
        END,
      'whatsapp',
        CASE
          WHEN length(regexp_replace(COALESCE(y.area_specific->>'whatsapp', ''), '\D', '', 'g')) >= 10
            THEN y.area_specific->>'whatsapp'
          WHEN length(regexp_replace(COALESCE(up.whatsapp::text, ''), '\D', '', 'g')) >= 10
            THEN up.whatsapp::text
          ELSE '11999999999'
        END,
      'countryCode',
        COALESCE(
          NULLIF(trim(y.area_specific->>'countryCode'), ''),
          NULLIF(trim(up.country_code::text), ''),
          'BR'
        )
    ),
  updated_at = NOW()
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE y.user_id = u.id
  AND (
    COALESCE(NULLIF(trim(y.profile_type::text), ''), '') = ''
    OR COALESCE(NULLIF(trim(y.profession::text), ''), '') = ''
    OR length(trim(COALESCE(y.area_specific->>'nome', ''))) < 2
    OR length(regexp_replace(COALESCE(y.area_specific->>'whatsapp', ''), '\D', '', 'g')) < 10
  );

-- Ajusta profile_type para 'vendas' quando a profissão padrão de vendas foi aplicada
UPDATE ylada_noel_profile y
SET
  profile_type = 'vendas',
  updated_at = NOW()
WHERE y.profession IN (
  'vendedor',
  'vendedor_suplementos',
  'vendedor_cosmeticos',
  'vendedor_perfumes',
  'vendedor_servicos',
  'vendedor_produtos'
)
  AND COALESCE(NULLIF(trim(y.profile_type::text), ''), '') = 'liberal';
