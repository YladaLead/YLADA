-- ============================================
-- FUNÇÃO PARA INCREMENTAR FREQUÊNCIA DE SUGESTÕES
-- ============================================

CREATE OR REPLACE FUNCTION increment_learning_frequency(suggestion_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE wellness_learning_suggestions
  SET 
    frequency = frequency + 1,
    last_seen_at = NOW()
  WHERE id = suggestion_id;
END;
$$;

COMMENT ON FUNCTION increment_learning_frequency IS 'Incrementa a frequência de uma sugestão de aprendizado';

