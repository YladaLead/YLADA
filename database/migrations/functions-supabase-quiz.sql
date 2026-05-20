-- =====================================================
-- YLADA - FUNÇÕES RPC PARA QUIZZES
-- Functions para o Supabase
-- =====================================================

-- Função para incrementar visualizações do quiz
CREATE OR REPLACE FUNCTION increment_quiz_views(slug_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE quizzes
  SET views = views + 1
  WHERE slug = slug_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para incrementar leads do quiz
CREATE OR REPLACE FUNCTION increment_quiz_leads(quiz_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE quizzes
  SET leads_count = leads_count + 1
  WHERE id = quiz_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar disponibilidade de slug
CREATE OR REPLACE FUNCTION check_slug_availability(slug_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  count_result INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_result
  FROM quizzes
  WHERE slug = slug_param;
  
  RETURN count_result = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VERIFICAR FUNÇÕES CRIADAS
-- =====================================================
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'increment_quiz_views',
    'increment_quiz_leads',
    'check_slug_availability'
)
ORDER BY routine_name;

