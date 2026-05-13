-- Segmento coach-bem-estar na matriz YLADA (Noel / ylada_noel_profile).

ALTER TABLE ylada_noel_profile
  DROP CONSTRAINT IF EXISTS ylada_noel_profile_segment_check;

ALTER TABLE ylada_noel_profile
  ADD CONSTRAINT ylada_noel_profile_segment_check
  CHECK (segment IN (
    'ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller',
    'perfumaria', 'estetica', 'fitness', 'joias', 'coach-bem-estar'
  ));

COMMENT ON CONSTRAINT ylada_noel_profile_segment_check ON ylada_noel_profile IS
  'Segmentos da matriz YLADA + coach-bem-estar (Coach de bem-estar; assinatura wellness, app /pt/coach-bem-estar).';
