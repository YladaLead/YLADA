-- Idempotência e auditoria: pagamentos MP de pacote +50 convites pendentes (Pro Líderes).

CREATE TABLE IF NOT EXISTS pro_lideres_invite_quota_mp_receipts (
  mercado_pago_payment_id TEXT PRIMARY KEY,
  leader_tenant_id UUID NOT NULL REFERENCES leader_tenants (id) ON DELETE CASCADE,
  owner_user_id UUID NOT NULL,
  amount_brl NUMERIC(12, 2) NOT NULL,
  slots_added INT NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pro_lideres_inv_quota_mp_receipts_tenant
  ON pro_lideres_invite_quota_mp_receipts (leader_tenant_id, created_at DESC);

COMMENT ON TABLE pro_lideres_invite_quota_mp_receipts IS
  'Pagamento único Mercado Pago: +50 em team_invite_pending_quota; webhook grava aqui antes do UPDATE.';
