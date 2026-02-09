-- Comissão de vendedores: 20% em todo pagamento (inicial e recorrente)
-- Quando a assinatura tem ref_vendedor, cada payment gera um registro aqui.

CREATE TABLE IF NOT EXISTS vendedor_comissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_vendedor VARCHAR(100) NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  payment_id UUID NULL REFERENCES payments(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  commission_pct DECIMAL(5,2) NOT NULL DEFAULT 20.00,
  commission_amount_cents INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE vendedor_comissoes IS 'Comissão de 20% para vendedores (ref_vendedor). Gerada em todo pagamento (inicial e renovações).';
COMMENT ON COLUMN vendedor_comissoes.ref_vendedor IS 'Código do vendedor (ex: paula).';
COMMENT ON COLUMN vendedor_comissoes.commission_pct IS 'Percentual de comissão (sempre 20).';
COMMENT ON COLUMN vendedor_comissoes.commission_amount_cents IS 'Valor da comissão em centavos (20% do amount_cents).';

CREATE INDEX IF NOT EXISTS idx_vendedor_comissoes_ref_vendedor ON vendedor_comissoes(ref_vendedor);
CREATE INDEX IF NOT EXISTS idx_vendedor_comissoes_subscription_id ON vendedor_comissoes(subscription_id);
CREATE INDEX IF NOT EXISTS idx_vendedor_comissoes_status ON vendedor_comissoes(status);
CREATE INDEX IF NOT EXISTS idx_vendedor_comissoes_created_at ON vendedor_comissoes(created_at);
