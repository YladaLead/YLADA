-- =====================================================
-- Incluir perfil 'ylada' (e áreas matriz) no CHECK de user_profiles.
-- Sem isso, requireApiAuth falha ao criar perfil automaticamente para
-- usuários que acessam /api/ylada/* (ex.: templates, links) com "Erro ao criar perfil".
-- =====================================================

-- Remover constraint antiga (nome pode variar)
ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_perfil_check;

ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_perfil_check_old;

-- Incluir ylada, psi, psicanalise, odonto, med (matriz) além dos existentes
ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_perfil_check
  CHECK (perfil IN (
    'nutri', 'wellness', 'coach', 'nutra', 'admin',
    'ylada', 'psi', 'psicanalise', 'odonto', 'med'
  ));

COMMENT ON CONSTRAINT user_profiles_perfil_check ON user_profiles IS
  'Perfis: nutri, wellness, coach, nutra, admin (áreas produto); ylada, psi, psicanalise, odonto, med (matriz YLADA).';
