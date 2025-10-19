-- Tabela para métricas dos assistentes
CREATE TABLE IF NOT EXISTS assistant_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  assistant_used TEXT NOT NULL CHECK (assistant_used IN ('chat', 'creator', 'expert')),
  tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  intent TEXT NOT NULL,
  escalated BOOLEAN NOT NULL DEFAULT false,
  message_length INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_assistant_metrics_assistant_used ON assistant_metrics(assistant_used);
CREATE INDEX IF NOT EXISTS idx_assistant_metrics_created_at ON assistant_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_assistant_metrics_user_id ON assistant_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_assistant_metrics_intent ON assistant_metrics(intent);

-- RLS Policies
ALTER TABLE assistant_metrics ENABLE ROW LEVEL SECURITY;

-- Política para inserção (qualquer usuário pode inserir suas próprias métricas)
CREATE POLICY "Allow insert own metrics" ON assistant_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Política para leitura (usuários podem ver suas próprias métricas)
CREATE POLICY "Allow read own metrics" ON assistant_metrics
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Política para administradores (podem ver todas as métricas)
CREATE POLICY "Allow admin read all metrics" ON assistant_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Função para obter estatísticas de uso dos assistentes
CREATE OR REPLACE FUNCTION get_assistant_usage_stats(days INTEGER DEFAULT 7)
RETURNS TABLE (
  total_requests BIGINT,
  chat_percentage NUMERIC,
  creator_percentage NUMERIC,
  expert_percentage NUMERIC,
  average_latency NUMERIC,
  escalation_rate NUMERIC,
  average_cost_per_request NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_requests,
    ROUND((COUNT(*) FILTER (WHERE assistant_used = 'chat') * 100.0 / COUNT(*)), 2) as chat_percentage,
    ROUND((COUNT(*) FILTER (WHERE assistant_used = 'creator') * 100.0 / COUNT(*)), 2) as creator_percentage,
    ROUND((COUNT(*) FILTER (WHERE assistant_used = 'expert') * 100.0 / COUNT(*)), 2) as expert_percentage,
    ROUND(AVG(latency_ms), 2) as average_latency,
    ROUND((COUNT(*) FILTER (WHERE escalated = true) * 100.0 / COUNT(*)), 2) as escalation_rate,
    ROUND((
      (COUNT(*) FILTER (WHERE assistant_used = 'chat') * 0.15) + 
      (COUNT(*) FILTER (WHERE assistant_used = 'creator') * 5.00) + 
      (COUNT(*) FILTER (WHERE assistant_used = 'expert') * 30.00)
    ) / COUNT(*) / 1000000, 6) as average_cost_per_request
  FROM assistant_metrics
  WHERE created_at >= NOW() - INTERVAL '1 day' * days;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter métricas por dia
CREATE OR REPLACE FUNCTION get_daily_assistant_metrics(days INTEGER DEFAULT 7)
RETURNS TABLE (
  date DATE,
  chat_requests BIGINT,
  creator_requests BIGINT,
  expert_requests BIGINT,
  total_requests BIGINT,
  average_latency NUMERIC,
  escalation_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COUNT(*) FILTER (WHERE assistant_used = 'chat') as chat_requests,
    COUNT(*) FILTER (WHERE assistant_used = 'creator') as creator_requests,
    COUNT(*) FILTER (WHERE assistant_used = 'expert') as expert_requests,
    COUNT(*) as total_requests,
    ROUND(AVG(latency_ms), 2) as average_latency,
    ROUND((COUNT(*) FILTER (WHERE escalated = true) * 100.0 / COUNT(*)), 2) as escalation_rate
  FROM assistant_metrics
  WHERE created_at >= NOW() - INTERVAL '1 day' * days
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter top intents
CREATE OR REPLACE FUNCTION get_top_intents(days INTEGER DEFAULT 7, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  intent TEXT,
  count BIGINT,
  percentage NUMERIC,
  average_latency NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    am.intent,
    COUNT(*) as count,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as percentage,
    ROUND(AVG(am.latency_ms), 2) as average_latency
  FROM assistant_metrics am
  WHERE am.created_at >= NOW() - INTERVAL '1 day' * days
  GROUP BY am.intent
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários para documentação
COMMENT ON TABLE assistant_metrics IS 'Métricas de uso dos assistentes de IA para monitoramento e otimização';
COMMENT ON COLUMN assistant_metrics.assistant_used IS 'Tipo de assistente usado: chat (GPT-4o mini), creator (GPT-4o), expert (GPT-4)';
COMMENT ON COLUMN assistant_metrics.tokens_in IS 'Número de tokens de entrada (aproximado)';
COMMENT ON COLUMN assistant_metrics.tokens_out IS 'Número de tokens de saída (aproximado)';
COMMENT ON COLUMN assistant_metrics.latency_ms IS 'Latência da resposta em milissegundos';
COMMENT ON COLUMN assistant_metrics.intent IS 'Intenção detectada da mensagem do usuário';
COMMENT ON COLUMN assistant_metrics.escalated IS 'Se houve escalação entre assistentes';
COMMENT ON COLUMN assistant_metrics.message_length IS 'Comprimento da mensagem do usuário';
