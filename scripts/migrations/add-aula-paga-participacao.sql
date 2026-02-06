-- DEPRECADO: use create-workshop-inscricoes-completo.sql se a tabela workshop_inscricoes
-- ainda não existir (ele cria a tabela e já inclui esta coluna).
--
-- Se a tabela JÁ existir e você só quiser adicionar participacao_aula:
ALTER TABLE workshop_inscricoes
ADD COLUMN IF NOT EXISTS participacao_aula text CHECK (participacao_aula IS NULL OR participacao_aula IN ('participou', 'nao_participou'));

COMMENT ON COLUMN workshop_inscricoes.participacao_aula IS 'Aula paga (aula_paga): participou | nao_participou. Null = ainda não marcado.';
