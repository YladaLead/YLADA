-- Titular do cartão no MP (pode diferir do e-mail payer — ex.: login MP de outra pessoa).

ALTER TABLE pro_lideres_invite_quota_mp_receipts
  ADD COLUMN IF NOT EXISTS mp_cardholder_name TEXT,
  ADD COLUMN IF NOT EXISTS mp_card_last_four TEXT;

COMMENT ON COLUMN pro_lideres_invite_quota_mp_receipts.mp_cardholder_name IS
  'Nome no cartão (card.cardholder.name) — quem efetivamente pagou com o cartão.';
COMMENT ON COLUMN pro_lideres_invite_quota_mp_receipts.mp_card_last_four IS
  'Últimos 4 dígitos do cartão no Mercado Pago.';
