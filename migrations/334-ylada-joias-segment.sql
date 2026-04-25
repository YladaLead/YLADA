-- Segmento joias (joias, semijoias, bijuterias) na matriz YLADA.

ALTER TABLE ylada_noel_profile
  DROP CONSTRAINT IF EXISTS ylada_noel_profile_segment_check;

ALTER TABLE ylada_noel_profile
  ADD CONSTRAINT ylada_noel_profile_segment_check
  CHECK (segment IN (
    'ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller',
    'perfumaria', 'estetica', 'fitness', 'joias'
  ));

ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_area_check;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_area_check
  CHECK (area IN (
    'wellness',
    'nutri',
    'coach',
    'nutra',
    'ylada',
    'med',
    'psi',
    'psicanalise',
    'odonto',
    'estetica',
    'fitness',
    'perfumaria',
    'seller',
    'joias',
    'pro_lideres_team'
  ));

COMMENT ON CONSTRAINT subscriptions_area_check ON public.subscriptions IS
  'Áreas válidas da matriz + wellness + pro_lideres_team; inclui joias (joias e bijuterias).';

ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_perfil_check;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_perfil_check
  CHECK (perfil IN (
    'nutri', 'wellness', 'coach', 'nutra', 'admin',
    'ylada', 'psi', 'psicanalise', 'odonto', 'med',
    'fitness', 'estetica', 'perfumaria', 'seller', 'joias',
    'coach-bem-estar'
  ));

COMMENT ON CONSTRAINT user_profiles_perfil_check ON user_profiles IS
  'Perfis da matriz incluem joias (joias e bijuterias).';
