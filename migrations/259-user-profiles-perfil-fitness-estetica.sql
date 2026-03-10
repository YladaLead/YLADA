-- Adiciona perfis fitness, estetica, perfumaria e seller ao CHECK de user_profiles.
-- Necessário para que usuários dessas áreas possam ter perfil criado/atualizado.

ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_perfil_check;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_perfil_check
  CHECK (perfil IN (
    'nutri', 'wellness', 'coach', 'nutra', 'admin',
    'ylada', 'psi', 'psicanalise', 'odonto', 'med',
    'fitness', 'estetica', 'perfumaria', 'seller'
  ));

COMMENT ON CONSTRAINT user_profiles_perfil_check ON user_profiles IS
  'Perfis: nutri, wellness, coach, nutra, admin; ylada, psi, psicanalise, odonto, med; fitness, estetica, perfumaria, seller.';
