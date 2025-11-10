-- =====================================================
-- SCRIPTS SQL PARA CHECKOUT SEM AUTENTICAÇÃO
-- =====================================================
-- Execute estes scripts no Supabase SQL Editor
-- Ordem: Execute todos os scripts abaixo em sequência
-- =====================================================

-- =====================================================
-- 1. CRIAR TABELA: access_tokens
-- =====================================================
-- Esta tabela armazena tokens temporários para links de acesso por e-mail
-- Necessária para o sistema de e-mail de boas-vindas

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

-- =====================================================
-- 2. ADICIONAR CAMPOS NA TABELA: subscriptions
-- =====================================================
-- Campos para rastrear envio de e-mails de boas-vindas
-- Isso evita enviar múltiplos e-mails para o mesmo pagamento

DO $$ 
BEGIN
  -- Adicionar campo welcome_email_sent
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'welcome_email_sent'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN welcome_email_sent BOOLEAN DEFAULT FALSE;
    COMMENT ON COLUMN subscriptions.welcome_email_sent IS 'true = e-mail de boas-vindas já foi enviado';
  END IF;

  -- Adicionar campo welcome_email_sent_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'welcome_email_sent_at'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN welcome_email_sent_at TIMESTAMP WITH TIME ZONE;
    COMMENT ON COLUMN subscriptions.welcome_email_sent_at IS 'Data/hora em que o e-mail de boas-vindas foi enviado';
  END IF;
END $$;

-- Criar índice para buscar assinaturas que precisam de e-mail
CREATE INDEX IF NOT EXISTS idx_subscriptions_welcome_email 
ON subscriptions(welcome_email_sent, status, created_at)
WHERE welcome_email_sent = false AND status = 'active';

-- =====================================================
-- 3. VERIFICAR SE TRIGGER DE PERFIL ESTÁ ATIVO
-- =====================================================
-- O trigger handle_new_user() deve criar perfil automaticamente
-- quando um novo usuário é criado no auth.users
-- Se não existir, será criado manualmente no webhook

-- Verificar se o trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Se o trigger não existir, você pode criar usando o schema-auth-users.sql
-- Mas geralmente já deve estar criado

-- =====================================================
-- CONCLUSÃO
-- =====================================================
-- Após executar estes scripts:
-- 1. A tabela access_tokens estará criada
-- 2. Os campos welcome_email_sent estarão na tabela subscriptions
-- 3. O sistema de checkout sem autenticação estará funcionando
-- 4. Usuários serão criados automaticamente após pagamento
-- 5. E-mails de boas-vindas serão enviados com link de acesso

