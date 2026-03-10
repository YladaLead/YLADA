-- Adiciona perfil coach-bem-estar ao CHECK de user_profiles.
-- Coach de bem-estar é segmento novo que usa a plataforma Wellness (base YLADA).

ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_perfil_check;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_perfil_check
  CHECK (perfil IN (
    'nutri', 'wellness', 'coach', 'nutra', 'admin',
    'ylada', 'psi', 'psicanalise', 'odonto', 'med',
    'fitness', 'estetica', 'perfumaria', 'seller',
    'coach-bem-estar'
  ));

COMMENT ON CONSTRAINT user_profiles_perfil_check ON user_profiles IS
  'Perfis: nutri, wellness, coach, nutra, admin; ylada, psi, psicanalise, odonto, med; fitness, estetica, perfumaria, seller; coach-bem-estar.';
