-- Permitir segmento 'ylada' na matriz central (substitui 'med' como área padrão).
-- Não remove 'med' do CHECK para não quebrar dados existentes; apenas adiciona 'ylada'.
ALTER TABLE ylada_noel_profile
  DROP CONSTRAINT IF EXISTS ylada_noel_profile_segment_check;

ALTER TABLE ylada_noel_profile
  ADD CONSTRAINT ylada_noel_profile_segment_check
  CHECK (segment IN ('ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller'));

COMMENT ON TABLE ylada_noel_profile IS 'Perfil empresarial por área para o Noel YLADA. Segmento ylada = matriz central.';
