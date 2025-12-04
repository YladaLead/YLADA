-- ============================================
-- ADICIONAR COLUNAS PARA ANÁLISE DE HISTÓRICO
-- Sistema de orientação de carreira Herbalife
-- ============================================

-- 1. Adicionar colunas na tabela wellness_user_queries para análise
-- (Usar IF NOT EXISTS para evitar erros se já existirem)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_user_queries' AND column_name = 'detected_topic') THEN
    ALTER TABLE wellness_user_queries ADD COLUMN detected_topic TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_user_queries' AND column_name = 'detected_challenge') THEN
    ALTER TABLE wellness_user_queries ADD COLUMN detected_challenge TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_user_queries' AND column_name = 'career_stage') THEN
    ALTER TABLE wellness_user_queries ADD COLUMN career_stage TEXT CHECK (career_stage IN ('iniciante', 'desenvolvimento', 'lideranca', 'master'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_user_queries' AND column_name = 'priority_area') THEN
    ALTER TABLE wellness_user_queries ADD COLUMN priority_area TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wellness_user_queries' AND column_name = 'sentiment') THEN
    ALTER TABLE wellness_user_queries ADD COLUMN sentiment TEXT CHECK (sentiment IN ('positivo', 'neutro', 'frustrado', 'dúvida', 'motivado'));
  END IF;
END $$;

-- 2. Criar tabela de perfil do consultor (baseado em histórico)
CREATE TABLE IF NOT EXISTS wellness_consultant_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Estágio da carreira
  career_stage TEXT DEFAULT 'iniciante' CHECK (career_stage IN ('iniciante', 'desenvolvimento', 'lideranca', 'master')),
  career_stage_confidence NUMERIC DEFAULT 0.5 CHECK (career_stage_confidence >= 0 AND career_stage_confidence <= 1),
  
  -- Áreas de foco e desafios
  main_challenges TEXT[] DEFAULT '{}',
  strong_areas TEXT[] DEFAULT '{}',
  priority_areas TEXT[] DEFAULT '{}',
  
  -- Padrões identificados
  frequent_topics TEXT[] DEFAULT '{}',
  learning_gaps TEXT[] DEFAULT '{}',
  
  -- Metas e objetivos (extraídos de conversas)
  mentioned_goals TEXT[] DEFAULT '{}',
  pv_goals JSONB, -- { current: number, target: number, timeframe: string }
  team_goals JSONB, -- { current: number, target: number }
  
  -- Análise comportamental
  engagement_level TEXT DEFAULT 'medio' CHECK (engagement_level IN ('baixo', 'medio', 'alto', 'muito_alto')),
  consistency_score NUMERIC DEFAULT 0.5 CHECK (consistency_score >= 0 AND consistency_score <= 1),
  motivation_level TEXT DEFAULT 'medio' CHECK (motivation_level IN ('baixo', 'medio', 'alto')),
  
  -- Estatísticas
  total_queries INTEGER DEFAULT 0,
  queries_last_30_days INTEGER DEFAULT 0,
  last_query_at TIMESTAMPTZ,
  first_query_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_consultant_profile_user ON wellness_consultant_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_consultant_profile_stage ON wellness_consultant_profile(career_stage);
CREATE INDEX IF NOT EXISTS idx_consultant_profile_engagement ON wellness_consultant_profile(engagement_level);

-- 3. Adicionar colunas de análise na tabela wellness_user_queries
CREATE INDEX IF NOT EXISTS idx_queries_detected_topic ON wellness_user_queries(detected_topic);
CREATE INDEX IF NOT EXISTS idx_queries_detected_challenge ON wellness_user_queries(detected_challenge);
CREATE INDEX IF NOT EXISTS idx_queries_career_stage ON wellness_user_queries(career_stage);
CREATE INDEX IF NOT EXISTS idx_queries_sentiment ON wellness_user_queries(sentiment);
CREATE INDEX IF NOT EXISTS idx_queries_user_created ON wellness_user_queries(user_id, created_at DESC);

-- 4. Função para atualizar perfil do consultor
CREATE OR REPLACE FUNCTION update_consultant_profile(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_queries INTEGER;
  v_queries_30d INTEGER;
  v_last_query TIMESTAMPTZ;
  v_first_query TIMESTAMPTZ;
  v_frequent_topics TEXT[];
  v_main_challenges TEXT[];
  v_career_stage TEXT;
  v_engagement_level TEXT;
  v_consistency_score NUMERIC;
BEGIN
  -- Calcular estatísticas básicas
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days'),
    MAX(created_at),
    MIN(created_at)
  INTO v_total_queries, v_queries_30d, v_last_query, v_first_query
  FROM wellness_user_queries
  WHERE user_id = p_user_id;

  -- Identificar tópicos frequentes (últimos 30 dias)
  SELECT ARRAY_AGG(topic ORDER BY frequency DESC)
  INTO v_frequent_topics
  FROM (
    SELECT detected_topic as topic, COUNT(*) as frequency
    FROM wellness_user_queries
    WHERE user_id = p_user_id
      AND created_at >= NOW() - INTERVAL '30 days'
      AND detected_topic IS NOT NULL
    GROUP BY detected_topic
    ORDER BY frequency DESC
    LIMIT 5
  ) sub;

  -- Identificar desafios principais
  SELECT ARRAY_AGG(challenge ORDER BY frequency DESC)
  INTO v_main_challenges
  FROM (
    SELECT detected_challenge as challenge, COUNT(*) as frequency
    FROM wellness_user_queries
    WHERE user_id = p_user_id
      AND created_at >= NOW() - INTERVAL '30 days'
      AND detected_challenge IS NOT NULL
    GROUP BY detected_challenge
    ORDER BY frequency DESC
    LIMIT 3
  ) sub;

  -- Determinar estágio da carreira (baseado em tópicos e frequência)
  SELECT CASE
    WHEN v_total_queries < 10 THEN 'iniciante'
    WHEN v_total_queries < 50 AND 'lideranca' = ANY(v_frequent_topics) THEN 'desenvolvimento'
    WHEN 'lideranca' = ANY(v_frequent_topics) OR 'equipe' = ANY(v_frequent_topics) THEN 'lideranca'
    ELSE 'desenvolvimento'
  END INTO v_career_stage;

  -- Calcular nível de engajamento
  SELECT CASE
    WHEN v_queries_30d >= 20 THEN 'muito_alto'
    WHEN v_queries_30d >= 10 THEN 'alto'
    WHEN v_queries_30d >= 5 THEN 'medio'
    ELSE 'baixo'
  END INTO v_engagement_level;

  -- Calcular score de consistência (baseado em frequência de uso)
  SELECT CASE
    WHEN v_queries_30d = 0 THEN 0
    WHEN v_queries_30d < 5 THEN 0.3
    WHEN v_queries_30d < 10 THEN 0.6
    WHEN v_queries_30d < 20 THEN 0.8
    ELSE 1.0
  END INTO v_consistency_score;

  -- Upsert perfil
  INSERT INTO wellness_consultant_profile (
    user_id,
    career_stage,
    career_stage_confidence,
    main_challenges,
    frequent_topics,
    engagement_level,
    consistency_score,
    total_queries,
    queries_last_30_days,
    last_query_at,
    first_query_at,
    updated_at
  )
  VALUES (
    p_user_id,
    v_career_stage,
    CASE WHEN v_total_queries >= 10 THEN 0.8 ELSE 0.5 END,
    COALESCE(v_main_challenges, '{}'),
    COALESCE(v_frequent_topics, '{}'),
    v_engagement_level,
    v_consistency_score,
    v_total_queries,
    v_queries_30d,
    v_last_query,
    v_first_query,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    career_stage = EXCLUDED.career_stage,
    career_stage_confidence = EXCLUDED.career_stage_confidence,
    main_challenges = EXCLUDED.main_challenges,
    frequent_topics = EXCLUDED.frequent_topics,
    engagement_level = EXCLUDED.engagement_level,
    consistency_score = EXCLUDED.consistency_score,
    total_queries = EXCLUDED.total_queries,
    queries_last_30_days = EXCLUDED.queries_last_30_days,
    last_query_at = EXCLUDED.last_query_at,
    first_query_at = COALESCE(wellness_consultant_profile.first_query_at, EXCLUDED.first_query_at),
    updated_at = NOW();
END;
$$;

-- 5. Trigger para atualizar perfil automaticamente após nova query
CREATE OR REPLACE FUNCTION trigger_update_consultant_profile()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_consultant_profile(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_wellness_queries_profile ON wellness_user_queries;
CREATE TRIGGER trigger_wellness_queries_profile
  AFTER INSERT ON wellness_user_queries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_consultant_profile();

-- 6. RLS para perfil do consultor
ALTER TABLE wellness_consultant_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON wellness_consultant_profile;
CREATE POLICY "Users can view own profile"
  ON wellness_consultant_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. Função para obter insights do consultor
CREATE OR REPLACE FUNCTION get_consultant_insights(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_profile wellness_consultant_profile%ROWTYPE;
  v_recent_queries JSONB;
  v_insights JSONB;
BEGIN
  -- Buscar perfil
  SELECT * INTO v_profile
  FROM wellness_consultant_profile
  WHERE user_id = p_user_id;

  -- Buscar queries recentes com análise
  SELECT jsonb_agg(
    jsonb_build_object(
      'query', query,
      'topic', detected_topic,
      'challenge', detected_challenge,
      'sentiment', sentiment,
      'created_at', created_at
    ) ORDER BY created_at DESC
  )
  INTO v_recent_queries
  FROM wellness_user_queries
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '7 days'
  LIMIT 10;

  -- Construir insights
  SELECT jsonb_build_object(
    'career_stage', v_profile.career_stage,
    'career_stage_confidence', v_profile.career_stage_confidence,
    'main_challenges', v_profile.main_challenges,
    'frequent_topics', v_profile.frequent_topics,
    'engagement_level', v_profile.engagement_level,
    'consistency_score', v_profile.consistency_score,
    'total_queries', v_profile.total_queries,
    'queries_last_30_days', v_profile.queries_last_30_days,
    'recent_queries', COALESCE(v_recent_queries, '[]'::jsonb),
    'recommendations', CASE
      WHEN v_profile.consistency_score < 0.5 THEN 'Aumentar frequência de uso para melhor acompanhamento'
      WHEN array_length(v_profile.main_challenges, 1) > 0 THEN 'Focar em resolver desafios principais identificados'
      ELSE 'Continuar evoluindo nas áreas já dominadas'
    END
  ) INTO v_insights;

  RETURN v_insights;
END;
$$;

COMMENT ON TABLE wellness_consultant_profile IS 'Perfil do consultor baseado em análise de histórico - Marketing Multinível Herbalife';
COMMENT ON FUNCTION update_consultant_profile IS 'Atualiza perfil do consultor baseado em histórico de queries';
COMMENT ON FUNCTION get_consultant_insights IS 'Retorna insights e recomendações baseadas no histórico do consultor';

