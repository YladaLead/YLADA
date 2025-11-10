-- Criar tabela de tokens de acesso para recuperação de acesso por e-mail
-- Tokens permitem que usuários acessem o dashboard mesmo sem ter completado o cadastro

CREATE TABLE IF NOT EXISTS access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_access_tokens_user_id ON access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_access_tokens_expires_at ON access_tokens(expires_at);

-- Comentários
COMMENT ON TABLE access_tokens IS 'Tokens temporários para acesso ao dashboard via link de e-mail';
COMMENT ON COLUMN access_tokens.token IS 'Token único gerado para cada solicitação de acesso';
COMMENT ON COLUMN access_tokens.expires_at IS 'Data de expiração do token (padrão: 30 dias)';
COMMENT ON COLUMN access_tokens.used_at IS 'Data em que o token foi usado (NULL = não usado ainda)';

-- Limpar tokens expirados (executar periodicamente via cron/job)
-- DELETE FROM access_tokens WHERE expires_at < NOW() AND used_at IS NULL;

