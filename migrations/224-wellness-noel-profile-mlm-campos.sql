-- =====================================================
-- Perfil Well (MLM puro): campos para carteira, contatos,
-- meta de equipe e bloqueio. Sem citar ferramenta/método.
-- =====================================================

ALTER TABLE wellness_noel_profile
  ADD COLUMN IF NOT EXISTS pessoas_na_carteira INTEGER;

ALTER TABLE wellness_noel_profile
  ADD COLUMN IF NOT EXISTS contatos_novos_semana INTEGER;

ALTER TABLE wellness_noel_profile
  ADD COLUMN IF NOT EXISTS meta_crescimento_equipe INTEGER;

ALTER TABLE wellness_noel_profile
  ADD COLUMN IF NOT EXISTS bloqueio_principal TEXT;

COMMENT ON COLUMN wellness_noel_profile.pessoas_na_carteira IS 'Quantas pessoas já estão na carteira (clientes/contatos ativos). Usado pelo mentor para contexto.';
COMMENT ON COLUMN wellness_noel_profile.contatos_novos_semana IS 'Quantos contatos novos a pessoa fala por semana (volume de conversas).';
COMMENT ON COLUMN wellness_noel_profile.meta_crescimento_equipe IS 'Meta de crescimento em equipe (quantos novos parceiros quer no período).';
COMMENT ON COLUMN wellness_noel_profile.bloqueio_principal IS 'Principal bloqueio: medo, organizacao, constancia, abordagem, outro. Para o mentor personalizar.';

-- Valores sugeridos para bloqueio_principal (sem CHECK para flexibilidade)
-- medo, organizacao, constancia, abordagem, outro
