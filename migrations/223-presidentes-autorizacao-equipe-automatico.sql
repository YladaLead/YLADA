-- =====================================================
-- Documento de autorização: presidente pode autorizar
-- que membros da equipe recebam acesso sem autorização
-- prévia dele para cada convite. Fica documentado com data.
-- =====================================================

ALTER TABLE presidentes_autorizados
  ADD COLUMN IF NOT EXISTS autoriza_equipe_automatico BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE presidentes_autorizados
  ADD COLUMN IF NOT EXISTS data_autorizacao_equipe_automatico TIMESTAMPTZ;

ALTER TABLE presidentes_autorizados
  ADD COLUMN IF NOT EXISTS texto_autorizacao_equipe TEXT;

COMMENT ON COLUMN presidentes_autorizados.autoriza_equipe_automatico IS 'Presidente aceitou documento autorizando que a equipe receba acesso/link sem autorização prévia dele para cada convite.';
COMMENT ON COLUMN presidentes_autorizados.data_autorizacao_equipe_automatico IS 'Data/hora em que o presidente aceitou o documento de autorização (ou em que o admin registrou).';
COMMENT ON COLUMN presidentes_autorizados.texto_autorizacao_equipe IS 'Texto do documento de autorização aceito (versão), para registro.';
