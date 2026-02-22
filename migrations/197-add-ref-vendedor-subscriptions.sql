-- Atribuição de venda ao vendedor (ex: paula)
-- Usado para identificar vendas vindas da página /pt/vendas/paula
-- OBRIGATÓRIA: o webhook Mercado Pago (payment aprovado) grava ref_vendedor ao criar/atualizar subscriptions.
-- Sem esta coluna ocorre PGRST204 e o pagamento não é reconhecido.
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS ref_vendedor VARCHAR(100) DEFAULT NULL;

COMMENT ON COLUMN subscriptions.ref_vendedor IS 'Identificador do vendedor que atribuiu a venda (ex: paula). Preenchido via ref=paula na URL do checkout.';
