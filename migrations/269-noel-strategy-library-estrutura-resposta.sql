-- Adiciona colunas para estrutura de resposta do Noel (Diagnóstico, Explicação, Próximo movimento, Exemplo).
-- Formato sugerido: diagnóstico → explicação → próximo movimento → exemplo.
-- Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md

ALTER TABLE noel_strategy_library
  ADD COLUMN IF NOT EXISTS diagnostic_phrase TEXT,
  ADD COLUMN IF NOT EXISTS explicacao TEXT,
  ADD COLUMN IF NOT EXISTS proximo_movimento TEXT;

COMMENT ON COLUMN noel_strategy_library.diagnostic_phrase IS 'Frase de diagnóstico no formato "Isso acontece quando..." para a resposta do Noel.';
COMMENT ON COLUMN noel_strategy_library.explicacao IS 'Explicação estratégica: o porquê (raciocínio) que conecta problema à solução.';
COMMENT ON COLUMN noel_strategy_library.proximo_movimento IS 'Próximo movimento em texto legível para o profissional (ex.: "Envie um diagnóstico curto antes de iniciar a conversa").';
