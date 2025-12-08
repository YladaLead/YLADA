-- =====================================================
-- MIGRAÇÃO 019: Criar Tabelas de Segurança do NOEL
-- =====================================================
-- Objetivo: Criar tabelas para rate limiting, logging de segurança
-- e detecção de padrões suspeitos
-- =====================================================

-- Tabela para rate limiting
CREATE TABLE IF NOT EXISTS noel_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_count INTEGER NOT NULL DEFAULT 1,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Índices para performance
  CONSTRAINT noel_rate_limits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_noel_rate_limits_user_id ON noel_rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_noel_rate_limits_created_at ON noel_rate_limits(created_at);
CREATE INDEX IF NOT EXISTS idx_noel_rate_limits_blocked ON noel_rate_limits(user_id, is_blocked, blocked_until) WHERE is_blocked = true;

-- Tabela para logging de segurança
CREATE TABLE IF NOT EXISTS noel_security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  detected_patterns TEXT[] NOT NULL DEFAULT '{}',
  was_blocked BOOLEAN NOT NULL DEFAULT false,
  response_sent TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Índices para análise
  CONSTRAINT noel_security_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_noel_security_logs_user_id ON noel_security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_noel_security_logs_risk_level ON noel_security_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_noel_security_logs_created_at ON noel_security_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_noel_security_logs_blocked ON noel_security_logs(was_blocked, created_at) WHERE was_blocked = true;

-- Função para limpar registros antigos (manutenção)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM noel_rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Comentários
COMMENT ON TABLE noel_rate_limits IS 'Registra requisições do NOEL para rate limiting';
COMMENT ON TABLE noel_security_logs IS 'Registra tentativas suspeitas e padrões de abuso detectados';
COMMENT ON FUNCTION cleanup_old_rate_limits() IS 'Limpa registros antigos de rate limit (executar diariamente)';
