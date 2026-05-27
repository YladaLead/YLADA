-- Auditoria: pagador real no Mercado Pago vs conta Ylada que abriu o checkout (+50 convites).

ALTER TABLE pro_lideres_invite_quota_mp_receipts
  ADD COLUMN IF NOT EXISTS checkout_account_email TEXT,
  ADD COLUMN IF NOT EXISTS mp_payer_email TEXT,
  ADD COLUMN IF NOT EXISTS mp_payer_name TEXT,
  ADD COLUMN IF NOT EXISTS mp_payer_id TEXT;

COMMENT ON COLUMN pro_lideres_invite_quota_mp_receipts.checkout_account_email IS
  'E-mail da conta Ylada (líder) no momento em que o checkout MP foi criado.';
COMMENT ON COLUMN pro_lideres_invite_quota_mp_receipts.mp_payer_email IS
  'E-mail do pagador registrado pelo Mercado Pago após aprovação.';
COMMENT ON COLUMN pro_lideres_invite_quota_mp_receipts.mp_payer_name IS
  'Nome do pagador no Mercado Pago (payer first/last).';
COMMENT ON COLUMN pro_lideres_invite_quota_mp_receipts.mp_payer_id IS
  'ID do pagador no Mercado Pago (payer.id).';
