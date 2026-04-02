-- Triagem na pesquisa v1: já usou / quer testar / conhece alguém (sem feedback completo).

ALTER TABLE ylada_usage_survey_v1_responses
  ALTER COLUMN experience_rating DROP NOT NULL,
  ALTER COLUMN recommend DROP NOT NULL;

ALTER TABLE ylada_usage_survey_v1_responses
  ADD COLUMN IF NOT EXISTS has_used BOOLEAN,
  ADD COLUMN IF NOT EXISTS want_to_try BOOLEAN,
  ADD COLUMN IF NOT EXISTS know_someone BOOLEAN;

UPDATE ylada_usage_survey_v1_responses
SET has_used = true
WHERE has_used IS NULL AND experience_rating IS NOT NULL;

COMMENT ON COLUMN ylada_usage_survey_v1_responses.has_used IS
  'true = respondeu ao feedback completo; false = só triagem (não usou o produto).';
