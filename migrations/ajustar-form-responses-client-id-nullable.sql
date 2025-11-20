-- Ajustar tabela form_responses para permitir client_id NULL
-- Isso permite que formulários sejam preenchidos por pessoas que ainda não são clientes
-- O client_id pode ser vinculado depois quando a pessoa se tornar cliente

-- Remover constraint NOT NULL do client_id
ALTER TABLE form_responses 
  ALTER COLUMN client_id DROP NOT NULL;

-- Adicionar comentário explicativo
COMMENT ON COLUMN form_responses.client_id IS 'ID do cliente (pode ser NULL se o formulário foi preenchido antes de ser cliente)';

