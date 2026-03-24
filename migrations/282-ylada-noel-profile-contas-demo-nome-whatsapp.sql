-- =====================================================
-- Migração: Atualizar ylada_noel_profile das contas demo
-- (área SEGMENTADA - ylada.com: nutri, coach, estética, etc.)
-- =====================================================
-- Objetivo: Adicionar nome e whatsapp em area_specific para que
-- o OnboardingPageContent considere o perfil completo e não peça
-- preenchimento toda vez que o usuário faz login.
--
-- NÃO mexe em wellness_noel_profile (área Herbalife).
-- =====================================================

-- Mapeamento email → nome para as contas demo
WITH demo_nomes AS (
  SELECT * FROM (VALUES
    ('demo.med@ylada.app', 'Dr. Demo Medicina'),
    ('demo.psi@ylada.app', 'Dra. Demo Psicologia'),
    ('demo.vendedor@ylada.app', 'Demo Vendedor (vendas em gerais)'),
    ('demo.nutra@ylada.app', 'Demo Nutra'),
    ('demo.estetica@ylada.app', 'Demo Esteticista'),
    ('demo.nutri@ylada.app', 'Dra. Demo Nutricionista'),
    ('demo.coach@ylada.app', 'Demo Coach'),
    ('demo.perfumaria@ylada.app', 'Demo Vendedor Perfumaria')
  ) AS t(email, nome)
),
demo_users AS (
  SELECT u.id, LOWER(u.email) AS email
  FROM auth.users u
  WHERE LOWER(u.email) IN (SELECT LOWER(email) FROM demo_nomes)
),
novos_dados AS (
  SELECT
    y.user_id,
    y.segment,
    COALESCE(y.area_specific, '{}'::jsonb) || jsonb_build_object(
      'nome', d.nome,
      'whatsapp', '19997230912',
      'countryCode', 'BR'
    ) AS area_specific_novo
  FROM ylada_noel_profile y
  JOIN demo_users u ON y.user_id = u.id
  JOIN demo_nomes d ON LOWER(d.email) = u.email
)
UPDATE ylada_noel_profile y
SET area_specific = n.area_specific_novo,
    updated_at = NOW()
FROM novos_dados n
WHERE y.user_id = n.user_id
  AND y.segment = n.segment;
