-- Adiciona coluna diagnostico à biblioteca de estratégias do Noel.
-- Estrutura ideal: problema → diagnóstico → orientação → próximo movimento.
-- diagnostico = o que o Noel deve perguntar/investigar antes de orientar.
-- Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md

ALTER TABLE noel_strategy_library
  ADD COLUMN IF NOT EXISTS diagnostico TEXT;

COMMENT ON COLUMN noel_strategy_library.diagnostico IS 'O que o Noel deve perguntar/investigar antes de orientar (fluxo: situação → diagnóstico → estratégia → próximo movimento).';
