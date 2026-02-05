-- Atribuição de venda ao vendedor (ex: paula)
-- Usado para identificar vendas vindas da página /pt/vendas/paula
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS ref_vendedor VARCHAR(100) DEFAULT NULL;

COMMENT ON COLUMN subscriptions.ref_vendedor IS 'Identificador do vendedor que atribuiu a venda (ex: paula). Preenchido via ref=paula na URL do checkout.';
