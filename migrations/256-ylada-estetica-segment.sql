-- Adiciona segmento estetica ao perfil Noel (ylada_noel_profile).
-- Permite que profissionais de estética tenham perfil e contexto específico no Noel.
ALTER TABLE ylada_noel_profile
  DROP CONSTRAINT IF EXISTS ylada_noel_profile_segment_check;

ALTER TABLE ylada_noel_profile
  ADD CONSTRAINT ylada_noel_profile_segment_check
  CHECK (segment IN ('ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller', 'perfumaria', 'estetica'));
