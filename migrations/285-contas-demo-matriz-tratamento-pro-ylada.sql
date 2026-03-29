-- =====================================================
-- Contas demo (vídeos / apresentações): tratamento Pro na matriz YLADA
-- hasYladaProPlan passa a considerar is_support (ver subscription-helpers.ts).
-- Garante is_support para demos ylada.app + demo nutri .com já usada nos scripts.
-- =====================================================

UPDATE user_profiles
SET
  is_support = true,
  is_admin = false,
  updated_at = NOW()
WHERE email IN (
  'demo.nutri@ylada.com',
  'demo.nutri@ylada.app',
  'demo.med@ylada.app',
  'demo.psi@ylada.app',
  'demo.vendedor@ylada.app',
  'demo.nutra@ylada.app',
  'demo.estetica@ylada.app',
  'demo.coach@ylada.app',
  'demo.perfumaria@ylada.app'
);
